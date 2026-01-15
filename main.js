import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Geometry
const geometry = new THREE.BoxGeometry();

// Material (reacts to light)
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

// Mesh
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 🔆 Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// ☀️ Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Animation
function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}
animate();
