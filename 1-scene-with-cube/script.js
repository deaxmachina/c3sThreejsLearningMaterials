// Loosely based on the Three.js Journey course, especially Lesson 14

const THREE = window.THREE; // This is just needed for glitch

//////////////////////////////////////////
///////////////// Setup //////////////////
//////////////////////////////////////////
// Debug
const gui = new window.lil.GUI(); // in a project you need to import GUI from 'lil-gui' instead

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
const scene = new THREE.Scene();

//////////////////////////////////////////
/////////////// Objects //////////////////
//////////////////////////////////////////

// Lights
// Ambient light
const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color(0xffffff);
ambientLight.intensity = 1;
scene.add(ambientLight);
gui.add(ambientLight, "intensity").min(0).max(3).step(0.001);

// Directional light
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9);
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight);

// Material -- shared between all geometires below
const material = new THREE.MeshStandardMaterial();

// Geometries
const planeGeometry = new THREE.PlaneGeometry(5, 5);
const geometryBox = new THREE.BoxGeometry(0.75, 0.75, 0.75);
const geometrySphere = new THREE.SphereGeometry(0.5, 32, 32);

// Meshes
const cube = new THREE.Mesh(geometryBox, material);

const sphere = new THREE.Mesh(geometrySphere, material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(planeGeometry, material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, plane);

// Camera
const camera = new THREE.PerspectiveCamera(
  75, // POV
  sizes.width / sizes.height, // aspect ratio
  0.1, // near
  100 // far
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

//////////////////////////////////////////
//////////////// Render //////////////////
//////////////////////////////////////////
// Controls
const controls = new THREE.OrbitControls(camera, canvas); // in a project, use new OrbitControls instead

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//////////////////////////////////////////
/////////////// Animate //////////////////
//////////////////////////////////////////
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
