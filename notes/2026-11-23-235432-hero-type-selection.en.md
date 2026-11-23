---
created_at: 2026-11-23T23:54:32+08:00
tags:
  - Product design
  - Typography
translation:
  source: 97d1e9e5be40
---
# Choosing and setting a homepage headline font

A homepage headline font is not an isolated choice of letterforms. It carries the product's tone in a limited first-screen space while establishing a clear reading order with the body, navigation, and next action. Before comparing fonts, define what each role needs to do, then consider whether the letterforms and type families suit the content. [Resend's brand guidelines](https://resend.com/handbook/design/what-are-our-brand-guidelines) distinguish display, product, and editorial type; [Webflow's design guidelines](https://brand.webflow.com/design-guidelines) also assign separate roles to headings and body text. These divisions are references, not instructions to copy the same families.

## Compare in the real page

Save the current page as a baseline, then set candidates with the real headline, body copy, and action. Change one related group of type parameters at a time where possible, so the source of a difference remains visible. A new font may also need adjustments to size, weight, spacing, line height, and container width. Evaluate both the character of the letters and the reading order of the whole screen instead of deciding from a type specimen alone.

When looking at other products, read the design team's first-hand explanation alongside the actual page. Record viewport width, family, optical size, weight, size, letter spacing, and line height. For example, [Linear's redesign account](https://linear.app/now/how-we-redesigned-the-linear-ui) describes the roles of Inter Display for headings and Inter for body text. On November 23, 2026, its homepage headline measured 64px at weight 510 in a 1440px viewport. That measurement describes the page at that time, not a formula for other products.

## Decide in context

One Keyref trial offers a concrete example. In a 1440px desktop capture on November 23, 2026, the original homepage headline used Bricolage Grotesque at 86.4px, weight 690, and approximately -3.2px letter spacing. A subsequent preview of the actual homepage tried Recursive Sans at weight 570 with looser letter spacing for the headline and Inter for body text, checking both 1440px desktop and 390px mobile widths. The final implementation also set Recursive's `CASL` axis, line height, and responsive size, and preloaded the headline font. These values describe one page's choices; they do not establish that Recursive suits every product.

Wait for the actual font to load, then check line breaks, contrast, the relationship between headline and body, and whether the action is visible in the first screen. Also check narrow screens, longer copy, and font fallback for layout problems; leave any untested case unknown. [Recursive's design process](https://www.recursive.design/process/) likewise shows testing a font with real website content.

Finally, record three kinds of evidence separately: measured parameters and viewports, judgments about visual tone and reading order, and the scope actually checked. Desktop and mobile previews support judgments about those two layouts; they do not replace validation on other devices, with other content, or with real users.
