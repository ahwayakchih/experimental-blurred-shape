# Experiment: Blurred Shape

Use SVG filter to create a shape that blurs web page underneath it, as on this [demo video](https://drive.google.com/file/d/10kp7R9zE-2uMOW6GLywDkfYK3-Ln3Eex/view?usp=sharing).

Based on the implementation described at:

https://www.sitepoint.com/design-tricks-with-svg-filters-a-masked-blur-effect/

Uses external SVG image as a shape, because of Firefox's problems with using local SVG fragment:

https://bugzilla.mozilla.org/show_bug.cgi?id=455986

## Compatibility

It seems to work on latest versions of Chrome and Firefox, but it does not work in IE or Edge:

https://caniuse.com/#search=svg-html

Microsoft does not seem to be interested in supporting SVG filters for CSS:

https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/6618695/

## Alternatives

### CSS: `backdrop-filter`

For IE and Edge, one could try to create "overlay" element with shape and CSS `backdrop-filter` applied:

https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter

But that's completely different implementation.

Too bad SVG's `enable-background` is deprecated, and only IE and Edge implement it anyway (probably that is why they already have `backdrop-filter` done).

### Canvas

It is possible to re-render parts of web page in a Canvas, using one of:

1. [html2canvas](https://github.com/niklasvh/html2canvas/)
2. [rasterizeHTML](https://github.com/cburgmer/rasterizeHTML.js)
3. [HTML-GL](https://github.com/PixelsCommander/HTML-GL)

That allows to apply any effects one can imagine, but has some limitations:

1. depending on the way the "drawing HTML on canvas" part is implemented, it may not support all CSS rules and or effects
2. because of the need to "redraw" initial HTML it is a lot slower, which prevents it form being usable on HTML with CSS animations, or any dynamic changes to the look of the web page

### CSS: `text-shadow`

This cool trick was thought about by [Greg](https://github.com/wlod).

1. Split text characters into `SPAN`s or other type of elements,
2. use some math to calculate which ones should be "blurred",
3. apply `text-shadow` on them

This may be made to look almost like real blur effect, but may be too slow to apply dynamically.