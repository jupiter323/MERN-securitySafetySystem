import { XPMobileSDK } from './library/XPMobileSDK.library'

export let XPMobileSDKSettings = {
  fileName: 'XPMobileSDK.js',
  clientType: 'WebClient',
  communicationChanel: '/XProtectMobile/Communication',
  videoChanel: '/XProtectMobile/Video',
  audioChannel: '/XProtectMobile/Audio',
  MobileServerURL: '',
  defaultEncryptionPadding: 'Iso10126',
  primeLength: 1024,
  videoConnectionTimeout: 20000,
  resamplingFactor: 1 / 1000000,

  supportsMultiThreaded: false,
  supportsCarousels: false,
  supportsFootages: false,
  supportsCHAP: true,

  SupportsAudioIn: true,
  SupportsAudioOut: false,
  AudioCompressionLevel: 99,
  AudioCompressionLevelAudioAPI: 41,
}

class XPMobileSDKInterface {
  library = {}
  interfaces = {}
  features = {}

  /**
   * Adds an observer to the Connection singleton.
   *
   * @method addObserver
   * @param {Object} observer - an arbitrary object implementing the ConnectionObserverInterface interface
   * @see ConnectionObserverInterface
   */
  addObserver(observer) {
    XPMobileSDK.library.CHAP.initialize()
    XPMobileSDK.library.Connection.initialize(window.localStorage)
    XPMobileSDK.library.Connection.addObserver(observer)
  }

  /**
   * Removes an existing observer from the Connection singleton.
   *
   * @method removeObserver
   * @param {Object} observer - an arbitrary object implementing the ConnectionObserverInterface interface
   * @see ConnectionObserverInterface
   */
  removeObserver(observer) {
    XPMobileSDK.library.Connection.removeObserver(observer)
  }

  /**
   * Cancels a request.
   *
   * @method cancelRequest
   * @param {ConnectionRequest} request - the ConnectionRequest object, returned by the method used to create it
   */
  cancelRequest(request) {
    XPMobileSDK.library.Connection.cancelRequest(request)
  }

  /**
   * Sends a Connect connection command to establish a new connection with a server.
   * The changes of the connect status are propagated to all listeners through the ConnectionObserver interface methods.
   * Listeners implementing the ConnectionObserver interface methods are added with the addObserver method.
   *
   * @method connect
   * @param {String} server - server name or IP address
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  connect(server) {
    if (server) {
      XPMobileSDK.library.Connection.server = server
    }
    return new this.Connect(null)
  }

  /**
   * Initiates connection to the Mobile Server. Two limitations are introduced:
   * MaximumConnectionAllowed and ConnectionTimeout between Connect and Login.
   * They are set from the GeneralSetting section in config file
   *
   * @method Connect
   * @param {Object} params - Parameters to sent to the server. May contain:
   * <pre>
   * - {String} EncryptionPadding - (optional) Padding scheme that will be used
   *                                when encrypting/decrypting shared key.
   *                                Default is PKCS7. Currently supported values are PKCS7 and ISO10126.
   * - {Number} PrimeLength - (optional) The length of the prime module in bits.
   *                          Default is 1024. Currently supported values are 1024 and 2048
   * - {String} ProcessingMessage - (optional) [Yes/No] Indicates whether processing messages
   *                                should be sent from server while processing the request. Default is Yes.
   * </pre>
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} failCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  Connect(params, successCallback, failCallback) {
    params = params || {}
    params.PublicKey = XPMobileSDK.library.Connection.dh.createPublicKey()
    if (XPMobileSDKSettings.primeLength) {
      params.PrimeLength = XPMobileSDKSettings.primeLength
    }
    if (XPMobileSDKSettings.defaultEncryptionPadding) {
      params.EncryptionPadding = XPMobileSDKSettings.defaultEncryptionPadding.toUpperCase()
    }
    var connectionRequest = XPMobileSDK.library.Connection.Connect(
      params,
      successCallback,
      failCallback,
    )
    return connectionRequest || XPMobileSDK.interfaces.ConnectionRequest
  }

  /**
   * Tries to reestablish an existing connection with a server by using an existing connection id.
   * The changes of the connect status are propagated to all listeners through the ConnectionObserver interface methods.
   * Listeners implementing the ConnectionObserver interface methods are added with the addObserver method.
   *
   * @method connectWithId
   * @param {String} server - server name or IP address
   * @param {String} connectionId - connection id
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  connectWithId(server, connectionId) {
    XPMobileSDK.library.Connection.connectWithId(server, connectionId)
  }

  /**
   * Sends a LogIn connection command to log a user with valid usernam and password.
   * The changes of the login status are propagated to all listeners through the ConnectionObserver interface methods.
   * Listeners implementing the ConnectionObserver interface methods are added with the addObserver method.
   *
   * @method login
   * @param {String} username - username
   * @param {String} password - password
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  login(username, password, parameters) {
    parameters = parameters || {}
    parameters.Username = username
    parameters.Password = password
    return new this.Login(parameters)
  }

  /**
   * Sends a low level Login command to the server.
   *
   * @method Login
   * @param {Object} params - Parameters to sent to the server.  May contain:
   * <pre>
   * - {String} Username - Name of the connection user.
   * - {String} Password - Password for the certain user.
   * - {Number} NumChallenges - Number of challenges the MoS should return.
   *                           Up to 100 can be requested at once.
   * - {String} ProcessingMessage - (optional) [Yes/No] Indicates whether processing messages
   *                                should be sent from server while processing the request. Default is Yes.
   * - {String} SupportsResampling - (optional) [Yes/No] When present and equal to
   *                                 "Yes", indicates that the client can handle
   *                                 downsized images. This instructs Quality of
   *                                 Service to reduce the size of the sent images
   *                                 as additional measure in cases of low bandwidth.
   * - {String} SupportsExtendedResamplingFactor - (optional) [Yes/No] When present and equal to
   *                                               "Yes", indicates that client supports working
   *                                               with decimal resampling factor. Influence on
   *                                               the type of ResamplingTag received in Header
   *                                               Extension Flags of Video frame
   * - {String} Footages - (optional) [Yes/No] When present and equal to
   *                       "Yes", indicates that client supports Footages.
   *                       Influence is that GetExport and
   *                       GetInvestigation commands will not return
   *                       footages if the client doesn't support it.
   * </pre>
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} failCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  Login(params, successCallback, failCallback) {
    params = params || {}
    console.log('loginParams')
    if (XPMobileSDK.library.Connection.PublicKey) {
      params.Username = XPMobileSDK.library.Connection.dh.encodeString(params.Username)
      params.Password = XPMobileSDK.library.Connection.dh.encodeString(params.Password)
    }

    if (
      XPMobileSDKSettings.supportsCHAP &&
      XPMobileSDK.library.Connection.CHAPSupported === 'Yes'
    ) {
      // Take 100 challenges to start with
      params.NumChallenges = params.NumChallenges || 100
    }

    params.SupportsResampling = params.SupportsResampling || 'Yes'
    params.SupportsExtendedResamplingFactor = params.SupportsExtendedResamplingFactor || 'Yes'

    if (XPMobileSDKSettings.supportsCarousels) {
      params.SupportsCarousel = params.SupportsCarousel || 'Yes'
    }
    if (XPMobileSDKSettings.supportsFootages) {
      params.Footages = params.Footages || 'Yes'
    }
    if (XPMobileSDKSettings.clientType) {
      params.ClientType = params.ClientType || XPMobileSDKSettings.clientType
    }

    var connectionRequest = XPMobileSDK.library.Connection.Login(
      params,
      successCallback,
      failCallback,
    )
    return connectionRequest || XPMobileSDK.interfaces.ConnectionRequest
  }

  /**
   * Sends a RequestSecondStepAuthenticationPin connection command after successful login with a valid username and password.
   * This method is used only if the server has called the connectionRequiresCode method of the ConnectionObserver interface.
   *
   * @method requestCode
   * @param {Function} successCallback - function that is called when the command execution was successful.
   * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  requestCode(successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.requestCode(successCallback, errorCallback)
  }

  /**
   * Sends a RequestSecondStepAuthenticationPin connection command after successful login with a valid username and password.
   * This method is used only if the server has called the connectionRequiresCode method of the ConnectionObserver interface.
   *
   * @method verifyCode
   * @param {String} code - second step authentication pin code
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  verifyCode(code) {
    return XPMobileSDK.library.Connection.verifyCode(code)
  }

  /**
   * Sends a Disconnect connection command and logs out the current user.
   *
   * @method disconnect
   */
  disconnect() {
    XPMobileSDK.library.Connection.Disconnect()
  }

