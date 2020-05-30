<template>
  <div id="App">
    <!-- カメラ表示 -->
    <video id="camera" width="400" height="300" loop playsinline autoplay></video>
    <canvas id="camera-overlay" width="400" height="300"></canvas>
    <!-- 3Dモデル表示 -->
    <canvas id="model" width="400" height="300"></canvas>
  </div>
</template>

<script lang="ts">
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRM, VRMUtils } from '@pixiv/three-vrm'

export default {
  name: 'App',
  data() {
    const renderer: any = null
    const camera: any = null
    const currentVrm: any = null
    return {
      renderer,
      camera,
      currentVrm,
    }
  },
  mounted() {
    // レンダラー
    const $canvas: any = document.getElementById('model')
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas: $canvas,
    })
    this.renderer.setSize(400, 300)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    // カメラ
    this.camera = new THREE.PerspectiveCamera(
      30.0,
      window.innerWidth / window.innerHeight,
      0.1,
      20.0
    )
    this.camera.position.set(0.0, 1.2, 0.8)
    // シーン
    const scene = new THREE.Scene()
    // ライト
    const color = new THREE.Color('rgb(255, 255, 255)')
    const light = new THREE.DirectionalLight(color)
    light.position.set(1.0, 1.0, 1.0).normalize()
    scene.add(light)
    // モデル
    const modelSrc = '/model/JK.vrm' // 利用するモデルの配置場所
    const loader = new GLTFLoader()
    loader.crossOrigin = 'anonymous'
    loader.load(
      modelSrc,
      (gltf) => {
        VRM.from(gltf).then((vrm) => {
          VRMUtils.removeUnnecessaryJoints(gltf.scene)
          scene.add(vrm.scene)
          this.currentVrm = vrm
          vrm.scene.rotation.y = Math.PI
        })
      },
      (progress) =>
        console.log('モデルを読み込んでいます...', 100.0 * (progress.loaded / progress.total), '%'),
      (error) => console.error(error)
    )
  },
}
</script>
