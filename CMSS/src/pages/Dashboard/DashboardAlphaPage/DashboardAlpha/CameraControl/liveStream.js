/* eslint-disable no-undef */
import { mobileSDK } from 'ducks/Milestone'
import { Whammy } from './whammy'
import $ from 'jquery'

let VideoConnectionSignal = {
  live: 1,
  playback: 2,
}
class liveStream {
  constructor(camera, dispatch) {
    this.Id = camera.Id

    this.image = document.getElementById(this.Id)
    if (this.image === null) return null
    this.image.addEventListener('load', this.onImageLoad)
    this.image.addEventListener('error', this.onImageError)
    this.drawing = false
    this.destination = { width: 800, height: 600 }
    this.videoConnectionObserver = {
      videoConnectionReceivedFrame: this.videoConnectionReceivedFrame,
    }
    this.playbackTimestamp = new Date()
    this.playbackSpeed = 0
    this.isLive = true
    this.isPushing = false
    this.dispatch = dispatch
    this.playBackTime = {}
    this.downloadAviState = -1
    this.loading = true

    this.canvas = document.createElement('canvas')
    this.canvas.style.width = 400
    this.canvas.style.height = 300
    this.context = this.canvas.getContext('2d')
    this.video = new Whammy.Video(15)
    /**
     * Requesting a video stream.
     */
    this.streamRequest = mobileSDK.requestStream(
      this.Id,
      this.destination,
      null,
      this.requestStreamCallback,
      function(error) {},
    )

    /**
     * Video Pushing Connection
     */
    this.videoPushConnetionObject = null
  }

  /**
   * Export Avi
   */
  exportAvi = () => {
    let startTime = this.playBackTime.startTime
    let endTime = this.playBackTime.endTime
    console.log('playBacktime: ', this.playBackTime)
    console.log('StartTime: ', new Date(startTime))
    console.log('EndTime: ', new Date(endTime))
    let cameraId = this.Id
    let successCallback = this.exportAviSuccessCallback
    let errorCallback = this.exportAviErrorCallback
    mobileSDK.startVideoExport(cameraId, startTime, endTime, successCallback, errorCallback)
  }

  exportAviSuccessCallback = response => {
    let id = response
    console.log('aviAvailableId: ', id, response)
    mobileSDK.getExport(
      id,
      this.exportAviRequestSuccessCallback,
      this.exportAviRequestErrorCallback,
    )
    /*setInterval(() => {
      if (this.downloadAviState !== 101) {
        mobileSDK.getExport(
          id,
          this.exportAviRequestSuccessCallback,
          this.exportAviRequestErrorCallback,
        )
      }
    }, 15000)*/
  }

  exportAviErrorCallback = error => {
    console.log('AviErrorCallback: ', error)
  }

  exportAviRequestSuccessCallback = response => {
    this.downloadAviState = response.State
    console.log('aviRequestSuccess: ', response.State)
  }
  exportAviRequestErrorCallback = error => {
    console.log('aviRequestError: ', error)
  }

  /**
   * Close Video stream request
   */
  closeVideoConnection = () => {
    console.log('close video id', this.videoController)
    if (this.videoController) {
      mobileSDK.closeStream(this.videoController.videoId)
    }
  }

  /**
   * Video stream request callback
   */
  requestStreamCallback = videoConnection => {
    if (videoConnection != null) {
      this.videoController = videoConnection
      videoConnection.addObserver(this.videoConnectionObserver)
      videoConnection.open()
      if (this.isPushing) {
        setTimeout(() => {
          this.createVideoPushConnection()
        }, 30000)
      }
    }
  }

  /**
   * Video Push connection
   */
  videoPushConnection = () => {
    this.switchToLive()
    this.isPushing = true
  }

  createVideoPushConnection = () => {
    mobileSDK.createVideoPushConnection(
      this.videoPushSuccessCallback,
      this.videoPushFailedCallback,
      true,
    )
  }

  videoPushSuccessCallback = videoPushConnectionObject => {
    this.videoPushConnetionObject = videoPushConnectionObject
    videoPushConnectionObject.open(
      () => {
        console.log('videoPushingConnection Opening')
        //this.isPushing = true;
      },
      error => {
        this.isPushing = false
        console.log(error)
      },
    )
  }

  videoPushFailedCallback = error => {
    console.log('error: ', error)
  }

