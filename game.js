import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 4, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHT
const ambient = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 1.5);
sun.position.set(5, 10, 5);
scene.add(sun);

// GROUND
const ground = new THREE.Mesh(
  new THREE.BoxGeometry(20, 1, 200),
  new THREE.MeshLambertMaterial({ color: 0xd2b48c })
);
ground.position.y = -1;
scene.add(ground);

// DINO
const dino = new THREE.Group();

const body = new THREE.Mesh(
  new THREE.BoxGeometry(1.4, 1, 2),
  new THREE.MeshLambertMaterial({ color: 0x4caf50 })
);
dino.add(body);

const head = new THREE.Mesh(
  new THREE.BoxGeometry(0.9, 0.7, 0.9),
  new THREE.MeshLambertMaterial({ color: 0x4caf50 })
);
head.position.set(0, 0.35, 1.2);
dino.add(head);

const nose = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 0.3, 0.8),
  new THREE.MeshLambertMaterial({ color: 0x43a047 })
);
nose.position.set(0, 0.15, 1.95);
dino.add(nose);

const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

const eyeL = new THREE.Mesh(
  new THREE.BoxGeometry(0.08, 0.08, 0.08),
  eyeMaterial
);
eyeL.position.set(-0.18, 0.45, 1.62);
dino.add(eyeL);

const eyeR = eyeL.clone();
eyeR.position.x = 0.18;
dino.add(eyeR);

const tail = new THREE.Mesh(
  new THREE.BoxGeometry(0.35, 0.35, 1.6),
  new THREE.MeshLambertMaterial({ color: 0x43a047 })
);
tail.position.set(0, -0.1, -1.7);
tail.rotation.x = -0.5;
dino.add(tail);

// LEGS
const legs = [];

for (let side of [-1, 1]) {
  for (let z of [-0.5, 0.5]) {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.8, 0.25),
      new THREE.MeshLambertMaterial({ color: 0x2e7d32 })
    );
    leg.position.set(side * 0.35, -0.9, z);
    dino.add(leg);
    legs.push(leg);
  }
}

// ARMS
for (let side of [-1, 1]) {
  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.4, 0.15),
    new THREE.MeshLambertMaterial({ color: 0x2e7d32 })
  );
  arm.position.set(side * 0.8, -0.1, 0.7);
  dino.add(arm);
}

dino.position.y = 0;
scene.add(dino);

camera.lookAt(dino.position);

// OBSTACLES
const obstacles = [];

function spawnCactus() {
  const cactus = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 2, 0.5),
    new THREE.MeshLambertMaterial({ color: 0x008800 })
  );
  cactus.add(trunk);

  const arm1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.8, 0.3),
    new THREE.MeshLambertMaterial({ color: 0x008800 })
  );
  arm1.position.set(0.4, 0.4, 0);
  cactus.add(arm1);

  const arm2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.8, 0.3),
    new THREE.MeshLambertMaterial({ color: 0x008800 })
  );
  arm2.position.set(-0.4, 0.1, 0);
  cactus.add(arm2);

  cactus.position.set(0, 0, -100);
  scene.add(cactus);
  obstacles.push(cactus);
}

setInterval(spawnCactus, 1800);

// JUMP
let velocityY = 0;
let isJumping = false;

function jump() {
  if (isJumping) return;
  isJumping = true;
  velocityY = 0.22;
}

window.addEventListener("click", jump);
window.addEventListener("touchstart", jump, { passive: true });

// SCORE
let score = 0;
const scoreElement = document.getElementById("score");

// LOOP
function animate() {
  requestAnimationFrame(animate);

  score++;
  if (scoreElement) scoreElement.textContent = score;

  // run animation
  const t = performance.now() * 0.02;
  legs[0].rotation.x = Math.sin(t) * 0.6;
  legs[1].rotation.x = -Math.sin(t) * 0.6;
  legs[2].rotation.x = -Math.sin(t) * 0.6;
  legs[3].rotation.x = Math.sin(t) * 0.6;

  // gravity
  velocityY -= 0.01;
  dino.position.y += velocityY;

  if (dino.position.y <= 0) {
    dino.position.y = 0;
    velocityY = 0;
    isJumping = false;
  }

  // move obstacles
  for (let i = 0; i < obstacles.length; i++) {
    const obj = obstacles[i];
    obj.position.z += 0.7;

    const dx = Math.abs(obj.position.x - dino.position.x);
    const dz = Math.abs(obj.position.z - dino.position.z);

    if (dx < 1 && dz < 1 && dino.position.y < 1) {
      alert("Game Over\nScore: " + score);
      location.reload();
    }
  }

  renderer.render(scene, camera);
}

animate();

// RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
