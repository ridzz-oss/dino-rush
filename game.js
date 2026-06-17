import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(4, 2.5, 6);

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

const green =
new THREE.MeshLambertMaterial({
  color:0x59c74f
});

const darkGreen =
new THREE.MeshLambertMaterial({
  color:0x3f9e38
});

// BODY

const body = new THREE.Mesh(
  new THREE.BoxGeometry(
    1.4,
    0.9,
    1.8
  ),
  green
);

body.position.y = 0.4;

dino.add(body);

// HEAD

const head = new THREE.Mesh(
  new THREE.BoxGeometry(
    0.9,
    0.7,
    0.9
  ),
  green
);

head.position.set(
  0,
  0.8,
  0.9
);

dino.add(head);

// MOUTH

const mouth = new THREE.Mesh(
  new THREE.BoxGeometry(
    0.55,
    0.25,
    0.8
  ),
  darkGreen
);

mouth.position.set(
  0,
  0.6,
  1.55
);

dino.add(mouth);

// TAIL

const tail = new THREE.Mesh(
  new THREE.BoxGeometry(
    0.3,
    0.3,
    1.4
  ),
  darkGreen
);

tail.position.set(
  0,
  0.4,
  -1.5
);

tail.rotation.x = -0.7;

dino.add(tail);

// EYES

const eyeMat =
new THREE.MeshBasicMaterial({
  color:0x000000
});

const eyeL = new THREE.Mesh(
  new THREE.BoxGeometry(
    0.06,
    0.06,
    0.06
  ),
  eyeMat
);

eyeL.position.set(
  -0.18,
  0.92,
  1.32
);

dino.add(eyeL);

const eyeR = eyeL.clone();

eyeR.position.x = 0.18;

dino.add(eyeR);

// LEGS

const legFL = new THREE.Group();
const legFR = new THREE.Group();
const legBL = new THREE.Group();
const legBR = new THREE.Group();

function buildLeg(group){

  const leg = new THREE.Mesh(
    new THREE.BoxGeometry(
      0.25,
      0.8,
      0.25
    ),
    darkGreen
  );

  leg.position.y = -0.4;

  group.add(leg);
}

buildLeg(legFL);
buildLeg(legFR);
buildLeg(legBL);
buildLeg(legBR);

legFL.position.set(
  -0.4,
  0,
  0.5
);

legFR.position.set(
  0.4,
  0,
  0.5
);

legBL.position.set(
  -0.4,
  0,
  -0.5
);

legBR.position.set(
  0.4,
  0,
  -0.5
);

dino.add(legFL);
dino.add(legFR);
dino.add(legBL);
dino.add(legBR);

// ARMS

const armL = new THREE.Mesh(
  new THREE.BoxGeometry(
    0.12,
    0.35,
    0.12
  ),
  darkGreen
);

armL.position.set(
  -0.8,
  0.25,
  0.6
);

dino.add(armL);

const armR = armL.clone();

armR.position.x = 0.8;

dino.add(armR);

scene.add(dino);

camera.lookAt(
  0,
  0.7,
  0
);;

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

  cactus.position.set(
  (Math.random()-0.5)*1.5,
  0,
  -100
);
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
const t =
performance.now() * 0.015;
const run =
Math.sin(t) * 0.7;
legFL.rotation.x = run;
legBR.rotation.x = run;
legFR.rotation.x = -run;
legBL.rotation.x = -run;
tail.rotation.z =
Math.sin(t * 0.7) * 0.12;
  
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