  /**
   * Sends a Disconnect connection command and logs out the current user.
   * (Stops all the open video communication channels, removes ConnectionId from the internal resolving mechanism)
   *
   * @method Disconnect
   * @param {Object} params - Parameters to sent to the server. May contain:
   * <pre>
   * - {String} ConnectionId - Connection ID retrieved from Connect command
   * - {String} ProcessingMessage - (optional) [Yes/No] Indicates whether processing
   *                                messages should be sent from server while
   *                                processing the request. Default depends on the
   *                                value in connect command.
   * </pre>
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} failCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   */
  Disconnect(params, successCallback, failCallback) {
    XPMobileSDK.library.Connection.Disconnect(params, successCallback, failCallback)
  }

  /**
   * Sends a LiveMessage command to the server indicating that the client is up and running. Client needs to send that command at least once in the watch dog interval which is 30 seconds by default.
   * Recomented interval is 80% of whach dog  = 80*30/100 = 24
   *
   * @example setInterval(function(){XPMobileSDK.LiveMessage()}, 24000);
   *
   * @method Disconnect
   * @param {Object} params - Parameters to sent to the server.  May contain:
   * <pre>
   * - {String} ConnectionId - Connection ID retrieved from Connect command
   * - {String} ProcessingMessage - (optional) [Yes/No] Indicates whether processing
   *                                messages should be sent from server while
   *                                processing the request. Default depends on the
   *                                value in connect command.
   * </pre>
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} failCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   */
  LiveMessage(params, successCallback, failCallback) {
    XPMobileSDK.library.Connection.LiveMessage(params, successCallback, failCallback)
  }

