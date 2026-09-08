ASCENT LOGO SYSTEM — v3.0.1, September 2026
Replaces the "Client Acquisition Systems" lockup. Tagline is now INVESTOR ACQUISITION.

v3.0.1 fixes the chevron. In v3.0 the inner edges of both chevrons were built at the
wrong offset, so the stroke thinned toward the apex and the inner V opened too early.
The mark now matches the original artwork's weight and angles. Replace any v3.0 file
you already used.

WHAT'S HERE
  *.svg   Vector masters. Use these anywhere vectors are accepted (Figma, Illustrator,
          web, print). They scale losslessly and are the source of truth.
  *.png   Raster exports. Lockups at 2400px wide (and @1200 half size); icons at
          1024px (and @512). All transparent unless the name says -bg or -app.

WHICH FILE TO USE
  ascent-lockup-primary-on-dark      Default logo on any dark ground. Transparent.
  ascent-lockup-primary-on-light     Default logo on white/light ground. Transparent.
  ascent-lockup-primary-ink-bg       Same, pre-set on #0E0E0E with padding.
  ascent-lockup-primary-white-bg     Same, pre-set on white with padding.
  ascent-lockup-white                One-colour white. Photos, dark overlays, one-colour print.
  ascent-lockup-charcoal             One-colour #232426. Faxes, stamps, one-colour print.
  ascent-lockup-stacked-*            Square-ish spaces: profile headers, ads, signage.
  ascent-wordmark-*                  No tagline. Use under 230px wide.
  ascent-icon-color / white / charcoal   The chevron alone. Transparent.
  ascent-icon-app-ink / -app-orange  Square tiles for app icons and avatars.
  ascent-favicon-32/64/180/192/512   Favicon and touch-icon sizes, square, on ink.

  ascent-logo-sheet.svg              The whole system on one board. This is what was
                                     imported to the Figma file's "Logo" page.
  ascent-logo-variants.svg           The 16 variants as separately-named groups
                                     (Type x Theme). This became the "Logo" component
                                     set on the Figma "Logo Components" page. Each
                                     group already carries its own clear space.

IN FIGMA
  File: ASCENT — Design System & Sponsor Report
  Page "Logo"             — the full logo system board.
  Page "Logo Components"  — component set named "Logo", 16 variants.
        Type  = Horizontal | Stacked | Wordmark | Chevron
        Theme = Dark | Light | White | Charcoal
  Drop an instance, then switch Type and Theme in the right-hand panel. Every variant
  includes its clear space, so the instance can sit flush against other elements.
  "Dark" and "Light" name the background the logo is going ON, not the logo's colour.

RULES
  Clear space   = 0.5 x the chevron's height on all four sides.
  Minimum size  full lockup 1.9 in print / 230 px screen
                stacked     1.4 in print / 165 px screen
                wordmark    0.6 in print /  70 px screen
                chevron     0.2 in print /  16 px screen
  Below the full-lockup minimum, drop the tagline and use the wordmark.
  Never restack, recolour, outline or add effects to the chevron.

GEOMETRY (for anyone rebuilding it)
  Both chevrons: edge slope dx/dy 0.711 (orange) and 0.757 (charcoal); horizontal
  stroke width 126 and 125 units on a 1254-unit canvas; the inner edges are the outer
  edges shifted horizontally by the stroke width, so the inner apex sits w/k below the
  outer apex. Legs end in flat horizontal cuts; the orange chevron's right leg is
  deliberately shorter than its left.

TYPE
  Wordmark  Montserrat Bold, -0.035 em tracking
  Tagline   Montserrat Medium, +0.376 em tracking, cap height 21% of the wordmark's
  Both are outlined in these files, so the fonts are not needed to use them.

COLOUR
  ASCENT orange  #F15F24     Ink        #0E0E0E
  Body dark      #232426     Hairline   #E3E4E6
