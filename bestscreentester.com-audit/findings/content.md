# Content Quality / E-E-A-T: bestscreentester.com (RE-AUDIT)

Re-audit date: 2026-10-02. Live build = `main` b6e17c2. main and dev differ only in `CNAME`, so the source line numbers below are valid for the live build.
Previous run (2026-10-01): Content 64. The orchestrator adjusted it to 60 for homepage overlap with screentester.io.

Method:
- Sampled live pages with `render_page.py --mode never`: homepage, /about/, 6 tool pages and 6 guides. All returned 200, and no page was an SPA shell.
  - Tool pages: white-screen, black-screen, contrast, greyscale, ghosting, color-gradient.
  - Guides: how-to-fix-a-stuck-pixel, dead-pixel-warranty-policies, color-gamut-srgb-vs-dci-p3-vs-adobe-rgb, hdr-explained, how-to-test-a-used-phone-screen-before-buying, oled-burn-in-and-how-to-check-for-it.
- Rendered screentester.io with `--mode auto`.
- Diffed the source from 29b4107 (previous audit) to main, and read every new FAQ and the full new homepage copy.
- Checked the claims against the components that implement them.
- Checked status codes on all 34 unique citation URLs with curl.
- Labels: anything not checked directly is marked **(inferred)**.

## Scores

| Metric | Now | Before | Delta |
|---|---|---|---|
| **Content Quality (overall)** | **73 / 100** | 64 (60 adjusted) | +9 (+13 vs adjusted) |
| E-E-A-T weighted (internal model) | 59.2 | 47.5 | +11.7 |
| AI-citation readiness | 76 | 68 | +8 |

These weights are the skill's own model, not Google's.

| Factor | Now | Before | Basis |
|---|---|---|---|
| Experience (20%) | 38 | 35 | **Better:** the new "what your result means" FAQs and the homepage "Normal, or worth returning?" table add practical judgement. **Still missing:** 0 first-hand signals, 0 real photos, 0 "tested on" notes. |
| Expertise (25%) | 72 | 60 | **Better:** all 4 previously verified errors are fixed, and 26 new FAQs checked out with no factual errors. **Against it:** 1 self-contradiction remains (guides.ts:373), and the author has no stated background. |
| Authoritativeness (25%) | 48 | 30 | **Better:** 38 links (34 unique URLs) to primary sources (ISO, ITU, CIE, IEC, SMPTE, VESA, HDMI, Apple, AAO, PMC) across 13 guides. **Still missing:** the named author is a brand, not a person, and there is no external recognition. |
| Trustworthiness (30%) | 72 | 60 | **Better:** the operator is named, About has a correction policy, /donate counts are fixed, homepage contradictions are fixed, and the FAQs say plainly what the tools can't measure. **Against it:** the operator's entity type is ambiguous, and About is thin. |

**What moved the score:**
- Factual errors were fixed.
- Primary-source citations were added.
- The homepage was rewritten in original copy. Overlap with screentester.io fell from 19–32% to about 0.5%, which removes the orchestrator's −4 adjustment.
- Every tool now has 2–3 FAQs.
- A byline was added.

**What still caps it:**
- No first-hand evidence (photos, test hardware).
- All 44 guides are still under the 1,500-word blog floor: median 836, range 695–995, total 37,607.
- There is no human author with credentials.
- About is thin.
- One homepage block still paraphrases the competitor.

## Homepage overlap with screentester.io (6-gram shingles)

| Text basis | Homepage words | Unique 6-grams | Shared with screentester.io |
|---|---|---|---|
| trafilatura `extracted_text` | 831 | 826 | 1 (0.1%) |
| Full visible HTML text | 1,917 | 1,902 | 10 (0.5%) |

Previous measurement: about 19–32%. Only 35 of 1,917 visible words (1.8%) fall inside shared runs. Most of those come from the device-guide cards (see NEW-1).

## Previous findings: status