  /**
   * Sends a GetAllViewsAndCameras connection command to get the full tree of views starting from the root.
   *
   * @method getAllViews
   * @param {Function} successCallback - function that is called when the command execution was successful and a views object is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getAllViews(successCallback, errorCallback) {
    var connectionRequest = XPMobileSDK.library.Connection.getAllViews(
      successCallback,
      errorCallback,
    )
    return connectionRequest || XPMobileSDK.interfaces.ConnectionRequest
  }

  /**
   * Sends a GetViews connection command to get the sub-views of any view using its id.
   *
   * @method getViews
   * @param {String} viewId - view id
   * @param {Function} successCallback - function that is called when the command execution was successful and a view object is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  requestStream(cameraId, size, options, successCallback, errorCallback) {
    var connectionRequest = XPMobileSDK.library.Connection.requestStream(
      cameraId,
      size,
      options,
      successCallback,
      errorCallback,
    )
    return connectionRequest || XPMobileSDK.interfaces.ConnectionRequest
  }

  /**
   * Starts live, payback or push video session for a particular device.
   *
   * @method RequestStream
   * @param {Object} params - Parameters to sent to the server. May contain:
   * <pre>
   * - {String} ConnectionId - Connection ID retrieved from Connect command
   * - {String} StreamType - Shows if this is a transcoded or a direct stream.
   *                         Possible values - Native and Transcoded. Missing
   *                         of this will be interpreted as Transcoded. (backward compatibility)
   * - {String} ByteOrder - LittleEndian/Network. Missing of this will be
   *                        interpreted as LittleEndian for Transcoded,
   *                        StreamType and Network for Native StreamType.
   * - {String} CameraId - ID of the camera, which stream is requested (GUID)
   * - {Number} DestWidth - Width of the requested video (in pixels)
   * - {Number} DestHeight - Height of the requested video (in pixels)
   * - {Number} Fps - Frame-rate of the requested video (frames per second)
   * - {Number} ComprLevel - Compression level of the received JPEG images (1 - 100)
   * - {String} SignalType - Type of the requested signal - Live, Playback or Upload.
   * - {String} MethodType - Type of the method for retrieving video data - Push or Pull
   * - {String} KeyFramesOnly - Yes/No (everything different than Yes is interpreted as No)
   *                            - reduces stream quality by transcoding only Key (I) frames,
   *                            if option is enabled in the Management Plug-in.
   * - {String} TImeRestrictionStart - (optional) Start time stamp of restriction period given as milliseconds since Unix EPOCH
   * - {String} TimeRestrictionEnd - (optional) End time stamp of restriction period given as milliseconds since Unix EPOCH
   * - {String} MotionOverlay - (reserved) No/Yes
   * - {String} RequestSize - (optional) [Yes/No] - If value of the field is Yes, Size header extension
   *                          is sent with every frame. Otherwise it is sent only on size change.
   *                           Missing of paramter is interpreted as No.
   * - {String} ProcessingMessage - (optional) [Yes/No] Indicates whether processing
   *                                messages should be sent from server while
   *                                processing the request. Default is Yes.
   * - {String} SeekType - (optional) Makes seek of specific type: DbStart,
   *                       DbEnd, PrevSeq, NextSeq, PrevFrame, NextFrame, Time, TimeOrBefore,
   *                       TimeOrAfter, TimeAfter, TimeBefore.
   * - {String} Time - (optional) Time of playback speed (in milliseconds
   *                   since Unix epoch). Valid if SeekType == Time.
   * - {String} UserInitiatedDownsampling - (optional) [Yes/No] When present and equal to
   *                                        "Yes", indicates that the client requires all sent images to
   *                                        be downsized at least by two (half the
   *                                        requested width and height). SupportsResampling
   *                                        must be set explicitly to "Yes".
   * - {String} PlaybackControllerId - (optional) Id of the playback controller used for common playback control.
   *                                   Received from "CreatePlaybackController" command.
   *                                   When present and not equal to empty string, indicates
   *                                   that the client requires playback controller to be used,
   *                                   shared between few playback streams. Valid only if "SignalType" is set to Playback.
   *                                   If does not present - single playback stream is created. If set to
   *                                   id of the existing in the server controller - this playback stream is attached to it.
   *                                   If set to invalid id - error is returned (unknown item id - 21).
   * </pre>
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} failCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   */
  RequestStream(params, successCallback, failCallback) {
    XPMobileSDK.library.Connection.RequestStream(params, successCallback, failCallback)
  }

  /**
   * Starts live, playback audio session for a particular device.
   *
   * @method RequestAudioStream
   * @param {Object} params - Parameters to sent to the server. May contain:
   * <pre>
   * - {String} ConnectionId - Connection ID retrieved from Connect command
   * - {String} StreamType - Shows if this is a transcoded or a direct stream.
   *                         Possible values - Native and Transcoded. Missing
   *                         of this will be interpreted as Transcoded. (backward compatibility)
   * - {String} ItemId - ID of the microphone, which stream is requested (GUID)
   * - {Number} ComprLevel - Compression level of the received Audio (1 - 100)
   * - {String} SignalType - Type of the requested signal - Live, Playback or Upload.
   * - {String} MethodType - Type of the method for retrieving video data - Push or Pull
   * - {String} StreamDataType - "Audio"
   * - {String} AudioEncoding - The type pf audio encoding - "Mp3"
   * </pre>
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} failCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   */
  RequestAudioStream(params, successCallback, failCallback) {
    XPMobileSDK.library.Connection.RequestAudioStream(params, successCallback, failCallback)
  }

