import getUserMedia from 'getusermedia'
import clm from 'clmtrackr'

export default class CameraTracker {
  vid: HTMLVideoElement | null
  vidWidth: number | null = null
  vidHeight: number | null = null
  overlay: HTMLCanvasElement | null
  overlayCC: CanvasRenderingContext2D | null
  ctrack: any

  constructor() {
    this.vid = <HTMLVideoElement>document.getElementById('camera')
    this.overlay = <HTMLCanvasElement>document.getElementById('cameraOverlay')
    this.overlayCC = this.overlay.getContext('2d')
    this.vidWidth = this.vid.width
    this.vidHeight = this.vid.height
    this.ctrack = new clm.tracker()
    this.InitializeCamera()
    this.ctrack.init()
  }

  InitializeCamera() {
    getUserMedia({ video: true, audio: false }, (err: string, stream: MediaStream) => {
      if (err) {
        this.gumFail()
      } else {
        this.gumSuccess(stream)
      }
    })
  }

  gumSuccess(stream: MediaStream) {
    if (this.vid != null) {
      if ('srcObject' in this.vid) {
        this.vid.srcObject = stream
      } else {
        this.vid.src = window.URL && window.URL.createObjectURL(stream)
      }
      this.vid.onloadedmetadata = () => {
        if (this.vid != null) this.vid.play()
      }
    }
  }

  gumFail() {
    alert('ビデオに接続できません')
  }

  drawLoop() {
    requestAnimationFrame(this.drawLoop)
    if (this.vidWidth != null && this.vidHeight != null)
      if (this.overlayCC != null) this.overlayCC.clearRect(0, 0, this.vidWidth, this.vidHeight)
    if (this.ctrack.getCurrentPosition()) {
      this.ctrack.draw(this.overlay)
    }
  }

  startVideo() {
    if (this.vid != null) this.vid.play()
    this.ctrack.start(this.vid)
    this.drawLoop()
  }
}
