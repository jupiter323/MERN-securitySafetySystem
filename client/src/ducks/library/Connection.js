/* eslint-disable no-undef */
/**
 * Network API
 *
 * This file defines the Connection singleton, which is the entry point of the Network API.
 * It is an abstraction layer over the communication with the Mobile server.
 * It encapsulates the low-level XML creation and parsing.  
 * It is responsible for creating the high-level ConnectionRequest, ConnectionResponse, VideoConnection and VideoItem instances. 
 * 
 * @module Network
 */ 

/**
 * Connection state machine states
 */
import $ from 'jquery'

let XPMobileSDK = {
	library: {
		ConnectionStates: {},
		ConnectionError: {},
        ConnectionObserverInterface: {}
	}

};

XPMobileSDK.library.ConnectionStates = {
	idle: 1, // Waiting to connect
	connecting: 2, // Connecting, waiting for ajax response
	loggingIn: 3, // Logging in, waiting for ajax response
	working: 4, // Logged in, established connection and etc
	lostConnection: 5 // Got an error from the server that the connection ID is no longer valid and should reconnect
};

/**
 * Interface description for the observers of the Connection singleton.
 * 
 * If an objects wants to be informed for a specific event (when connection is lost for example) they can register as an observer.
 * Registering an object as an observer for the Connection singleton is simple as calling Connection.addObserver(object).
 * Then, if the observer defines any of the methods described below, they will be called whenever it is appropriate.
 * 
 * All methods are optional. Just implement those you need in your class and add it as observer. 
 * 
 * @class ConnectionObserverInterface
 */
XPMobileSDK.library.ConnectionObserverInterface = {
	connectionStateChanged: function () {},
	connectionDidConnect: function (parameters) {},
	connectionFailedToConnect: function (error) {},
	connectionFailedToConnectWithId: function (error) {},
	connectionRequiresCode: function (provider) {},
	connectionCodeError: function () {},
	connectionDidLogIn: function () {},
	connectionFailedToLogIn: function (error) {},
	connectionLostConnection: function () {},
	connectionProcessingDisconnect: function() {},
	connectionDidDisconnect: function () {},
	connectionSwitchedToPull: function () {},
	 connectionRequestSucceeded: function (request, response) {},

	 connectionVersionChanged: function () {},

	 connectionReloadConfiguration: function () {},

	 connectionReloadCameraConfiguration: function () {},
	 
	 closeStreamFinished: function () {}
};