  /**
   * Sends a RequestAudioStream connection command to get the live/playback video stream of a camera as a VideoConnection object from the server.
   *
   * @method requestAudioStream
   * @param {String} cameraId - unique GUID of the microphone that should be started
   * @param {AudioConnectionOptions} options - optional, optional configuration. May contain:
   * <pre>
   * - {String} signal - Type of the requested signal - Live, Playback.
   * - {String} streamType - Shows if this is a transcoded or a direct stream.
   *                         Possible values - Transcoded.
   * </pre>
   * @param {Function} successCallback - function that is called when the command execution was successful and a VideoConnection object is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  requestAudioStream(microphoneId, options, successCallback, errorCallback) {
    var connectionRequest = XPMobileSDK.library.Connection.requestAudioStream(
      microphoneId,
      options,
      successCallback,
      errorCallback,
    )
    return connectionRequest || XPMobileSDK.interfaces.ConnectionRequest
  }

  /**
   * Sends a RequestStream connection command to get an upstream for video push to the server.
   *
   * @method requestPushStream
   * @param {Function} successCallback - function that is called when the command execution was successful and a stream parameters object is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  requestPushStream(successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.requestPushStream(successCallback, errorCallback)
  }

  /**
   * Sends a RequestFootageStream connection command to get an upstream for uploading video files and images as existing recordings to the server.
   *
   * @method requestFootageStream
   * @param {String} fileName - name of file
   * @param {Number} fileSize - size of file
   * @param {Function} successCallback - function that is called when the command execution was successful and a stream parameters object is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  requestFootageStream(fileName, fileSize, successCallback, errorCallback) {
    var connectionRequest = XPMobileSDK.library.Connection.requestFootageStream(
      fileName,
      fileSize,
      successCallback,
      errorCallback,
    )
    return connectionRequest || XPMobileSDK.interfaces.ConnectionRequest
  }

  /**
   * Sends a ChangeStream connection command to change the parameters of an existing VideoConnection.
   *
   * @method changeStream
   * @param {VideoConnection} videoConnection - existing VideoConnection object representing a camera stream
   * @param {VideoConnectionCropping} cropping - rectangle to crop from the native camera video stream
   * @param {VideoConnectionSize} size - output stream size for the resulting cropped native camera video stream
   * @param {Function} successCallback - function that is called when the command execution was successful.
   * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  changeStream(videoConnection, cropping, size, successCallback, errorCallback) {
    var connectionRequest = XPMobileSDK.library.Connection.changeStream(
      videoConnection,
      cropping,
      size,
      successCallback,
      errorCallback,
    )
    return connectionRequest || XPMobileSDK.interfaces.ConnectionRequest
  }

  /**
   * Sends a ChangeStream connection command and logs out the current user.
   *
   * @method ChangeStream
   * @param {Object} params - Parameters to sent to the server.  May contain:
   * <pre>
   * - {String} ConnectionId - Connection ID retrieved from Connect command
   * - {String} VideoId - ID of the video connection (GUID)
   * - {Number} DestWidth - (optional) Width of the requested video (in pixels)
   * - {Number} DestHeight - (optional) Height of the requested video (in pixels)
   * - {Number} Fps - (optional) Frame-rate of the requested video (frames per second)
   * - {Number} ComprLevel - (optional) Compression level of the received JPEG images (1 - 100)
   * - {String} MethodType - Type of the method for retrieving video data - Push or Pull
   * - {String} SeekType - (optional) Makes seek of specific type: DbStart,
   *                       DbEnd, PrevSeq, NextSeq, PrevFrame, NextFrame, Time, TimeOrBefore,
   *                       TimeOrAfter, TimeAfter, TimeBefore.
   * - {String} Time - (optional) Time of playback speed (in milliseconds
   *                   since Unix epoch). Valid if SeekType == Time.
   *
   * - {String} SignalType - Type of the requested signal - Live, Playback or Upload.
   * - {Number} SrcLeft - (optional) Left coordinate (X) of the cropping rectangle.
   * - {Number} SrcTop - (optional) Top coordinate (Y) of the cropping rectangle.
   * - {Number} SrcRight - (optional) Right coordinate (X) of the cropping rectangle.
   * - {Number} SrcBottom - (optional) Bottom coordinate (Y) of the cropping rectangle.
   * - {Number} Speed - (optional) Speed of the playback (floating point). Sign determines the direction.
   * - {Number} PtzPreset - (optional) Makes move of the PTZ to a user defined preset.
   * - {String} RegionGrid - (reserved)
   * - {String} MotionOverlayEnabled - (reserved) No/Yes
   * - {Number} MotionAmount - (reserved ) 1-100
   * - {Number} SensitivityAmount - (reserved) 1-100
   * - {Number} CPUImpactAmont - (reserved) 1-4
   * - {String} ProcessingMessage - (optional) [Yes/No] Indicates whether processing messages should
   *                                be sent from server while processing the request.
   *                                Default depends on the value in connect command
   * </pre>
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} failCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   */
  ChangeStream(params, successCallback, failCallback) {
    XPMobileSDK.library.Connection.ChangeStream(params, successCallback, failCallback)
  }

  /**
   * Sends a CloseStream connection command to close an existing VideoConnection by id.
   *
   * @method closeStream
   * @param {String} videoId - id of an existing VideoConnection
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  closeStream(videoId) {
    return XPMobileSDK.library.Connection.closeStream(videoId)
  }

  /**
   * Sends a CloseStream connection command to close an existing Audio stream by Id.
   *
   * @method closeStream
   * @param {String} videoId - id of an existing stream
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  closeAudioStream(videoId) {
    return XPMobileSDK.library.Connection.closeAudioStream(videoId)
  }

  /**
   * Sends a CloseStream connection command and logs out the current user.
   *
   * @method CloseStream
   * @param {Object} params - Parameters to sent to the server. Should contain:
   * <pre>
   * - {String} ConnectionId - Connection ID retrieved from Connect command
   * - {String} VideoId - ID of the video connection (GUID)
   * - {String} ProcessingMessage - (optional) [Yes/No] Indicates whether processing messages should
   *                                be sent from server while processing the request.
   *                                Default depends on the value in connect command
   * </pre>
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} failCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   */
  CloseStream(params, successCallback, failCallback) {
    XPMobileSDK.library.Connection.CloseStream(params, successCallback, failCallback)
  }

