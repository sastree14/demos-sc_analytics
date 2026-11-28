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
        page.goto(base+"../",wait_until="networkidle")
        page.get_by_role("button",name="Català",exact=True).click()
        assert page.locator("html").get_attribute("lang")=="ca"
        assert page.locator(".grid a").count()==7
        assert page.locator("#sector-hub").is_visible()
        page.goto(base+"index.html",wait_until="networkidle")
        page.get_by_role("button",name="Castellano",exact=True).click()
        assert page.locator("#industry-grid article").count()==18,"Industry catalog is incomplete"
        assert page.locator("#industry-grid a[href*='?lang=']").count()==18
        if page.locator("#tour").evaluate("el => el.open"):
            page.locator("#tour-skip").click()
        assert page.locator("#capabilities").is_hidden(),"Capability view should start hidden"
        page.locator("#tab-capabilities").click()
        assert page.locator("#capability-grid article").count()==7
        for sector in SECTORS:
            page.goto(base+("experience.html?sector=SC01" if sector=="SC01" else f"{sector.lower()}/"),wait_until="networkidle")
            page.get_by_role("button",name="English",exact=True).click()
            assert page.locator("html").get_attribute("lang")=="en"
            if page.locator("#guide-dialog").evaluate("el => el.open"):
                page.locator("#guide-skip").click()
            assert page.locator("#case-nav button").count()==6,sector
            assert page.locator("#sector-code").inner_text()==sector
            for idx in range(6):
                page.locator("#case-nav button").nth(idx).click()
                for language in ("es","ca","en"):
                    page.locator("[data-locale="+language+"]").click()
                    assert page.locator("html").get_attribute("lang")==language
                    assert page.locator("#case-description").inner_text().strip()
                    assert page.locator("#contact-link").get_attribute("href").endswith("case="+sector+"-P"+str(idx+1).zfill(2))
                assert page.locator("#plan-board .plan-row").count()==3
                page.locator("#plan-board select").select_option("1")
                if sector=="SC01" and idx==2:
                    page.get_by_role("button",name="Optimise route",exact=True).click()
                    page.get_by_text("Route recalculated",exact=True).wait_for()
                    page.locator(".route-plans button").nth(2).click()
                    assert "versus A" in page.locator(".route-detail").inner_text()
                    assert page.locator("#route-studio circle").count()==7
                    page.locator("#route-studio").screenshot(path="qa-evidence/route-studio.png")
                if sector=="SC02" and idx==5:
                    page.locator("#stock-groups select").select_option("4")
                    assert page.locator("#stock-groups circle").count()==24
                if sector=="SC03" and idx==4:
                    assert "Optimum" in page.locator("#legend").inner_text()
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
                page.locator("#save-c").click()
                assert page.locator("#compare-result .compare-table>div").count()==20
                with page.expect_download() as download:
                    page.locator("#download").click()
                assert download.value.suggested_filename.endswith(".html")
                for lang in ["ca","en","es"]:
                    page.locator(f"[data-locale={lang}]").click()
                    assert page.locator("html").get_attribute("lang")==lang
                    assert page.locator("#case-nav button").count()==6
                page.screenshot(path="qa-evidence/industry-lab-sc01-desktop.png",full_page=True)
                page.set_viewport_size({"width":390,"height":844})
                assert page.locator("#mobile-case").is_visible()
                assert page.locator("#input-grid input").count()>=3
                assert page.locator("#chart").is_visible()
                page.screenshot(path="qa-evidence/industry-lab-sc01-mobile.png",full_page=True)
                page.set_viewport_size({"width":1366,"height":850})
            print("PASS",sector,"6 cases",flush=True)
        page.goto(base+"sc01/",wait_until="networkidle")
        page.locator(".navcase").first.wait_for()
        assert page.locator(".navcase").count()==16
        assert page.locator("#agent-dock").is_visible()
        top=page.locator("#agent-dock").bounding_box()["y"]
        page.evaluate("window.scrollTo(0, 800)")
        assert abs(page.locator("#agent-dock").bounding_box()["y"]-top)<2
        page.locator("#agent-close").click()
        assert page.locator("#agent-launch").is_visible()
        page.locator("#agent-launch").click()
        assert page.locator(".navcase .num").all_text_contents()==[f"{i:02d}" for i in range(1,17)]
        titles=[]
        for button in page.locator(".navcase").all():
            button.click()
            titles.append(page.locator(".case-head h2").inner_text())
            assert page.locator("#results .metric").count()>=2
            assert page.locator("#try-preset").is_visible()
            assert page.locator("#try-manual").is_visible()
            assert "NaN" not in page.locator("#results").inner_text()
        assert len(set(titles))==16
        page.locator("[data-case=rutas]").click()
        assert page.locator("#map-canvas svg").count()==1
        assert page.locator("#results table").count()==3
        page.locator("[data-case=demanda]").click()
        assert page.locator("#results svg").count()==1
        assert page.locator(".quantile").count()==4
        page.locator("#forecast-day").evaluate("(el) => { el.value = 7; el.dispatchEvent(new Event(\'input\', {bubbles:true})); }")
        assert page.locator("#forecast-day-label").inner_text()=="D+7"
        assert page.locator(".percentile-explain > div").count()==4
        page.locator('[data-policy="2"]').click()
        assert page.locator("#forecast-day-label").inner_text()=="D+7"
        assert "P90" in page.locator("#forecast-capacity").inner_text()
        assert page.locator('[data-policy="2"]').get_attribute("aria-pressed")=="true"
        page.locator("#try-preset").click()
        assert "Prueba aplicada" in page.locator("#try-feedback").inner_text()
        page.locator("[data-case=simulacion]").click()
        assert "500" in page.locator("#results").inner_text()
        page.locator("#role-picker").select_option("finance")
        assert page.locator(".navcase").count()==7
        assert "Rentabilidad" in page.locator(".case-head h2").inner_text()
        page.locator("#role-picker").select_option("ops")
        assert page.locator(".navcase").count()==10
        assert "rutas" in page.url
        page.locator('[data-input="1"]').evaluate("(el) => { el.value = 2; el.dispatchEvent(new Event('input', {bubbles:true})); }")
        assert "pendientes" in page.locator("#execution-status").inner_text()
        page.locator("#run-model").click()
        page.locator("#execution-status.done").wait_for()
        page.locator("[data-question=change]").click()
        page.locator("#apply-proposal").wait_for()
        page.locator("#apply-proposal").click()
        page.locator("#execution-status.done").wait_for()
        page.locator("[data-question=explain]").click()
        page.locator(".assistant-reply").wait_for()
        assert page.locator(".assistant-metric").count()>=2
        page.locator("[data-question=visual]").click()
        page.locator("#apply-proposal").wait_for()
        page.locator("#apply-proposal").click()
        assert page.locator("#view-panel").is_visible()
        assert page.locator("#view-metric").count()==1
        page.locator("#agent-close").click()
        page.locator("#role-picker").select_option("all")
        page.locator("[data-case=demanda]").click()
        for width in [1920,1366,768,390,320]:
            page.set_viewport_size({"width":width,"height":900})
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 2"), width
            if width<=820:
                assert page.locator("#mobile-tools").is_visible()
                page.locator("#mobile-tools").select_option("demanda")
            page.screenshot(path=f"qa-evidence/logistics-forecast-{width}.png",full_page=True)
        page.set_viewport_size({"width":1366,"height":850})
        page.screenshot(path="qa-evidence/logistics-executive.png",full_page=True)
        assert not failures,failures
        browser.close()
    server.shutdown()
    print("Industry Lab browser QA: 18 sectors / 108 scenarios + multilingual + download + responsive.",flush=True)

if __name__=="__main__":
    main()
