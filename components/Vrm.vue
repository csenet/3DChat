<template>
  <div id="App">
    <!-- カメラ表示 -->
    <video id="camera" width="400" height="300" loop playsinline autoplay></video>
    <canvas id="cameraOverlay" width="400" height="300"></canvas>
    <!-- 3Dモデル表示 -->
    <canvas id="model" width="400" height="300"></canvas>
  </div>
</template>

<script lang="ts">
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRM, VRMUtils, VRMSchema } from '@pixiv/three-vrm'
import ModelRenderer from '@/assets/chat/ModelRenderer'
const clm = require('@/assets/js/clmtrackr')

export default {
  name: 'App',
  data() {
    const render: any = null
    return {
      render,
    }
  },

  mounted() {
    this.render = new ModelRenderer()
  },

  methods: {},
}
</script>