  /**
   * Establishes a connection to an available web camera and requests a video push stream for that camera with requestPushStream.
   *
   * @method createVideoPushConnection
   * @param {Function} successCallback - function that is called when the command execution was successful and a VideoPushConnection object is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
   * @param {Boolean} skipUserMedia - do not restrict usage to user media, but allow alternative ways for streaming.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  createVideoPushConnection(successCallback, errorCallback, skipUserMedia) {
    console.log('Connecting Video Push')
    var videoPushConnection = new XPMobileSDK.library.VideoPushConnection(
      successCallback,
      errorCallback,
      skipUserMedia,
    )
    return videoPushConnection || XPMobileSDK.interfaces.VideoPushConnection
  }

  /**
   * Returns the Open Street Map servers defined into Mobile Server's config file
   *
   * @method getOsmServerAddresses
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getOsmServerAddresses(successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getOsmServerAddresses(successCallback, errorCallback)
  }

  /**
   * Returns the all Smart Maps cameras
   *
   * @method getGisMapCameras
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getGisMapCameras(successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getGisMapCameras(successCallback, errorCallback)
  }

  /**
   * Returns the all Smart Maps locations
   *
   * @method getGisMapLocations
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getGisMapLocations(successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getGisMapLocations(successCallback, errorCallback)
  }

  /**
   * Sends a ChangeStream command to the server.
   * Changes the motion detection settings of the stream that the given videoConnection represents.
   *
   * @method motionDetection
   * @param {VideoConnection} videoConnection - existing VideoConnection object representing a camera stream
   * @param {Object} options - contains any or all of the motion, sensitivity, grid and cpu parameters.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  motionDetection(videoConnection, options) {
    return XPMobileSDK.library.Connection.motionDetection(videoConnection, options)
  }

  /**
   * Sends a GetPtzPresets command to the server.
   *
   * @method getPtzPresets
   * @param {GUID} cameraId - the current camera related to the presets this request will return
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getPtzPresets(cameraId, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getPtzPresets(cameraId, successCallback, errorCallback)
  }

  /**
   * Sends a ControlPTZ command to the server. Controls PTZ Preset.
   * The parameter needs to be a valid preset name, otherwise nothing will happen.
   *
   * @method ptzPreset
   * @param {VideoConnection} videoConnection - existing VideoConnection object representing a camera stream
   * @param {String} presetName - the name of the preset to be activated
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  ptzPreset(videoConnection, presetName) {
    return XPMobileSDK.library.Connection.ptzPreset(videoConnection, presetName)
  }

  /**
   * It is used to change the camera orientation by moving it in the direction of the tap.
   * The reference point of the movement is the center of the screen.
   * The tap and the reference points are used to calculate the direction and the speed of the camera movement.
   *
   * @method ptzTapAndHold
   * @param {Object} parameters - Object containing the following properties:
   * <pre>
   * - {String} CameraId - unique GUID of the camera
   * - {Number} GestureXPercent - the percentage of distance between start and finish [-100:100]
   * - {Number} GestureYPercent - the percentage of distance between start and finish [-100:100]
   * </pre>
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and an error object is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  ptzMove(videoConnection, direction) {
    return XPMobileSDK.library.Connection.ptzMove(videoConnection, direction)
  }

  /**
   * It is used to change the camera orientation by moving it in the direction of the swipe.
   * The swipe direction and length are calculated based on the start and end points of the gesture.
   * The swipe speed is calculated based on the time it took to perform the gesture
   * from the start point to the end point.
   * The calculated direction defines the direction of the PTZ movement,
   * whereas the length and the speed are used to determine the amount of the PTZ movement.
   *
   * @method ptzSwipe
   * @param {Object} parameters - Object containing the following properties:
   * <pre>
   * - {String} CameraId - unique GUID of the camera
   * - {Number} GestureXPercent - the percentage of distance between start and finish [-100:100]
   * - {Number} GestureYPercent - the percentage of distance between start and finish [-100:100]
   * </pre>
   * @param {Number} gestureDuration - number of milliseconds
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  ptzSwipe(parameters, gestureDuration) {
    return XPMobileSDK.library.Connection.ptzSwipe(parameters, gestureDuration)
  }

  /**
   * Sends a ChangeStream command to the server.
   * Controls playback speed as a float. Negative number means backwards. 1.0 means normal speed.
   *
   * @method playbackSpeed
   * @param {VideoConnection} videoConnection - existing VideoConnection object representing a camera stream
   * @param {Number} speed - Speed of the playback (floating point). Sign determines the direction
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  playbackSpeed(videoConnection, speed) {
    return XPMobileSDK.library.Connection.playbackSpeed(videoConnection, speed)
  }

  /**
   * Sends a ChangeStream command to the server.
   * Seeks to either of: 'DbStart', 'DbEnd', 'PrevSeq', 'NextSeq', 'PrevFrame' or 'NextFrame'.
   *
   * @method playbackSeek
   * @param {VideoConnection} videoConnection - existing VideoConnection object representing a camera stream
   * @param {String} seekType - 'DbStart', 'DbEnd', 'PrevSeq', 'NextSeq', 'PrevFrame' or 'NextFrame'
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  playbackSeek(videoConnection, seekType) {
    return XPMobileSDK.library.Connection.playbackSeek(videoConnection, seekType)
  }

  /**
   * Sends a ChangeStream command to the server. Goes to the closest possible match of specific time.
   *
   * @method playbackGoTo
   * @param {VideoConnection} videoConnection - existing VideoConnection object representing a camera stream
   * @param {Number} millisecondsSinceUnixEpoch - Time of playback speed (in milliseconds since Unix epoch). Valid if SeekType == Time
   * @param {String} seekType - optional, 'Time' (default), 'TimeOrBefore', 'TimeOrAfter'
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  playbackGoTo(
    videoConnection,
    millisecondsSinceUnixEpoch,
    seekType,
    successCallback,
    errorCallback,
  ) {
    return XPMobileSDK.library.Connection.playbackGoTo(
      videoConnection,
      millisecondsSinceUnixEpoch,
      seekType,
      successCallback,
      errorCallback,
    )
  }

  /**
   * Sends a GetThumbnail command to the server in order to obtain an image representation for a given camera.
   *
   * @method getThumbnail
   * @param {String} cameraId - the unique GUID of the camera
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getThumbnail(cameraId, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getThumbnail(cameraId, successCallback, errorCallback)
  }

  /**
   * Gets thumbnail by the given camera id and time.
   *
   * @method getThumbnailByTime
   * @param {String} cameraId - Id of the requested camera thumbnail
   * @param {Number} time - Miliseconds since start of UNIX epoch, in UTC.
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getThumbnailByTime(cameraId, time, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getThumbnailByTime(
      cameraId,
      time,
      successCallback,
      errorCallback,
    )
  }

  /**
   * Gets the start time of the recordings for a particular camera.
   *
   * @method getDBStartTime
   * @param {String} cameraId - ID of the camera, which recordings database time is requested
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getDBStartTime(cameraId, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getDBStartTime(cameraId, successCallback, errorCallback)
  }

  /**
   * Gets the next sequence by given time for the given cameraId.
   *
   * @method getNextSequence
   * @param {String} cameraId - ID of the camera (GUID) for which Sequences are retrieved.
   * @param {Number} timestamp - milliseconds in UTC, a sequence after this moment will be returned
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getNextSequence(cameraId, timestamp, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getNextSequence(
      cameraId,
      timestamp,
      successCallback,
      errorCallback,
    )
  }

  /**
   * Gets the previous sequence by given time.
   *
   * @method getPrevSequence
   * @param {String} cameraId - ID of the camera (GUID) for which Sequences are retrieved.
   * @param {Number} timestamp - milliseconds in UTC, a sequence before this moment will be returned
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getPrevSequence(cameraId, timestamp, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getPrevSequence(
      cameraId,
      timestamp,
      successCallback,
      errorCallback,
    )
  }

  /**
   * Gets all the sequences in a given interval of time.
   *
   * @method getSequencesInInterval
   * @param {String} cameraId - ID of the camera (GUID) for which Sequences are retrieved.
   * @param {Number} startTime - milliseconds in UTC, the start time of the interval
   * @param {Number} endTime - milliseconds in UTC, the end time of the interval
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getSequencesInInterval(cameraId, startTime, endTime, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getSequencesInInterval(
      cameraId,
      startTime,
      endTime,
      successCallback,
      errorCallback,
    )
  }

  /**
   * Starts a new video export.
   *
   * @method startVideoExport
   * @param {String} cameraId - GUID of the camera
   * @param {Number} startTime - timestamp in UTC, the initial time of the export
   * @param {Number} endTime - timestamp in UTC, the end time of the export
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  startVideoExport(cameraId, startTime, endTime, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.startVideoExport(
      cameraId,
      startTime,
      endTime,
      successCallback,
      errorCallback,
    )
  }

  /**
   * Starts a new still image export.
   *
   * @method startImageExport
   * @param {String} cameraId - GUID of the camera
   * @param {Number} startTime - timestamp in UTC, the time of the still image
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  startImageExport(cameraId, startTime, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.startImageExport(
      cameraId,
      startTime,
      successCallback,
      errorCallback,
    )
  }

  /**
   * Restarts an exports that has previously failed. Requires a valid exportId.
   *
   * @method restartErroneousExport
   * @param {String} exportId - a valid exportId of a previously failed export
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  restartErroneousExport(exportId, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.restartErroneousExport(
      exportId,
      successCallback,
      errorCallback,
    )
  }

  /**
   * Gets the exports for the currently logged user.
   *
   * @method getUserExports
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getUserExports(successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getUserExports(successCallback, errorCallback)
  }

  /**
   * Gets all exports.
   *
   * @method getAllExports
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getAllExports(successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getAllExports(successCallback, errorCallback)
  }

  /**
   * Gets an export by id.
   *
   * @method getExport
   * @param {String} id - ID of the export to retrieve (GUID).
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getExport(id, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getExport(id, successCallback, errorCallback)
  }

  /**
   * Deletes an export by id.
   *
   * @method deleteExport
   * @param {String} id - ID of the export to delete (GUID).
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  deleteExport(id, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.deleteExport(id, successCallback, errorCallback)
  }

  /**
   * Sends a GetOutputsAndEvents command to the server, gets configuration entry from the server.
   *
   * @method getOutputsAndEvents
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getOutputsAndEvents(successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getOutputsAndEvents(successCallback, errorCallback)
  }

  /**
   * Gets server statistic (CPU load, network trafic etc.)
   *
   * @method getServerStatus
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getServerStatus(successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getServerStatus(successCallback, errorCallback)
  }

  /**
   * Triggers an output or event.
   *
   * @method triggerOutputOrEvent
   * @param {String} objectId - the Id of the item
   * @param {String} triggerType - 'TriggerOutput' or 'TriggerEvent'
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  triggerOutputOrEvent(objectId, triggerType, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.triggerOutputOrEvent(
      objectId,
      triggerType,
      successCallback,
      errorCallback,
    )
  }

  /**
   * Gets the camera capabilities - export, live, playback, ptz, presets.
   *
   * @method getCameraCapabilities
   * @param {String} cameraId - GUID of the camera
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  prepareUpload(parameters, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.prepareUpload(parameters, successCallback, errorCallback)
  }

  /**
   * Get the status of the upload by given UploadID
   *
   * @method getUploadStatus
   * @param {Object} parameters - Object containing the following properties:
   * <pre>
   * - {String} UploadID - Upload ID retrieved from PrepareUpload command.
   * </pre>
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getUploadStatus(parameters, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getUploadStatus(
      parameters,
      successCallback,
      errorCallback,
    )
  }

  /**
   * Get new challenges from server
   *
   * @method requestChallenges
   * @param {Object} parameters - Object containing the following properties:
   * <pre>
   * - {Number} NumChallenges - Number of challenges that will be returned as a response.
   *                            Up to 100 can be requested at once.
   *                            There is limitation of the total challenges in the queue.
   *                            If exceeded error code is returned.
   * - {String} Reset - Whether to reset the list of challenges with a fresh one.('Yes', 'No')
   * </pre>
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  requestChallenges(parameters, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.requestChallenges(
      parameters,
      successCallback,
      errorCallback,
    )
  }

  /**
   * Create playback controller
   *
   * @method createPlaybackController
   * @param {Object} parameters - Object containing the following properties:
   * <pre>
   * - {String} SeekType - (optional) Makes seek of specific type: DbStart, DbEnd, PrevSeq, NextSeq,
   *                       PrevFrame, NextFrame, Time, TimeOrBefore, TimeOrAfter, TimeAfter, TimeBefore.
   * - {Number} Time - (optional) Time in miliseconds
   * - {Number} InvestigationId - (optional) The id of the investigation
   * </pre>
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  createPlaybackController(parameters, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.createPlaybackController(
      parameters,
      successCallback,
      errorCallback,
    )
  }

  /**
   * Change several streams at a time
   *
   * @method changeMultipleStreams
   * @param {Object} parameters - Object containing the following properties:
   * <pre>
   * - {String} PlaybackControllerId - Id of the video connection
   * - {Number} Speed - (optional) Speed of the playback (floating point). Sign determines the direction.
   * - {String} SeekType - (optional) Makes seek of specific type: Time.
   * - {Number} Time - (optional) Time of playback speed (in milliseconds since Unix epoch). Valid if "SeekType == Time"
   * </pre>
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  changeMultipleStreams(parameters, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.changeMultipleStreams(
      parameters,
      successCallback,
      errorCallback,
    )
  }

  /**
   * Get all investigations from server
   *
   * @method getAllInvestigations
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getAllInvestigations(successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getAllInvestigations(successCallback, errorCallback)
  }

  /**
   * Get user investigations from server
   *
   * @method getUserInvestigations
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getUserInvestigations(successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getUserInvestigations(successCallback, errorCallback)
  }

  /**
   * Gets a specific investigation by its id
   *
   * @method getInvestigation
   * @param {String} id - the investigation id
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getInvestigation(id, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getInvestigation(id, successCallback, errorCallback)
  }

  /**
   * Creates new investigation entry in the server.
   *
   * @method createInvestigation
   * @param {Object} parameters - Object containing the following properties:
   * <pre>
   * - {Number} StartTime - Start time of the investigation (milliseconds since Unix epoch)
   * - {Number} EndTime - End Time of the investigation (milliseconds since Unix epoch)
   * - {String} Name - Name of the investigation.
   * - {String} State - (optional) State of the investigation.
   * - {String} CameraId - (Multiple items possible) Id of the camera part of this investigation (Guid)
   * - {String} ProcessingMessage - (optional) [Yes/No] Indicates whether processing messages should
   *                                be sent from server while processing the request.
   *                                Default depends on the value in connect command.
   * </pre>
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  createInvestigation(parameters, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.createInvestigation(
      parameters,
      successCallback,
      errorCallback,
    )
  }

  /**
   * Updates/saves new parameters of already created investigation
   *
   * @method updateInvestigation
   * @param {Object} parameters - Object containing the following properties:
   * <pre>
   * - {Number} ItemId - Id of the already saved investigation.
   * - {Number} StartTime - Start time of the investigation (milliseconds since Unix epoch)
   * - {Number} EndTime - End Time of the investigation (milliseconds since Unix epoch)
   * - {String} Name - Name of the investigation.
   * - {String} State - (optional) State of the investigation.
   * - {String} CameraId - (Multiple items possible) Id of the camera part of this investigation (Guid)
   * - {String} ProcessingMessage - (optional) [Yes/No] Indicates whether processing messages should
   *                                be sent from server while processing the request.
   *                                Default depends on the value in connect command.
   * </pre>
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  updateInvestigation(parameters, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.updateInvestigation(
      parameters,
      successCallback,
      errorCallback,
    )
  }

  /**
   * Updates mata-data of the alredy created investigation
   *
   * @method updateInvestigationData
   * @param {Object} parameters - Object containing the following properties:
   * <pre>
   * - {Number} ItemId - Id of the already saved investigation.
   * - {String} Name - (optional) Name of the investigation.
   * - {String} State - (optional) State of the investigation.
   * - {String} ProcessingMessage - (optional) [Yes/No] Indicates whether processing messages should
   *                                be sent from server while processing the request.
   *                                Default depends on the value in connect command.
   * </pre>
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  updateInvestigationData(parameters, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.updateInvestigationData(
      parameters,
      successCallback,
      errorCallback,
    )
  }

  /**
   * Deletes investigation.
   *
   * @method deleteInvestigation
   * @param {Number} investigationId - Id of the investigation. Tricky values:
   * <pre>
   * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXX - Single (concrete) investigation.
   * 00000000-0000-0000-0000-0000000000 - All investigation (My)
   * C6B4940C-A1E9-4BBF-9CFC-6E9CBF53FFE1 - All investigations (All users)
   * </pre>
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  deleteInvestigation(investigationId, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.deleteInvestigation(
      investigationId,
      successCallback,
      errorCallback,
    )
  }

  /**
   * Cancels investigation creation when in progress.
   *
   * @method cancelInvestigation
   * @param {Number} investigationId - Id of the investigation to delete.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  cancelInvestigation(investigationId) {
    return XPMobileSDK.library.Connection.cancelInvestigation(investigationId)
  }

  /**
   * Triggers new investigation export in the server.
   *
   * @method startInvestigationExport
   * @param {String} investigationId - Guid. Id of the investigation for which an export will be created.
   * @param {String} exportType - Type of the export to be triggered. Possible values: DB, AVI, MKV (the same as for triggering normal exports)
   * @param {String} includeAudio - YES/NO - flag whether to include audio in the investigation export
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  startInvestigationExport(
    investigationId,
    exportType,
    includeAudio,
    successCallback,
    errorCallback,
  ) {
    return XPMobileSDK.library.Connection.startInvestigationExport(
      investigationId,
      exportType,
      includeAudio,
      successCallback,
      errorCallback,
    )
  }

  /**
   * Deletes an investigation export on the server.
   *
   * @method deleteInvestigationExport
   * @param {String} investigationId - Guid. Id of the investigation for which an export will be created.
   * @param {String} exportType - Type of the export to be triggered. Possible values: DB, AVI, MKV (the same as for triggering normal exports)
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  deleteInvestigationExport(investigationId, exportType, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.deleteInvestigationExport(
      investigationId,
      exportType,
      successCallback,
      errorCallback,
    )
  }

  /**
   * Gets a list of alarms
   *
   * @method getAlarmList
   * @param {Object} parameters - Object containing the following properties:
   * <pre>
   * - {String} MyAlarms - YES/NO - flag whether to send only my Alarms
   * - {Number} Timestamp - Target time
   * - {Number} Count - Max alarms count to return
   * - {String} Priority - Priority of the alarm (id of the priority type)
   * - {String} State - State of the alarm (id of the state type)
   * </pre>
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */

