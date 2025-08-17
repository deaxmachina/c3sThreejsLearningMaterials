# Start here 

Refer to [here](https://glitch.com/edit/#!/1-scene-with-cube) for a walkthrough of all the basic 
ingredients to render some simple objects and animate them in Three.js. 
Then continue onto [here](https://glitch.com/edit/#!/2-single-colour-cube-grid-with-perlin-noise) for a couple of new concepts, mainly 
the use of `OrthographicCamera` and Perlin noise. 
Below is an outline of what is new, building on top of the example above. 

# What's new

## Gradient texture 
A really simple way to start customising your geometries is by adding a canvas texture. 
You don't need to write a shader or any complicated custom logic. First you need to create 
a texture - this is basically like drawing anything on a good old 2d canvas. Here we use the following 

```js 
function createGradientTexture() {
  const size = 128; // 256; // Resolution of the texture

  // Create a new canvas dom element
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, size);
  gradient.addColorStop(0, "rebeccapurple");
  gradient.addColorStop(0.2, "hotpink");
  gradient.addColorStop(0.4, "#ffffff");

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

Note the lines at the end - in order to use this texture, we need to tell Three.js to convert it 
to its own texture type by calling the `CanvasTexture` with the canvas that we just created and 
drew on. Note that you don't have to render this additional canvas anywhere. It is created purely 
for the purposes of storing our texture to be passed onto Three.js

The next step is to create a material which can be just a `MeshBasicMaterial`, where you pass 
the gradient textrue we just created into the `map` property - which is generally used for 
textures in the world of Three.js. 

```js 
const gradientTexture = createGradientTexture();
const gradientMaterial = new THREE.MeshBasicMaterial({ map: gradientTexture });
```

Finaly, we tell Three.js to use just a basic material for the top and bottom face of the cube 
and the new gradient material for all the other sized by doing 

```js 
// Assign materials to cube faces
const materials = [
  gradientMaterial, // +X (right)
  gradientMaterial, // -X (left)
  baseMaterial, // +Y (top)
  baseMaterial, // -Y (bottom)
  gradientMaterial, // +Z (front)
  gradientMaterial, // -Z (back)
];
```

and we pass this on to the mesh just like any other material! 