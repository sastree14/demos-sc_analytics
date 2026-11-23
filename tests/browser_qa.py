"""Exercise the deployed site's actual controls using Chrome. Requires playwright and pypdf."""
import csv
import io
import os
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright
from pypdf import PdfReader

FAMILIES = {"predictive-models": 7, "optimization": 5, "modelling-scenarios": 4,
            "simulations": 4, "bi-reporting": 4, "automation-ai": 4, "custom-apps": 4}

def download(page, button):
    with page.expect_download() as event:
        button.click()
    return Path(event.value.path()).read_text()

def verify_case(page, case, first):
    page.locator(f'[data-case="{case}"]').click()
    run = page.locator('#calculate,#run-analysis')
    controls = page.locator('#control-list input[type=range]')
    slider = controls.first
    slots = page.locator('.sc-scenario-slot')
    metrics = page.locator('.kpi-grid .kpi strong')
    assert metrics.count() == 4
    assert "Unable" not in page.locator("#input-status,#update-status").inner_text(),case
    baseline = metrics.all_text_contents()
    original = slider.input_value()
    slider.press('End' if original != slider.get_attribute('max') else 'Home')
    assert metrics.all_text_contents() == baseline
    slots.nth(1).get_by_text('Save current').click()
    run.click()
    page.wait_for_selector('.workflow-step.done:nth-of-type(5)')
    assert 'complete' in page.locator('#workflow-status').inner_text().lower()
    slots.nth(2).get_by_text('Save current').click()
    saved = metrics.all_text_contents()
    slots.nth(1).get_by_text('Restore & run').click()
    page.wait_for_function("!document.querySelector('#calculate,#run-analysis').disabled")
    assert slider.input_value() == original and metrics.all_text_contents() == baseline
    if first:
        page.once("dialog", lambda dialog: dialog.accept("North & West"))
        page.get_by_text('Preview client branding',exact=True).click()
    page.locator('.sc-input-help').first.click()
    assert page.locator('.sc-chat.assistant').last.inner_text()
    page.get_by_text("Compare alternatives",exact=True).click()
    assert "Alternative B" in page.locator('.sc-chat.assistant').last.inner_text()
    page.locator('.sc-guide-close').click()
    page.locator('.kpi-grid .kpi').first.click()
    assert baseline[0] in page.locator('.sc-chat.assistant').last.inner_text()
    page.locator('.sc-guide-close').click()
    page.get_by_text('Open full report ↗',exact=True).click()
    pages = page.locator('.sc-report-page')
    assert pages.count() == 4
    for i in range(4):
        page.locator('.sc-report-pagination button').nth(i).click()
        assert pages.nth(i).is_visible()
    report = download(page,page.get_by_text('Download HTML',exact=True))
    assert 'North &amp; West' in report and 'Alternative A' in report and 'Alternative B' in report
    assert pages.nth(1).locator('svg').count() == 1
    assert pages.nth(0).locator('.sc-report-metric strong').all_text_contents() == baseline
    assert [row.all_text_contents()[-1] for row in [pages.nth(2).locator('table').first.locator('tbody tr').nth(i).locator('td') for i in range(4)]] == saved
    page.evaluate("window.print = () => {}")
    page.get_by_text('Print / save PDF',exact=True).click()
    pdf = PdfReader(io.BytesIO(page.pdf(prefer_css_page_size=True)))
    assert len(pdf.pages) == 4, (case,len(pdf.pages))
    for i, sheet in enumerate(pdf.pages):
        assert f'{i+1} / 4' in sheet.extract_text(), (case,i,sheet.extract_text()[-120:])
    page.get_by_text('Close ×',exact=True).click()
    data = list(csv.reader(io.StringIO(download(page,page.locator('#download-csv,#download-data')))))
    assert len(data)>5 and not any('NaN' in cell for row in data for cell in row)
    print('PASS',case,flush=True)

def main():
    root = Path(__file__).resolve().parents[1]
    server = ThreadingHTTPServer(('127.0.0.1',0), partial(SimpleHTTPRequestHandler,directory=root))
    Thread(target=server.serve_forever,daemon=True).start()
    base = os.environ.get('QA_BASE',f'http://127.0.0.1:{server.server_port}/')
    with sync_playwright() as driver:
        browser = driver.chromium.launch(channel='chrome',args=['--no-sandbox'])
        page = browser.new_page(viewport={'width':1440,'height':900},reduced_motion='reduce')
        page.set_default_timeout(7000)
        errors = []
        shots = Path("qa-evidence")
        shots.mkdir(exist_ok=True)
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(base)
        page.screenshot(path=shots/'catalog.png')
        for family,count in FAMILIES.items():
            page.goto(base+family+'/')
            assert page.locator('[data-case]').count() == count
            assert page.locator('.sc-crossnav a').count() == 7
            for width in [390,820,1440]:
                page.set_viewport_size({'width':width,'height':900})
                page.screenshot(path=shots/f'{family}-{width}.png')
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1'), (family,width,page.evaluate('document.documentElement.scrollWidth'))
            page.locator('#sc-fast-mode').check()
            for i,case in enumerate(page.locator('[data-case]').evaluate_all('(nodes)=>nodes.map(n=>n.dataset.case)')):
                verify_case(page,case,i==0)
                assert not errors,errors
        page.goto(base+'optimization/inventory.html')
        page.locator('#sc-fast-mode').check()
        page.locator('#run-optimisation').click()
        page.get_by_text('Analysis complete',exact=True).wait_for()
        assert '€' in page.locator('#kpi-gain').inner_text()
        assert not errors,errors
    server.shutdown()

if __name__ == '__main__':
    main()
