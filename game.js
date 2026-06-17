import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0,3,8);

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

scene.add(
  new THREE.AmbientLight(
    0xffffff,
    1.4
  )
);

const sun =
new THREE.DirectionalLight(
  0xffffff,
  1.5
);

sun.position.set(
  5,
  10,
  5
);

scene.add(sun);

// GROUND

const ground =
new THREE.Mesh(
  new THREE.BoxGeometry(
    30,
    1,
    200
  ),
  new THREE.MeshLambertMaterial({
    color:0xd2b48c
  })
);

ground.position.y = -1;

scene.add(ground);

// DINO SPRITE

const loader =
new THREE.TextureLoader();

const walkTexture =
loader.load(
  "assets/dino_walk.png"
);

walkTexture.wrapS =
THREE.RepeatWrapping;

walkTexture.wrapT =
THREE.RepeatWrapping;

walkTexture.repeat.set(
  1/4,
  0.72
);

// buang tulisan atas bawah
walkTexture.offset.y = 0.14;

const dinoMaterial =
new THREE.SpriteMaterial({
  map:walkTexture,
  transparent:true
});

const dino =
new THREE.Sprite(
  dinoMaterial
);

dino.scale.set(
  3,
  3,
  1
);

dino.position.y = 1;

scene.add(dino);

// SHADOW

const shadow =
new THREE.Mesh(
  new THREE.CircleGeometry(
    0.8,
    32
  ),
  new THREE.MeshBasicMaterial({
    color:0x000000,
    transparent:true,
    opacity:0.2
  })
);

shadow.rotation.x =
-Math.PI/2;

shadow.position.y =
-0.49;

scene.add(shadow);

// ANIMATION

let frame = 0;
let lastFrameTime = 0;

function updateWalk(time){

  if(
    time - lastFrameTime >
    120
  ){

    frame++;

    if(frame > 3)
      frame = 0;

    walkTexture.offset.x =
      frame / 4;

    lastFrameTime =
      time;
  }
}

// LEFT RIGHT

let lane = 0;

function moveLeft(){

  lane--;

  if(lane < -1)
    lane = -1;
}

function moveRight(){

  lane++;

  if(lane > 1)
    lane = 1;
}

window.addEventListener(
  "keydown",
  e=>{

    if(
      e.key === "ArrowLeft"
    ){
      moveLeft();
    }

    if(
      e.key === "ArrowRight"
    ){
      moveRight();
    }

  }
);

let touchStartX = 0;

window.addEventListener(
  "touchstart",
  e=>{
    touchStartX =
    e.touches[0].clientX;
  },
  {passive:true}
);

window.addEventListener(
  "touchend",
  e=>{

    const dx =
      e.changedTouches[0]
      .clientX -
      touchStartX;

    if(dx > 50)
      moveRight();

    if(dx < -50)
      moveLeft();

  },
  {passive:true}
);

// LOOP

function animate(time){

  requestAnimationFrame(
    animate
  );

  updateWalk(time);

  const targetX =
    lane * 1.6;

  dino.position.x +=
    (targetX -
    dino.position.x)
    * 0.15;

  shadow.position.x =
    dino.position.x;

  renderer.render(
    scene,
    camera
  );
}

animate();

// RESIZE

window.addEventListener(
  "resize",
  ()=>{

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
