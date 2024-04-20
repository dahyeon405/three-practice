import * as THREE from "three";
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

export class SoundBackground {
  camera: THREE.Camera;
  audioLoader: THREE.AudioLoader;
  sound: THREE.Audio;
  analzyer: THREE.AudioAnalyser;
  mesh: THREE.Mesh;

  constructor(camera: THREE.Camera) {
    this.camera = camera;

    const listener = new THREE.AudioListener();
    this.camera.add(listener);

    this.sound = new THREE.Audio(listener);
    this.audioLoader = new THREE.AudioLoader();
    this.analzyer = new THREE.AudioAnalyser(this.sound, 32);

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

    const material = this.mesh.material as THREE.ShaderMaterial;
    material.uniforms.u_frequencyData.value = data;
  }

  private createMesh() {
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_frequencyData: { value: new Float32Array(16) },
      },
    });

    const sphere = new THREE.Mesh(geometry, material);

    return sphere;
  }
}