| ID | Status | Evidence |
|---|---|---|
| HIGH-1 No named author | **CHANGED (partial)** | **Done:** the byline is "By Nelera", linked to /about (`src/app/blog/[slug]/page.tsx:125-128`). About has a "Who makes" section (`src/app/about/page.tsx:45-54`). The homepage has a "Who makes" block (`src/components/HomeSections.tsx:372-378`). Live on all sampled guides. **Still missing:** the author is a brand typed as `Organization` (`src/lib/seo.ts:235-236`), with no person, credentials or test hardware. See NEW-2. |
| HIGH-2 Zero citations | **FIXED (mostly)** | 38 outbound links in 13 guides. Spot-checked live: iso.org/standard/40102 and isic PDF (warranty guide), support.apple.com/102658 (phone guide), displayhdr.org and VESA True Black (HDR guide), ITU BT.2020 (gamut guide). Remaining gaps: NEW-4. |
| HIGH-3.1 ISO classes | **FIXED** | guides.ts:447 now gives Class 0 through the looser classes and notes 13406-2's numbering. Live: "Class 0" present, "Class III and IV" gone. |
| HIGH-3.2 iPhone parts history | **FIXED** | guides.ts:1986: "iPhone 11 and newer … XR, XS and SE 2nd/3rd generation show battery history only". Live. |
| HIGH-3.3 Color Gradient gamut | **FIXED** | **Copy:** the tagline, description and keywords in tools.ts no longer mention gamut or P3. A new FAQ says "Can this test my color gamut? No." **Live:** the only "dci-p3" on the page is the Related-guides card for the gamut guide. |
| HIGH-3.4 Homepage "IPS ~1ms" | **FIXED** | The homepage was rewritten. "IPS ~1ms" is absent from the live HTML. |
| MEDIUM-1 Dark-room advice | **FIXED** | HomeSections.tsx:190: "Bleed, blooming and black-level tests need a properly dark room". This matches tools.ts:110, :357, :568, :974, :994. |
| MEDIUM-1 Warm-up time | **CHANGED, still inconsistent** | **Homepage:** HomeSections.tsx:182 says "about five minutes before testing, and 20–30 minutes before calibrating". **Guides:** guides.ts:98 (monitor guide) says to test after 20-30 minutes, and :158 (TV) says 20–30 minutes before judging uniformity. guides.ts:31 (checklist) says five minutes. |
| MEDIUM-2 /donate counts | **FIXED** | `src/app/donate/page.tsx:9` and `:24` use `TOOLS.length`. |
| MEDIUM-3.1 Stuck-pixel title | **FIXED** | "How to Fix a Stuck Pixel: 4 Methods Worth Trying". Live. |
| MEDIUM-3.2 Burn-in excerpt | **FIXED** | It now reads "…how to tell permanent burn-in from retention that fades". |
| MEDIUM-3.3 "likely dead, not stuck" | **STILL PRESENT** | guides.ts:373 still says this, which contradicts the dead-pixel definition at guides.ts:335. Live. |
| MEDIUM-4 Thin tool pages / 1 FAQ | **FIXED** | The 14 named tools went to 3 FAQs; all 28 tools now have 2–3. Unique copy is now 144–307 words (was 90–268). The thinnest are boot-screen-simulator (144) and color-test (152). Plugin `content_quality.py` scores: white-screen 72, contrast-test 81. |
| MEDIUM-5 No experience signals | **STILL PRESENT** | 0 `![` images in guides.ts. The hero alt is still "— illustrated diagram" (`src/app/blog/[slug]/page.tsx:117`). No test hardware is named anywhere. |
| MEDIUM-6 Cannibalisation | **PARTIAL** | **Fixed:** color-gradient vs wide-gamut. **Still present:** the greyscale keyword `gamma test` (tools.ts:197); the black-level keyword `ips glow` (tools.ts:566); color-test vs dead-pixel ("find pixel defects", tools.ts:75 vs :42); and the bleed/glow guide cluster (untouched). **Changed:** the black-screen description (tools.ts:103) now lists dust, OLED and dim uses, but the new FAQ "Why do the edges glow on a black screen?" leans back into bleed. |
| LOW-1 AI-typical phrasing | **PARTIAL** | **Fixed:** the overclaims ("Pixel-perfect", "every quality dimension"…) are gone. **Still present:** "comprehensive OLED-specific coverage" (HomeSections.tsx:175) and "essential for used-phone checks" (:172). The guide tics are unchanged: 12.1 em dashes per 1,000 words, "Here's" in 15/44 excerpts, "return window" ×21. |
| LOW-2 "Free <title>…" openers | **STILL PRESENT** | For example tools.ts:42, :75 and :103. |
| Thin guides (<1,500) | **STILL PRESENT** | All 44 guides, median 836 words. Live extracted words on the sampled guides: 883–991. |
| /about thin (220) | **CHANGED, still thin** | 286 extracted words (347 visible), against a floor of 400. The plugin flags `thin-content` and `low-density`. |
| INFO HowTo JSON-LD on tool pages | **STILL PRESENT** | `src/app/[tool]/page.tsx:54` (for the schema owner). |
| INFO tool-page dates | **CHANGED** | Tools now carry `updatedAt` (tools.ts). htmldate reads 2026-10-01 on the sampled tool pages; it previously fell back to 2026-01-01. I did not check whether the date is visible on the page. |