  getAlarmList(parameters, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getAlarmList(parameters, successCallback, errorCallback)
  }

  /**
   * Gets a single alarm.
   *
   * @method getAlarm
   * @param {String} alarmId - GUID of the alarm to be retrieved
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getAlarm(alarmId, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getAlarm(alarmId, successCallback, errorCallback)
  }

  /**
   * Update alarm details
   *
   * @method updateAlarm
   * @param {Object} parameters - Object containing the following properties:
   * <pre>
   * - {String} Id - Id of the Alarm to update
   * - {String} Comment - Updated comment
   * - {String} AssignedTo - Updated alarm assignee
   * - {String} Priority - Updated priority of the alarm (id of the priority type)
   * - {String} State - Updated state of the alarm (id of the state type)
   * </pre>
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  updateAlarm(parameters, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.updateAlarm(parameters, successCallback, errorCallback)
  }

  /**
   * Gets settings for alarms (Priority, State).
   *
   * @method getAlarmDataSettings
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getAlarmDataSettings(successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getAlarmDataSettings(successCallback, errorCallback)
  }

  /**
   * Gets list of users for a specified alarm. The alarm can be assigned to any one of these users.
   *
   * @method getAlarmUsers
   * @param {String} alarmId - GUID of the alarm for which users will be retrieved
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  getAlarmUsers(alarmId, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.getAlarmUsers(alarmId, successCallback, errorCallback)
  }

  /**
   * Acknowledges a given alarm.
   *
   * @method acknowledgeAlarm
   * @param {String} alarmId - Id of the Alarm to acknowlegde
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  acknowledgeAlarm(alarmId, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.acknowledgeAlarm(alarmId, successCallback, errorCallback)
  }

  /**
   * Request the prev camera for the given carousel.
   *
   * @method prevCarouselCamera
   * @param {String} videoId - ID of the carousel stream
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  prevCarouselCamera(videoId) {
    return XPMobileSDK.library.Connection.prevCarouselCamera(videoId)
  }

  /**
   * Request the next camera for the given carousel.
   *
   * @method nextCarouselCamera
   * @param {String} videoId - ID of the carousel stream
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  nextCarouselCamera(videoId) {
    return XPMobileSDK.library.Connection.nextCarouselCamera(videoId)
  }

  /**
   * Pauses a carousel.
   *
   * @method pauseCarousel
   * @param {String} videoId - ID of the carousel stream
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  pauseCarousel(videoId) {
    return XPMobileSDK.library.Connection.pauseCarousel(videoId)
  }

  /**
   * Resumes a carousel.
   *
   * @method resumeCarousel
   * @param {String} videoId - ID of the carousel stream
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  resumeCarousel(videoId) {
    return XPMobileSDK.library.Connection.resumeCarousel(videoId)
  }

  /**
   * Gets the resampling factor
   *
   * @method getResamplingFactor
   *
   * @return {Number} - the resampling factor
   */
  getResamplingFactor() {
    return (
      (XPMobileSDK.features.SupportsExtendedResamplingFactor &&
        XPMobileSDKSettings.resamplingFactor) ||
      1
    )
  }

