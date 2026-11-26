"""Smoke-test all 18 industry experiences and their 108 model-backed problem routes.
The benchmark uses synthetic data only. No external API requests are made.
"""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright

SECTORS = [f"SC{i:02d}" for i in range(1,19)]

def main():
    root=Path(__file__).resolve().parents[1]
    server=ThreadingHTTPServer(("127.0.0.1",0),partial(SimpleHTTPRequestHandler,directory=root))
    Thread(target=server.serve_forever,daemon=True).start()
    base=f"http://127.0.0.1:{server.server_port}/industry-lab/"
    failures=[]
    with sync_playwright() as pw:
        browser=pw.chromium.launch(channel="chrome",args=["--no-sandbox"])
        context=browser.new_context(viewport={"width":1366,"height":850},accept_downloads=True)
        page=context.new_page()
        page.set_default_timeout(9000)
        page.on("pageerror",lambda err: failures.append(str(err)))
        page.goto(base+"index.html",wait_until="networkidle")
        assert page.locator("#industry-grid article").count()==18,"Industry catalog is incomplete"
        assert page.locator("#capabilities").is_hidden(),"Capability view should start hidden"
        page.locator("#tab-capabilities").click()
        assert page.locator("#capability-grid article").count()==7
        for sector in SECTORS:
            page.goto(base+f"experience.html?sector={sector}",wait_until="networkidle")
            if page.locator("#guide-dialog").evaluate("el => el.open"):
                page.locator("#guide-skip").click()
            assert page.locator("#case-nav button").count()==6,sector
            assert page.locator("#sector-code").inner_text()==sector
            for idx in range(6):
                page.locator("#case-nav button").nth(idx).click()
                assert page.locator("#metrics .metric").count()==4,(sector,idx)
                sliders=page.locator("#input-grid input[type=range]")
                assert sliders.count()>=3,(sector,idx)
                before=page.locator("#metrics .metric-value").all_text_contents()
                slider=sliders.last
                slider.evaluate("(el) => { el.value = el.value !== el.min ? el.min : el.max; el.dispatchEvent(new Event('input', {bubbles:true})); }")
                assert page.locator("#unsaved").is_visible(),(sector,idx)
                page.locator("#run").click()
                assert page.locator("#unsaved").is_hidden()
                after=page.locator("#metrics .metric-value").all_text_contents()
                assert len(after)==4
                assert "NaN" not in " ".join(after) and "undefined" not in " ".join(after)
                assert page.locator("#chart svg").count()==0 or page.locator("#chart title").count()==1
            if sector=="SC01":
                page.locator("#save-a").click()
                page.locator("#input-grid input[type=range]").first.evaluate("(el) => { el.value = el.value !== el.max ? el.max : el.min; el.dispatchEvent(new Event('input', {bubbles:true})); }")
                page.locator("#run").click()
                page.locator("#save-b").click()
                assert page.locator("#compare-result .compare-table>div").count()==15
                with page.expect_download() as download:
                    page.locator("#download").click()
                assert download.value.suggested_filename.endswith(".html")
                for lang in ["ca","en","es"]:
                    page.locator(f"[data-locale={lang}]").click()
                    assert page.locator("html").get_attribute("lang")==lang
                    assert page.locator("#case-nav button").count()==6
                page.set_viewport_size({"width":390,"height":844})
                assert page.locator("#mobile-case").is_visible()
                assert page.locator("#input-grid input").count()>=3
                assert page.locator("#chart").is_visible()
                page.set_viewport_size({"width":1366,"height":850})
            print("PASS",sector,"6 cases",flush=True)
        assert not failures,failures
        browser.close()
    server.shutdown()
    print("Industry Lab browser QA: 18 sectors / 108 scenarios + multilingual + download + responsive.",flush=True)

if __name__=="__main__":
    main()
