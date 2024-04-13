import "./style.css";
import * as THREE from "three";
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const buttonElement = document.querySelector(
  "#play-button"
) as HTMLButtonElement;

const sphereRadius = 1;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

const geometry = new THREE.SphereGeometry(sphereRadius, 64, 64);
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    u_frequencyData: { value: new Float32Array(64) },
    u_radius: { value: sphereRadius },
  },
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 5;

const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();

audioLoader.load(
  "https://p.scdn.co/mp3-preview/632d6c82c76df12239b31e81936f7ca316a3d45b",
  function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
  }
);

const analyser = new THREE.AudioAnalyser(sound, 128);

const controls = new OrbitControls(camera, renderer.domElement);

const animate = function () {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  controls.update();

  const data = analyser.getFrequencyData();
  material.uniforms.u_frequencyData.value = data;
};

animate();

buttonElement.addEventListener("click", () => {
  if (sound.isPlaying) {
    sound.pause();
  } else {
    sound.play();
  }
});

const axisHelper = new THREE.AxesHelper(5);
scene.add(axisHelper);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