## New findings

### NEW-1 (MEDIUM): Device-guide cards still paraphrase screentester.io
The rest of the homepage was rewritten, but `src/components/HomeSections.tsx:170-177` (`DEVICE_GUIDES`) has not changed since 1aec280 (2026-06-21, per `git log -L`). It keeps screentester.io's card structure and its phrasing, with only a word or two swapped:

| Ours | screentester.io |
|---|---|
| "OLED burn-in, touch dead zones, tint — essential for used-phone checks" | "OLED burn-in, touch dead zones, PWM flicker — essential for used phone inspection" |
| "IPS/VA/OLED testing" | "IPS/VA/OLED panel testing" |
| "comprehensive OLED-specific coverage" | "comprehensive OLED-specific issue coverage" |
| "IPS bleed, VA ghosting, OLED blacks" | "IPS bleed, VA ghosting, Mini LED blooming" |
| "do it after unboxing" | "Must-do after new TV unboxing" |

Shingle overlap is low only because of the swapped words.

**Fix:** rewrite the six `body` strings at :171-176 to say what each guide actually covers, in the guides' own terms. Alternatively, drop the section: the symptom grid already links these guides.

### NEW-2 (MEDIUM): Author entity is ambiguous and carries no credentials
- `src/app/about/page.tsx:46-47` calls Nelera "an independent developer", which reads as a person.
- `src/lib/seo.ts:10-13` describes "Nelera" as the name of a not-yet-formed LLC.
- Article JSON-LD types the author as `Organization` (`src/lib/seo.ts:236`).
- No person, background or test hardware is given anywhere.

**Fix:**
1. Name the person behind Nelera, or a consistent pen name.
2. Emit a `Person` author with `worksFor` Nelera (seo.ts:235-236).
3. Add 2–3 lines to about/page.tsx:45-50: display-testing background, plus the panels the tests were checked on. This also lifts /about over the 400-word floor.

### NEW-3 (LOW): Warm-up guidance still contradicts the guides
See MEDIUM-1 above.

**Fix:** change HomeSections.tsx:182 to "about five minutes for pixel checks; 20–30 minutes before judging uniformity or calibrating". That matches guides.ts:31, :98, :158 and :498.

### NEW-4 (LOW): Uneven citation coverage and four links to recheck
- **31 of 44 guides have no outbound link.** That makes "The guides cite the standards and manufacturer documents they rely on" (HomeSections.tsx:375-377 and about/page.tsx:51-53) only mostly true.
- **Uncited claims:**
  - new-device-screen-test-checklist names ISO 9241-307 with no link.
  - what-is-pwm-flicker states health effects ("headaches, eye strain, or fatigue") without a source.
- **Links to recheck:** curl got 403 from iso.org/standard/40102 and from both dell.com URLs, and a timeout from adobe.com/…/AdobeRGB1998.pdf. This is likely bot blocking **(inferred)**; check them in a browser. The other 30 returned 200.

**Fix:**
- Link ISO in the checklist to /blog/dead-pixel-warranty-policies or iso.org.
- Cite a peer-reviewed or IEEE 1789 source in the PWM guide.

### NEW-5 (LOW): Homepage FAQ answers mention pages they don't link
"the Privacy page" (HomeSections.tsx:213) and "The new-device checklist in our guides" (:229) are plain strings, so readers can't click through.

**Fix:** render the links in the visible answer, and keep the plain text for FAQPage. FAQPage schema is Info only; this is a usability point, not a rich-result one.

