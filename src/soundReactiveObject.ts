import * as THREE from "three";
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

const fftSize = 32;
const bigSphereRadius = 1;
const smallSphereRadius = 0.05;
const circleRadius = 3;

export class SoundReactiveObject {
  camera: THREE.Camera;
  audioLoader: THREE.AudioLoader;
  sound: THREE.Audio;
  analzyer: THREE.AudioAnalyser;
  mesh: THREE.Group;

  fftSpheres: THREE.Mesh[] = [];

  constructor(camera: THREE.Camera) {
    this.camera = camera;

    const listener = new THREE.AudioListener();
    this.camera.add(listener);

    this.sound = new THREE.Audio(listener);
    this.audioLoader = new THREE.AudioLoader();
    this.analzyer = new THREE.AudioAnalyser(this.sound, fftSize * 2);

    this.mesh = this.createMesh();
  }

  load(url: string) {
    const _sound = this.sound;

    this.audioLoader.load(url, function (buffer) {
      _sound.setBuffer(buffer);
      _sound.setLoop(true);
      _sound.setVolume(0.5);
    });
  }

  togglePlay() {
    if (this.sound.isPlaying) {
      this.sound.pause();
    } else {
      this.sound.play();
    }
  }

  getMesh() {
    return this.mesh;
  }

  updateMeshByFrequency() {
    const data = this.analzyer.getFrequencyData();

    this.mesh.rotation.x = 0.05;
    this.mesh.rotation.y += 0.005;

    this.fftSpheres.forEach((_sphere, index) => {
      const factor = 1 + data[index] / 255;

      const material = _sphere.material as THREE.ShaderMaterial;
      material.uniforms.u_fftFactor.value = factor;
    });

    // const material = this.mesh.material as THREE.ShaderMaterial;
    // material.uniforms.u_frequencyData.value = this.normalizeFrequencyData(data);
  }

  private createMesh() {
    const soundReactiveObject = new THREE.Group();

    const circle = new THREE.Group();

    this.fftSpheres = new Array(fftSize).fill(0).map((_, index) => {
      const sphere = new THREE.SphereGeometry(smallSphereRadius, 32, 32);
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          u_fftFactor: { value: 1 },
          u_index: { value: index },
        },
      });

      const mesh = new THREE.Mesh(sphere, material);

      mesh.position.set(
        circleRadius * Math.cos(((Math.PI * 2) / fftSize) * index),
        0,
        circleRadius * Math.sin(((Math.PI * 2) / fftSize) * index)
      );

      return mesh;
    });

    this.fftSpheres.forEach((sphere) => circle.add(sphere));

    const geometry = new THREE.SphereGeometry(bigSphereRadius, 64, 64);
    const material = new THREE.MeshBasicMaterial({
      color: "black",
    });

    const sphere = new THREE.Mesh(geometry, material);

    soundReactiveObject.add(circle);
    soundReactiveObject.add(sphere);

    return soundReactiveObject;
  }

  private normalizeFrequencyData(data: Uint8Array) {
    return data.map((value) => value);
  }
}
