<template>
  <div id="App">
    <!-- カメラ表示 -->
    <div id="container">
      <video id="camera" width="400" height="300" loop playsinline autoplay></video>
      <canvas id="cameraOverlay" width="400" height="300"></canvas>
    </div>
    <b-button @click="startVideo">Start Tracking</b-button>
    <!-- 3Dモデル表示 -->
    <canvas id="model" width="400" height="300"></canvas>
  </div>
</template>
<style>
#cameraOverlay {
  position: absolute;
  top: 0px;
  left: 0px;
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  -ms-filter: fliph; /*IE*/
  filter: fliph; /*IE*/
}

#camera {
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  -ms-filter: fliph; /*IE*/
  filter: fliph; /*IE*/
}

#container {
  position: relative;
  width: 370px;
  /*margin : 0px auto;*/
}
</style>
<script lang="ts">
import clm from 'clmtrackr'
import getUserMedia from 'getusermedia'

let render: any
let tracker: any
let vid: HTMLVideoElement | null
let vidWidth: number | null
let vidHeight: number | null
let overlay: HTMLCanvasElement | null
let overlayCC: CanvasRenderingContext2D | null
const ctrack = new clm.tracker({
  faceDetection: {
    useWebWorkers: false,
  },
})

export default {
  name: 'App',
  mounted() {
    vid = <HTMLVideoElement>document.getElementById('camera')
    overlay = <HTMLCanvasElement>document.getElementById('cameraOverlay')
    overlayCC = overlay.getContext('2d')
    vidWidth = vid.width
    vidHeight = vid.height
    this.InitializeCamera()
    ctrack.init()
  },

  methods: {
    InitializeCamera() {
      getUserMedia({ video: true, audio: false }, (err: string, stream: MediaStream) => {
        if (err) {
          this.gumFail()
        } else {
          this.gumSuccess(stream)
        }
      })
    },
    gumSuccess(stream: MediaStream) {
      if (vid != null) {
        if ('srcObject' in vid) {
          vid.srcObject = stream
        } else {
          vid.src = window.URL && window.URL.createObjectURL(stream)
        }
        vid.onloadedmetadata = () => {
          if (vid != null) vid.play()
        }
      }
    },
    gumFail() {
      alert('ビデオに接続できません')
    },
    drawLoop() {
      requestAnimationFrame(this.drawLoop)
      if (vidWidth != null && vidHeight != null)
        if (overlayCC != null) overlayCC.clearRect(0, 0, vidWidth, vidHeight)
      if (ctrack.getCurrentPosition() && overlay != null) {
        ctrack.draw(overlay)
      }
    },
    startVideo() {
      if (vid != null) {
        vid.play()
        ctrack.start(vid)
        this.drawLoop()
      }
    },
  },
}
</script>