  /**
   * Executed on received frame.
   */
  videoConnectionReceivedFrame = frame => {
    if (!this.drawing && frame.dataSize > 0) {
      this.drawing = true

      if (frame.hasSizeInformation) {
        var multiplier =
          frame.sizeInfo.destinationSize.resampling * mobileSDK.getResamplingFactor() || 1
        this.image.width = multiplier * frame.sizeInfo.destinationSize.width
        this.image.height = multiplier * frame.sizeInfo.destinationSize.height
      }
      if (this.imageURL) {
        window.URL.revokeObjectURL(this.imageURL)
      }

      this.imageURL = window.URL.createObjectURL(frame.blob)
      if (this.loading) {
        $('#cameraLoadingArea' + this.Id)[0].style.display = 'none'
        this.loading = false
      }
      this.image.src = this.imageURL

      if (this.playBackTime !== {} && !this.isLive) {
        if (
          !(frame.timestamp.getTime() > this.playBackTime.endTime) &&
          !(frame.timestamp.getTime() < this.playBackTime.startTime)
        ) {
          let img = new Image()
          img.onload = () => {
            //this.processImage(img)
          }
          img.src = this.imageURL
          //this.processImage(img)
          this.updateTime(frame.timestamp.getTime())
          this.dispatch({
            type: 'SET_PLAYBACK_TIME_SEEK',
            playBackTimeSeek: frame.timestamp.getTime() - this.playBackTime.startTime,
          })
        } else {
          /*console.log('download finish')
          this.playbackChangeSpeed(0)
          let output = this.video.compile()
          let url = webkitURL.createObjectURL(output)

          this.dispatch({
            type: 'SET_PLAYBACK_VIDEO_DOWNLOAD',
            videoInfo: {
              enabled: true,
              url: url,
            },
          })*/
        }
      } else {
      }
    }
  }

  /**
   * Export video from image sequence.
   */
  processImage = img => {
    //let imageUrl = url.replace('blob:', '');
    let context = this.context
    let canvas = this.canvas
    let video = this.video
    context.globalAlpha = 0.2
    context.drawImage(img, 0, 0, canvas.width, canvas.height)
    video.add(context)
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.globalAlpha = 0.4
    context.drawImage(img, 0, 0, canvas.width, canvas.height)
    video.add(context)
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.globalAlpha = 0.6
    context.drawImage(img, 0, 0, canvas.width, canvas.height)
    video.add(context)
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.globalAlpha = 0.8
    context.drawImage(img, 0, 0, canvas.width, canvas.height)
    video.add(context)
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.globalAlpha = 1
    context.drawImage(img, 0, 0, canvas.width, canvas.height)

    //this should be a loop based on some user input
    video.add(context)
    video.add(context)
    video.add(context)
    video.add(context)
    video.add(context)
    video.add(context)
    video.add(context)

    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.globalAlpha = 0.8
    context.drawImage(img, 0, 0, canvas.width, canvas.height)
    video.add(context)
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.globalAlpha = 0.6
    context.drawImage(img, 0, 0, canvas.width, canvas.height)
    video.add(context)
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.globalAlpha = 0.4
    context.drawImage(img, 0, 0, canvas.width, canvas.height)
    video.add(context)

    this.video = video

    img.remove()
  }

  /**
   * Executed on image load.
   */
  onImageLoad = event => {
    this.drawing = false
  }

  onImageError = event => {
    this.drawing = false
  }

  /**
   * Stop camera stream
   */
  stop = () => {
    if (this.videoController) {
      this.videoController.removeObserver(this.videoConnectionObserver)
      this.videoController.close()
      this.videoController = null
    }
    if (this.streamRequest) {
      mobileSDK.cancelRequest(this.streamRequest)
      this.streamRequest = null
    }
  }

  resetState = () => {
    this.playbackSpeed = 0

    if (this.streamRequest) {
      mobileSDK.cancelRequest(this.streamRequest)
      this.streamRequest = null
    }
  }

  /**
   * Turn camera directions.
   */
  ptzMove = command => {
    mobileSDK.ptzMove(this.videoController, command)
  }

  /**
   * Zoom camera.
   */
  ptzZoom = command => {
    mobileSDK.ptzMove(this.videoController, command)
  }

