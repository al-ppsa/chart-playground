# Demo
[Here's a link to the demo]('http://al-ppsa.github.io/chart-playground')

# Testing Writeup
My criteria for testing:
- build a (donut) chart using just the docs/provided examples
- add labels not directly touching the arcs they correspond to
- specify arc colors based on the data itself

I chose these criteria arbitrarily based on our one known use case, as well as what seem like commmon features in a chart.

For now, I've left out animation in favor of getting this info to the team, but that's my next focus (an update on this - contrary to what I thought yesterday, visx has a bunch of examples using react-spring, so that integration should be fairly trivial)

Anyway, here's what I found:

## Building the chart
### Visx
As expected, it took significantly longer to put this together with visx. Largely this was due to my lack of knowledge
 with svg (not realizing I needed a `<g>` element wrapping the chart - oops), but it's still true that this was a
 more manual setup. There's a TON of flexibility, and the data you pass to the chart doesn't need to be in any
  particular format; you can define accessor functions to get various attributes as desired.

Getting donut behavior was super easy: just define an `outerRadius` and `innerRadius` in units and you get what you'd expect.

### Nivo
This one came together much more quickly. I just needed to define a `data` array where each item had an `id` and a `value` property. The only other thing needed for the chart to render is a containing element with a defined `height` and `width`. What you get is a chart with basic (hover) animations, random colors, and labels (both on the arcs and coming from them; these are taken from the `id` and `label` attributes on the data, the latter of which may not exist).

Donut behavior was slightly more involved. There's no `outerRadius` attribute, at all. The chart fills the container it's in, and you can customize the size with `margin` (basically padding the container). There is an `innerRadius` property which accepts a ratio for the cutout, so I needed to do a bit of math to get the correct thickness.

## Labels
### Visx
Again, since we're basically working directly in svg, I was limited by my ability/desire to build a decent svg document.
We're provided a `centroid` function which passes you the datum used to render the arc, as well as coordinates to the center of the arc; the result of the `centroid` function gets rendered. Rendering an in-arc label was easy enough, but I
needed to do some math to get the offset-from-donut effect. I also added my own custom lines, but it'll take some work to get those to look decent.

### Nivo
Comes with in-arc and outside-arc labels by default. The labels come from the data automatically (`id` and `label` attributes) but can be changed by passing in accessor functions. The library handles the "label links" (this is what they call the lines extending from the graph to the labels) by itself, which was a nice surprise. You can customize the color of the links/text via props.

## Color
To be totally honest, I struggled with color for both of these.

### Visx
As with everything else, color is manually specified wherever you create your svg elements. For whatever reason, I'm having trouble getting full values when generating dynamic colors; the colors seem faded and washed out. If I specify a manual value like "rgb(255, 0, 0)" I have no problems. Going to continue looking into this.

### Nivo
I could not get _custom_ colors working. We need to use the `colors` property to change colors manually, but it was...more difficult than I expected. First, they're using the special `Omit` interface to _strip the `color` attribute from the data_, meaning you can't just define `color` on your dataset. That kinda sucks. I was able to write a hacky workaround, which gave me the colors I was looking for, but also introduced some very odd animation behavior and a slew of console errors. More testing needed here as well