/**
 * Main Connection.
 * 
 * This class encapsulates:
 * 	- connection state management;
 *  - commands sending to the server over ajax;
 *  - keep alive messages (LiveMessage commands).
 *  
 * The class uses ConnectionRequest to generate XML and perform the actual AJAX call with the command. 
 * Most commands methods (if not all), such as getViews and requestStream return a connectionRequest object to the callee.
 * This object can be used to cancel the request if needed via the cancelRequest method.
 * 
 * @class Connection
 */
 class Connection {
	
	self = this;
	
	/**
	 * Read-only: Connection ID, supplied by the server
	 * @property {String} connectionId
	 */
	connectionId = null; 
	
	/**
	 * Keeps the name of the currently logged in user
	 * @property {String} currentUserName
	 */
	currentUserName = null; 
	
	/**
	 * Session timeout in seconds, supplied by the server. It is needed so we know how often to send keep-alive messages
	 * @property {Number} serverTimeout
	 */
	serverTimeout = 30;
	
	/**
	 * Read-only: Connection state. See ConnectionStates constants for possible values
	 * @property {Number} state
	 */
	state = XPMobileSDK.library.ConnectionStates.idle; 
	
	/**
	 * Indicates the configuration of DS comming from the Mobile Server
	 */
	DSServerStatus = {
			NotAvailable: 0,
			DoNotEnforce: 1,
			EnforceWheneverPossible: 2,
			Enforce: 3
	};
	
	/**
	 * All requests currently waiting for response
	 */ 
	requests = [];

	/**
	 * Observers are objects that receive certain events from the connection. These objects should implement methods from 
	 * the ConnectionObserverInterface. To add/remove an observer use the addObserver/removeObsever methods, don't modify this 
	 * array directly - it is supposed to be private property
	 */
	observers = [];
	
	/**
	 * Each command send to the server has a sequenceID which starts from 1 and is increased with every next request.
	 */
	sequenceID = 0;

	/**
	 * Number of previous LiveMessages still waiting for response from the server.
	 */
	liveMessagesWaiting = 0;
	
	/**
	 * Minimum FPS supported. In push mode this FPS value is used as lowest value when adjusting the frame rate
	 */
	minFps = 1;
	
	/**
	 * Maximum FPS supported. In push mode this FPS value is used as highest value when adjusting the frame rate. 
	 */
	maxFps = 15;
	
	/**
	 * Initializes the Connection singleton. Must be called before using any of the other methods.
	 * 
	 * @method initialize
	 * @param storage: optional, the storage used to store server features in, and to initialize them from (for example XPMobileSDK.localStorage, XPMobileSDK.sessionStorage, or any object implementing their methods). 
	 * 				The server features are retrieved on login. The idea is to keep the connection state if you want to connectWithId, but it is cleared for some reason (browser refresh for example).
	 */
	initialize = function (storage) {
		
		if (this.self.storage = storage) {
			XPMobileSDK.features = this.self.storage.getItem('features');
			this.self.resizeAvailable = this.self.storage.getItem('resizeAvailable');
			this.self.webSocketServer = self.storage.getItem('webSocketServer');
			self.webSocketBrowser = self.storage.getItem('webSocketBrowser');
		}

		self.server = XPMobileSDKSettings.MobileServerURL || window.location.origin;
		self.dh = new XPMobileSDK.library.DiffieHellman();
	};
	
	/**
	 * Adds an observer to the Connection singleton. 
	 * 
	 * @method addObserver
	 * @param object: an arbitrary object implementing the ConnectionObserverInterface interface
	 * @see ConnectionObserverInterface
	 */
	addObserver = function (object) {
		console.log('AddObserver')
		if (observers.indexOf(object) == -1) observers.push(object);
	};

	/**
	 * Removes an existing observer from the Connection singleton.
	 * 
	 * @method removeObserver
	 * @param object: an arbitrary object implementing the ConnectionObserverInterface interface
	 * @see ConnectionObserverInterface
	 */
	removeObserver = function (object) {
		var index = observers.indexOf(object);
		if (index < 0) {
			console.log('Error removing observer. Observer does not exist.');
			return;
		}
		observers.splice(index, 1);
	};
	
	/**
	 * Cancels a request. Provide the ConnectionRequest object, returned by the method used to create it.
	 * 
	 * @method cancelRequest
	 * @param {ConnectionRequest} connectionRequest
	 */ 
	cancelRequest = function (connectionRequest) {
		console.log('Cancelling request: ', connectionRequest);
		connectionRequest.cancel();
		requestFinished(connectionRequest);
	};
	
    /**
	 * Sends a Connect command to the server.
	 * 
     * @param {Object} params: Parameters to sent to the server
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 * 
	 * @return the request object
	 */
	Connect = function (params, successCallback, failCallback) {
	    params = params || {};

	    setState(XPMobileSDK.library.ConnectionStates.connecting);
	    return self.sendCommand('Connect', params, { successCallback: successCallback }, connectCallback, failCallback);
	};
	
	connectCallback = function (connectionRequest) {
		requestFinished(connectionRequest);
		var connectionResponse = connectionRequest.response;
		if (!connectionResponse || connectionResponse.isError) {
			callMethodOnObservers('connectionFailedToConnect', connectionResponse && connectionResponse.error);
		} else {
			self.connectionId = connectionResponse.outputParameters.ConnectionId;
			self.serverTimeout = parseInt(connectionResponse.outputParameters.Timeout);

			if (self.storage) {
			
				if (typeof self.storage.getItem('resizeAvailable') === 'boolean') {
					self.resizeAvailable = self.storage.getItem('resizeAvailable');
				}
				else {
					self.resizeAvailable = true;
					self.storage.setItem('resizeAvailable', self.resizeAvailable);
				}
							
				self.webSocketServer = connectionResponse.outputParameters.WebSocketSupport == 'Yes';
				self.storage.setItem('webSocketServer', self.webSocketServer);
				
				if (typeof self.storage.getItem('webSocketBrowser') === 'boolean' && !!window.WebSocket) {
					self.webSocketBrowser = self.storage.getItem('webSocketBrowser');
				}
				else {
					self.webSocketBrowser = !!window.WebSocket;
					self.storage.setItem('webSocketBrowser', self.webSocketBrowser);
				}
				
			}
			
			if(connectionResponse.outputParameters.SecurityEnabled) {
				self.SecurityEnabled = connectionResponse.outputParameters.SecurityEnabled;
			}
			
			if (connectionResponse.outputParameters.PublicKey) {
				self.PublicKey = connectionResponse.outputParameters.PublicKey;
				self.dh && self.dh.setServerPublicKey(connectionResponse.outputParameters.PublicKey);
			} 
			if (connectionResponse.outputParameters.CHAPSupported) {
				self.CHAPSupported = connectionResponse.outputParameters.CHAPSupported;
				XPMobileSDK.library.CHAP.sharedKey = self.dh && self.dh.getSharedKey();
			}
			
			console.log('Established connection');
			scheduleLiveMessage();
			callMethodOnObservers('connectionDidConnect', connectionResponse.outputParameters);
		}
	};
	
	/**
	 * Connects to the server with an existing connectionId.
	 * 
	 * @method connectWithId
	 * @param {String} server: url of the server to connect to
	 * @param {String} connectionId: token provided from external login request
	 */
	connectWithId = function (server, connectionId) {
		self.server = server;
		self.connectionId = connectionId;
		console.log('Connecting with Id ' + self.connectionId);
		setState(XPMobileSDK.library.ConnectionStates.connecting);
		// We need to check the connection ID we have been provided with the server. Easiest way is to just ping it
		self.sendLiveMessage();
		// we set a flag which is checked when the live message comes back. If it contains an OK response we set the connection as live.
		// If it contains a time out response we set it as disconnected
		self.connectingViaExternalConnectionID = true;
	};


    /**
     * Sends a Login command to the server. Log-in has to be performed before any other normal requests (except connect and some other special cases). 
     * 
     * @param {Object} params: Parameters to sent to the server
     * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
     * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
     * 
     * @return the request object
     */
	Login = function (params, successCallback, failCallback) {
	    params = params || {};

	    console.log('Log in with username ' + params.Username + ' password ' + params.Password);

	    setState(XPMobileSDK.library.ConnectionStates.loggingIn);
	    return self.sendCommand('LogIn', params, { successCallback: successCallback }, loginCallback, failCallback);
	};
	
	loginCallback = function (connectionRequest) {
		requestFinished(connectionRequest);
		var connectionResponse = connectionRequest.response;
		if (!connectionResponse || connectionResponse.isError) {
			if (connectionResponse && connectionResponse.error.code == XPMobileSDK.library.ConnectionError.SecondStepAuthenticationRequired) {
				callMethodOnObservers('connectionRequiresCode', connectionResponse.outputParameters.SecondStepAuthenticationProvider);
			}
			else {
				self.connectionId = null;
				cancelLiveMessage();
				callMethodOnObservers('connectionFailedToLogIn', connectionResponse && connectionResponse.error);
			}
		}
		else {
			proceedWithLogin(connectionResponse);
		}
	};
	
	proceedWithLogin = function (connectionResponse) {
        
	    var oldServerVersion = XPMobileSDK.features && XPMobileSDK.features.ServerVersion;

		console.log('Logged in');
		getFeatures(connectionResponse.outputParameters);

        setState(XPMobileSDK.library.ConnectionStates.working);
		callMethodOnObservers('connectionDidLogIn');

		if (oldServerVersion && oldServerVersion != XPMobileSDK.features.ServerVersion) {
			callMethodOnObservers('connectionVersionChanged');
		}
	};
	
	/**
	 * Sends a verification code request command after a log-in command, that requires a second step of verification. 
	 * 
	 * @method requestCode
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	requestCode = function (successCallback, failCallback) {
		var params = {};
		return self.sendCommand('RequestSecondStepAuthenticationPin', params, { successCallback: successCallback }, requestCodeCallback, failCallback);
	};
	
	requestCodeCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error requesting validation code.', connectionRequest.options.successCallback);
	};
	
	/**
	 * Sends a code for verification after a it has been requested with requestCode command. 
	 * 
	 * @method verifyCode
	 * @param {String} code - second step authentication pin code
	 */
	verifyCode = function (code) {
		var params = {
			SecondStepAuthenticationPin: code
		};
		return self.sendCommand('VerifySecondStepAuthenticationPin', params, null, verifyCodeCallback);
	};
	
	verifyCodeCallback = function (connectionRequest) {
		requestFinished(connectionRequest);
		var connectionResponse = connectionRequest.response;
		if (!connectionResponse || connectionResponse.isError) {
			if (connectionResponse && connectionResponse.error.code == XPMobileSDK.library.ConnectionError.SecondStepAuthenticationCodeError) {
				callMethodOnObservers('connectionCodeError');
			}
			else {
				self.connectionId = null;
				cancelLiveMessage();
				callMethodOnObservers('connectionFailedToLogIn', connectionResponse && connectionResponse.error);
			}
		}
		else {
			proceedWithLogin(connectionResponse);
		}
	};
	
	/**
	 * Sends a disconnect command to the server. Performing any other normal requests that requires a valid connectionId will not be possible from now on.
	 * 
	 *  @method Disconnect
	 */
	Disconnect = function (params, successCallback, failCallback) {
		cancelLiveMessage();
		setState(XPMobileSDK.library.ConnectionStates.idle);

		XPMobileSDK.library.VideoConnectionPool.clear();
		var params = params || {};
		var connectionRequest = self.sendCommand('Disconnect', params, { successCallback: successCallback }, logOutCallback, failCallback);

		callMethodOnObservers('connectionProcessingDisconnect');
		self.connectionId = null;
		return connectionRequest;
	};
	
	/**
	 * logOut callback
	 * 
	 * @param 	connectionRequest		object		XMLHttpResponse
	 */
	logOutCallback = function(connectionRequest) {
		requestFinished(connectionRequest);
		callMethodOnObservers('connectionDidDisconnect');
		self.destroy();
	};
	
	/**
	 * Sends a GetViews command to the server. Sub views, child of the given viewId, will be returned in the given callback.
	 * 
	 * @method getViews
	 * @param {String} viewId
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	getViews = function (viewId, successCallback, failCallback) {
	    return self.sendCommand('GetViews', { ViewId: viewId }, { successCallback: successCallback, ViewId: viewId }, getViewsCallback, failCallback);
	};
	
	getViewsCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, null, function () {
			
			var subViews = [];
			var subViewsNodes = connectionRequest.response.subItems.getElementsByTagName('Item');

			for (var i = 0, c = subViewsNodes.length; i < c; i++) {
				var item = subViewsNodes[i];
				var res = {};
				for (var j = 0; j < item.attributes.length; j++) {
					res[item.attributes[j].name] = item.attributes[j].value;
				}
				subViews.push(res);
			}
			var view = {
				id: connectionRequest.options.ViewId,
				subViews: subViews
			};
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(view);
		});
	};
	
	/**
	 * Sends a GetAllViewsAndCameras command to the server. Retrieves all folders, views and cameras in a single command.
	 * 
	 * @method getAllViews
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	getAllViews = function (successCallback, failCallback) {
	    return self.sendCommand('GetAllViewsAndCameras', {}, { successCallback: successCallback}, getAllViewsCallback, failCallback);
	};
	
	/**
	 * Called when getAllViews response is received
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	getAllViewsCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error executing GetAllViewsAndCameras on the server.', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.items);
		});
	};
	
	requestFootageStream = function (fileName, fileSize, successCallback, failCallback) {
		
		var parameters = {
			FileName: fileName,
			FileSize: fileSize,
			ByteOrder: 'Network'
		};
		return self.sendCommand('RequestFootageStream', parameters, { successCallback: successCallback }, requestFootageStreamCallback, failCallback);
		
	};
	
	requestFootageStreamCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error requesting import footage stream from the server.', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.outputParameters);
		});
	};
	
	getOsmServerAddresses = function (successCallback, failCallback) {

	    return self.sendCommand('GetOsmServerAddresses', {}, { successCallback: successCallback }, getOsmServerAddressesCallback, failCallback);
		
	};
	
	getOsmServerAddressesCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting OSM server addresses from the server.', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.items);
		});
	};	

	getGisMapCameras = function (successCallback, failCallback) {

	    return self.sendCommand('GetGisMapCameras', {}, { successCallback: successCallback }, getGisMapCamerasCallback, failCallback);
		
	};
	
	getGisMapCamerasCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting GIS map cameras from the server.', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.items);
		});
	};	

	getGisMapLocations = function (successCallback, failCallback) {

	    return self.sendCommand('GetGisMapLocations', {}, { successCallback: successCallback }, getGisMapLocationsCallback, failCallback);
		
	};
	
	getGisMapLocationsCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting GIS map cameras from the server.', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.items);
		});
	};	

	requestPushStream = function (successCallback, failCallback) {
		
		var parameters = {
			SignalType: 'Upload',
			ByteOrder: 'Network'
		};
		return self.RequestStream(parameters, successCallback, failCallback);
		
	};
	
	requestPushStreamCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error requesting video push stream from the server.', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.outputParameters);
		});
	};

	/**
	 * Sends a RequestStream command to the server.
	 * 
	 * @method requestStream
	 * @param {String} cameraId: the unique GUID of the camera that should be started
	 * @param size: includes width and height as mandatory properties
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 * @param options: optional parameter containing various configuration, includes:
	 * 			- {int} signal: live or playback
	 * 			- {int} jpegCompressionLevel
	 * 			- {boolean} keyFramesOnly
	 * 			- {boolean} reuseConnection - if true, the API will reuse existing connections for the same camera
	 *			- {int} time - timestamp for playback
	 * 
	 * @return the request object
	 */
	requestStream = function (cameraId, size, options, successCallback, failCallback) {
		
		var options = options || {};
		
		if (options.reuseConnection) {
			if (XPMobileSDK.library.VideoConnectionPool.containsCamera(cameraId)) {
				return XPMobileSDK.library.VideoConnectionPool.pretendToOpenStream(cameraId, successCallback);
			} else {
				XPMobileSDK.library.VideoConnectionPool.addCameraId(cameraId);
			}
		}
		
		var params = {
			CameraId: cameraId,
			DestWidth: Math.round(size.width),
			DestHeight: Math.round(size.height),
			SignalType: options.signal === XPMobileSDK.interfaces.VideoConnectionSignal.playback ? 'Playback' : 'Live',
			MethodType: self.webSocketServer && self.webSocketBrowser ? 'Push' : 'Pull', 
			Fps: maxFps, // This doesn't work for Pull mode, but we have to supply it anyway to keep the server happy
			ComprLevel: options.jpegCompressionLevel ? options.jpegCompressionLevel : 70,
			KeyFramesOnly: options.keyFramesOnly ? 'Yes' : 'No', // Server will give only key frame thumb nails. This will reduce FPS
			RequestSize: 'Yes',
			StreamType: options.streamType == XPMobileSDK.library.VideoConnectionStream['native'] ? 'Native' : options.streamType == XPMobileSDK.library.VideoConnectionStream.segmented ? 'Segmented' : 'Transcoded'
		};
		
		if (options.time) {
			params.SeekType = 'Time';
			params.Time = options.time;
		}
		
		if (options.motionOverlay) {
			params.MotionOverlay = 'Yes';
		}
		
		if (XPMobileSDK.features.SupportNoScaledImages) {
			params.ResizeAvailable = 'Yes';
		}
		
		if (XPMobileSDK.features.MultiCameraPlayback && options.playbackControllerId) {
			params.PlaybackControllerId = options.playbackControllerId;
		}

		var options = {
			successCallback: successCallback,
			cameraId: cameraId,
			signal: options.signal === XPMobileSDK.interfaces.VideoConnectionSignal.playback ? 'Playback' : 'Live',
			reuseConnection: !!options.reuseConnection
		};
		return self.sendCommand('RequestStream', params, options, requestStreamCallback, failCallback);
	};

    /**
     * Sends a RequestStream command to the server.
     * 
     * @param {Object} params: Parameters to sent to the server
     * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
     * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
     * 
     * @return the request object
     */
	RequestStream = function (params, successCallback, failCallback) {
	    return self.sendCommand('RequestStream', params, { successCallback: successCallback }, requestStreamCallback, failCallback);
	};
	
	requestStreamCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error starting stream for camera ' + connectionRequest.options.cameraId, function () {
			
			var videoId = connectionRequest.response.outputParameters.VideoId;
			console.log('Server prepared video ID ' + videoId + ' for camera ' + connectionRequest.options.cameraId);
			
			// connectionRequest.response.outputParameters.VideoChannel0 = 'ws:///XProtectMobile/Video';
			// connectionRequest.response.outputParameters.VideoChannel1 = 'http://google.com/XProtectMobile/Video';
			// connectionRequest.response.outputParameters.VideoChannel2 = '/XProtectMobile/Video';
			
			var videoConnection = new XPMobileSDK.library.VideoConnection(
				videoId,
				connectionRequest,
				{
					onClose: closeVideoConnection,
					onRestart: restartVideoConnection,
					onPushFailed: switchToPull
				}				
			);
			if (connectionRequest.options.reuseConnection) {
				XPMobileSDK.library.VideoConnectionPool.addVideoConnection(connectionRequest.options.cameraId, videoConnection, connectionRequest.response);
			}
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(videoConnection);
		});
	};
	
	closeVideoConnection = function (videoConnection) {
	
		self.closeStream(videoConnection.videoId);
		videoConnection.isReusable && XPMobileSDK.library.VideoConnectionPool.removeCamera(videoConnection.cameraId);
		
	};

	restartVideoConnection = function (videoConnection) {
	
		videoConnection.request.parameters.MethodType = self.webSocketServer && self.webSocketBrowser ? 'Push' : 'Pull';

		self.closeStream(videoConnection.videoId);
		self.sendCommand('RequestStream', videoConnection.request.parameters, videoConnection.request.options, requestStreamCallback);
	};
		
	toggleWebSocket = function (enabled) {
		self.webSocketBrowser = !!enabled;
		self.storage && self.storage.setItem('webSocketBrowser', self.webSocketBrowser);
		restartCameras();
	};
	
	restartCameras = function() {
		
		XPMobileSDK.library.VideoConnection.instances.forEach(function(videoConnection) {
		    videoConnection.getState() == XPMobileSDK.library.VideoConnectionState.running && videoConnection.restart();
		});
	};
	
	switchToPull = function () {

		self.toggleWebSocket(false);
		callMethodOnObservers('connectionSwitchedToPull');
	};
	
	/**
	 * Sends a ChangeStream command to the server. Changes the visual part of the stream that the given videoConnection represents. 
	 * 
	 * @method changeStream
	 * @param {VideoConnection} videoConnection
	 * @param cropping: contains top, left, bottom, and right properties for cropping
	 * @param size: contains width and height properties that define the received frame size
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	changeStream = function (videoConnection, cropping, size, successCallback, failCallback) {
		
		var params = {
			VideoConnection: videoConnection,
			VideoId: videoConnection.videoId,
			DestWidth: Math.round(size.width),
			DestHeight: Math.round(size.height),
			SrcTop: Math.round(cropping.top),
			SrcLeft: Math.round(cropping.left)
		};

		if (cropping.right !== undefined) {
			params.SrcRight = Math.round(cropping.right);
		} else if (cropping.width !== undefined) {
			params.SrcRight = Math.round(cropping.width) + Math.round(cropping.left);
		}

		if (cropping.bottom !== undefined) {
			params.SrcBottom = Math.round(cropping.bottom);
		} else if (cropping.height !== undefined) {
			params.SrcBottom = Math.round(cropping.height) + Math.round(cropping.top);
		}

		return self.ChangeStream(params, successCallback, failCallback);
	};

    /**
     * Sends a ChangeStream command to the server.
     * 
     * @param {Object} params: Parameters to sent to the server
     * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
     * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
     * 
     * @return the request object
     */
	ChangeStream = function (params, successCallback, failCallback) {
	    return self.sendCommand('ChangeStream', params, { successCallback: successCallback }, changeStreamCallback, failCallback);
	};

	changeStreamCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error changing stream.', function () {
			if (XPMobileSDK.features.SupportTimeBetweenFrames) {
				connectionRequest.VideoConnection.resetCommunication();
			}
			connectionRequest.options.successCallback && connectionRequest.options.successCallback();
		});
	};

	/**
	 * Sends a ChangeStream command to the server. Changes the motion detection settings of the stream that the given videoConnection represents. 
	 * 
	 * @method motionDetection
	 * @param {VideoConnection} videoConnection
	 * @param {Object} options: contains any or all of the motion, sensitivity, grid and cpu parameters.
	 */
	motionDetection = function (videoConnection, options) {
		
		var params = { VideoId: videoConnection.videoId, VideoConnection: videoConnection };
		
		var motion = options.motion || options.MotionAmount;
		if (motion) params.MotionAmount = Math.round(motion);

		var sensitivity = options.sensitivity || options.SensitivityAmount;
		if (sensitivity) params.SensitivityAmount = Math.round(sensitivity);

		var cpu = options.cpu || options.CPUImpactAmount;
		if (cpu) params.CPUImpactAmount = Math.round(cpu);

		var grid = options.grid || options.RegionGrid;
		if (/^\d+x\d+(;\d+)+$/.test(grid)) params.RegionGrid = grid;

		return self.ChangeStream(params);
	};

	/**
	 * Sends a GetPtzPresets command to the server. 
	 * 
	 * @method getPtzPresets
	 * @param {GUID} cameraId: the current camera related to the presets this request will return
	 * @param {Function} successCallback, failCallback: failCallback
	 */
	getPtzPresets = function (cameraId, successCallback, failCallback) {
		
		var params = {
			CameraId: cameraId
		};
		
		return self.sendCommand('GetPtzPresets', params, { successCallback: successCallback }, getPtzPresetsCallback, failCallback);
	};

	getPtzPresetsCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting PTZ presets.', function () {
		    delete connectionRequest.response.outputParameters.Challenge;
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.outputParameters);
		});
	};

	/**
	 * Closes a stream by the given videoId.
	 * 
	 * @method closeStream
	 * @param {String} videoId
	 */
	closeStream = function (videoId) {
	    return self.CloseStream({ VideoId: videoId });
	};

    /**
     * Sends a CloseStream command to the server.
     * 
     * @param {Object} params: Parameters to sent to the server
     * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
     * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
     * 
     * @return the request object
     */
	CloseStream = function (params, successCallback, failCallback) {
	    return self.sendCommand('CloseStream', params, { successCallback: successCallback }, closeStreamCallback, failCallback);
	};

	closeStreamCallback = function (connectionRequest) {
		requestFinished(connectionRequest);

		var connectionResponse = connectionRequest.response;
		
		if (!connectionResponse || connectionResponse.isError) {
			if (connectionRequestResponseIsTerminal(connectionRequest)) {
				lostConnection();
			} else {

			}
		} else {

		}
		callMethodOnObservers('closeStreamFinished');
	};
	
	/**
	 * This singleton manages the FPS of all Cameras in the VideoConnectionPool (increasing/decreasing FPS), but never dropping bellow minFps and not exceeding the maxFps.
	 * It is triggered by the LiveMessage in push mode, when the message has difficulties receiving its response from the server due to low bandwidth and heavy incoming traffic for the VideoConnections.
	 */
	fps = new function () {

		var decreasing = false;
		var increasing = false;
		var current = maxFps;
		var stable = minFps;
		var queueEmptyCount = 0;
		
		/**
		 * Manages FPS increase/decrease depending on the given queue length, as well as the number of consecutive zero queue lengths.
		 * e.g. If the LiveMessage queue length parameter reaches 2 (meaning that by the sending of the third LiveMessage the previous 2 are still waiting for response), the FPS has to be dropped so, 
		 * that the LiveMessage responses can be received from the server. The drop is to a safe FPS level we know of, bellow the current one, or to 1 FPS (in order to free the communication channel ASAP).
		 * e.g. If the LiveMessage queue length is zero and was zero for the past 5 consecutive LiveMessages, there will be an attempt to recover the FPS (if bellow maximum) up to its maximum by increasing it with 1 FPS at a time.
		 * 
		 * @param {Number} queueLength: current queue size
		 */
		var manage = function (queueLength) {
		
			if (queueLength) {
				queueEmptyCount = 0;
				if (queueLength > 1) {
					decrease();
				}
			}
			else {
				queueEmptyCount++;
				if (queueEmptyCount > 5) {
					increase();
					queueEmptyCount = 0;
				}
			}

		}.bind(this);

		/**
		 * Decreases the FPS within the given boundies.
		 */
		var decrease = function () {

			if (decreasing || current == minFps) return;
			
			decreasing = true;
			current = current > stable ? stable : minFps;

			console.log('Decreasing FPS to ' + current);
			change(current, function () { decreasing = false; });
			
		};
		
		/**
		 * Increases the FPS within the given boundies.
		 */
		var increase = function () {
			
			if (increasing || current == maxFps) return;
			
			increasing = true;
			stable = current++;

			console.log('Increasing FPS to ' + current);
			change(current, function () { increasing = false; });

		};


		/**
		 * Changes the FPS to a given level.
		 *
		 * @param {Number} fps: target FPS level.
		 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
		 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
		 */
		var change = function (fps, successCallback, failCallback) {
		
			for (var i = 0, camera; camera = XPMobileSDK.library.VideoConnectionPool.cameras[i]; i++) {
				
				if (!camera.videoConnection || !camera.videoConnection.videoId) continue;
				
				var params = {
					VideoId: camera.videoConnection.videoId,
					Fps: fps,
					VideoConnection: camera.videoConnection
				};
				self.ChangeStream(params, successCallback, failCallback);
				
			}
			
		};

	}();
	
	/**
	 * Sends a ControlPTZ command to the server. Controls PTZ Preset. The parameter needs to be a valid preset name, otherwise nothing will happen.
	 * 
	 * @method ptzPreset
	 * @param {VideoConnection} videoConnection: the current stream related to the preset this request will activate
	 * @param {String} presetName: the name of the preset to be activated
	 */
	ptzPreset = function (videoConnection, presetName) {
		
		var params = {
			CameraId: videoConnection.cameraId,
			PtzPreset: presetName
		};

		return self.sendCommand('ControlPTZ', params, null, controlPTZCallback);
	};

	/**
	 * Sends a ControlPTZ command to the server. Controls PTZMove. Directions are: 'Up', 'Down', 'Left', 'Right', 'UpLeft', 'UpRight', 'DownLeft', 'DownRight', 'ZoomIn', 'ZoomOut', 'Home'.
	 * The camera needs to support PTZ, otherwise nothing will happen.
	 * 
	 * @method ptzMove
	 * @param {VideoConnection} videoConnection: the current stream related to the PTZ this request will activate
	 * @param {String} direction: 'Up', 'Down', 'Left', 'Right', 'UpLeft', 'UpRight', 'DownLeft', 'DownRight', 'ZoomIn', 'ZoomOut', 'Home'
	 */
	ptzMove = function (videoConnection, direction) {
		
		var params = {
			CameraId: videoConnection.cameraId,
			PtzMove: direction,
			VideoConnection: videoConnection
		};

		return self.sendCommand('ControlPTZ', params, null, controlPTZCallback);
	};

	/**
	 * It is used to change the camera orientation by moving it in the direction of the tap.
	 * The reference point of the movement is the center of the screen.
	 * The tap and the reference points are used to calculate the direction and the speed of the camera movement.
	 *
	 * @method tapAndHold
	 * @param params:
	 *          		- CameraId: String
	 *          		- GestureXPercent: the percentage of distance between start and finish [-100:100]
	 *          		- GestureYPercent: the percentage of distance between start and finish [-100:100]
	 */
	ptzTapAndHold = function (params, successCallback, failCallback) {
		params['Type'] = 'TapAndHold';
		params['GestureTimeout'] = 2000;

		return self.sendCommand('ControlPTZ', params, { successCallback: successCallback }, ptzTapAndHoldCallback, failCallback);
	};

	ptzTapAndHoldCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error controlling PTZ', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback();
		});
	};
	/**
	 * It is used to change the camera orientation by moving it in the direction of the swipe.
	 * The swipe direction and length are calculated based on the start and end points of the gesture.
	 * The swipe speed is calculated based on the time it took to perform the gesture from the start point to the end point.
	 * The calculated direction defines the direction of the PTZ movement, whereas the length and the speed are used to determine the amount of the PTZ movement.
	 *
	 * @method swipe
	 * @param params:
	 *          		- CameraId: String
	 *          		- GestureXPercent: the percentage of distance between start and finish [-100:100]
	 *          		- GestureYPercent: the percentage of distance between start and finish [-100:100]
	 */
	ptzSwipe = function (params, gestureDuration) {
		params['Type'] = 'Swipe';
		params['GestureDuration'] = gestureDuration;

		return self.sendCommand('ControlPTZ', params, null, controlPTZCallback);
	};

	/**
	 * Called after ptzMove and ptzPreset response is returned.
	 */
	controlPTZCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error controlling PTZ');
	};

	/**
	 * Sends a ChangeStream command to the server. Controls playback speed as a float. Negative number means backwards. 1.0 means normal speed.
	 * 
	 * @method playbackSpeed
	 * @param {VideoConnection} videoConnection
	 * @param {Number} speed
	 */
	playbackSpeed = function (videoConnection, speed) {
		
		var params = {
			VideoId: videoConnection.videoId,
			Speed: speed,
			VideoConnection: videoConnection
		};

		return self.ChangeStream(params);
	};

	/**
	 * Sends a ChangeStream command to the server. Seeks to either of: 'DbStart', 'DbEnd', 'PrevSeq', 'NextSeq', 'PrevFrame' or 'NextFrame'.
	 * 
	 * @method playbackSeek
	 * @param {VideoConnection} videoConnection
	 * @param {String} seekType: 'DbStart', 'DbEnd', 'PrevSeq', 'NextSeq', 'PrevFrame' or 'NextFrame'
	 */
	playbackSeek = function (videoConnection, seekType) {
		
		var params = {
			VideoId: videoConnection.videoId,
			SeekType: seekType,
			VideoConnection: videoConnection
		};

		return self.ChangeStream(params);
	};

	/**
	 * Sends a ChangeStream command to the server. Goes to the closest possible match of specific time.
	 * 
	 * @method playbackGoTo
	 * @param {VideoConnection} videoConnection
	 * @param {Number} millisecondsSinceUnixEpoch
	 * @param {String} seekType: optional, 'Time' (default), 'TimeOrBefore', 'TimeOrAfter'
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	playbackGoTo = function (videoConnection, millisecondsSinceUnixEpoch, seekType, successCallback, failCallback) {
		
		// TODO reverse the arguments
		
		var params = {
			VideoId: videoConnection.videoId,
			SeekType: seekType || 'Time',
			Time: millisecondsSinceUnixEpoch,
			VideoConnection: videoConnection
		};
		
		return self.ChangeStream(params, successCallback, failCallback);
	};
	
	/**
	 * Sends a GetThumbnail command to the server in order to obtain an image representation for a given camera.
	 * 
	 * @method getThumbnail
	 * @param {String} cameraId: the unique GUID of the camera
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	getThumbnail = function (cameraId, successCallback, failCallback) {
		
		var params = {
			CameraId: cameraId,
			ComprLevel: 70
		};

		return self.sendCommand('GetThumbnail', params, { successCallback: successCallback }, getThumbnailCallback, failCallback);
	};

	getThumbnailCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting thumbnail.', function () {
			
			if (connectionRequest.response.thumbnailBase64) {
				connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.thumbnailBase64);
			}
			else if (connectionRequest.response.thumbnailJSON) {
				
				var video = document.createElement('video');
				var canvas = document.createElement('canvas');
				var canvasContext = canvas.getContext('2d');

				var segment = new Segment(connectionRequest.response.thumbnailJSON);

				video.oncanplaythrough = function () {

					video.oncanplaythrough = function () {};
					video.ontimeupdate = function () {
						
						canvasContext.canvas.width = video.videoWidth;
						canvasContext.canvas.height = video.videoHeight;
						canvasContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

						video.src = '';
						connectionRequest.options.successCallback && connectionRequest.options.successCallback(canvas.toDataURL());
					
					}
					video.currentTime = segment.offset;
					
				};
				
				video.src = segment.url;
			}
		});
	};
	
	/**
	 * Gets thumbnail by the given camera id and time. 
	 * 
	 * @param cameraId
	 * @param time
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	getThumbnailByTime = function (cameraId, time, successCallback, failCallback) {
		
		var params = {
			CameraId: cameraId,
			Time: time,
			SeekType: 'Time'
		};
		
		return self.sendCommand('GetThumbnailByTime', params, { successCallback: successCallback }, getThumbnailByTimeCallback, failCallback);
	}
	
	/**
	 * Called after getThumbnailByTime response is returned.
	 */
	getThumbnailByTimeCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting thumbnail by time', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.outputParameters.Thumbnail);
		});
	};
	
	/**
	 * Gets the start time of the recordings for a particular camera.
	 * 
	 * @method getDBStartTime
	 * @param {String} cameraId
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	getDBStartTime = function (cameraId, successCallback, failCallback) {

		var params = {
			CameraId: cameraId,
			SeekType: 'DbStart'
		};
		
		return self.sendCommand('GetRecordingTime', params, { successCallback: successCallback }, getDBStartTimeCallback, failCallback);
	};

	/**
	 * Called after getDBStartTime response is returned.
	 */
	getDBStartTimeCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting recording time', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.outputParameters.Time);
		});
	};
	
	/**
	 * Gets the next sequence by given time for the given cameraId. 
	 * 
	 * @method getNextSequence
	 * @param {String} cameraId
	 * @param {Number} timestamp: milliseconds in UTC, a sequence after this moment will be returned
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	getNextSequence = function (cameraId, timestamp, successCallback, failCallback) {
		
		var afterTime = parseInt((new Date().getTime() - timestamp) / 1000);
		afterTime = afterTime < 0 ? 0 : afterTime;
		
		var params = {
			CameraId: cameraId,
			SeqType: 'Recording',
			Time: timestamp,
			AfterTime: afterTime,
			AfterCount: 1
		};

		// debuger.getSequences(params);
		return self.sendCommand('GetSequences', params, { successCallback: successCallback }, getNextSequenceCallback, failCallback);
	};

	getNextSequenceCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting sequences', function () {
			if (connectionRequest.response.sequences.length > 0) {
				connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.sequences[0]);
			} else {
				connectionRequest.options.successCallback && connectionRequest.options.successCallback(null);
			}
		});
		// debuger.result(connectionRequest.response.sequences);
	};

	/**
	 * Gets the previous sequence by given time. 
	 * 
	 * @method getPrevSequence
	 * @param {String} cameraId
	 * @param {Number} timestamp: milliseconds in UTC, a sequence before this moment will be returned
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	getPrevSequence = function (cameraId, timestamp, successCallback, failCallback) {
		
		var params = {
			CameraId: cameraId,
			SeqType: 'Recording',
			Time: timestamp,
			BeforeTime: 60 * 60 * 24 * 30,
			BeforeCount: 1
		};

		// debuger.getSequences(params);
		return self.sendCommand('GetSequences', params, { successCallback: successCallback }, getPrevSequenceCallback, failCallback);
	};

	getPrevSequenceCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting sequences', function () {
			if (connectionRequest.response.sequences.length > 0) {
				connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.sequences[0]);
			} else {
				connectionRequest.options.successCallback && connectionRequest.options.successCallback(null);
			}
		});
		// debuger.result(connectionRequest.response.sequences);
	};
	
	/**
	 * Gets all the sequences in the given interval of time.
	 * 
	 * @method getSequenceInInterval
	 * @param {String} cameraId
	 * @param {Number} startTime: milliseconds in UTC, the start time of the interval
	 * @param {Number} endTime: milliseconds in UTC, the end time of the interval
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	getSequencesInInterval = function (cameraId, startTime, endTime, successCallback, failCallback) {
		
		var params = {
			CameraId: cameraId,
			SeqType: 'Recording',
			Time: startTime,
			AfterTime: parseInt((endTime - startTime) / 1000),
			AfterCount: 10000
		};

		// debuger.getSequences(params);
		return self.sendCommand('GetSequences', params, { successCallback: successCallback }, getSequencesInIntervalCallback, failCallback);
		
	};

	getSequencesInIntervalCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting sequences', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.sequences);
		});
		// debuger.result(connectionRequest.response.sequences);
	};

	/**
	 * Starts a new video export.
	 * 
	 * @method startVideoExport
	 * @param {String} cameraId: indicates the camera this export will be extracted from
	 * @param {Number} startTime: timestamp in UTC, the initial time of the export
	 * @param {Number} endTime: timestamp in UTC, the end time of the export
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	startVideoExport = function (cameraId, startTime, endTime, successCallback, failCallback) {
		
		var params = {
			CameraId: cameraId,
			StartTime: startTime,
			EndTime: endTime,
			Type: 'Avi'
		};

		return self.sendCommand('StartExport', params, { successCallback: successCallback }, startExportCallback, failCallback);
	};

	/**
	 * Starts a new still image export.
	 * 
	 * @method startImageExport
	 * @param {String} cameraId: indicates the camera this export will be extracted from
	 * @param {Number} startTime: timestamp in UTC, the time of the still image
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	startImageExport = function (cameraId, startTime, successCallback, failCallback) {

		var params = {
			CameraId: cameraId,
			StartTime: startTime,
			Type: 'Jpeg'
		};

		return self.sendCommand('StartExport', params, { successCallback: successCallback }, startExportCallback, failCallback);
	};
	
	/**
	 * Restarts an exports that has previously failed. Requires a valid exportId.
	 * 
	 * @method restartErroneousExport
	 * @param {String} exportId: a valid exportId of a previously failed export
	 */
	restartErroneousExport = function(exportId, successCallback, failCallback) {
		
		var params = {
			ExportId: exportId
		};
		
		return self.sendCommand('StartExport', params, { successCallback: successCallback }, startExportCallback, failCallback);
	};
	
	/**
	 * Called after startVideoExport response is returned.
	 */
	startExportCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error starting export.', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.outputParameters.ExportId);
		});
	};

	/**
	 * Gets the exports for the currently logged user.
	 *
	 * @method getUserExports
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	getUserExports = function (successCallback, failCallback) {

		var params = {
			ExportId: '00000000-0000-0000-0000-000000000000'
		};

		return self.sendCommand('GetExport', params, { successCallback: successCallback }, getUserExportsCallback, failCallback);
	};
	
	/**
	 * Called after getUserExports response is returned.
	 */
	getUserExportsCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting user exports', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.exports);
		});
	};

	/**
	 * Gets all exports.
	 * 
	 * @method getAllExports
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	getAllExports = function (successCallback, failCallback) {

		var params = {
			ExportId: '{A3B9C5FB-FAAD-42C8-AB73-B79D6FFFDBC1}'
		};

		return self.sendCommand('GetExport', params, { successCallback: successCallback }, getAllExportsCallback, failCallback);
	};
	
	/**
	 * Called after getAllExports response is returned.
	 */
	getAllExportsCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting all exports', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.exports);
		});
	};

	/**
	 * Gets and export by id.
	 * 
	 * @method getExport
	 * @param {String} id: the uniq id of the export.
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	getExport = function (id, successCallback, failCallback) {

		var params = {
			ExportId: id
		};

		return self.sendCommand('GetExport', params, { successCallback: successCallback }, getExportCallback, failCallback);
	};
	
	/**
	 * Called after getExport response is returned.
	 */
	getExportCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting export', function () {
			
			if (connectionRequest.response.exports.length == 0) {
				connectionRequest.options.successCallback && connectionRequest.options.successCallback(null);
				return ;
			}
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.exports[0]);
		});
	};

	/**
	 * Deletes an export by id. 
	 * 
	 * @method deleteExport
	 * @param {String} id: the unique id of the export.
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	deleteExport = function (id, successCallback, failCallback) {

		var params = {
			ExportId: id
		};

		return self.sendCommand('DeleteExport', params, { successCallback: successCallback }, deleteExportCallback, failCallback);
	};

	/**
	 * Called after deleteExport response is returned.
	 */
	deleteExportCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error deleting export.', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback();
		});
	};
	
	/**
	 * Sends a GetOutputsAndEvents command to the server. 
	 * 
	 * @method getOutputsAndEvents
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	getOutputsAndEvents = function(successCallback, failCallback) {

		var params = {
			CameraId: '' // empty string for all cameras
		};

		return self.sendCommand('GetOutputsAndEvents', params, { successCallback: successCallback }, getOutputsAndEventsCallback, failCallback);
	};
	
	getOutputsAndEventsCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting outputs and events', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.actions);
		});
	};

	/**
	 * Gets server statistic (CPU load, network trafic etc.)
	 * 
	 * @method getServerStatus
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	getServerStatus = function(successCallback, failCallback) {
		
	    return self.sendCommand('GetServerStatus', {}, { successCallback: successCallback }, getServerStatusCallback, failCallback);
	};

    /**
	 * Called after getServerStatus command is executed
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	getServerStatusCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting server status', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.ServerStatus);
		});
	};
	
	/**
	 * Triggers an output or event.
	 * 
	 * @method {triggerOutputOrEvent}
	 * @param {String} objectId: the objectId of the item
	 * @param {String} triggerType: 'TriggerOutput' or 'TriggerEvent'
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	triggerOutputOrEvent = function(objectId, triggerType, successCallback, failCallback) {
		
		var params = {
			ObjectId: objectId,
			TriggerType : triggerType
		};
		
		return self.sendCommand('RequestActivation', params, { successCallback: successCallback }, triggerOutputOrEventCallback, failCallback);
	};
	
	/**
	 * If the command succeeded, the connectionRequest.options.successCallback is called without arguments if defined.
	 * If the command failed, the connectionRequest.options.successCallback is called with the error code if defined.
	 */
	triggerOutputOrEventCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error triggering output or event.', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback();
		});
	};
	
	/**
	 * Gets the camera capabilities - export, live, playback, ptz, presets.
	 */
	getCameraCapabilities = function (cameraId, successCallback, failCallback) {
		
		var params = {
			CameraId: cameraId
		};
		
		return self.sendCommand('GetCapabilities', params, { successCallback: successCallback }, getCameraCapabilitiesCallback, failCallback);
	};
	
	/**
	 * Called after getCameraCapabilities response is returned.
	 */
	getCameraCapabilitiesCallback = function (connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting camera capabilities', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.outputParameters);
		});
	};
	
	/**
	 * Asks server to prepare URL for uploading.
	 * 
	 * @param {Object} params: Parameters to sent to the server
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	prepareUpload =  function(params, successCallback, failCallback) {
	    return self.sendCommand('PrepareUpload', params, { successCallback: successCallback }, prepareUploadCallback, failCallback);
	};

    /**
	 * Called after prepareUpload command is executed
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	prepareUploadCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error preparing upload', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.outputParameters);
		});
	};
	
	/**
	 * Get the status of the upload by given UploadID
	 * 
	 * @param {Object} params: Parameters to sent to the server
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	getUploadStatus = function(params, successCallback, failCallback) {
	    return self.sendCommand('GetUploadStatus', params, { successCallback: successCallback }, getUploadStatusCallback, failCallback);
	};

    /**
	 * Called after getUploadStatus command is executed
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	getUploadStatusCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting upload status', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.outputParameters);
		});
	};
	
	/**
	 * Get new challenges from server
	 * 
	 * @param {Object} params: Parameters to sent to the server
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	requestChallenges = function(params, successCallback, failCallback) {
	    return self.sendCommand('RequestChallenges', params, { successCallback: successCallback }, requestChallengesCallback, failCallback);
	};
	
	 /**
	 * Called after RequestChallenges command is executed
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	requestChallengesCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting challenges.', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.outputParameters);
		});
	};
	
	/**
	 * Create playback controller
	 * 
	 * @param {Object} params: Parameters to sent to the server
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	createPlaybackController = function(params, successCallback, failCallback) {
		params.MethodType = self.webSocketServer && self.webSocketBrowser ? 'Push' : 'Pull'; 
		params.CloseOldControllers = 'Yes';
		return self.sendCommand('CreatePlaybackController', params, { successCallback: successCallback }, createPlaybackControllerCallback, failCallback);
	};
	
	/**
	 * Called when CreatePlaybackController reposne is received
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	createPlaybackControllerCallback = function(connectionRequest) {
	
		var connectionResponse = connectionRequest.response;
		var videoConnection = new XPMobileSDK.library.VideoConnection(
			connectionResponse.outputParameters.PlaybackControllerId,
			connectionRequest,
			{
				onClose: function () {},
				onRestart: function () {},
				onPushFailed: function () {}
			}
		);
		callbackAfterRequest(connectionRequest, 'Error creating playback controller', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(videoConnection);
		});
	};
	
	/**
	 * Change several streams at a time
	 * 
	 * @param {Object} params: Parameters to sent to the server
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	changeMultipleStreams = function(params, successCallback, failCallback) {
	    return self.sendCommand('ChangeMultipleStreams', params, { successCallback: successCallback }, changeMultipleStreamsCallback, failCallback);
	};
	
	 /**
	 * Called when ChangeMultipleStreams reposne is received
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	changeMultipleStreamsCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting multiple stream data', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.outputParameters);
		});
	};
	
	/**
	 * Get all investigations from server
	 * 
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	getAllInvestigations = function(successCallback, failCallback) {
		var params = {
				ItemId: '{A3B9C5FB-FAAD-42C8-AB73-B79D6FFFDBC1}'
		};
		return self.sendCommand('GetInvestigation', params, { successCallback: successCallback }, getInvestigationsCallback, failCallback);
	};
	
	/**
	 * Get user investigations from server
	 * 
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	getUserInvestigations = function(successCallback, failCallback) {
		var params = {
				ItemId: '00000000-0000-0000-0000-000000000000'
		};
		return self.sendCommand('GetInvestigation', params, { successCallback: successCallback }, getInvestigationsCallback, failCallback);
	};
	
	/**
	 * Called when getAllInvestigations or getUserInvestigations reponse is received
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	getInvestigationsCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting investigations', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.items);
		});
	};
	
	/**
	 * Gets a specific investigation by its id
	 * 
	 * @param id: string, the investigation id
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	getInvestigation = function(id, successCallback, failCallback) {
		var params = {
				ItemId: id
		};
		return self.sendCommand('GetInvestigation', params, { successCallback: successCallback }, getInvestigationCallback, failCallback);
	};
	
	/**
	 * Called when getInvestigation reponse is received
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	getInvestigationCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting investigation', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.items[0]);
		});
	};
	
	/**
	 * Create investigation to the server
	 * 
	 * @param {Object} params: Parameters to sent to the server
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	createInvestigation = function(params, successCallback, failCallback) {
	    return self.sendCommand('CreateInvestigation', params, { successCallback: successCallback }, createInvestigationCallback, failCallback);
	};
	
	 /**
	 * Called when CreateInvestigation reposne is received
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	createInvestigationCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error creating investigation to the server.', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.outputParameters);
		});
	};
	
	/**
	 * Update investigation on the server
	 * 
	 * @param {Object} params: Parameters to sent to the server
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	updateInvestigation = function(params, successCallback, failCallback) {
	    return self.sendCommand('UpdateInvestigation', params, { successCallback: successCallback }, updateInvestigationCallback, failCallback);
	};
	
	/**
	 * Update investigation data on the server (avoids reexport).
	 * 
	 * @param {Object} params: Parameters to sent to the server
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	updateInvestigationData = function(params, successCallback, failCallback) {
	    return self.sendCommand('UpdateInvestigationData', params, { successCallback: successCallback }, updateInvestigationCallback, failCallback);
	};
	
	 /**
	 * Called when CreateInvestigation reposne is received
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	updateInvestigationCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error updating investigation to the server.', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.outputParameters);
		});
	};
	
	/**
	 * Delete investigation from the server
	 * 
	 * @param {String} investigationId: Id of investigation to delete
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	deleteInvestigation = function(investigationId, successCallback, failCallback) {
	    return self.sendCommand('DeleteInvestigation', { ItemId: investigationId }, { successCallback: successCallback }, deleteInvestigationCallback, failCallback);
	};
	
	 /**
	 * Called when DeleteInvestigation reposne is received
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	deleteInvestigationCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error deleteing investigation from the server.', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(!connectionRequest.response.isError);
		});
	};
	
	/**
	 * Cancels investigation creation when in progress.
	 * 
	 * @param 		investigationId			object		Id of investigation to delete
	 */
	cancelInvestigation = function(investigationId) {
		return self.sendCommand('CancelInvestigationUpdate', { ItemId: investigationId }, null, cancelInvestigationCallback);
	};
	
	
	/**
	 * Called when CancelInvestigationUpdate reposne is received
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	cancelInvestigationCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error canceling investigation update');
	};
	
	/**
	 * Starts an investigation export.
	 * 
	 * @method startInvestigationExport
	 * @param {String} investigationId: the uniq id of the investigation.
	 * @param {String} exportType: the type of the export: DB, AVI, MKV
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	startInvestigationExport = function(investigationId, exportType, successCallback, failCallback) {
		
		var params = {
				InvestigationId: investigationId,
				ExportType: exportType
		};
		
		return self.sendCommand('StartInvestigationExport', params, { successCallback: successCallback }, startInvestigationExportCallback, failCallback);
	};
	
	/**
	 * Called when startInvestigationExport response is returned
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	startInvestigationExportCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error starting investigation export.', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.outputParameters.ExportId);
		});
	};
	
	deleteInvestigationExport = function(investigationId, exportType, successCallback, failCallback) {
		
		var params = {
				InvestigationId: investigationId,
				ExportType: exportType
		};
		
		return self.sendCommand('DeleteInvestigationExport', params, { successCallback: successCallback }, deleteInvestigationExportCallback, failCallback);
	};
	
	/**
	 * Called when deleteInvestigationExport response is returned
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	deleteInvestigationExportCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error deleting investigation export.', connectionRequest.options.successCallback);
	};
	
	/**
	 * Get alarms from server.
	 *
	 * @param {Object} params: Parameters to sent to the server
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	getAlarmList = function(params, successCallback, failCallback) {
		
		var params = {
				MyAlarms: params.MyAlarms || 'No',
				Timestamp: params.Timestamp,
				Operator: 'LessThan',
				Count: params.Count,
				Priority: params.Priority,
				State: params.State
		};
		
		return self.sendCommand('GetAlarmList', params, { successCallback: successCallback }, getAlarmsCallback, failCallback);
	};
	
	/**
	 * Called when GetAlarmList reponse is received
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	getAlarmsCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting alarms', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.items);
		});
	};
	
	/**
	 * Gets a single alarm. 
	 *
	 * @param {Object} params: Parameters to sent to the server
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	getAlarm = function(alarmId, successCallback, failCallback) {
		
		var params = {
				AlarmId: alarmId
		};
		
		return self.sendCommand('GetAlarmList', params, { successCallback: successCallback }, getAlarmCallback, failCallback);
	};
	
	/**
	 * Called when GetAlarmList reponse is received
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	getAlarmCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting alarm', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.items[0]);
		});
	};
	
	/**
	 * Updates an alarm.
	 *
	 * @param params
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	updateAlarm = function(params, successCallback, failCallback) {
	    return self.sendCommand('UpdateAlarm', params, { successCallback: successCallback }, updateAlarmCallback, failCallback);
	};
	
	/**
	 * Called when UpdateAlarm reponse is received
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	updateAlarmCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error updating alarms', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback();
		});
	};
	
	/**
	 * Gets settings for alarms (Priority, State).
	 * 
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	getAlarmDataSettings = function(successCallback, failCallback) {
	    return self.sendCommand('GetAlarmDataSettings', {}, { successCallback: successCallback }, getAlarmDataSettingsCallback, failCallback);
	};
	
	/**
	 * Called when GetAlarmList reponse is received
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	getAlarmDataSettingsCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting alarm data settings', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.items);
		});
	};
	
	/**
	 * Gets list of users for the specified alarm. The alarm can be assigned to any one of these users. 
	 *
	 * @param alarmId
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	getAlarmUsers = function(alarmId, successCallback, failCallback) {
	    return self.sendCommand('GetPermittedUsers', { SourceId: alarmId }, { successCallback: successCallback }, getAlarmUsersCallback, failCallback);
	}
	
	/**
	 * Called when GetPermittedUsers reponse is received
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	getAlarmUsersCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting permitted users for alarm', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.items);
		});
	};
	
	/**
	 * Acknowledges the given alarm.
	 *
	 * @param alarmId
	 * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
	 * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
	 */
	acknowledgeAlarm = function(alarmId, successCallback, failCallback) {
	    return self.sendCommand('AcknowledgeAlarm', { Id: alarmId }, { successCallback: successCallback }, acknowledgeAlarmCallback, failCallback);
	}
	
	/**
	 * Called when GetPermittedUsers reponse is received
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	acknowledgeAlarmCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error acknowledging alarm', function () {
			connectionRequest.options.successCallback && connectionRequest.options.successCallback();
		});
	};
	
	/**
	 * Request the next camera for the given carousel.
	 * 
	 * @param videoId: string
	 */
	prevCarouselCamera = function(videoId) {
		return self.sendCommand('ControlCarousel', { VideoId: videoId, CarouselCommand: 'PreviousCamera' }, null, prevCarouselCameraCallback);
	};
	
	/**
	 * Called when prevCarouselCamera response is returned
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	prevCarouselCameraCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting prev camera from carousel');
	};
	
	/**
	 * Request the next camera for the given carousel.
	 * 
	 * @param videoId: string
	 */
	nextCarouselCamera = function(videoId) {
		return self.sendCommand('ControlCarousel', { VideoId: videoId, CarouselCommand: 'NextCamera' }, null, nextCarouselCameraCallback);
	};
	
	/**
	 * Called when prevCarouselCamera response is returned
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	nextCarouselCameraCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error getting next camera from carousel');
	};
	
	/**
	 * Pauses a carousel.
	 * 
	 * @param videoId: string
	 */
	pauseCarousel = function(videoId) {
		return self.sendCommand('ControlCarousel', { VideoId: videoId, CarouselCommand: 'PauseCarousel' }, null, pauseCarouselCallback);
	};
	
	/**
	 * Called when pauseCarousel response is returned
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	pauseCarouselCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error pausing carousel');
	};
	
	/**
	 * Pauses a carousel.
	 * 
	 * @param videoId: string
	 */
	resumeCarousel = function(videoId) {
		return self.sendCommand('ControlCarousel', { VideoId: videoId, CarouselCommand: 'ResumeCarousel' }, null, resumeCarouselCallback);
	};
	
	/**
	 * Called when resumeCarousel response is returned
	 * 
	 * @param 		connectionRequest		object		Response from AXAJ call
	 */
	resumeCarouselCallback = function(connectionRequest) {
		callbackAfterRequest(connectionRequest, 'Error resuming carousel');
	};
	

	registerForNotifications = function (setting, successCallback, failCallback) {
	    var browser = $.getBrowser();
	    var deviceName = browser.name + " " + browser.version + ", " + browser.os;
	    var params = {
	        Settings: setting, 
	        DeviceName: XPMobileSDK.library.Connection.dh.encodeString(deviceName),
	        DeviceId: XPMobileSDK.library.Connection.connectionId
	    };
	    return self.RegisterForNotifications(params, successCallback, failCallback);
	};

	RegisterForNotifications = function (params, successCallback, failCallback) {
	    return self.sendCommand('RegisterForNotifications', params, { successCallback: successCallback }, registerForNotificationsCallback, failCallback);
	};

	registerForNotificationsCallback = function (connectionRequest) {
	    callbackAfterRequest(connectionRequest, 'Error register for notifications.', function () {
	        connectionRequest.options.successCallback && connectionRequest.options.successCallback(connectionRequest.response.items);
	    });
	};

	/**
	 * A general callback to be called after a request operation. 
	 * Notifies that the request is finished, checks the response for errors, print error message if necessary and calls the callee callback with the appropriate argument(s).
	 *
	 * @param connectionRequest.
	 * @param errorMessage: logged in the console in case of an error.
	 * @param callback
	 */
	callbackAfterRequest = function (connectionRequest, errorMessage, callback) {
		
		requestFinished(connectionRequest);

		var connectionResponse = connectionRequest.response;
		
		if (!connectionResponse || connectionResponse.isError) {
			if (connectionRequestResponseIsTerminal(connectionRequest)) {
				console.log("The application has lost connection due to connectionRequestResponseIsTerminal");
				console.log(errorMessage);
				lostConnection();
			}
			else {
				console.log(errorMessage);
				
				if (connectionRequest.options.failCallback) {
				    connectionRequest.options.failCallback(connectionResponse.error, connectionResponse);
				}
				else if (connectionRequest.options.successCallback) {
				    XPMobileSDK.library.VideoConnectionPool.updateCameraResponse(connectionRequest.params.CameraId, connectionResponse);
				    connectionRequest.options.successCallback(null, connectionResponse.error, connectionResponse);
				}
			}
		}
		else if (callback) {
			callback();
		}
	};
	
	/**
	 * Sends requests to the server. Creates ConnectionRequest instances. 
	 * 
	 * @param commandName: string, the name of the command
	 * @param requestParams: json object, the parameters of the command
	 * @param options: object, optional, can contain:
	 * 				- timeout: integer, time interval in milliseconds after which the request will be aborted
     * 				- reuseConnection: boolean, flag to reuse connection or not
     * 				- viewId: string, the unique GUID of the view that we will work on
     * 				- cameraId: String, the unique GUID of the camera that should be started
	 * 				- successCallback: function, callback that is provided by the client code of the Network API which will be called during the execution of the callback parameter.
	 * @param successCallback: function, the callback to be called after the response is returned and parsed
     * @param failCallback: function, callback that is provided by the client code of the Network API which will be called if something is wrong with the command.
	 */
	sendCommand = function (commandName, requestParams, options, successCallback, failCallback) {

	    requestParams = requestParams || {};

	    if (XPMobileSDKSettings.supportsCHAP && self.SecurityEnabled == 'Yes' && self.CHAPSupported == 'Yes') {
	        var challenge = XPMobileSDK.library.CHAP.calculate();
	        if (challenge.Challenge && challenge.ChalAnswer) {
	            requestParams.Challenge = challenge.Challenge;
	            requestParams.ChalAnswer = challenge.ChalAnswer;
	        }
	    }

	    options = options || {};
	    if (failCallback) {
	        options.failCallback = failCallback;
	    }
		
	    console.log('Sending ' + commandName + ' on ' + (new Date()) + 'with ', requestParams);
        console.log('options: ', options);
	    var connectionRequest = new XPMobileSDK.library.ConnectionRequest(commandName, getNextSequenceID(), requestParams, options, successCallback);
		requests.push(connectionRequest);

		return connectionRequest;
	};

	requestFinished = function (connectionRequest) {
		var index = requests.indexOf(connectionRequest);
		if (index > -1) {
			requests.splice(index, 1);
		}
		var request = {
			parameters: connectionRequest.params,
			options: connectionRequest.options
		};
		var response = connectionRequest.response && {
			parameters: connectionRequest.response.outputParameters
		};
		callMethodOnObservers('connectionRequestSucceeded', request, response);
	};

	/**
	 * Each command send to the server has a sequenceID which starts from 1 and is increased with every next request.
	 */ 
	getNextSequenceID = function () {
		return ++sequenceID;
	};

	setState = function (state) {
		self.state = state;
		// inform observers of state change
		callMethodOnObservers('connectionStateChanged');
	};

	callMethodOnObservers = function () {
		if (arguments.length < 1) return;
		var methodName = arguments[0];
		var args = Array.prototype.slice.call(arguments, 1);
		observers.forEach(function (object) {
			if (object[methodName]) {
				try {
					object[methodName].apply(object, args);
				} catch (e) {
					console.log(e);
					console.log(e.stack);
				}
			}
		});
	};

	/**
	 * Live message
	 * Live message methods are used to "ping" the server with LiveMessage commands to keep the connection ID alive.
	 * All commands sent to the server should cancel the live message and schedule it again on response. The idea is that if
	 * there is a constant stream of communication going on with the server there is no point in sending live messages. Instead
	 * we send it only if there is some period of time that we haven't sent any commands.
	 * 
	 * TODO possible bug: when we have video connections they consume a lot of AJAX calls. And the live messages may get queued. 
	 * If that happens it is possible to timeout the connection even though the video is still properly running and everything.
	 * 
	 * All these methods are private!
	 */
	scheduleLiveMessage = function () {
		
		if (self.liveMessageTimer) return;
		
		// serverTimeout is in seconds and setTimeout accepts milliseconds so we have to multiple by 1000. However
		// we shouldn't wait for the entire period but send the live message earlier. Hence the multiplier is smaller
		self.liveMessageTimer = setInterval(self.sendLiveMessage, self.serverTimeout * 1000 / 3);
		
	};

	updateLiveMessageTimer = function (minInterval) {
	    // serverTimeout is in seconds and setTimeout accepts milliseconds so we have to multiple by 1000. However
	    // we shouldn't wait for the entire period but send the live message earlier. Hence the multiplier is smaller
	    var interval = self.serverTimeout * 1000 / 3;

	    if (minInterval && typeof minInterval === "number")
	    {
	        interval = Math.min(interval, minInterval);
	    }

	    clearTimeout(self.liveMessageTimer);
	    
	    self.liveMessageTimer = setInterval(self.sendLiveMessage, interval);
	};
	
	cancelLiveMessage = function () {

		if (!self.liveMessageTimer) return;
		
		clearTimeout(self.liveMessageTimer);
		self.liveMessageTimer = null;
		
	};

	sendLiveMessage = function () {
		
		console.log('Live messages waiting: ' + liveMessagesWaiting);
		self.LiveMessage();
		
		if (self.webSocketServer && self.webSocketBrowser) {
			fps.manage(liveMessagesWaiting);
		}
		
		liveMessagesWaiting++;
		
	};

    /**
     * Sends a LiveMessage command to the server.
     * 
     * @param {Object} params: Parameters to sent to the server
     * @param {Function} successCallback: function that is called when the command execution was successful and the result is passed as a parameter.
     * @param {Function} failCallback: function that is called when the command execution has failed and the error is passed as a parameter.
     * 
     */
	LiveMessage = function (params, successCallback, failCallback) {
	    params = params || {};
	    self.sendCommand('LiveMessage', params, { successCallback: successCallback }, liveMessageCallback, failCallback);
	};
	
	liveMessageCallback = function (connectionRequest) {

		liveMessagesWaiting--;
		
		requestFinished(connectionRequest);
		var connectionResponse = connectionRequest.response;
		if (!connectionResponse || connectionResponse.isError) {
			if (connectionRequestResponseIsTerminal(connectionRequest)) {
				if (self.connectingViaExternalConnectionID) {
					self.connectingViaExternalConnectionID = false;
					console.log('Old connection ID has expired');
					callMethodOnObservers('connectionFailedToConnectWithId', connectionResponse && connectionResponse.error);
					self.connectionId = null;
				} else {
					lostConnection();
				}
				cancelLiveMessage();
				return;
			}
		}
		if (self.connectingViaExternalConnectionID) {
			self.connectingViaExternalConnectionID = false; // reset the flag
			console.log('Started connection from external connection ID');
			setState(XPMobileSDK.library.ConnectionStates.working);
			callMethodOnObservers('connectionDidLogIn'); // do we need another method?
		}
		if(connectionResponse.outputParameters.FolderDefinitionsChanged == 'Yes' || 
		   connectionResponse.outputParameters.ViewDefinitionsChanged == 'Yes') {
			callMethodOnObservers('connectionReloadConfiguration');
		}
		if(connectionResponse.outputParameters.CameraDefinitionsChanged == 'Yes') {
			callMethodOnObservers('connectionReloadCameraConfiguration');
		}
		if (connectionResponse.items.length > 0)
		{
		    for (var i = 0; i < connectionResponse.items.length; i++)
		    {
		        if (connectionResponse.items[i].Type == "Notification")
		        {
		            callMethodOnObservers('receivedNotification', connectionResponse.items[i]);
                }
		        
		    }
		    
		}
		scheduleLiveMessage();

	};

	/**
	 * Parses the features that are returned from server and puts them in local storage
	 * 
	 * @param 		features		object		Features that the server is supporting
	 */
	getFeatures = function (features) {
		
		if (!features) return;

		if (!features.SupportNoScaledImages) {
			features.SupportNoScaledImages = 'Yes'; // default value
		}
		
		var data = {};
		for (let i in features) {
			switch(i) {
				case 'Challenge':
					data['CHAPSupported'] = true;
					break;
				case 'ServerVersion':
					data['ServerVersion'] = features[i];
					break;
				default:
					var value = isNaN(Number(features[i])) ? features[i] == 'Yes' : Number(features[i]);
					data[i] = value;
					break;
			};
		}
		
		addDirectStreamingStatus(data);
		self.storage && self.storage.setItem('features', data);
		XPMobileSDK.features = data;

	};
	
	/**
	 * Adds the status of the Direct Streaming to the XPMobileSDK.features object.
	 * 
	 *  XPMobileSDK.features.DirectStreaming == 0 - DS not available
	 *  XPMobileSDK.features.DirectStreaming == 1 - do not enforce
	 *  XPMobileSDK.features.DirectStreaming == 2 - enforce whenever possible
	 *  XPMobileSDK.features.DirectStreaming == 3 - enforce for all clients
	 */
	addDirectStreamingStatus = function(data) {

		if (!data.NativeStreamingAvailable) {
			data.DirectStreaming = self.DSServerStatus.NotAvailable; 
			return;
		} 
		
		if (!data.TranscodedStreamingAvailable) {
			data.DirectStreaming = self.DSServerStatus.Enforce; 
			return;
		}
		
		if (data.NativeStreamingSuggested) {
			data.DirectStreaming = self.DSServerStatus.EnforceWheneverPossible; 
			return;
		}
		
		data.DirectStreaming = self.DSServerStatus.DoNotEnforce; 
	};
	
	/**
	 * Tests if response of a request contains an error that is terminal for the connection, such as connection timeout error!
	 */
	connectionRequestResponseIsTerminal = function (connectionRequest) {
		var connectionResponse = connectionRequest.response;
		if (connectionResponse == undefined
            || connectionResponse.errorCode == XPMobileSDK.library.ConnectionError.WrongID
            || connectionResponse.errorCode == XPMobileSDK.library.ConnectionError.ChallengesLimitReached
            || connectionResponse.errorString == 'Wrong connection ID') {
			return true;
		}
		return false;
	};

	lostConnection = function () {
		if (self.state != XPMobileSDK.library.ConnectionStates.lostConnection) {
			setState(XPMobileSDK.library.ConnectionStates.lostConnection);
			self.connectionId = null;
			XPMobileSDK.library.VideoConnectionPool.clear();
			self.destroy();
			callMethodOnObservers('connectionLostConnection');
		}
	};

	/**
	 * Destructor. As much as there is such thing in JavaScript.
	 * 
	 * @method destroy
	 */
	destroy = function () {
		requests = [];
		if (self.storage) {
			self.storage.removeItem('features');
			self.storage.removeItem('webSocketServer');
		}
	};
};

