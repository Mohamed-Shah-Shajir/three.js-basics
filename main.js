import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

// Scene
const scene = new THREE.Scene();

// ===== SPACE GRADIENT BACKGROUND =====
const bgGeometry = new THREE.SphereGeometry(20, 64, 64);

const bgMaterial = new THREE.MeshBasicMaterial({
  side: THREE.BackSide,
  color: 0x050812, // base deep space color
});

const backgroundSphere = new THREE.Mesh(bgGeometry, bgMaterial);
scene.add(backgroundSphere);

// ===== STAR FIELD =====
const starCount = 800;

const starGeometry = new THREE.BufferGeometry();
const starPositions = [];

// Store random phase for twinkling
const starTwinklePhase = [];
for (let i = 0; i < starCount; i++) {
  starTwinklePhase.push(Math.random() * Math.PI * 2);
}


for (let i = 0; i < starCount; i++) {
  const x = (Math.random() - 0.5) * 40;
  const y = (Math.random() - 0.5) * 40;
  const z = (Math.random() - 0.5) * 40;
  starPositions.push(x, y, z);
}

starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starPositions, 3)
);

const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.06,
  transparent: true,
  opacity: 0.8,
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// ===== SHOOTING STARS =====
const shootingStars = [];
const shootingStarGeometry = new THREE.BufferGeometry();
shootingStarGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute([
    0, 0, 0,
    0, 0, -0.6
  ], 3)
);


const shootingStarMaterial = new THREE.LineBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.9,
});

// Create one shooting star
function spawnShootingStar() {
  const star = new THREE.Line(
    shootingStarGeometry,
    shootingStarMaterial.clone()
  );

  star.position.set(
    (Math.random() - 0.5) * 20,
    Math.random() * 10 + 5,
    -10
  );

  // Velocity
  star.userData.velocity = new THREE.Vector3(
    Math.random() * 0.25 + 0.15,
    -Math.random() * 0.15 - 0.1,
    Math.random() * 0.25 + 0.15
  );

  // 🔑 ALIGN TRAIL TO VELOCITY
  const dir = star.userData.velocity.clone().normalize();
  const quat = new THREE.Quaternion();
  quat.setFromUnitVectors(new THREE.Vector3(0, 0, -1), dir);
  star.quaternion.copy(quat);

  star.userData.life = 0;

  scene.add(star);
  shootingStars.push(star);
}






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

// ===== HOVER STATE =====
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isHovered = false;
 window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});


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

// ===== 3D GLOWING RING (TORUS) =====
const ringGeometry = new THREE.TorusGeometry(
  0.55,   // ring radius (distance from center)
  0.06,   // tube thickness
  32,     // tube segments
  100     // smoothness
);

const ringMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ffff,      // alien cyan
  emissive: 0x00ffff,   // glow effect
  emissiveIntensity: 1.5,
});

const hoverRing = new THREE.Mesh(ringGeometry, ringMaterial);

// Make ring horizontal
hoverRing.rotation.x = Math.PI / 2;

// Position below the sphere
hoverRing.position.y = -0.65;

scene.add(hoverRing);

// ===== AURA SPOT LIGHT (PROJECTING UPWARD) =====
const auraLight = new THREE.SpotLight(
  0x00ffff,   // cyan alien light
  2,          // intensity
  6,          // distance
  Math.PI / 6,// spread angle
  0.5,        // softness
  1           // decay
);

// Position light inside the ring
auraLight.position.set(0, -0.65, 0);
auraLight.target.position.set(0, 0.5, 0);

scene.add(auraLight);
scene.add(auraLight.target);

// ===== ENERGY WAVES =====
const waveGroup = new THREE.Group();
scene.add(waveGroup);

const waveGeometry = new THREE.RingGeometry(0.45, 0.48, 64);

const waveMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ffff,
  transparent: true,
  opacity: 0.6,
  side: THREE.DoubleSide,
  depthWrite: false,
});

// Create multiple waves
const waves = [];
for (let i = 0; i < 3; i++) {
  const wave = new THREE.Mesh(waveGeometry, waveMaterial.clone());
  wave.rotation.x = -Math.PI / 2;
  wave.position.y = -0.65;
  wave.scale.setScalar(1 + i * 0.25);
  waveGroup.add(wave);
  waves.push(wave);
}



// Floating animation
const clock = new THREE.Clock();

function animate() {
  
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();
  imageSphere.position.y = Math.sin(t) * 0.2;

  // ===== ENERGY WAVE ANIMATION =====
waves.forEach((wave, i) => {
  const speed = 0.4;
  const offset = i * 0.5;

  wave.position.y = -0.65 + ((t * speed + offset) % 1.2);
  wave.material.opacity = 0.4 * (1 - (wave.position.y + 0.65));
});

// Subtle star drift
stars.rotation.y += 0.0003;

// ===== TWINKLING STARS =====
const twinkle = 0.15 + Math.sin(t * 2) * 0.05; // base twinkle
stars.material.opacity = 0.6 + twinkle;

// Subtle size flicker (safe for PointsMaterial)
stars.material.size = 0.04 + Math.sin(t * 3) * 0.01;


// ===== SHOOTING STAR SPAWN (HOVER REACTIVE) =====
const spawnRate = isHovered ? 0.08 : 0.002;

if (Math.random() < spawnRate) {
  spawnShootingStar();
}


// ===== UPDATE SHOOTING STARS =====
for (let i = shootingStars.length - 1; i >= 0; i--) {
  const star = shootingStars[i];

  star.position.add(star.userData.velocity);
  star.userData.life++;

  // Fast fade
  star.material.opacity = Math.max(0, 1 - star.userData.life / 25);

  if (star.userData.life > 25) {
    scene.remove(star);
    shootingStars.splice(i, 1);
  }
}

// ===== CHECK HOVER ON SPHERE =====
raycaster.setFromCamera(mouse, camera);
const intersects = raycaster.intersectObject(imageSphere);
isHovered = intersects.length > 0;




  renderer.render(scene, camera);
  // 3D ring pulse + slow rotation
hoverRing.scale.setScalar(1 + Math.sin(t * 3) * 0.05);
hoverRing.rotation.z += 0.009;

}
animate();

// Resize handling
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
