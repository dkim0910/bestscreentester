# Visual / mobile RE-AUDIT - bestscreentester.com (2026-10-02, build main b6e17c2)
Method: plugin capture_screenshot.py (desktop 1920x1080, laptop, tablet, mobile 375x812 @2x = 750px PNGs) + source reading. No custom viewports/DOM measurement possible, so tap sizes/contrast are derived from Tailwind classes.
Screenshots: /Users/daniel/Codes/bestscreentester/bestscreentester.com-audit/screenshots/
- home/bestscreentester_com_desktop.png, home/bestscreentester_com_mobile.png (FULL page, 750x31780), home/bestscreentester_com_fold.png (first 812 CSS px), home/table-mobile.png (crop of "What's wrong with my screen?")
- white-screen/, dead-pixel-test/, refresh-rate-test/ (bestscreentester_com_mobile.png = viewport only), guide/ (new-device-screen-test-checklist)
- cold1..cold4/ = four independent cold homepage loads x 4 viewports

## Previous findings - status
1. HIGH "This page couldn't load" on homepage: NOT REPRODUCED (4 fresh cold loads x 4 viewports = 16 captures, all rendered the full page; cold1..4 images are pixel-identical in mean colour). Treat as FIXED/transient, but still unmitigated: no src/app/error.tsx or global-error.tsx exists, so any future chunk/hydration failure shows the unbranded Next screen. Keep as MEDIUM hardening.
2. MEDIUM refresh-rate preview text overlaps Start pill: STILL PRESENT (refresh-rate-test/bestscreentester_com_mobile.png: "Measured from animation frames" collides with "Tap for controls . Esc to exit", and the grey Hz circles peek out above the pill). Cause: RefreshRateTool.tsx:25-37 renders the large readout absolutely at top-[20%] even when not active; FullscreenStage.tsx:299 hint sits at the same height. Fix: in RefreshRateTool use the `active` arg of renderFrame and render nothing/compact when !active, or hide the "Measured from..." line (RefreshRateTool.tsx:35) in the preview.
3. MEDIUM accent text contrast 4.26:1: STILL PRESENT (--accent #d6336c, globals.css:8; eyebrow labels "PANEL & BACKLIGHT" in dead-pixel-test mobile; "Open test ->" at ToolCard.tsx:13 uses text-accent/70, lower still; swatch labels at FullscreenStage.tsx:30 text-accent). Fix: add a lighter --accent-text (~#ee5a8f) for text and drop /70.
4. LOW low-contrast hint on Fake Broken Screen: not re-tested (not in scope); code unchanged at FullscreenStage.tsx:299. White Screen hint is now a readable grey pill (white-screen mobile PNG) - CHANGED/ok for solid previews (previewScrim=false path gives pill bg-black/70).
5. LOW small tap targets: STILL PRESENT. Frame-picker arrows px-3 py-1 (FullscreenStage.tsx:278,289,322,328) visible on dead-pixel-test mobile (arrow glyphs ~28px tall); header nav links short (Header.tsx); footer links ~20px tall.
6. LOW wordmark truncation "BestSc...": STILL PRESENT on every mobile page (Header.tsx:16 `truncate`). Fix: hide text below sm (`hidden sm:inline`) or reduce nav gap.
7. LOW narrow guide column: STILL PRESENT (guide mobile PNG: card p-6 inside px-4; blog/[slug]/page.tsx:80,113; body text ~285px wide). Fix: `p-4 sm:p-8`.

## New / re-checked
- PASS Swatch row above the fold on mobile: first row (Black/White/Red) spans y~632-724 CSS px of 812 and is fully visible; second row is cut off (home/bestscreentester_com_fold.png). Hero CTA and "Browse all 28 tools" also visible. Note H1 at 375px takes 2 lines + 4-line subhead; fine.
- PASS Homepage layout: no horizontal overflow (all PNGs 750px wide), desktop swatches in one 9-up row (home desktop PNG), sections intact in full-page capture.
- PASS "Normal, or worth returning?" table stacks into cards on mobile (HomeSections.tsx:277-297); text readable (14px). LOW: the hidden column header (HomeSections.tsx:277 `hidden ... md:grid`) means on mobile the three lines ("what you see / what it usually is / what to do") have no labels, so lines 2 and 3 read as an undifferentiated grey block. Fix: add small `md:hidden` labels ("Usually:" / "Do:") at HomeSections.tsx:283-285.
- PASS White Screen preview is now white (white-screen mobile PNG); Dead Pixel preview is pure black without scrim. The Start pill remains the accent colour with dark text, legible.
- LOW Section headings on mobile are centred while card grids are left-aligned (home full-page PNG, e.g. "Panel & Backlight" left vs "What's wrong with my screen?" centred) - inconsistent alignment; unify SectionHeading.
- LOW Home page is ~15,900 CSS px tall on mobile with many one-column cards; consider 2-column compact cards for tools below sm.
- No cookie banner/interstitial captured; no layout shift visible between loads.
