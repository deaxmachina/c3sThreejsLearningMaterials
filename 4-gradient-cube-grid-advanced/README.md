# Start here

Refer to [here](https://glitch.com/edit/#!/1-scene-with-cube) for a walkthrough of all the
basic ingredients to render some simple objects and animate them in Three.js.
Then continue onto [here](https://glitch.com/edit/#!/2-single-colour-cube-grid-with-perlin-noise) for a couple of new concepts, mainly
the use of `OrthographicCamera` and Perlin noise, and finally [here](https://glitch.com/edit/#!/3-gradient-cube-grid)
to see how to create a gradient texture.
Here we extend the composition of the sketch and start thinking about how to make the gradients
a bit more interesting.

# What's new

## Different random gradients for each cube

This is almost the same as before, we have just added some parameters to the function,
so that later on we can pass on different colours or different stops for the gradient.

```js
function createGradientTexture(mainColour = "#ff006e", stops = [0, 0.6, 1]) {
  const size = 64; // Increase resolution for smoother gradient and pattern
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // Create gradient 
  const gradient = ctx.createLinearGradient(0, 0, 0, size);
  gradient.addColorStop(stops[0], mainColour);
  gradient.addColorStop(stops[1], baseCol);
  gradient.addColorStop(stops[2], baseCol);
  // Fill the canvas with the gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Convert to texture
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace; // Correct color rendering
  texture.needsUpdate = true;
  return texture;
}
```

### Nice colour palettes! 🎨

To get some random nice colour palettes, I took the 500 most popular palettes from the library
[`nice-color-palettes`](https://www.npmjs.com/package/nice-color-palettes) and put those in
the file `500.json`. Note that because we need to load this file asynchronously in Glitch, there is
a bit of extra code to make sure that the colour are loaded before we render the cubes.
If you were working in an environment with some sort of modern bundler, you probably wouldn't
need to do that.
