/**
 * Video connection item
 * Do not create instances of this class directly. They are only created by the video connection object and served to you 
 * via its callback. You can then read its properties and data. Which are:
 *  - imageURL - if the frame represents an image, this will be a base64 encoded image;
 *  - frameNumber - index of the frame;
 *  - timestamp - data and time of the frame (Date object);
 *  - hasSizeInformation, hasLiveInformation, hasPlaybackInformation - whether the frame has the corresponding extensions.
 *  If hasSizeInformation is set to true:
 *  	- sizeInfo - contains information about frame size and cropping.
 *  If hasLiveInformation is set to true:
 *  	- changedLiveEvents and currentLiveEvents - masks of flags. See VideoItem.LiveFlags.
 *  If hasPlaybackInformation is set to true:
 *  	- changedPlaybackEvents and currentPlaybackEvents - masks of flags. See VideoItem.PlaybackFlags.
 *  
 *  @class VideoItem
 *  @param 		binary		data		Binary data represented header with all information about the frame and the frame itself
 */
XPMobileSDK.library.VideoItem = function (data) {
	// Stores the context of execution
	var self = this;
	
	// Stores the pointer to the current bytes offset.
	var bytesOffset = 0;
	
	// Define data view variable used in older browsers that does not support TypedArray
	var dataView = null;
	
	 /**
     * Called to get the video data from the binary
     *
     * @param dataView, binary, video data
     */
    function getData() {
		
		if (self.dataSize > 0) {
			
    		retrieveData();

			if (self.stream) {
				switch (self.stream.dataType) {
					case 'JPEG':	convertToImage();		break;
					case 'JSON':	convertToSegment();		break;
				}
			}
			else {
				convertToImage();
			}
        }
    };
	
	/**
	 * Initialize the prototype
	 */
	function initialize() {
		parseHeader();
		getData();
	}
	
	/**
	 * Parse frame headers
	 */
	function parseHeader() {
	    self.uuid = getGUID();
		
		self.timestamp = new Date(readBytes(8));
		self.frameNumber = readBytes(4);
		self.dataSize = readBytes(4);
		self.headerSize = readBytes(2);

		var MainHeader = readBytes(2);
		
		self.hasSizeInformation = MainHeader & XPMobileSDK.library.VideoItem.HeaderExtensionSize;
		self.hasLiveInformation = MainHeader & XPMobileSDK.library.VideoItem.HeaderExtensionLiveEvents;
		self.hasPlaybackInformation = MainHeader & XPMobileSDK.library.VideoItem.HeaderExtensionPlaybackEvents;
		self.hasNativeData = MainHeader & XPMobileSDK.library.VideoItem.HeaderExtensionNative;
		self.hasMotionInformation = MainHeader & XPMobileSDK.library.VideoItem.HeaderExtensionMotionEvents;
		self.hasLocationData = MainHeader & XPMobileSDK.library.VideoItem.HeaderExtensionLocationInfo;
		self.hasStreamInfo = MainHeader & XPMobileSDK.library.VideoItem.HeaderExtensionStreamInfo;
		self.hasCarouselInfo = MainHeader & XPMobileSDK.library.VideoItem.HeaderExtensionCarouselInfo;

		if (self.hasSizeInformation) {
			parseSizeInformation();
		}
		
		if (self.hasLiveInformation) {
			parseLiveInformation();
		}
		if (self.hasPlaybackInformation) {
			parsePlaybackInformation();
		}
		if (self.hasNativeData) {
			readBytes(readBytes(4)); // Remove this by header parser when we have support for Native data
		}
		if (self.hasMotionInformation) {
			parseMotionInformation();
		}
		if (self.hasLocationData) {
			readBytes(readBytes(4)); // Remove this by header parser when we have support for Stream location
		}
		if (self.hasStreamInfo) {
			parseStreamInfo();
		}
		if (self.hasCarouselInfo) {
		    parseCarouselInfo();
		}
	};
	
	/**
	 * Get all information from header related with frame size
	 */
	function parseSizeInformation() {
		self.sizeInfo = { sourceSize: {}, sourceCrop: {}, destinationSize: {} };
		self.sizeInfo.sourceSize.width = readBytes(4);
		self.sizeInfo.sourceSize.height = readBytes(4);
		self.sizeInfo.sourceCrop.left = readBytes(4);
		self.sizeInfo.sourceCrop.top = readBytes(4);
		self.sizeInfo.sourceCrop.right = readBytes(4);
		self.sizeInfo.sourceCrop.bottom = readBytes(4);
		self.sizeInfo.sourceCrop.width = self.sizeInfo.sourceCrop.right - self.sizeInfo.sourceCrop.left;
		self.sizeInfo.sourceCrop.height = self.sizeInfo.sourceCrop.bottom - self.sizeInfo.sourceCrop.top;
		self.sizeInfo.destinationSize.width = readBytes(4);
		self.sizeInfo.destinationSize.height = readBytes(4);
		self.sizeInfo.destinationSize.resampling = readBytes(4);
		
		// Not currently used
		self.sizeInfo.destinationSize.top = readBytes(4);
		self.sizeInfo.destinationSize.right = readBytes(4);
		self.sizeInfo.destinationSize.bottom = readBytes(4);
	};
	
	/**
	 * Get video connection GUID 
	 */
	function parseLiveInformation() {
		self.currentLiveEvents = readBytes(4);
		self.changedLiveEvents = readBytes(4);
	};
	
	/**
	 * Get playback events information 
	 */
	function parsePlaybackInformation() {
		self.currentPlaybackEvents = readBytes(4);
		self.changedPlaybackEvents = readBytes(4);
	};
	/**
	 * Get motion amount information 
	 */
	function parseMotionInformation() {
		self.motionHeaderSize = readBytes(4);
		self.motionAmount = readBytes(4);
	};
	/**
	 * Get stream information 
	 */
	function parseStreamInfo() {
		self.stream = {};
		self.stream.headerSize = readBytes(4);
		self.stream.headerVesion = readBytes(4);
		self.stream.validFields = readBytes(4);
		self.stream.reserved = readBytes(4);
		self.stream.timeBetweenFrames = readBytes(4);
		self.stream.dataType = readBytesAsCharacters(4);
		self.stream.rotation = readBytes(4);
		self.stream.interlace = readBytes(4);
		self.stream.error = readBytes(4);
	};

	function parseCarouselInfo() {
	    self.carousel = {};
	    self.carousel.headerSize = readBytes(4);
	    self.carousel.headerVesion = readBytes(4);
	    self.carousel.itemId = getGUID();
	}
	
	/**
	 * Retrieve frame binary data  
	 */
	function retrieveData() {
		self.data = new Uint8Array(data, self.headerSize, self.dataSize);
	};
	
	/**
	 * Encode the data using Blob
	 */
	function convertToImage() {
	    self.type = XPMobileSDK.library.VideoItem.Type.Frame;
		self.blob = new Blob([self.data], { type: 'image/jpeg' });
	};
	
	/**
	 * Convert binary data to segment listing
	 */
	function convertToSegment () {
		var encodedData = Base64.encodeArray(self.data);
		var string = atob(encodedData);
		
		Segment.call(self, string);
	};

	/**
	 * Read bytes from ArrayBuffer
	 * 
	 * @param		number		bytesCount		Number of bytes to read from ArrayByffer
	 */
	function readBytes(bytesCount) {
		var bytes = new Uint8Array(data, bytesOffset, bytesCount);
		bytesOffset += bytesCount;
		var result = 0;
		for (var i = 0; i < bytesCount; i ++) {
			result += bytes[i] * Math.pow(2, 8 * i);
		}
		return result;
	};
	
	/**
	 * Get frame timestamp in milliseconds unix timestamp  
	 */
	function readBytesAsCharacters(bytesCount) {
		
		var result = '';
		
		for (var i = 0; i < bytesCount; i++) {
			result += String.fromCharCode(readBytes(1));
		}
		return result;
		
	}

    /**
     * Converts byte to hex string
     * @param {} v 
     * @returns {} 
     */
	function uintToHexString(v) {
	    var res = '';
	    var map = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

	    var vl = (v & 0xf0) >> 4;
	    res += map[vl];

	    var vr = v & 0x0f;
	    res += map[vr];

	    return res;
	}

    /**
     * Base method for reading bytes from buffer, processing them and converts to hex string
     * @param {} count - number of bytes to read
     * @returns {} string - hex representation of the bytes read
     */
	function readToStringBase(count, processor) {
	    var arr = new Uint8Array(data, bytesOffset, count);
	    var processed = processor(arr);
	    var res = '';
	    for (var i = 0; i < count; i++) {
	        res += uintToHexString(processed[i]);
	    }
	    bytesOffset += count;
	    return res;
	}

    /**
     * Reads bytes from buffer, reverse bytes in the array and converts to hex string
     * @param {} count - number of bytes to read
     * @returns {} string - hex representation of the bytes read
     */
	function readToString(count) {
	    return readToStringBase(count, function(arg) { return arg; } );
	}

    /**
     * Reads bytes from buffer and converts to hex string
     * @param {} count - number of bytes to read
     * @returns {} string - hex representation of the bytes read
     */
	function readAndReverseToString(count) {
	    return readToStringBase(count, function(arr) { return Array.prototype.reverse.call(arr); });
	}

    /**
	 * Retrieving string of guid from its binary representation
	 */
    function getGUID() {
        var res = '';

        res += readAndReverseToString(4);
        res += '-';
        res += readAndReverseToString(2);
        res += '-';
        res += readAndReverseToString(2);
        res += '-';
        res += readToString(2);
        res += '-';
        res += readToString(6);

        return res;
    }

    /**
	 * Old methog, not used any more, could be deleted
	 */
	function getGUIDold() {
		var arr = new Uint8Array(data, bytesOffset, 16);
		var res = '';
		var map = ['a', 'b', 'c', 'd', 'e', 'f'];
		
		for (var i = bytesOffset + 3; i >= bytesOffset + 0; i--) {
			var v = arr[i];
			var vl = (v & 0xf0) >> 4;
			if (vl < 10) {
				res += vl;
			} else {
				res += map[vl-10];
			}
			var vr = v & 0x0f;
			if (vr < 10) {
				res += vr;
			} else {
				res += map[vr-10];
			}
		}
		
		for (var i = bytesOffset + 5; i > bytesOffset + 3; i--) {
			var v = arr[i];
			var vl = (v & 0xf0) >> 4;
			if (vl < 10) {
				res += vl;
			} else {
				res += map[vl-10];
			}
			var vr = v & 0x0f;
			if (vr < 10) {
				res += vr;
			} else {
				res += map[vr-10];
			}
		}
		
		for (var i = bytesOffset + 7; i > bytesOffset + 5; i--) {
			var v = arr[i];
			var vl = (v & 0xf0) >> 4;
			if (vl < 10) {
				res += vl;
			} else {
				res += map[vl-10];
			}
			var vr = v & 0x0f;
			if (vr < 10) {
				res += vr;
			} else {
				res += map[vr-10];
			}
		}
		
		for (var i = bytesOffset + 8; i < bytesOffset + 16; i++) {
			var v = arr[i];
			var vl = (v & 0xf0) >> 4;
			if (vl < 10) {
				res += vl;
			} else {
				res += map[vl-10];
			}
			var vr = v & 0x0f;
			if (vr < 10) {
				res += vr;
			} else {
				res += map[vr-10];
			}
		}
	    bytesOffset += 16;
//		res = Array.prototype.slice.call( res, 8, 0, "-" );//res.splice(8, 0, "-");
//		res = Array.prototype.slice.call( res, 13, 0, "-" );//res.splice(13, 0, "-");
//		res = Array.prototype.slice.call( res, 18, 0, "-" );//res.splice(18, 0, "-");
//		res = Array.prototype.slice.call( res, 23, 0, "-" );//res.splice(23, 0, "-");
		return res;
	};
	
	initialize();
	
};

