/**
 * A pool of reusable video connections. 
 * 
 * A video connection can be reused if a client needs to open more than one stream for the same camera. In this case the client needs to 
 * provide an additional parameter to the command Connection.requestStream. 
 * 
 * @author rvp
 */
XPMobileSDK.library.VideoConnectionPool = new function() {
	
	/**
	 * An abstraction of a camera in the pool.
	 * 
	 * @param {String} id: the camera id
	 */
	var Camera = function(id) {
		this.id = id;
		this.videoConnection = undefined;
		this.response = undefined;
		this.count = 1;
		this.pendingCallbacks = [];
	};
	
	this.cameras = [];

	/**
	 * Checks if the pool contains a camera with the given cameraId.
	 */
	this.containsCamera = function(cameraId) {
		return !!getCameraById(cameraId);
	};
	
	/**
	 * Pretends to open stream instead of calling a RequestStream command. The client should not notice any difference. 
	 */
	this.pretendToOpenStream = function(cameraId, callback) {
		var camera = getCameraById(cameraId);
		camera.count++;
		if (camera.videoConnection !== undefined) {
			// waiting for some time to simulate a real request
			setTimeout(function() {
				callback(camera.videoConnection, camera.response);
			}, 10); 
		} else {
			camera.pendingCallbacks.push(callback);
		}
		return new XPMobileSDK.library.FakeConnectionRequest(cameraId, callback);
	};
	
	/**
	 * Adds a camera to the pool.
	 */
	this.addCameraId = function(cameraId) {
		this.cameras.push(new Camera(cameraId));
	};
	
	/**
	 * Adds a video connection and a server response to the pool.
	 */
	this.addVideoConnection = function(cameraId, videoConnection, response) {
		var camera = getCameraById(cameraId);
		if (camera) {
			camera.videoConnection = videoConnection;
			camera.response = response;
			camera.pendingCallbacks.forEach(function(callback) {
				callback(videoConnection, response);
			});
		}
		videoConnection || this.removeCamera(cameraId);
	};
	
	/**
	 * Checks if the client uses the camera with the given cameraId to display more than one stream at the same time. 
	 */
	this.hasDuplicatedStream = function(cameraId) {
		var cam = getCameraById(cameraId);
		return cam && cam.count > 1;
	};

	this.updateCameraResponse = function (cameraId, response) {
	    var cam = getCameraById(cameraId);

	    if (cam) {
	        cam.response = response;
	    }
	    
	};

	this.getCameraResponse = function (cameraId) {
	    var cam = getCameraById(cameraId);
	    return cam.response;
	};
	
	/**
	 * Removes a stream instance for the given cameraId. 
	 * This is needed because the NetworkAPI closes a videoConnection only if the last stream instance of the same camera is closed. 
	 */
	this.removeInstance = function(cameraId) {
		getCameraById(cameraId).count--;
	};
	
	/**
	 * Removes the camera with the given cameraId from the pool. Further attempts to open a stream for the same camera will result in a new RequestStream command. 
	 */
	this.removeCamera = function(cameraId) {
		this.cameras.splice(this.cameras.indexOf(getCameraById(cameraId)), 1);
	};
	
	/**
	 * Cancels a request to use a reusable stream for the given cameraId.
	 */
	this.cancelFakeRequest = function(cameraId, callback) {
		var camera = getCameraById(cameraId);
		if (camera) {
			camera.count--;
			var index = camera.pendingCallbacks.indexOf(callback);
			index != -1 && camera.pendingCallbacks.splice(index, 1);
		}
	};
	
	/**
	 * Removes all cameras from the pool.
	 */
	this.clear = function() {
		this.cameras = [];
	};
	
	var getCameraById = function(cameraId) {
		
		var result = undefined;
		
		this.cameras.forEach(function(camera) {
			if (camera.id == cameraId) {
				result = camera;
			}
		});
		
		return result;
	}.bind(this);
};