### NEW-6 (INFO): New FAQs and homepage copy were fact-checked with no errors found
**Checked against code:**
- Ghosting speeds 240/480/960 px/s: `GhostingTool.tsx:7-11`.
- Prank exits on tap or Esc: `FullscreenStage.tsx:151` and `:212-214`.
- Clock is centred and the other effects move: `ScreensaverTool.tsx:14` and `:603-610`.
- 32-step ramp: `patterns.ts:12`.
- 7 gradient frames: `patterns.ts:48`.
- Viewing angle shows grey steps on top and colour bars below: `patterns.ts:148-154`.
- Frame time and closest rate: `RefreshRateTool.tsx:33`.
- On iOS the stage fills the browser window: `FullscreenStage.tsx:247`.
- HDR patches run 100–1,600 nits: `HdrTool.tsx:13-18`.
- Zone sweep, P3 logos and frame-skip cells: the matching components.

**Checked against the guides:** the contrast FAQ figures (IPS about 1,000:1, VA 2,500–5,000:1) match guides.ts:2370-2371.

**Not fetched externally:** the general facts (macOS gamma 2.2 since 2009, 59.94 Hz, 1000/144 = 6.94 ms, Wake Lock in Firefox and Safari). They are consistent with known specs.

## What works (unchanged or improved)
- **Plugin `content_quality.py`:** 0 filler and 0 AI-pattern matches on all 7 sampled pages. Scores: home 78, about 67, white 72, contrast 81, stuck-pixel 77, HDR 81, warranty 80.
- **Readability:**

  | Page | Flesch | FK grade |
  |---|---|---|
  | Homepage | 75 | 5.2 |
  | Stuck-pixel guide | 70 | 7.2 |
  | About | 62 | 7.9 |

- **Metadata:** `metadata_template.py` on the new homepage title and description gives `site_risk: low`, `templated_ratio: 0.0` and `shared_cta_phrases: {}`. The previous 80-page result also showed no templating.
- **Freshness:** the guides edited on 2026-10-01 carry `updatedAt: "2026-10-01"`, which matches commit 510a538.

## AI-citation readiness (76, was 68)
- **Better:**
  - Primary-source links sit next to the standards claims.
  - The byline links to an About page.
  - Tool FAQs now answer how to read the result.
  - The homepage verdict table can be quoted directly.
- **Gaps:**
  - No person author or credentials (NEW-2).
  - 31 guides have no sources.
  - No original measurements or photos.

## Structured findings (for audit-data.json, Content Quality)
```json
{"category":"Content Quality","score":73,"previous_score":64,"eeat":{"experience":38,"expertise":72,"authoritativeness":48,"trustworthiness":72,"weighted":59.2},"ai_citation_readiness":76,
"homepage_overlap_screentester_io":{"extracted_unique_6gram_share":0.001,"visible_unique_6gram_share":0.005,"previous":"0.19-0.32"},
"findings":[
{"id":"NEW-1","severity":"medium","title":"Homepage device-guide cards paraphrase screentester.io","file":"src/components/HomeSections.tsx:170-177"},
{"id":"NEW-2","severity":"medium","title":"Author is an ambiguous brand entity (Organization) with no person or credentials","file":"src/lib/seo.ts:235-236; src/app/about/page.tsx:45-50"},
{"id":"MEDIUM-5","severity":"medium","title":"No first-hand experience signals; hero alt says 'illustrated diagram'","file":"src/app/blog/[slug]/page.tsx:117"},
{"id":"MEDIUM-6","severity":"medium","title":"Remaining cannibalisation: greyscale 'gamma test', black-level 'ips glow', color-test vs dead-pixel, bleed/glow guide cluster","file":"src/lib/tools.ts:197,566,75"},
{"id":"THIN-GUIDES","severity":"medium","title":"All 44 guides under 1,500-word floor (median 836)","file":"src/lib/guides.ts"},
{"id":"MEDIUM-3.3","severity":"low","title":"'likely dead, not stuck' contradicts own definition","file":"src/lib/guides.ts:373"},
{"id":"NEW-3","severity":"low","title":"Warm-up time inconsistent between homepage and guides","file":"src/components/HomeSections.tsx:182"},
{"id":"NEW-4","severity":"low","title":"31/44 guides uncited; 4 citation URLs non-200 to curl","file":"src/lib/guides.ts"},
{"id":"NEW-5","severity":"low","title":"Homepage FAQ references unlinked pages","file":"src/components/HomeSections.tsx:213,229"},
{"id":"ABOUT-THIN","severity":"low","title":"/about 286 words, under 400 floor","file":"src/app/about/page.tsx"},
{"id":"LOW-1","severity":"low","title":"Leftover stock phrasing and guide tics","file":"src/components/HomeSections.tsx:172,175"}]}
```