/**
 * List of connection error codes. Not in use just yet but definitely should be!
 */ 
XPMobileSDK.library.ConnectionError = {
	NotImplemented: 1,
	NotFullyImplemented: 2,
	BadCommandType: 10,
	BadCommandKind: 11,
	WrongID: 12,
	MissingInputParameter: 13,
	WrongInputParameter: 14,
	InvalidCredentials: 15,
	IncorrectPublicKey: 16,
	SurveillanceServerDown: 17,
	InvalidLicense: 18,
	SecurityError: 19,
	UnknownCameraID: 20,
	UnknownItemID: 21,
	NoPresetsAvailable: 22,
	NotAllowedInThisState: 23,
	FeatureIsDisabled: 24,
	InsufficientUserRights: 25,
	TooManySessions: 26,
	NewConfigurationNotAvailable: 27,
	AddressesNotReachable: 28,
	PlaybackStreamsLimitReached: 29,
	Redirection: 30,
	MovingInvestigations: 31,
	NoRecordingsFound: 32,
	NoRecordingsInInterval: 33,
	SecondStepAuthenticationRequired: 34,
	SecondStepAuthenticationEnabledUsersOnly: 35,
	SecondStepAuthenticationCodeError: 36,
	SecondStepAuthenticationCodeExpired: 37,
	ImportFootageFileSizeOverLimit: 38,
	ImportFootageFileTypeNotAllowed: 39,
	InputParameterTooLong: 43,
	ChallengesLimitReached: 51,
	
	CommandTimedOut: 0x7FFFFFFD,
	InternalError: 0x7FFFFFFE,
	Unknown: 0x7FFFFFFF
};