  /**
   * Switch to camera playback mode.
   */
  switchToPlayback = playBackTime => {
    if (playBackTime === this.playBackTime) return
    this.loading = true
    $('#cameraLoadingArea' + this.Id)[0].style.display = 'flex'
    this.playBackTime = playBackTime
    if (playBackTime !== {}) {
      this.playbackTimestamp = playBackTime.startTime
    } else {
      this.playbackTimestamp = new Date().getTime()
    }
    //if (!this.isLive) return;

    this.isLive = false

    //this.exportAvi(this.playBackTime.startTime, this.playBackTime.endTime);

    this.stop()

    this.resetState()

    this.updateTime(this.playbackTimestamp)

    var parameters = this.destination

    var option = {
      signal: VideoConnectionSignal.playback,
      time: this.playbackTimestamp,
    }

    this.streamRequest = mobileSDK.requestStream(
      this.Id,
      parameters,
      option,
      this.requestStreamCallback,
      null,
    )
  }

  /**
   * Switch camera to live video
   */
  switchToLive = () => {
    if (this.isLive) return
    this.loading = true
    $('#cameraLoadingArea' + this.Id)[0].style.display = 'flex'

    this.isLive = true

    this.playBackTime = {}

    this.stop()

    this.resetState()

    this.streamRequest = mobileSDK.requestStream(
      this.Id,
      this.destination,
      null,
      this.requestStreamCallback,
      function(error) {},
    )
  }

  /**
   * Trigger camera play backwards
   */
  playBackwardTrigger = () => {
    this.playbackChangeSpeed(-1)
  }

  /**
   * Trigger camera play forward
   */
  playForwardTrigger = () => {
    let myTimer = setInterval(() => {
      if (this.videoController) {
        this.playbackChangeSpeed(1)
        clearInterval(myTimer)
      }
    }, 3000)
  }

  fastBackward = () => {
    let myTimer = setInterval(() => {
      if (this.videoController) {
        this.playbackChangeSpeed(-5)
        clearInterval(myTimer)
      }
    }, 3000)
  }

  fastForward = () => {
    let myTimer = setInterval(() => {
      if (this.videoController) {
        this.playbackChangeSpeed(5)
        clearInterval(myTimer)
      }
    }, 3000)
  }

  gotoStart = () => {
    this.isLive = false

    this.stop()

    this.resetState()

    this.playbackTimestamp = this.playBackTime.startTime

    this.dispatch({
      type: 'SET_PLAYBACK_TIME_SEEK',
      playBackTimeSeek: 0,
    })

    this.updateTime(this.playbackTimestamp)

    var parameters = { width: 400, height: 300 }

    var option = {
      signal: VideoConnectionSignal.playback,
      time: this.playbackTimestamp,
    }

    this.streamRequest = mobileSDK.requestStream(
      this.Id,
      parameters,
      option,
      this.requestStreamCallback,
      null,
    )
  }

  gotoEnd = () => {
    this.isLive = false

    this.stop()

    this.resetState()

    this.playbackTimestamp = this.playBackTime.endTime

    this.dispatch({
      type: 'SET_PLAYBACK_TIME_SEEK',
      playBackTimeSeek: this.playbackTimestamp,
    })

    this.updateTime(this.playbackTimestamp)

    var parameters = { width: 400, height: 300 }

    var option = {
      signal: VideoConnectionSignal.playback,
      time: this.playbackTimestamp,
    }

    this.streamRequest = mobileSDK.requestStream(
      this.Id,
      parameters,
      option,
      this.requestStreamCallback,
      null,
    )
  }

  /**
   * Change video speed
   */
  playbackChangeSpeed = speed => {
    if (!this.videoController) return

    speed = Math.round(speed)

    mobileSDK.playbackSpeed(this.videoController, speed)
    this.playbackSpeed = speed
    /*if (speed == 0) {
            this.playbackSpeed = 0;
        }
        else if (speed < 0) {
            this.playbackSpeed = -1;
        }
        else if (speed > 0) {
            this.playbackSpeed = 1;
        }*/
  }

  /**
   * Updates time element
   */
  updateTime = timestamp => {
    if (this.isLive) return

    this.playbackTimestamp = timestamp

    var date = new Date(timestamp)

    var hours = date.getHours()
    var minutes = '0' + date.getMinutes()
    var seconds = '0' + date.getSeconds()
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
    console.log('nowTime: ', date)
  }
}

export { liveStream }