  /**
   * Toggles the WebSocket setting
   *
   * @method toggleWebSocket
   */
  toggleWebSocket(enabled) {
    XPMobileSDK.library.Connection.toggleWebSocket(enabled)
  }

  /**
   * Register or update client notifications subscription with specified settings
   *
   * @method RegisterForNotifications
   * @param {Number} settings - Settings mask indicating whether the subscriber should recieve notification and what type of notifications will be send.
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   *
   * @return {ConnectionRequest} - the ConnectionRequest object
   */
  registerForNotifications(setting, successCallback, errorCallback) {
    return XPMobileSDK.library.Connection.registerForNotifications(
      setting,
      successCallback,
      errorCallback,
    )
  }

  /**
   * Register or update client notifications subscription with specified settings
   *
   * @method RegisterForNotifications
   * @param {Object} params - Parameters for the server. Can contain:
   * <pre>
   * - {String} DeviceId - The ID of the notifications subscriber.
   * - {String} DeviceName - Humanly readable device identifier. Expected to be encrypted
   * - {Number} Settings - Settings mask indicating whether the subscriber should recieve notification and what type of notifications will be send.
   * - {String} OptionalParamX - Humanly readable device identifier
   * - {String} OptionalParamY - Humanly readable device identifier
   * - {String} OptionalParamZ - Humanly readable device identifier
   * </pre>
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   */
  RegisterForNotifications(params, successCallback, errorCallback) {
    XPMobileSDK.library.Connection.RegisterForNotifications(params, successCallback, errorCallback)
  }

