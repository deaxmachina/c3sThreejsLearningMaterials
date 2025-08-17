# Ingredients of a Three.js scene

## The scene 🎬

[`Scene` docs](https://threejs.org/docs/#api/en/scenes/Scene)

This is like your scene on a movie shooting. You arrange your actors, your props, your camera and the camera person, lights.. action.
You need to have the scene and add things to the scene before you can see anything at all.

```js
const scene = new THREE.Scene();
```

## Objects (meshes)

[`Object3D` docs](https://threejs.org/docs/#api/en/core/Object3D)

In other words, things that we want to place in the scene. In Three.js language we have **meshes**,
which are like 'objects' made from **materials** and **geometry**. Pretty intuitive!

Let's look at some simple materials and geometries below and you can combine them into meshes.
I encourage you to explore the Three.js docs for a wide range of possible geometries and materials -
this is one of the most fun bits of the learning experience!

### Materials 🪨
[`MeshBasicMaterial` docs](https://threejs.org/docs/?q=material#api/en/materials/MeshBasicMaterial)

[`MeshStandardMaterial` docs](https://threejs.org/docs/?q=material#api/en/materials/MeshStandardMaterial)

The bottom line is, you will most likely use a `MeshBasicsMaterial` or a `MeshStandardMaterial`. The former
is, well, pretty basic. It doesn't need any lights to illuminate it for you to be able to see it.
The latter is a physically rendered material - you will need lights.
Here, we are going to use a `MeshStandardMaterial` so that we can see the effect of some lights.

```js
const material = new THREE.MeshStandardMaterial();
```

### Geometries 🪩
[`PlaneGeometry` docs](https://threejs.org/docs/?q=planegeometry#api/en/geometries/PlaneGeometry)

[`BoxGeometry` docs](https://threejs.org/docs/?q=box#api/en/geometries/BoxGeometry)

[`SphereGeometry` docs](https://threejs.org/docs/?q=sphere#api/en/geometries/SphereGeometry)

Again, another fun topic to experiment with! Three.js has a bunch of built-in geometries; we'll only look
at a handful of them here. What's even cooler is that you can define your own geometry, using shaders, Blender, etc.

Let's add these 3 to start with:

```js
const planeGeometry = new THREE.PlaneGeometry(5, 5);
const geometryBox = new THREE.BoxGeometry(0.75, 0.75, 0.75);
const geometrySphere = new THREE.SphereGeometry(0.5, 32, 32);
```

Note that the parameters in the brackets will be different for the different geometries.
If you're using an editor like VSCode, you'll be able to see what each of them means by simply
hovering over the class name. Here we can't do that, but we can always refer to the interactive docs.

### Meshes 🗑️
[`Mesh` docs](https://threejs.org/docs/#api/en/objects/Mesh)

At this point we just have a bunch of geometries floating in the aether and a material.. but we won't
see anything. Why is that? We're missing 2 things. The first one is the 'body' or 'object' that is
'made up' of these geometries and material. (Note that we can re-use the same materials or
geometries - in fact this is a highly desirable for performance!)
So, let's create those -- we call them 'meshes' as we alluded earlier.

```js
const cube = new THREE.Mesh(geometryBox, material);
const sphere = new THREE.Mesh(geometrySphere, material);
const plane = new THREE.Mesh(planeGeometry, material);
```

We're still not seeing anything. Why do you think that is?
Remember we said that everything we see will have to be in the scene. Well, let's add them to the
scene! Here's how you do that

```js
scene.add(sphere, cube, plane);
```

Meshes are an instance of what's called `Object3D` in Three.js. Anything of that type will have certain
properties like position, scale, rotation. There are multiple ways that these can be set, for example

```js
sphere.position.x = -1.5;
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;
```

Note that it doesn't matter if you set these before or after you add the meshes to the scene.

## Cameras 🎥
[`PerspectiveCamera` docs](https://threejs.org/docs/?q=perspective#api/en/cameras/PerspectiveCamera)

[`OrthographicCamera` docs](https://threejs.org/docs/?q=ortho#api/en/cameras/OrthographicCamera)

We're still missing a camera to shoot our scene. Without one, we won't see anything! There are several
options you have for cameras is Three.js but mostly 2 of these are used - the `PerspectiveCamera` and the
`Orthographic` camera. The former will give you a perspective, so that objects that are closers appear
bigger; the latter will give you the 'orthographic look' where everything appears to be at the exact same
distance and without any distortion. Let's start with a perspective camera

```js
const camera = new THREE.PerspectiveCamera(
  75, // FOV
  sizes.width / sizes.height, // aspect ratio
  0.1, // near
  100 // far
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);
```

### OrbitControls 
[`OrbitControls` docs](https://threejs.org/docs/?q=orbit#examples/en/controls/OrbitControls)

Orbit controls allow the camera to orbit around a target. They are an add-on in Three.js, so 
the way you use them in a standalone project and here in Glitch might differ a bit.
They are really useful when building your project, and sometimes even useful to leave in. 

```js 
const controls = new THREE.OrbitControls(camera, canvas); // in a project, use new OrbitControls instead
```


## Renderer
[`WebGLRenderer` docs](https://threejs.org/docs/?q=renderer#api/en/renderers/WebGLRenderer)

Finally our last ingredient to actually see something on the screen (well, almost, you'll see below).
The Renderer is the means by which the entire setup that we have is 'rendered'. Remember how we created
a new canvas element to draw all of our scene on? We haven't used it yet! This is where we take that
canvas element and pass it onto the renderer telling it to draw on that. In all cases for us,
we will use the WebGL renderer, which is beautifully GPU-optimised.

```js
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```

Note that if we don't pass anything to the `WebGLRenderer`, some defaults will be assumed and it will
still work. The parameters above are the minimum to get it to look good.

We have only just set up the renderer but we haven't explicitly told it to do anything.
We need to finally call

```js
renderer.render(scene, camera);
```

At this point you might still not be seeing anything; why is that?

## Lights

[`AmbientLight` docs](https://threejs.org/docs/?q=ambient%20light#api/en/lights/AmbientLight)

[`DirectionalLight` docs](https://threejs.org/docs/?q=direction#api/en/lights/DirectionalLight)

We don't _have to_ have lights in order to see something on the scene. However, if we are using any
physically-based materials, such as our `MeshStandardMaterial`, we do need them to see the meshes.
There are many interesting light options that Three.js provides, and we will see some of these in later
examples, but for now let's add the two most common lights that you will encounter.

```js
// Ambient light
const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color(0xffffff);
ambientLight.intensity = 1;
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9);
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight);
```

## Animation 
[`Clock` docs](https://threejs.org/docs/?q=cloc#api/en/core/Clock)

So far, we should have a static scene with some basic shapes to explore. However, it's not very 
interesting. Just like in p5.js - or any other creative coding setup - you would often want to add 
animation to your piece, so let's do just that. 
The principle is the same as with any other JavaScript animation, i.e. we are going to use a 
`requestAnimationFrame`. The only difference is, we have a helpful way of ensuring that the 
speed of the animation is consistent for every device by using a Three.js helper called 
`Clock`. Note that we don't *have to* use the helper but it is, well, useful. 

The things that we will always have to update in a Three.js animation loop include 
the renderer and controls from Three.js. The rest is very much depended on exactly what you're trying 
to animate. But we will start simple and update some positions and rotations. 


```js 
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  cube.rotation.y = 0.1 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;

  sphere.position.x = Math.cos(elapsedTime);
  sphere.position.y = Math.sin(elapsedTime);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
```
