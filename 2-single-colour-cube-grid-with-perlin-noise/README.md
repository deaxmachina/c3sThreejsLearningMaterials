# Start here 

Refer to [here](https://glitch.com/edit/#!/1-scene-with-cube) for a walkthrough of all the 
basic ingredients to render some simple objects and animate them in Three.js. 
Below is an outline of what is new, building on top of the example above. 

# What's new

## Orthographic Camera 
[`OrthographicCamera` docs](https://threejs.org/docs/?q=OrthographicCamera#api/en/cameras/OrthographicCamera)

To quote the docs, 
"In this projection mode, an object's size in the rendered image stays constant regardless of its distance from the camera."
It is commonly used in creative coding / generative art in Three.js for the particular look and feel 
it has. It is a little bit tricky to wrap your head around the parameters it takes, so I often 
copy-paste a setup that I have which I know works. 

```js

const aspectRatio = sizes.width / sizes.height;
const frustumSize = 5; // Adjust for a larger view
const camera = new THREE.OrthographicCamera(
  -frustumSize * aspectRatio,
  frustumSize * aspectRatio,
  frustumSize,
  -frustumSize,
  -100,
  100
);
camera.position.set(frustumSize, frustumSize, frustumSize);
scene.add(camera);
```

## Options for the Renderer


### Arranging cubes in a grid and animating with or without Perlin noise 

[`Group` docs](https://threejs.org/docs/?q=group#api/en/objects/Group)

A lot of this part has nothing to do with Three.js actually. 
First of all, here is how we can create and add cubes in a grid, where we re-use 
the same geometry and material for each of the meshes that corresponds to a new cube 
(but we do create a new mesh for each cube; something that is not done very efficiently 
and can be solved with instance rendering)

Our first approach will be to add the cubes in a grid and give them random scales in the 
x, y and z directions. The one new Three.js concept here is the `Group`, which is also 
an `Object3D` in the Three.js world and is a convenient way of keeping a bunch of meshes grouped 
so that we can move or rotate or scale the entire group as a whole. 

```js
// Create and add all the meshes in a grid
const meshes = [];
const group = new THREE.Group();
let cols = 5;
let rows = 5;
let spacing = 0.5; // How much space between all the cubes in the grid
const noiseScale = 0.4; // Adjust for smoothness of the Perlin noise

for (let x = 0; x < cols; x++) {
  for (let y = 0; y < rows; y++) {
    const newMesh = new THREE.Mesh(geometry, material);
    // Position the mesh in the grid
    newMesh.position.x = x + spacing * x;
    newMesh.position.z = y + spacing * y;

    // Adjust the scale of the cubes (random)
    newMesh.scale.x = Math.random() + 0.5;
    newMesh.scale.z = Math.random() + 0.5;

    // Adjust the height of the cubes
    // Option 1: Random
    const scaleY = Math.random() * 2 + 0.5;

    // Apply the scale
    newMesh.scale.y = scaleY;
    
    // Adjust position so scaling happens from the bottom and not the center
    newMesh.position.y = (scaleY - 1) / 2;

    // Push the mesh into the array of meshes
    meshes.push(newMesh);
  }
}
// Add the new meshes to the scene all at once
group.add(...meshes);
scene.add(group);
```

Alternatively, we can introduce some Perlin noise for smooth and natural randomness. 
For example, we can keep the x and z scaling random, but for the y scale use Perlin noise: 

```js 
  const noiseValue = noise.perlin2(x * noiseScale, y * noiseScale); // Get Perlin noise value for (x, y). Returns value between -1 and 1
  const scaleY =(noiseValue+1)*1.5  // THREE.MathUtils.mapLinear(noiseValue, -1, 1, 1, 4); // Convert noise to a valid scale range (e.g., 1 to 4)
```

Then, later on when we are running the animation loop, we can have the cubes going up and down 
in a very smooth and satisfying way: 

```js
  // Animate meshes using Perlin noise over time
  const animationSpeed = 0.5; // Adjust for slower or faster animation
  group.children.forEach((mesh) => {
    const x = mesh.position.x;
    const z = mesh.position.z;

    const noiseValue = noise.perlin2(
      x * noiseScale,
      z * noiseScale + elapsedTime * animationSpeed // Same as before but moving on z axis
    );
    const scaleY = (noiseValue+1)*1.5 // THREE.MathUtils.mapLinear(noiseValue, -1, 1, 1, 4); //// Map noise value to scale range

    mesh.scale.y = scaleY;
    mesh.position.y = (scaleY - 1) / 2; // Keep bottom at the same level
  });
```