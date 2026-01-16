import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 3;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x111111);
document.body.appendChild(renderer.domElement);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

// Load image texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("./profile-02.jpeg");

texture.colorSpace = THREE.SRGBColorSpace;
texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

// 🎯 FRONT-ONLY SPHERE (HALF SPHERE)
const radius = 0.6;

const geometry = new THREE.SphereGeometry(
  radius,
  128,
  128,
  Math.PI / 2,   // phiStart (centered)
  Math.PI        // phiLength (180 degrees)
);

const material = new THREE.MeshStandardMaterial({
  map: texture,
  side: THREE.FrontSide,
});

const imageSphere = new THREE.Mesh(geometry, material);
imageSphere.rotation.y = -Math.PI / 2;
imageSphere.scale.set(0.85, 0.85, 0.85);

scene.add(imageSphere);

// Floating animation
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();
  imageSphere.position.y = Math.sin(t) * 0.2;

  renderer.render(scene, camera);
}
animate();

// Resize handling
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