XPMobileSDK.library.VideoItem.Type = {};
XPMobileSDK.library.VideoItem.Type.Segment = 0;
XPMobileSDK.library.VideoItem.Type.Frame = 1;

XPMobileSDK.library.VideoItem.Error = {};
XPMobileSDK.library.VideoItem.Error.NonFatal = 0x01;
XPMobileSDK.library.VideoItem.Error.Fatal = 0x02;

XPMobileSDK.library.VideoItem.MainHeaderLength = 36;
XPMobileSDK.library.VideoItem.SizeInfoHeaderLength = 32;
XPMobileSDK.library.VideoItem.LiveInfoHeaderLength = 8;
XPMobileSDK.library.VideoItem.PlaybackInfoHeaderLength = 8;

XPMobileSDK.library.VideoItem.HeaderExtensionSize = 0x01;
XPMobileSDK.library.VideoItem.HeaderExtensionLiveEvents = 0x02;
XPMobileSDK.library.VideoItem.HeaderExtensionPlaybackEvents = 0x04;
XPMobileSDK.library.VideoItem.HeaderExtensionNative = 0x08;
XPMobileSDK.library.VideoItem.HeaderExtensionMotionEvents = 0x10;
XPMobileSDK.library.VideoItem.HeaderExtensionLocationInfo = 0x20;
XPMobileSDK.library.VideoItem.HeaderExtensionStreamInfo = 0x40;
XPMobileSDK.library.VideoItem.HeaderExtensionCarouselInfo = 0x80;

