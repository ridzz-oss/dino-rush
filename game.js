import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// CAMERA

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
1000
);

camera.position.set(0, 4, 8);

// RENDERER

const renderer = new THREE.WebGLRenderer({
antialias: true
});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

document.body.appendChild(
renderer.domElement
);

// LIGHT

const sun = new THREE.DirectionalLight(
0xffffff,
2
);

sun.position.set(10, 15, 10);

scene.add(sun);

scene.add(
new THREE.AmbientLight(
0xffffff,
0.8
)
);

// GROUND

const ground = new THREE.Mesh(
new THREE.BoxGeometry(
20,
1,
200
),
new THREE.MeshLambertMaterial({
color: 0xd2b48c
})
);

ground.position.y = -1;

scene.add(ground);

// DINO

const dino = new THREE.Group();

// BODY

const body = new THREE.Mesh(
new THREE.BoxGeometry(
1.4,
1,
2
),
new THREE.MeshLambertMaterial({
color: 0x4caf50
})
);

dino.add(body);

// HEAD

const head = new THREE.Mesh(
new THREE.BoxGeometry(
0.9,
0.7,
0.9
),
new THREE.MeshLambertMaterial({
color: 0x4caf50
})
);

head.position.set(
0,
0.35,
1.2
);

dino.add(head);

// NOSE

const nose = new THREE.Mesh(
new THREE.BoxGeometry(
0.5,
0.3,
0.8
),
new THREE.MeshLambertMaterial({
color: 0x43a047
})
);

nose.position.set(
0,
0.15,
1.95
);

dino.add(nose);

// EYES

const eyeMaterial =
new THREE.MeshBasicMaterial({
color: 0x000000
});

const eyeL = new THREE.Mesh(
new THREE.BoxGeometry(
0.08,
0.08,
0.08
),
eyeMaterial
);

eyeL.position.set(
-0.18,
0.45,
1.62
);

dino.add(eyeL);

const eyeR = eyeL.clone();

eyeR.position.x = 0.18;

dino.add(eyeR);

// TAIL

const tail = new THREE.Mesh(
new THREE.BoxGeometry(
0.35,
0.35,
1.6
),
new THREE.MeshLambertMaterial({
color: 0x43a047
})
);

tail.position.set(
0,
-0.1,
-1.7
);

tail.rotation.x = -0.5;

dino.add(tail);

// LEGS

const legs = [];

for (let side = -1; side <= 1; side += 2) {

for (let z = -0.5; z <= 0.5; z += 1) {

const leg = new THREE.Mesh(
new THREE.BoxGeometry(
0.25,
0.8,
0.25
),
new THREE.MeshLambertMaterial({
color: 0x2e7d32
})
);

leg.position.set(
side * 0.35,
-0.9,
z
);

dino.add(leg);

legs.push(leg);

}

}

// ARMS

for (let side = -1; side <= 1; side += 2) {

const arm = new THREE.Mesh(
new THREE.BoxGeometry(
0.15,
0.4,
0.15
),
new THREE.MeshLambertMaterial({
color: 0x2e7d32
})
);

arm.position.set(
side * 0.8,
-0.1,
0.7
);

dino.add(arm);

}

dino.position.y = 0;

scene.add(dino);

camera.lookAt(
dino.position
);

// OBSTACLES

const obstacles = [];

function spawnCactus() {

const cactus = new THREE.Group();

const trunk = new THREE.Mesh(
new THREE.BoxGeometry(
0.5,
2,
0.5
),
new THREE.MeshLambertMaterial({
color: 0x008800
})
);

cactus.add(trunk);

const arm = new THREE.Mesh(
new THREE.BoxGeometry(
0.3,
0.8,
0.3
),
new THREE.MeshLambertMaterial({
color: 0x008800
})
);

arm.position.set(
0.4,
0.4,
0
);

cactus.add(arm);

cactus.position.set(
0,
0,
-100
);

scene.add(cactus);

obstacles.push(cactus);

}

setInterval(
spawnCactus,
1800
);

