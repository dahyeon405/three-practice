import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { SoundBackground } from "./soundBackground";

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

const soundBackground = new SoundBackground(camera);

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

scene.add(soundBackground.getMesh());

camera.position.z = 5;

const listener = new THREE.AudioListener();
camera.add(listener);

const controls = new OrbitControls(camera, renderer.domElement);

const animate = function () {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  controls.update();

  soundBackground.updateMeshByFrequency();
};

animate();

buttonElement.addEventListener("click", () => soundBackground.togglePlay());

const axisHelper = new THREE.AxesHelper(5);
scene.add(axisHelper);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
