import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { SoundReactiveObject } from "./soundReactiveObject";

const buttonElement = document.querySelector(
  "#play-button"
) as HTMLButtonElement;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const soundReactiveObject = new SoundReactiveObject(camera);

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

soundReactiveObject.load(
  "https://p.scdn.co/mp3-preview/632d6c82c76df12239b31e81936f7ca316a3d45b"
);
scene.add(soundReactiveObject.getMesh());

camera.position.z = 5;

const listener = new THREE.AudioListener();
camera.add(listener);

const controls = new OrbitControls(camera, renderer.domElement);

const animate = function () {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  controls.update();

  soundReactiveObject.updateMeshByFrequency();
};

animate();

buttonElement.addEventListener("click", () => soundReactiveObject.togglePlay());

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