  /**
   * Sends requests to the server. Creates ConnectionRequest instances.
   *
   * @method sendCommand
   * @param {String} commandName - the name of the command
   * @param {Object} requestParams - the parameters of the command
   * @param {Object} [options] - (optional) May contain:
   * <pre>
   * 	- {Number} timeout - time interval in milliseconds after which the request will be aborted
   * 	- {Boolean} reuseConnection - flag to reuse connection or not
   * 	- {String} viewId - the unique GUID of the view that we will work on
   * 	- {String} cameraId - the unique GUID of the camera that should be started
   * 	- {Function} successCallback - callback that is provided by the client code of the Network API which will be called during the execution of the callback parameter.
   * </pre>
   * @param {Function} successCallback - function that is called when the command execution was successful and the result is passed as a parameter.
   * @param {Function} errorCallback - function that is called when the command execution has failed and the error is passed as a parameter.
   */
  sendCommand(commandName, requestParams, options, successCallback, failCallback) {
    XPMobileSDK.library.Connection.sendCommand(
      commandName,
      requestParams,
      options,
      successCallback,
      failCallback,
    )
  }

  /**
   * Destroys the connection
   *
   * @method destroy
   */
  destroy() {
    XPMobileSDK.library.Connection.destroy()
  }
}
export { XPMobileSDKInterface }
