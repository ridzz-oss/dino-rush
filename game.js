import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
);

const renderer = new THREE.WebGLRenderer({
antialias:true
});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

document.body.appendChild(
renderer.domElement
);

// LIGHT

const light = new THREE.DirectionalLight(
0xffffff,
2
);

light.position.set(5,10,5);

scene.add(light);

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