// JUMP

let velocityY = 0;
let isJumping = false;

function jump() {

if (isJumping) return;

isJumping = true;
velocityY = 0.22;

}

window.addEventListener(
"click",
jump
);

window.addEventListener(
"touchstart",
jump,
{
passive: true
}
);

// SCORE

let score = 0;

const scoreElement =
document.getElementById(
"score"
);

// LOOP

function animate() {

requestAnimationFrame(
animate
);

// SCORE

score++;

if (scoreElement) {

scoreElement.innerText =
score;

}

// RUN ANIMATION

const run =
performance.now() * 0.015;

legs[0].rotation.x =
Math.sin(run) * 0.6;

legs[1].rotation.x =
-Math.sin(run) * 0.6;

legs[2].rotation.x =
-Math.sin(run) * 0.6;

legs[3].rotation.x =
Math.sin(run) * 0.6;

// GRAVITY

velocityY -= 0.01;

dino.position.y +=
velocityY;

if (dino.position.y <= 0) {

dino.position.y = 0;

velocityY = 0;

isJumping = false;

}

// MOVE CACTUS

for (let i = 0; i < obstacles.length; i++) {

const obj = obstacles[i];

obj.position.z += 0.7;

// COLLISION

const dx = Math.abs(
obj.position.x -
dino.position.x
);

const dz = Math.abs(
obj.position.z -
dino.position.z
);

if (
dx < 1 &&
dz < 1 &&
dino.position.y < 1
) {

alert(
"Game Over\nScore: " +
score
);

location.reload();

}

}

renderer.render(
scene,
camera
);

}

animate();

// RESIZE

window.addEventListener(
"resize",
() => {

camera.aspect =
window.innerWidth /
window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(
window.innerWidth,
window.innerHeight
);

}
);
// GROUND

const ground = new THREE.Mesh(
new THREE.BoxGeometry(20,1,200),
new THREE.MeshLambertMaterial({
color:0xd2b48c
})
);

ground.position.y = -1;

scene.add(ground);

// DINO (sementara kubus)

const dino = new THREE.Mesh(
new THREE.BoxGeometry(1,1,1),
new THREE.MeshLambertMaterial({
color:0x22aa22
})
);

dino.position.y = 0;

scene.add(dino);

// CAMERA

camera.position.set(0,4,8);

camera.lookAt(dino.position);

// OBSTACLES

const obstacles = [];

function spawnCactus(){

  const cactus = new THREE.Mesh(
    new THREE.BoxGeometry(
      0.8,
      2,
      0.8
    ),
    new THREE.MeshLambertMaterial({
      color:0x008800
    })
  );

  cactus.position.set(
    0,
    0,
    -100
  );

  scene.add(cactus);

  obstacles.push(cactus);
}

setInterval(
spawnCactus,
2000
);

// JUMP

let velocityY = 0;
let isJumping = false;

function jump(){

  if(isJumping) return;

  isJumping = true;
  velocityY = 0.22;
}

window.addEventListener(
"click",
jump
);

window.addEventListener(
"touchstart",
jump
);

// SCORE

let score = 0;

// LOOP

function animate(){

  requestAnimationFrame(
    animate
  );

  score++;

  document.getElementById(
    "score"
  ).innerText = score;

  // gravity

  velocityY -= 0.01;

  dino.position.y += velocityY;

  if(dino.position.y <= 0){

    dino.position.y = 0;
    velocityY = 0;
    isJumping = false;
  }

  // move obstacles

  obstacles.forEach(obj=>{

    obj.position.z += 0.6;

    // collision

    const dx =
      Math.abs(
        obj.position.x -
        dino.position.x
      );

    const dz =
      Math.abs(
        obj.position.z -
        dino.position.z
      );

    if(
      dx < 1 &&
      dz < 1 &&
      dino.position.y < 1
    ){
      alert(
        "Game Over\nScore: "+
        score
      );
      location.reload();
    }

  });

  renderer.render(
    scene,
    camera
  );
}

animate();