XPMobileSDK.library.VideoItem.LiveFlags = {};
XPMobileSDK.library.VideoItem.LiveFlags.LiveFeed = 0x01;
XPMobileSDK.library.VideoItem.LiveFlags.Motion = 0x02;
XPMobileSDK.library.VideoItem.LiveFlags.Recording = 0x04;
XPMobileSDK.library.VideoItem.LiveFlags.Notification = 0x08;
XPMobileSDK.library.VideoItem.LiveFlags.CameraConnectionLost = 0x10;
XPMobileSDK.library.VideoItem.LiveFlags.DatabaseFail = 0x20;
XPMobileSDK.library.VideoItem.LiveFlags.DiskFull = 0x40;
XPMobileSDK.library.VideoItem.LiveFlags.ClientLiveStopped = 0x80;

XPMobileSDK.library.VideoItem.PlaybackFlags = {};
XPMobileSDK.library.VideoItem.PlaybackFlags.Stopped = 0x01;
XPMobileSDK.library.VideoItem.PlaybackFlags.Forward = 0x02;
XPMobileSDK.library.VideoItem.PlaybackFlags.Backward = 0x04;
XPMobileSDK.library.VideoItem.PlaybackFlags.DatabaseStart = 0x10;
XPMobileSDK.library.VideoItem.PlaybackFlags.DatabaseEnd = 0x20;
XPMobileSDK.library.VideoItem.PlaybackFlags.DatabaseError = 0x40;

