/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/charenc/charenc.js":
/*!*****************************************!*\
  !*** ./node_modules/charenc/charenc.js ***!
  \*****************************************/
/***/ ((module) => {

var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;


/***/ }),

/***/ "./node_modules/crypt/crypt.js":
/*!*************************************!*\
  !*** ./node_modules/crypt/crypt.js ***!
  \*************************************/
/***/ ((module) => {

(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();


/***/ }),

/***/ "./node_modules/is-buffer/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-buffer/index.js ***!
  \*****************************************/
/***/ ((module) => {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ "./node_modules/md5/md5.js":
/*!*********************************!*\
  !*** ./node_modules/md5/md5.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

(function(){
  var crypt = __webpack_require__(/*! crypt */ "./node_modules/crypt/crypt.js"),
      utf8 = (__webpack_require__(/*! charenc */ "./node_modules/charenc/charenc.js").utf8),
      isBuffer = __webpack_require__(/*! is-buffer */ "./node_modules/is-buffer/index.js"),
      bin = (__webpack_require__(/*! charenc */ "./node_modules/charenc/charenc.js").bin),

  // The core
  md5 = function (message, options) {
    // Convert to byte array
    if (message.constructor == String)
      if (options && options.encoding === 'binary')
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message) && message.constructor !== Uint8Array)
      message = message.toString();
    // else, assume byte array already

    var m = crypt.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    if (message === undefined || message === null)
      throw new Error('Illegal argument ' + message);

    var digestbytes = crypt.wordsToBytes(md5(message, options));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

})();


/***/ }),

/***/ "./src/api/index.ts":
/*!**************************!*\
  !*** ./src/api/index.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.debug = exports.logFailedTranslateUrl = exports.translateImage = exports.submitFeedback = exports.signup = exports.SignupStatus = exports.logout = exports.login = exports.LoginStatus = exports.getCurrentUser = exports.baseUrl = void 0;
const storage_1 = __webpack_require__(/*! ../storage */ "./src/storage/index.ts");
// If set to true, use local implementations and turn on logging.
const isDebug = false;
exports.baseUrl = isDebug ? 'http://localhost:8080' : 'https://ichigoreader.com';
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["Ok"] = 200] = "Ok";
    StatusCode[StatusCode["Created"] = 201] = "Created";
    StatusCode[StatusCode["NoContent"] = 204] = "NoContent";
    StatusCode[StatusCode["Forbidden"] = 403] = "Forbidden";
    StatusCode[StatusCode["NotFound"] = 404] = "NotFound";
    StatusCode[StatusCode["TooManyRequests"] = 429] = "TooManyRequests";
    StatusCode[StatusCode["InternalServerError"] = 500] = "InternalServerError";
})(StatusCode || (StatusCode = {}));
function getCurrentUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const clientUuid = yield storage_1.appConfig.getClientUuid();
        const request = yield fetch(`${exports.baseUrl}/metrics?clientUuid=${clientUuid}&fingerprint=${getFingerprint()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (request.status !== StatusCode.Ok) {
            throw new Error('Failed to retrieve user.');
        }
        return (yield request.json());
    });
}
exports.getCurrentUser = getCurrentUser;
var LoginStatus;
(function (LoginStatus) {
    LoginStatus[LoginStatus["Unknown"] = 0] = "Unknown";
    LoginStatus[LoginStatus["UnknownEmail"] = 1] = "UnknownEmail";
    LoginStatus[LoginStatus["BadPassword"] = 2] = "BadPassword";
    LoginStatus[LoginStatus["Success"] = 3] = "Success";
})(LoginStatus = exports.LoginStatus || (exports.LoginStatus = {}));
function login(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const request = yield fetch(`${exports.baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        if (request.status === StatusCode.NotFound) {
            return LoginStatus.UnknownEmail;
        }
        if (request.status === StatusCode.Forbidden) {
            return LoginStatus.BadPassword;
        }
        return request.status === StatusCode.Ok ? LoginStatus.Success : LoginStatus.Unknown;
    });
}
exports.login = login;
function logout() {
    return __awaiter(this, void 0, void 0, function* () {
        const request = yield fetch(`${exports.baseUrl}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return request.status === StatusCode.NoContent;
    });
}
exports.logout = logout;
var SignupStatus;
(function (SignupStatus) {
    SignupStatus[SignupStatus["Unknown"] = 0] = "Unknown";
    SignupStatus[SignupStatus["Success"] = 1] = "Success";
    SignupStatus[SignupStatus["EmailTaken"] = 2] = "EmailTaken";
})(SignupStatus = exports.SignupStatus || (exports.SignupStatus = {}));
function signup(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const request = yield fetch(`${exports.baseUrl}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        if (request.status === StatusCode.Forbidden) {
            return SignupStatus.EmailTaken;
        }
        return request.status === StatusCode.Created ? SignupStatus.Success : SignupStatus.Unknown;
    });
}
exports.signup = signup;
function submitFeedback(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const request = yield fetch(`${exports.baseUrl}/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        return request.status === StatusCode.Created;
    });
}
exports.submitFeedback = submitFeedback;
function translateImage(base64Image) {
    return __awaiter(this, void 0, void 0, function* () {
        const clientUuid = yield storage_1.appConfig.getClientUuid();
        const request = yield fetch(`${exports.baseUrl}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                base64Images: [base64Image],
                clientUuid: clientUuid,
                fingerprint: getFingerprint()
            })
        });
        if (request.status === StatusCode.InternalServerError) {
            const errorMessage = 'Server is down or experiencing issues. Sorry for the inconvenience.';
            return {
                errorMessage,
                translations: [
                    {
                        originalLanguage: 'Unknown',
                        translatedText: errorMessage,
                        minX: 0,
                        minY: 0,
                        maxX: 200,
                        maxY: 200
                    }
                ]
            };
        }
        if (request.status === StatusCode.TooManyRequests) {
            const errorMessage = 'Out of translations. Server costs are expensive. Upgrade for more!';
            return {
                errorMessage,
                translations: [
                    {
                        originalLanguage: 'Unknown',
                        translatedText: errorMessage,
                        minX: 0,
                        minY: 0,
                        maxX: 200,
                        maxY: 200
                    }
                ]
            };
        }
        const results = yield request.json();
        return {
            translations: results.images[0]
        };
    });
}
exports.translateImage = translateImage;
function logFailedTranslateUrl(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fetch(`${exports.baseUrl}/log/translation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    translationUrls: [url]
                })
            });
        }
        catch (_a) {
            // Do nothing.
        }
    });
}
exports.logFailedTranslateUrl = logFailedTranslateUrl;
function debug(message) {
    if (isDebug) {
        console.log(message);
    }
}
exports.debug = debug;
let fingerprint = null; // Do not access this directly, use getFingerprint().
function getFingerprint() {
    if (fingerprint) {
        return fingerprint;
    }
    // Initialize fingerprint.
    const webGlRenderer = getWebGlRenderer();
    const hardware = getHardware();
    const connectionString = getConnectionString();
    const timezoneCode = new Date().getTimezoneOffset();
    fingerprint = btoa(`${webGlRenderer}-${hardware}-${connectionString}-${timezoneCode}`);
    return fingerprint;
}
function getWebGlRenderer() {
    const gl = new OffscreenCanvas(0, 0).getContext('webgl');
    if (!gl) {
        return 'none';
    }
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    return debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
}
function getHardware() {
    const hardwareConcurrency = navigator === null || navigator === void 0 ? void 0 : navigator.hardwareConcurrency;
    const deviceMemory = navigator['deviceMemory'];
    return `${hardwareConcurrency}-${deviceMemory}`;
}
function getConnectionString() {
    var _a, _b, _c, _d, _e;
    const type = (_a = navigator['connection']) === null || _a === void 0 ? void 0 : _a.type;
    const rtt = (_b = navigator['connection']) === null || _b === void 0 ? void 0 : _b.rtt;
    const downlinkMax = (_c = navigator['connection']) === null || _c === void 0 ? void 0 : _c.downlinkMax;
    const effectiveType = (_d = navigator['connection']) === null || _d === void 0 ? void 0 : _d.effectiveType;
    const saveData = (_e = navigator['connection']) === null || _e === void 0 ? void 0 : _e.saveData;
    return `${type}-${rtt}-${downlinkMax}-${effectiveType}-${saveData}`;
}


/***/ }),

/***/ "./src/app/background.ts":
/*!*******************************!*\
  !*** ./src/app/background.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// Background process for the Ichigo extension.
// This module should be used to process async work.
// Handle failures in a robust manner and avoid the fail-fast pattern, unless in debug mode.
const async_1 = __webpack_require__(/*! ../chrome/async */ "./src/chrome/async.ts");
const storage_1 = __webpack_require__(/*! ../storage */ "./src/storage/index.ts");
const api_1 = __webpack_require__(/*! ../api */ "./src/api/index.ts");
const saveTranslatedImageFeature_1 = __webpack_require__(/*! ./saveTranslatedImage/saveTranslatedImageFeature */ "./src/app/saveTranslatedImage/saveTranslatedImageFeature.ts");
const saveAllTranslatedImageFeature_1 = __webpack_require__(/*! ./saveTranslatedImage/saveAllTranslatedImageFeature */ "./src/app/saveTranslatedImage/saveAllTranslatedImageFeature.ts");
const translateWithScaling_1 = __webpack_require__(/*! ./translateWithScaling */ "./src/app/translateWithScaling.ts");
const md5 = __webpack_require__(/*! md5 */ "./node_modules/md5/md5.js");
saveTranslatedImageFeature_1.initSaveTranslatedImageContextMenu();
saveAllTranslatedImageFeature_1.initSaveAllTranslatedImageContextMenu();
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    handleMessages(message, sender).then(sendResponse);
    return true;
});
const outgoingTranslationRequests = new Set();
function handleMessages(message, sender) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!message) {
            api_1.debug(`Message must not be empty.\n sender:\n ${JSON.stringify(sender)}`);
            return;
        }
        switch (message.kind) {
            case 'translateImage':
                const translateErrorMessage = validateImageMessage(message);
                if (translateErrorMessage) {
                    api_1.debug(`${translateErrorMessage}\n message:\n ${JSON.stringify(message)}`);
                    return;
                }
                const imageIdentity = md5(message.image.src);
                // Already translating the image.
                if (outgoingTranslationRequests.has(imageIdentity)) {
                    return 'FullQueue';
                }
                if (outgoingTranslationRequests.size >= 4) {
                    return 'FullQueue';
                }
                try {
                    outgoingTranslationRequests.add(imageIdentity);
                    const translation = yield translateWithScaling_1.translate(message.image, message.includeBase64Data);
                    return translation;
                }
                finally {
                    outgoingTranslationRequests.delete(imageIdentity);
                }
            case 'translateSnapshot':
                const snapshotErrorMessage = validateSnapshotMessage(message);
                if (snapshotErrorMessage) {
                    api_1.debug(`${snapshotErrorMessage}\n message:\n ${JSON.stringify(message)}`);
                    return;
                }
                const snapshot = yield takeSnapshot(message.dimensions, sender.tab);
                if (!snapshot) {
                    return;
                }
                const snapshotTranslation = yield translateWithScaling_1.translate({
                    src: snapshot.dataUrl,
                    width: message.dimensions.width,
                    height: message.dimensions.height
                });
                // Possibly free up memory. May not have any impact at all, but (probably) doesn't hurt.
                delete snapshot.dataUrl;
                return {
                    translations: snapshotTranslation.translations,
                    zoomFactor: snapshot.zoomFactor
                };
            case 'setExtensionIcon':
                yield doSetExtensionIcon();
                return;
            case 'openLoginPopup':
                const currentTab = yield async_1.getCurrentTab();
                chrome.windows.create({
                    focused: true,
                    width: 376,
                    height: 440,
                    type: 'popup',
                    url: `loginPopup.html?refreshOnCompleteTabId=${currentTab.id}`,
                    top: 0,
                    left: 0
                }, () => { });
                return;
            default:
                api_1.debug(`Unsupported message kind.\n sender:\n ${JSON.stringify(sender)}\n Received message: \n ${JSON.stringify(message)}`);
        }
    });
}
// Returns an error message string on error.
// undefined means there are no errors.
function validateImageMessage(message) {
    let errorMessage = '';
    const image = message.image;
    if (!image) {
        return 'translateImage message must set image.';
    }
    if (!image.src) {
        errorMessage += 'translateImage message must set image.src\n';
    }
    if (!image.height) {
        errorMessage += 'translateImage message must set image.height\n';
    }
    if (!image.width) {
        errorMessage += 'translateImage message must set image.width\n';
    }
    return errorMessage === '' ? undefined : errorMessage;
}
// Returns an error message string on error.
// undefined means there are no errors.
function validateSnapshotMessage(message) {
    let errorMessage = '';
    if (message.dimensions == null) {
        errorMessage += 'Must supply dimensions of top, left, width, and height.\n';
    }
    else {
        const dimensions = message.dimensions;
        if (!Number.isInteger(dimensions.top)) {
            errorMessage += 'top must be an integer.';
        }
        if (!Number.isInteger(dimensions.left)) {
            errorMessage += 'left must be an integer.';
        }
        if (!Number.isInteger(dimensions.width)) {
            errorMessage += 'width must be an integer.';
        }
        if (!Number.isInteger(dimensions.height)) {
            errorMessage += 'height must be an integer.';
        }
    }
    return errorMessage === '' ? undefined : errorMessage;
}
function doSetExtensionIcon() {
    return __awaiter(this, void 0, void 0, function* () {
        // Calculate if Ichigo Reader is active on the current tab.
        const activeTab = yield async_1.getCurrentTab();
        const activeUrls = yield storage_1.appConfig.getActiveUrls();
        if (activeTab && activeUrls.includes(activeTab.getHostName())) {
            yield async_1.setExtensionIcon({
                path: chrome.runtime.getURL('icons/128x128.png'),
                tabId: activeTab.id
            });
        }
    });
}
function takeSnapshot({ top, left, height, width }, tab) {
    return __awaiter(this, void 0, void 0, function* () {
        if (tab == null) {
            return;
        }
        const dataUrl = yield async_1.captureVisibleTab(tab.windowId);
        // Something went wrong. Possibly closed tab or refreshed.
        if (!dataUrl) {
            return;
        }
        const zoomFactor = yield async_1.getZoomFactor(tab.id);
        const dataUrlFetch = yield fetch(dataUrl);
        const visibleTabBlob = yield dataUrlFetch.blob();
        const canvas = new OffscreenCanvas(width, height);
        const context = canvas.getContext('bitmaprenderer');
        const bitmap = yield createImageBitmap(visibleTabBlob, zoomFactor * left, zoomFactor * top, zoomFactor * width, zoomFactor * height);
        context.transferFromImageBitmap(bitmap);
        const snippetBlob = yield canvas.convertToBlob();
        // WebP is faster than PNG and still lossless.
        return {
            dataUrl: yield blobToBase64(snippetBlob),
            zoomFactor
        };
    });
}
function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}


/***/ }),

/***/ "./src/app/saveTranslatedImage/saveAllTranslatedImageFeature.ts":
/*!**********************************************************************!*\
  !*** ./src/app/saveTranslatedImage/saveAllTranslatedImageFeature.ts ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.initSaveAllTranslatedImageContextMenu = void 0;
const async_1 = __webpack_require__(/*! ../../chrome/async */ "./src/chrome/async.ts");
const saveTranslatedImageMenuId = 'ichigo-reader-save-all-translated';
// Contains all code necessary to setup and execute the "Save All Translated Images" right click context menu.
function initSaveAllTranslatedImageContextMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        // Clear previous context menu to prevent "duplicate context menu" error.
        yield removeContextMenu(saveTranslatedImageMenuId);
        chrome.contextMenus.create({
            id: saveTranslatedImageMenuId,
            title: 'Save All Translated Images',
            type: 'normal',
            contexts: ['all']
        });
        chrome.contextMenus.onClicked.addListener((context, currentTab) => __awaiter(this, void 0, void 0, function* () {
            if ((context === null || context === void 0 ? void 0 : context.menuItemId) !== saveTranslatedImageMenuId) {
                return;
            }
            const allFrames = false;
            yield async_1.executeScript(currentTab.id, 'js/saveAllTranslatedImageContent.js', allFrames);
        }));
    });
}
exports.initSaveAllTranslatedImageContextMenu = initSaveAllTranslatedImageContextMenu;
function removeContextMenu(menuId) {
    return new Promise(resolve => {
        chrome.contextMenus.remove(menuId, () => {
            if (chrome.runtime.lastError) {
                // Do nothing if an error occurs. Can happen if menu item doesn't exist.
            }
            resolve(undefined);
        });
    });
}


/***/ }),

/***/ "./src/app/saveTranslatedImage/saveTranslatedImageFeature.ts":
/*!*******************************************************************!*\
  !*** ./src/app/saveTranslatedImage/saveTranslatedImageFeature.ts ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.initSaveTranslatedImageContextMenu = void 0;
const async_1 = __webpack_require__(/*! ../../chrome/async */ "./src/chrome/async.ts");
const saveTranslatedImageMenuId = 'ichigo-reader-save-translated';
// Contains all code necessary to setup and execute the "Save Translated Image" right click context menu.
function initSaveTranslatedImageContextMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        // Clear previous context menu to prevent "duplicate context menu" error.
        yield removeContextMenu(saveTranslatedImageMenuId);
        chrome.contextMenus.create({
            id: saveTranslatedImageMenuId,
            title: 'Save Translated Image',
            type: 'normal',
            contexts: ['image']
        });
        chrome.contextMenus.onClicked.addListener((image, currentTab) => __awaiter(this, void 0, void 0, function* () {
            if ((image === null || image === void 0 ? void 0 : image.menuItemId) !== saveTranslatedImageMenuId) {
                return;
            }
            const allFrames = false;
            if ((image === null || image === void 0 ? void 0 : image.mediaType) != 'image') {
                if (currentTab.id) {
                    yield async_1.executeScript(currentTab.id, 'js/errorDownloadingMessage.js', allFrames);
                    chrome.tabs.sendMessage(currentTab.id, 'Image is missing necessary download data.');
                }
                return;
            }
            if (!image.srcUrl) {
                if (currentTab.id) {
                    yield async_1.executeScript(currentTab.id, 'js/errorDownloadingMessage.js', allFrames);
                    chrome.tabs.sendMessage(currentTab.id, 'Image is missing necessary download data.');
                }
                return;
            }
            // Toggle on download spinner.
            if (currentTab.id)
                yield async_1.executeScript(currentTab.id, 'js/toggleDownloadLoadingSpinner.js', allFrames);
            const result = yield getBase64Data(image.srcUrl);
            if (result === 'FetchError') {
                yield async_1.executeScript(currentTab.id, 'js/errorDownloadingMessage.js', allFrames);
                chrome.tabs.sendMessage(currentTab.id, 'This site has blocked extensions.');
                yield async_1.executeScript(currentTab.id, 'js/toggleDownloadLoadingSpinner.js', allFrames);
                return;
            }
            if (result === 'UnsupportedImage') {
                yield async_1.executeScript(currentTab.id, 'js/errorDownloadingMessage.js', allFrames);
                chrome.tabs.sendMessage(currentTab.id, 'This image kind is unsupported.');
                yield async_1.executeScript(currentTab.id, 'js/toggleDownloadLoadingSpinner.js', allFrames);
                return;
            }
            const filename = image.srcUrl.split('/').pop();
            yield async_1.executeScript(currentTab.id, 'js/saveTranslatedImageContent.js', allFrames);
            chrome.tabs.sendMessage(currentTab.id, {
                base64Data: result.base64Data,
                width: result.width,
                height: result.height,
                filename
            }, () => __awaiter(this, void 0, void 0, function* () {
                // Toggle off download spinner.
                if (currentTab.id)
                    yield async_1.executeScript(currentTab.id, 'js/toggleDownloadLoadingSpinner.js', allFrames);
            }));
        }));
    });
}
exports.initSaveTranslatedImageContextMenu = initSaveTranslatedImageContextMenu;
function removeContextMenu(menuId) {
    return new Promise(resolve => {
        chrome.contextMenus.remove(menuId, () => {
            if (chrome.runtime.lastError) {
                // Do nothing if an error occurs. Can happen if menu item doesn't exist.
            }
            resolve(undefined);
        });
    });
}
/*
 * All code below this line was copied from `imageUtils.ts`,
 * but edited to fit the contextual needs of the save translated image feature.
 */
function getBase64Data(imageSrc) {
    return __awaiter(this, void 0, void 0, function* () {
        const imageData = yield fetch(imageSrc);
        if (!validStatusCode(imageData.status)) {
            return 'FetchError';
        }
        const blob = yield imageData.blob();
        if (!validImageType(blob.type)) {
            return 'UnsupportedImage';
        }
        const bitmap = yield createImageBitmap(blob);
        const base64Data = yield blobToBase64(blob);
        return { base64Data, width: bitmap.width, height: bitmap.height };
    });
}
function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}
function validStatusCode(statusCode) {
    // See: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
    return statusCode >= 200 && statusCode < 400;
}
function validImageType(imageType) {
    // TODO: Maybe try and add binary blob mime types and other things?
    const validMimeTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
    return validMimeTypes.includes(imageType);
}


/***/ }),

/***/ "./src/app/translateWithScaling.ts":
/*!*****************************************!*\
  !*** ./src/app/translateWithScaling.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.translate = void 0;
const api_1 = __webpack_require__(/*! ../api */ "./src/api/index.ts");
const imageUtils_1 = __webpack_require__(/*! ./utils/imageUtils */ "./src/app/utils/imageUtils.ts");
const translation_1 = __webpack_require__(/*! ../translation */ "./src/translation/index.ts");
// Note this can only be called from contexts which can make HTTP requests.
// For example, `background.ts`.
function translate(image, includeBase64Data) {
    return __awaiter(this, void 0, void 0, function* () {
        const encodedImage = yield getScaledBase64Data(image);
        if (isFailure(encodedImage)) {
            return encodedImage;
        }
        const result = yield api_1.translateImage(encodedImage.base64Data);
        const base64Data = includeBase64Data && encodedImage.base64Data;
        // Possibly free up memory. May not have any impact at all, but (probably) doesn't hurt.
        delete encodedImage.base64Data;
        return {
            image: { width: encodedImage.width, height: encodedImage.height },
            translations: result.translations,
            base64Data
        };
    });
}
exports.translate = translate;
function getScaledBase64Data(image) {
    return __awaiter(this, void 0, void 0, function* () {
        // Downscale extra large images. Helps prevent processing timeouts.
        const [resizedWidth, resizedHeight] = translation_1.calculateResizedAspectRatio({
            width: image.width,
            height: image.height,
            heightMaxPx: 1800,
            widthMaxPx: 1800
        });
        api_1.debug(`h:${resizedHeight} w:${resizedWidth}`);
        const resizedImage = Object.assign(Object.assign({}, image), { originalWidth: image.width, originalHeight: image.height, resizedWidth,
            resizedHeight });
        const encodedImage = yield imageUtils_1.getBase64Data(resizedImage);
        return encodedImage;
    });
}
function isFailure(result) {
    return result === 'FetchError' || result === 'UnsupportedImage' || result === 'SiteAccessError';
}


/***/ }),

/***/ "./src/app/utils/imageUtils.ts":
/*!*************************************!*\
  !*** ./src/app/utils/imageUtils.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getBase64Data = void 0;
const api_1 = __webpack_require__(/*! ../../api */ "./src/api/index.ts");
const utils_1 = __webpack_require__(/*! ./utils */ "./src/app/utils/utils.ts");
function getBase64Data({ src, resizedWidth, resizedHeight, originalHeight, originalWidth }) {
    return __awaiter(this, void 0, void 0, function* () {
        let imageData;
        try {
            imageData = yield utils_1.getImage(src);
        }
        catch (error) {
            // This can happen if the users sets Ichigo Reader's "Site Access" to "On click",
            // instead of "On all sites", due to CORS. It can also happen if referer is not properly set, on some domains.
            yield api_1.logFailedTranslateUrl(src.substring(0, 180));
            return 'SiteAccessError';
        }
        if (!validStatusCode(imageData.status)) {
            yield api_1.logFailedTranslateUrl(src.substring(0, 180));
            return 'FetchError';
        }
        const blob = yield imageData.blob();
        if (!validImageType(blob.type)) {
            return 'UnsupportedImage';
        }
        const shouldResize = resizedWidth != originalWidth || resizedHeight != originalHeight;
        if (shouldResize) {
            api_1.debug(`resized: ${resizedWidth}/${originalWidth} : ${resizedHeight}/${originalHeight}`);
            const canvas = new OffscreenCanvas(resizedWidth, resizedHeight);
            const context = canvas.getContext('bitmaprenderer');
            const bitmap = yield createImageBitmap(blob, {
                resizeWidth: resizedWidth,
                resizeHeight: resizedHeight,
                resizeQuality: 'high'
            });
            context.transferFromImageBitmap(bitmap);
            const resizedBlob = yield canvas.convertToBlob();
            const base64Data = yield blobToBase64(resizedBlob);
            return { base64Data, width: resizedWidth, height: resizedHeight };
        }
        else {
            const base64Data = yield blobToBase64(blob);
            return { base64Data, width: originalWidth, height: originalHeight };
        }
    });
}
exports.getBase64Data = getBase64Data;
function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}
function validStatusCode(statusCode) {
    // See: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
    return statusCode >= 200 && statusCode < 400;
}
function validImageType(imageType) {
    // TODO: Maybe try and add binary blob mime types and other things?
    const validMimeTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
    return validMimeTypes.includes(imageType);
}


/***/ }),

/***/ "./src/app/utils/utils.ts":
/*!********************************!*\
  !*** ./src/app/utils/utils.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getImage = exports.sleepMs = void 0;
const async_1 = __webpack_require__(/*! ../../chrome/async */ "./src/chrome/async.ts");
// A set of common functions that aren't worth grouping alone.
// Break module into multiple modules when it grows too large (800+ LOC).
function sleepMs(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
exports.sleepMs = sleepMs;
const ModifyHeaders = 'modifyHeaders';
const SetHeader = 'set';
const Request = 'xmlhttprequest';
let id = 1;
function getId() {
    return id++;
}
function getImage(src) {
    return __awaiter(this, void 0, void 0, function* () {
        let hostname;
        try {
            hostname = new URL(src).hostname;
        }
        catch (_a) {
            hostname = '';
        }
        // Check if hostname matches any of the referer header rule ids.
        const ruleValues = Object.values(rules);
        for (const rule of ruleValues) {
            if (hostname.includes(rule.condition.urlFilter)) {
                const clonedRule = Object.assign(Object.assign({}, rule), { id: getId() });
                async_1.updateSessionHeaders({ addRules: [clonedRule] });
                const result = yield fetch(src);
                async_1.updateSessionHeaders({ removeRuleIds: [clonedRule.id] });
                return result;
            }
        }
        // Otherwise, return regular fetch request.
        return yield fetch(src);
    });
}
exports.getImage = getImage;
const rules = {
    pixiv: {
        id: getId(),
        priority: 1,
        action: {
            type: ModifyHeaders,
            requestHeaders: [
                { header: 'referer', operation: SetHeader, value: 'https://www.pixiv.net/' }
            ]
        },
        condition: {
            urlFilter: 'pximg.net',
            resourceTypes: [Request]
        }
    },
    manhuagui: {
        id: getId(),
        priority: 1,
        action: {
            type: ModifyHeaders,
            requestHeaders: [
                {
                    header: 'referer',
                    operation: SetHeader,
                    value: 'https://www.manhuagui.com/'
                }
            ]
        },
        condition: {
            urlFilter: 'i.hamreus.com',
            resourceTypes: [Request]
        }
    },
    hitomi: {
        id: getId(),
        priority: 1,
        action: {
            type: ModifyHeaders,
            requestHeaders: [
                {
                    header: 'referer',
                    operation: SetHeader,
                    value: 'https://hitomi.la/'
                }
            ]
        },
        condition: {
            urlFilter: 'hitomi.la',
            resourceTypes: [Request]
        }
    },
    klmanga: {
        id: getId(),
        priority: 1,
        action: {
            type: ModifyHeaders,
            requestHeaders: [
                {
                    header: 'referer',
                    operation: SetHeader,
                    value: 'https://klmanga.com/'
                }
            ]
        },
        condition: {
            urlFilter: 'klimv1.xyz',
            resourceTypes: [Request]
        }
    }
};


/***/ }),

/***/ "./src/chrome/async.ts":
/*!*****************************!*\
  !*** ./src/chrome/async.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setStorageItem = exports.getStorageItem = exports.postBackgroundMessage = exports.isAllowedFileSchemeAccess = exports.executeScript = exports.setExtensionIcon = exports.getZoomFactor = exports.captureVisibleTab = exports.updateSessionHeaders = exports.getCurrentTab = void 0;
// Module for making working with the Chrome API easier.
// This may include making the API async, simplifying the interface, or more.
function getCurrentTab() {
    return new Promise(resolve => {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            if (chrome.runtime.lastError) {
                resolve(undefined);
                return;
            }
            const currentTab = tabs[0];
            if (!(currentTab === null || currentTab === void 0 ? void 0 : currentTab.url)) {
                resolve(undefined);
                return;
            }
            currentTab.getHostName = () => {
                try {
                    return new URL(currentTab.url).hostname;
                }
                catch (_a) {
                    return '';
                }
            };
            resolve(currentTab);
        });
    });
}
exports.getCurrentTab = getCurrentTab;
function updateSessionHeaders(ruleOptions) {
    return new Promise(resolve => {
        chrome.declarativeNetRequest.updateSessionRules(ruleOptions, resolve);
    });
}
exports.updateSessionHeaders = updateSessionHeaders;
// Window ID of tab to capture, eg getCurrentTab().windowId;
function captureVisibleTab(windowId) {
    return new Promise(resolve => chrome.tabs.captureVisibleTab(windowId, { format: 'png' }, resolve));
}
exports.captureVisibleTab = captureVisibleTab;
function getZoomFactor(tabId) {
    return new Promise(resolve => chrome.tabs.getZoom(tabId, resolve));
}
exports.getZoomFactor = getZoomFactor;
function setExtensionIcon(icon) {
    return new Promise(resolve => {
        chrome.action.setIcon(icon, () => {
            resolve(true);
        });
    });
}
exports.setExtensionIcon = setExtensionIcon;
function executeScript(tabId, filePath, allFrames) {
    return new Promise(resolve => {
        chrome.scripting.executeScript({ target: { tabId, allFrames: allFrames !== null && allFrames !== void 0 ? allFrames : true }, files: [filePath] }, () => {
            resolve(true);
        });
    });
}
exports.executeScript = executeScript;
function isAllowedFileSchemeAccess() {
    return new Promise(resolve => {
        chrome.extension.isAllowedFileSchemeAccess(resolve);
    });
}
exports.isAllowedFileSchemeAccess = isAllowedFileSchemeAccess;
function postBackgroundMessage(
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
message) {
    const extensionId = undefined; // undefined means send to self, instead of another extension.
    const options = undefined;
    return new Promise(resolve => {
        chrome.runtime.sendMessage(extensionId, message, options, resolve);
    });
}
exports.postBackgroundMessage = postBackgroundMessage;
function getStorageItem(key) {
    const formattedKey = formatKey(key);
    return new Promise(resolve => {
        try {
            chrome.storage.local.get([formattedKey], function (result) {
                resolve(result[formattedKey]);
            });
        }
        catch (_a) {
            // Do nothing if cache fails.
            resolve(undefined);
        }
    });
}
exports.getStorageItem = getStorageItem;
function setStorageItem(key, value) {
    const formattedKey = formatKey(key);
    return new Promise(resolve => {
        try {
            chrome.storage.local.set({ [formattedKey]: value }, () => {
                resolve(true);
            });
        }
        catch (_a) {
            // Do nothing if cache fails.
            resolve(false);
        }
    });
}
exports.setStorageItem = setStorageItem;
function formatKey(key) {
    const keyPrefix = 'app';
    return `${keyPrefix}-${key}`;
}


/***/ }),

/***/ "./src/storage/appConfig.ts":
/*!**********************************!*\
  !*** ./src/storage/appConfig.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.appConfig = exports.defaults = void 0;
const async_1 = __webpack_require__(/*! ../chrome/async */ "./src/chrome/async.ts");
const uuid_1 = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/index.js");
var Keys;
(function (Keys) {
    Keys["Email"] = "email";
    Keys["FontFamily"] = "fontFamily";
    Keys["FontColor"] = "fontColor";
    Keys["FontWeight"] = "fontWeight";
    Keys["ActiveUrls"] = "activeUrls";
    Keys["ClientUuid"] = "clientUuid";
})(Keys || (Keys = {}));
exports.defaults = Object.freeze({
    email: '',
    fontFamily: 'CC Wild Words',
    fontColor: '#000000',
    fontWeight: 'initial'
});
// Used to check if any of the activeUrl appConfig properties have been accessed.
// This is so defaults can be initialized.
// This cannot be done in chrome.runtime.onInstalled due to that event being triggered on chrome updates,
// and on app updates.
const hasInitActiveUrlDefaults = '_isActiveUrlInitKey';
const commonMangaSites = [];
exports.appConfig = Object.freeze({
    getClientUuid: () => __awaiter(void 0, void 0, void 0, function* () {
        const clientUuid = yield async_1.getStorageItem(Keys.ClientUuid);
        if (clientUuid) {
            return clientUuid;
        }
        // Initialize client uuid.
        // If storage is full, this could fail repeatedly, but client uuids are not crucial.
        const newUuid = uuid_1.v4();
        yield async_1.setStorageItem(Keys.ClientUuid, newUuid);
        return newUuid;
    }),
    getEmail: () => __awaiter(void 0, void 0, void 0, function* () { var _a; return (_a = (yield async_1.getStorageItem(Keys.Email))) !== null && _a !== void 0 ? _a : exports.defaults.email; }),
    setEmail: (email) => __awaiter(void 0, void 0, void 0, function* () { return yield async_1.setStorageItem(Keys.Email, email); }),
    getFontFamily: () => __awaiter(void 0, void 0, void 0, function* () { var _b; return (_b = (yield async_1.getStorageItem(Keys.FontFamily))) !== null && _b !== void 0 ? _b : exports.defaults.fontFamily; }),
    setFontFamily: (fontFamily) => __awaiter(void 0, void 0, void 0, function* () { return yield async_1.setStorageItem(Keys.FontFamily, fontFamily); }),
    getFontColor: () => __awaiter(void 0, void 0, void 0, function* () { var _c; return (_c = (yield async_1.getStorageItem(Keys.FontColor))) !== null && _c !== void 0 ? _c : exports.defaults.fontColor; }),
    setFontColor: (fontColor) => __awaiter(void 0, void 0, void 0, function* () { return yield async_1.setStorageItem(Keys.FontColor, fontColor); }),
    getFontWeight: () => __awaiter(void 0, void 0, void 0, function* () { var _d; return (_d = (yield async_1.getStorageItem(Keys.FontWeight))) !== null && _d !== void 0 ? _d : exports.defaults.fontWeight; }),
    setFontWeight: (fontWeight) => __awaiter(void 0, void 0, void 0, function* () { return yield async_1.setStorageItem(Keys.FontWeight, fontWeight); }),
    getActiveUrls: () => __awaiter(void 0, void 0, void 0, function* () {
        var _e;
        const hasInitDefaults = yield async_1.getStorageItem(hasInitActiveUrlDefaults);
        if (!hasInitDefaults) {
            yield async_1.setStorageItem(Keys.ActiveUrls, commonMangaSites);
            yield async_1.setStorageItem(hasInitActiveUrlDefaults, true);
        }
        return (_e = (yield async_1.getStorageItem(Keys.ActiveUrls))) !== null && _e !== void 0 ? _e : [];
    }),
    addActiveUrl: (activeUrl) => __awaiter(void 0, void 0, void 0, function* () {
        var _f;
        const hasInitDefaults = yield async_1.getStorageItem(hasInitActiveUrlDefaults);
        if (!hasInitDefaults) {
            yield async_1.setStorageItem(Keys.ActiveUrls, commonMangaSites);
            yield async_1.setStorageItem(hasInitActiveUrlDefaults, true);
        }
        const activeUrls = (_f = (yield async_1.getStorageItem(Keys.ActiveUrls))) !== null && _f !== void 0 ? _f : [];
        return yield async_1.setStorageItem(Keys.ActiveUrls, [...activeUrls, activeUrl]);
    }),
    removeActiveUrl: (activeUrl) => __awaiter(void 0, void 0, void 0, function* () {
        var _g;
        const hasInitDefaults = yield async_1.getStorageItem(hasInitActiveUrlDefaults);
        if (!hasInitDefaults) {
            yield async_1.setStorageItem(Keys.ActiveUrls, commonMangaSites);
            yield async_1.setStorageItem(hasInitActiveUrlDefaults, true);
        }
        const activeUrls = (_g = (yield async_1.getStorageItem(Keys.ActiveUrls))) !== null && _g !== void 0 ? _g : [];
        return yield async_1.setStorageItem(Keys.ActiveUrls, activeUrls.filter(url => url !== activeUrl));
    })
});


/***/ }),

/***/ "./src/storage/index.ts":
/*!******************************!*\
  !*** ./src/storage/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var appConfig_1 = __webpack_require__(/*! ./appConfig */ "./src/storage/appConfig.ts");
Object.defineProperty(exports, "appConfig", ({ enumerable: true, get: function () { return appConfig_1.appConfig; } }));
Object.defineProperty(exports, "defaults", ({ enumerable: true, get: function () { return appConfig_1.defaults; } }));


/***/ }),

/***/ "./src/translation/index.ts":
/*!**********************************!*\
  !*** ./src/translation/index.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.calculateResizedAspectRatio = exports.scaleTranslation = void 0;
function scaleTranslation(targetWidth, targetHeight, originalWidth, originalHeight, result) {
    const scaleX = targetWidth / originalWidth;
    const scaleY = targetHeight / originalHeight;
    return {
        originalLanguage: result.originalLanguage,
        translatedText: result.translatedText,
        minX: Math.round(scaleX * result.minX),
        minY: Math.round(scaleY * result.minY),
        maxX: Math.round(scaleX * result.maxX),
        maxY: Math.round(scaleY * result.maxY),
        background: result.background
    };
}
exports.scaleTranslation = scaleTranslation;
function calculateResizedAspectRatio(params) {
    const { width, height, widthMaxPx, heightMaxPx } = params;
    // `alreadyWithinBounds` intentionally uses `||` instead of `&&`,
    // so that images slightly over bounds are likely not touched.
    // Although experimenting with `&&` instead of `|| may be viable.
    const alreadyWithinBounds = width <= widthMaxPx || height <= heightMaxPx;
    if (alreadyWithinBounds) {
        return [width, height];
    }
    // `Math.max` (vs `Math.min`) is intentionally used to favor larger images.
    const resizedAspectRatio = Math.max(heightMaxPx / height, widthMaxPx / width);
    return [Math.round(width * resizedAspectRatio), Math.round(height * resizedAspectRatio)];
}
exports.calculateResizedAspectRatio = calculateResizedAspectRatio;


/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NIL": () => (/* reexport safe */ _nil_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   "parse": () => (/* reexport safe */ _parse_js__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   "stringify": () => (/* reexport safe */ _stringify_js__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   "v1": () => (/* reexport safe */ _v1_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "v3": () => (/* reexport safe */ _v3_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "v4": () => (/* reexport safe */ _v4_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "v5": () => (/* reexport safe */ _v5_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "validate": () => (/* reexport safe */ _validate_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   "version": () => (/* reexport safe */ _version_js__WEBPACK_IMPORTED_MODULE_5__["default"])
/* harmony export */ });
/* harmony import */ var _v1_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./v1.js */ "./node_modules/uuid/dist/esm-browser/v1.js");
/* harmony import */ var _v3_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./v3.js */ "./node_modules/uuid/dist/esm-browser/v3.js");
/* harmony import */ var _v4_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./v4.js */ "./node_modules/uuid/dist/esm-browser/v4.js");
/* harmony import */ var _v5_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./v5.js */ "./node_modules/uuid/dist/esm-browser/v5.js");
/* harmony import */ var _nil_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./nil.js */ "./node_modules/uuid/dist/esm-browser/nil.js");
/* harmony import */ var _version_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./version.js */ "./node_modules/uuid/dist/esm-browser/version.js");
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./parse.js */ "./node_modules/uuid/dist/esm-browser/parse.js");










/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/md5.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/md5.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*
 * Browser-compatible JavaScript MD5
 *
 * Modification of JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
function md5(bytes) {
  if (typeof bytes === 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Uint8Array(msg.length);

    for (var i = 0; i < msg.length; ++i) {
      bytes[i] = msg.charCodeAt(i);
    }
  }

  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
/*
 * Convert an array of little-endian words to an array of bytes
 */


function md5ToHexEncodedArray(input) {
  var output = [];
  var length32 = input.length * 32;
  var hexTab = '0123456789abcdef';

  for (var i = 0; i < length32; i += 8) {
    var x = input[i >> 5] >>> i % 32 & 0xff;
    var hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
    output.push(hex);
  }

  return output;
}
/**
 * Calculate output length with padding and bit length
 */


function getOutputLength(inputLength8) {
  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */


function wordsToMd5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[getOutputLength(len) - 1] = len;
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;

  for (var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  return [a, b, c, d];
}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */


function bytesToWords(input) {
  if (input.length === 0) {
    return [];
  }

  var length8 = input.length * 8;
  var output = new Uint32Array(getOutputLength(length8));

  for (var i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
  }

  return output;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */


function safeAdd(x, y) {
  var lsw = (x & 0xffff) + (y & 0xffff);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xffff;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */


function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */


function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}

function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}

function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (md5);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/nil.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/nil.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('00000000-0000-0000-0000-000000000000');

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/parse.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/parse.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");


function parse(uuid) {
  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Invalid UUID');
  }

  var v;
  var arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (parse);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/regex.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/regex.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/rng.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/rng.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/sha1.js":
/*!****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/sha1.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
function f(s, x, y, z) {
  switch (s) {
    case 0:
      return x & y ^ ~x & z;

    case 1:
      return x ^ y ^ z;

    case 2:
      return x & y ^ x & z ^ y & z;

    case 3:
      return x ^ y ^ z;
  }
}

function ROTL(x, n) {
  return x << n | x >>> 32 - n;
}

function sha1(bytes) {
  var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  var H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

  if (typeof bytes === 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = [];

    for (var i = 0; i < msg.length; ++i) {
      bytes.push(msg.charCodeAt(i));
    }
  } else if (!Array.isArray(bytes)) {
    // Convert Array-like to Array
    bytes = Array.prototype.slice.call(bytes);
  }

  bytes.push(0x80);
  var l = bytes.length / 4 + 2;
  var N = Math.ceil(l / 16);
  var M = new Array(N);

  for (var _i = 0; _i < N; ++_i) {
    var arr = new Uint32Array(16);

    for (var j = 0; j < 16; ++j) {
      arr[j] = bytes[_i * 64 + j * 4] << 24 | bytes[_i * 64 + j * 4 + 1] << 16 | bytes[_i * 64 + j * 4 + 2] << 8 | bytes[_i * 64 + j * 4 + 3];
    }

    M[_i] = arr;
  }

  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

  for (var _i2 = 0; _i2 < N; ++_i2) {
    var W = new Uint32Array(80);

    for (var t = 0; t < 16; ++t) {
      W[t] = M[_i2][t];
    }

    for (var _t = 16; _t < 80; ++_t) {
      W[_t] = ROTL(W[_t - 3] ^ W[_t - 8] ^ W[_t - 14] ^ W[_t - 16], 1);
    }

    var a = H[0];
    var b = H[1];
    var c = H[2];
    var d = H[3];
    var e = H[4];

    for (var _t2 = 0; _t2 < 80; ++_t2) {
      var s = Math.floor(_t2 / 20);
      var T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[_t2] >>> 0;
      e = d;
      d = c;
      c = ROTL(b, 30) >>> 0;
      b = a;
      a = T;
    }

    H[0] = H[0] + a >>> 0;
    H[1] = H[1] + b >>> 0;
    H[2] = H[2] + c >>> 0;
    H[3] = H[3] + d >>> 0;
    H[4] = H[4] + e >>> 0;
  }

  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sha1);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/stringify.js":
/*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/stringify.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v1.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v1.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");

 // **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;

var _clockseq; // Previous uuid creation time


var _lastMSecs = 0;
var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || new Array(16);
  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    var seedBytes = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  var msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__["default"])(b);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v1);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v3.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v3.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _v35_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./v35.js */ "./node_modules/uuid/dist/esm-browser/v35.js");
/* harmony import */ var _md5_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./md5.js */ "./node_modules/uuid/dist/esm-browser/md5.js");


var v3 = (0,_v35_js__WEBPACK_IMPORTED_MODULE_0__["default"])('v3', 0x30, _md5_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v3);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v35.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v35.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DNS": () => (/* binding */ DNS),
/* harmony export */   "URL": () => (/* binding */ URL),
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parse.js */ "./node_modules/uuid/dist/esm-browser/parse.js");



function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  var bytes = [];

  for (var i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

var DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
var URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0,_parse_js__WEBPACK_IMPORTED_MODULE_0__["default"])(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    var bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (var i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__["default"])(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v4.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v4.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__["default"])(rnds);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v5.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v5.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _v35_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./v35.js */ "./node_modules/uuid/dist/esm-browser/v35.js");
/* harmony import */ var _sha1_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sha1.js */ "./node_modules/uuid/dist/esm-browser/sha1.js");


var v5 = (0,_v35_js__WEBPACK_IMPORTED_MODULE_0__["default"])('v5', 0x50, _sha1_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v5);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/validate.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/validate.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ "./node_modules/uuid/dist/esm-browser/regex.js");


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__["default"].test(uuid);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/version.js":
/*!*******************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/version.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");


function version(uuid) {
  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (version);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/app/background.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7Ozs7Ozs7O0FDTmM7O0FBRXJDO0FBQ0EsT0FBTyx3REFBUTtBQUNmO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpRUFBZSxPQUFPOzs7Ozs7VUNWdEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9pY2hpZ28tcmVhZGVyLy4vbm9kZV9tb2R1bGVzL2NoYXJlbmMvY2hhcmVuYy5qcyIsIndlYnBhY2s6Ly9pY2hpZ28tcmVhZGVyLy4vbm9kZV9tb2R1bGVzL2NyeXB0L2NyeXB0LmpzIiwid2VicGFjazovL2ljaGlnby1yZWFkZXIvLi9ub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwid2VicGFjazovL2ljaGlnby1yZWFkZXIvLi9ub2RlX21vZHVsZXMvbWQ1L21kNS5qcyIsIndlYnBhY2s6Ly9pY2hpZ28tcmVhZGVyLy4vc3JjL2FwaS9pbmRleC50cyIsIndlYnBhY2s6Ly9pY2hpZ28tcmVhZGVyLy4vc3JjL2FwcC9iYWNrZ3JvdW5kLnRzIiwid2VicGFjazovL2ljaGlnby1yZWFkZXIvLi9zcmMvYXBwL3NhdmVUcmFuc2xhdGVkSW1hZ2Uvc2F2ZUFsbFRyYW5zbGF0ZWRJbWFnZUZlYXR1cmUudHMiLCJ3ZWJwYWNrOi8vaWNoaWdvLXJlYWRlci8uL3NyYy9hcHAvc2F2ZVRyYW5zbGF0ZWRJbWFnZS9zYXZlVHJhbnNsYXRlZEltYWdlRmVhdHVyZS50cyIsIndlYnBhY2s6Ly9pY2hpZ28tcmVhZGVyLy4vc3JjL2FwcC90cmFuc2xhdGVXaXRoU2NhbGluZy50cyIsIndlYnBhY2s6Ly9pY2hpZ28tcmVhZGVyLy4vc3JjL2FwcC91dGlscy9pbWFnZVV0aWxzLnRzIiwid2VicGFjazovL2ljaGlnby1yZWFkZXIvLi9zcmMvYXBwL3V0aWxzL3V0aWxzLnRzIiwid2VicGFjazovL2ljaGlnby1yZWFkZXIvLi9zcmMvY2hyb21lL2FzeW5jLnRzIiwid2VicGFjazovL2ljaGlnby1yZWFkZXIvLi9zcmMvc3RvcmFnZS9hcHBDb25maWcudHMiLCJ3ZWJwYWNrOi8vaWNoaWdvLXJlYWRlci8uL3NyYy9zdG9yYWdlL2luZGV4LnRzIiwid2VicGFjazovL2ljaGlnby1yZWFkZXIvLi9zcmMvdHJhbnNsYXRpb24vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vaWNoaWdvLXJlYWRlci8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vaWNoaWdvLXJlYWRlci8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvbWQ1LmpzIiwid2VicGFjazovL2ljaGlnby1yZWFkZXIvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL25pbC5qcyIsIndlYnBhY2s6Ly9pY2hpZ28tcmVhZGVyLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9wYXJzZS5qcyIsIndlYnBhY2s6Ly9pY2hpZ28tcmVhZGVyLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9yZWdleC5qcyIsIndlYnBhY2s6Ly9pY2hpZ28tcmVhZGVyLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9ybmcuanMiLCJ3ZWJwYWNrOi8vaWNoaWdvLXJlYWRlci8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvc2hhMS5qcyIsIndlYnBhY2s6Ly9pY2hpZ28tcmVhZGVyLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9zdHJpbmdpZnkuanMiLCJ3ZWJwYWNrOi8vaWNoaWdvLXJlYWRlci8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvdjEuanMiLCJ3ZWJwYWNrOi8vaWNoaWdvLXJlYWRlci8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvdjMuanMiLCJ3ZWJwYWNrOi8vaWNoaWdvLXJlYWRlci8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvdjM1LmpzIiwid2VicGFjazovL2ljaGlnby1yZWFkZXIvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3Y0LmpzIiwid2VicGFjazovL2ljaGlnby1yZWFkZXIvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3Y1LmpzIiwid2VicGFjazovL2ljaGlnby1yZWFkZXIvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3ZhbGlkYXRlLmpzIiwid2VicGFjazovL2ljaGlnby1yZWFkZXIvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3ZlcnNpb24uanMiLCJ3ZWJwYWNrOi8vaWNoaWdvLXJlYWRlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9pY2hpZ28tcmVhZGVyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9pY2hpZ28tcmVhZGVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vaWNoaWdvLXJlYWRlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2ljaGlnby1yZWFkZXIvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9pY2hpZ28tcmVhZGVyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9pY2hpZ28tcmVhZGVyL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY2hhcmVuYyA9IHtcbiAgLy8gVVRGLTggZW5jb2RpbmdcbiAgdXRmODoge1xuICAgIC8vIENvbnZlcnQgYSBzdHJpbmcgdG8gYSBieXRlIGFycmF5XG4gICAgc3RyaW5nVG9CeXRlczogZnVuY3Rpb24oc3RyKSB7XG4gICAgICByZXR1cm4gY2hhcmVuYy5iaW4uc3RyaW5nVG9CeXRlcyh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoc3RyKSkpO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgYnl0ZSBhcnJheSB0byBhIHN0cmluZ1xuICAgIGJ5dGVzVG9TdHJpbmc6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGVzY2FwZShjaGFyZW5jLmJpbi5ieXRlc1RvU3RyaW5nKGJ5dGVzKSkpO1xuICAgIH1cbiAgfSxcblxuICAvLyBCaW5hcnkgZW5jb2RpbmdcbiAgYmluOiB7XG4gICAgLy8gQ29udmVydCBhIHN0cmluZyB0byBhIGJ5dGUgYXJyYXlcbiAgICBzdHJpbmdUb0J5dGVzOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgIGZvciAodmFyIGJ5dGVzID0gW10sIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKVxuICAgICAgICBieXRlcy5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRik7XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBieXRlIGFycmF5IHRvIGEgc3RyaW5nXG4gICAgYnl0ZXNUb1N0cmluZzogZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGZvciAodmFyIHN0ciA9IFtdLCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSsrKVxuICAgICAgICBzdHIucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldKSk7XG4gICAgICByZXR1cm4gc3RyLmpvaW4oJycpO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjaGFyZW5jO1xuIiwiKGZ1bmN0aW9uKCkge1xuICB2YXIgYmFzZTY0bWFwXG4gICAgICA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJyxcblxuICBjcnlwdCA9IHtcbiAgICAvLyBCaXQtd2lzZSByb3RhdGlvbiBsZWZ0XG4gICAgcm90bDogZnVuY3Rpb24obiwgYikge1xuICAgICAgcmV0dXJuIChuIDw8IGIpIHwgKG4gPj4+ICgzMiAtIGIpKTtcbiAgICB9LFxuXG4gICAgLy8gQml0LXdpc2Ugcm90YXRpb24gcmlnaHRcbiAgICByb3RyOiBmdW5jdGlvbihuLCBiKSB7XG4gICAgICByZXR1cm4gKG4gPDwgKDMyIC0gYikpIHwgKG4gPj4+IGIpO1xuICAgIH0sXG5cbiAgICAvLyBTd2FwIGJpZy1lbmRpYW4gdG8gbGl0dGxlLWVuZGlhbiBhbmQgdmljZSB2ZXJzYVxuICAgIGVuZGlhbjogZnVuY3Rpb24obikge1xuICAgICAgLy8gSWYgbnVtYmVyIGdpdmVuLCBzd2FwIGVuZGlhblxuICAgICAgaWYgKG4uY29uc3RydWN0b3IgPT0gTnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBjcnlwdC5yb3RsKG4sIDgpICYgMHgwMEZGMDBGRiB8IGNyeXB0LnJvdGwobiwgMjQpICYgMHhGRjAwRkYwMDtcbiAgICAgIH1cblxuICAgICAgLy8gRWxzZSwgYXNzdW1lIGFycmF5IGFuZCBzd2FwIGFsbCBpdGVtc1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuLmxlbmd0aDsgaSsrKVxuICAgICAgICBuW2ldID0gY3J5cHQuZW5kaWFuKG5baV0pO1xuICAgICAgcmV0dXJuIG47XG4gICAgfSxcblxuICAgIC8vIEdlbmVyYXRlIGFuIGFycmF5IG9mIGFueSBsZW5ndGggb2YgcmFuZG9tIGJ5dGVzXG4gICAgcmFuZG9tQnl0ZXM6IGZ1bmN0aW9uKG4pIHtcbiAgICAgIGZvciAodmFyIGJ5dGVzID0gW107IG4gPiAwOyBuLS0pXG4gICAgICAgIGJ5dGVzLnB1c2goTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KSk7XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBieXRlIGFycmF5IHRvIGJpZy1lbmRpYW4gMzItYml0IHdvcmRzXG4gICAgYnl0ZXNUb1dvcmRzOiBmdW5jdGlvbihieXRlcykge1xuICAgICAgZm9yICh2YXIgd29yZHMgPSBbXSwgaSA9IDAsIGIgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpKyssIGIgKz0gOClcbiAgICAgICAgd29yZHNbYiA+Pj4gNV0gfD0gYnl0ZXNbaV0gPDwgKDI0IC0gYiAlIDMyKTtcbiAgICAgIHJldHVybiB3b3JkcztcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBiaWctZW5kaWFuIDMyLWJpdCB3b3JkcyB0byBhIGJ5dGUgYXJyYXlcbiAgICB3b3Jkc1RvQnl0ZXM6IGZ1bmN0aW9uKHdvcmRzKSB7XG4gICAgICBmb3IgKHZhciBieXRlcyA9IFtdLCBiID0gMDsgYiA8IHdvcmRzLmxlbmd0aCAqIDMyOyBiICs9IDgpXG4gICAgICAgIGJ5dGVzLnB1c2goKHdvcmRzW2IgPj4+IDVdID4+PiAoMjQgLSBiICUgMzIpKSAmIDB4RkYpO1xuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgYnl0ZSBhcnJheSB0byBhIGhleCBzdHJpbmdcbiAgICBieXRlc1RvSGV4OiBmdW5jdGlvbihieXRlcykge1xuICAgICAgZm9yICh2YXIgaGV4ID0gW10sIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaGV4LnB1c2goKGJ5dGVzW2ldID4+PiA0KS50b1N0cmluZygxNikpO1xuICAgICAgICBoZXgucHVzaCgoYnl0ZXNbaV0gJiAweEYpLnRvU3RyaW5nKDE2KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaGV4LmpvaW4oJycpO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgaGV4IHN0cmluZyB0byBhIGJ5dGUgYXJyYXlcbiAgICBoZXhUb0J5dGVzOiBmdW5jdGlvbihoZXgpIHtcbiAgICAgIGZvciAodmFyIGJ5dGVzID0gW10sIGMgPSAwOyBjIDwgaGV4Lmxlbmd0aDsgYyArPSAyKVxuICAgICAgICBieXRlcy5wdXNoKHBhcnNlSW50KGhleC5zdWJzdHIoYywgMiksIDE2KSk7XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBieXRlIGFycmF5IHRvIGEgYmFzZS02NCBzdHJpbmdcbiAgICBieXRlc1RvQmFzZTY0OiBmdW5jdGlvbihieXRlcykge1xuICAgICAgZm9yICh2YXIgYmFzZTY0ID0gW10sIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDMpIHtcbiAgICAgICAgdmFyIHRyaXBsZXQgPSAoYnl0ZXNbaV0gPDwgMTYpIHwgKGJ5dGVzW2kgKyAxXSA8PCA4KSB8IGJ5dGVzW2kgKyAyXTtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCA0OyBqKyspXG4gICAgICAgICAgaWYgKGkgKiA4ICsgaiAqIDYgPD0gYnl0ZXMubGVuZ3RoICogOClcbiAgICAgICAgICAgIGJhc2U2NC5wdXNoKGJhc2U2NG1hcC5jaGFyQXQoKHRyaXBsZXQgPj4+IDYgKiAoMyAtIGopKSAmIDB4M0YpKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBiYXNlNjQucHVzaCgnPScpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJhc2U2NC5qb2luKCcnKTtcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJhc2UtNjQgc3RyaW5nIHRvIGEgYnl0ZSBhcnJheVxuICAgIGJhc2U2NFRvQnl0ZXM6IGZ1bmN0aW9uKGJhc2U2NCkge1xuICAgICAgLy8gUmVtb3ZlIG5vbi1iYXNlLTY0IGNoYXJhY3RlcnNcbiAgICAgIGJhc2U2NCA9IGJhc2U2NC5yZXBsYWNlKC9bXkEtWjAtOStcXC9dL2lnLCAnJyk7XG5cbiAgICAgIGZvciAodmFyIGJ5dGVzID0gW10sIGkgPSAwLCBpbW9kNCA9IDA7IGkgPCBiYXNlNjQubGVuZ3RoO1xuICAgICAgICAgIGltb2Q0ID0gKytpICUgNCkge1xuICAgICAgICBpZiAoaW1vZDQgPT0gMCkgY29udGludWU7XG4gICAgICAgIGJ5dGVzLnB1c2goKChiYXNlNjRtYXAuaW5kZXhPZihiYXNlNjQuY2hhckF0KGkgLSAxKSlcbiAgICAgICAgICAgICYgKE1hdGgucG93KDIsIC0yICogaW1vZDQgKyA4KSAtIDEpKSA8PCAoaW1vZDQgKiAyKSlcbiAgICAgICAgICAgIHwgKGJhc2U2NG1hcC5pbmRleE9mKGJhc2U2NC5jaGFyQXQoaSkpID4+PiAoNiAtIGltb2Q0ICogMikpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9XG4gIH07XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBjcnlwdDtcbn0pKCk7XG4iLCIvKiFcbiAqIERldGVybWluZSBpZiBhbiBvYmplY3QgaXMgYSBCdWZmZXJcbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8aHR0cHM6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbi8vIFRoZSBfaXNCdWZmZXIgY2hlY2sgaXMgZm9yIFNhZmFyaSA1LTcgc3VwcG9ydCwgYmVjYXVzZSBpdCdzIG1pc3Npbmdcbi8vIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHlcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgKGlzQnVmZmVyKG9iaikgfHwgaXNTbG93QnVmZmVyKG9iaikgfHwgISFvYmouX2lzQnVmZmVyKVxufVxuXG5mdW5jdGlvbiBpc0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiAhIW9iai5jb25zdHJ1Y3RvciAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG59XG5cbi8vIEZvciBOb2RlIHYwLjEwIHN1cHBvcnQuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkuXG5mdW5jdGlvbiBpc1Nsb3dCdWZmZXIgKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnNsaWNlID09PSAnZnVuY3Rpb24nICYmIGlzQnVmZmVyKG9iai5zbGljZSgwLCAwKSlcbn1cbiIsIihmdW5jdGlvbigpe1xyXG4gIHZhciBjcnlwdCA9IHJlcXVpcmUoJ2NyeXB0JyksXHJcbiAgICAgIHV0ZjggPSByZXF1aXJlKCdjaGFyZW5jJykudXRmOCxcclxuICAgICAgaXNCdWZmZXIgPSByZXF1aXJlKCdpcy1idWZmZXInKSxcclxuICAgICAgYmluID0gcmVxdWlyZSgnY2hhcmVuYycpLmJpbixcclxuXHJcbiAgLy8gVGhlIGNvcmVcclxuICBtZDUgPSBmdW5jdGlvbiAobWVzc2FnZSwgb3B0aW9ucykge1xyXG4gICAgLy8gQ29udmVydCB0byBieXRlIGFycmF5XHJcbiAgICBpZiAobWVzc2FnZS5jb25zdHJ1Y3RvciA9PSBTdHJpbmcpXHJcbiAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZW5jb2RpbmcgPT09ICdiaW5hcnknKVxyXG4gICAgICAgIG1lc3NhZ2UgPSBiaW4uc3RyaW5nVG9CeXRlcyhtZXNzYWdlKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIG1lc3NhZ2UgPSB1dGY4LnN0cmluZ1RvQnl0ZXMobWVzc2FnZSk7XHJcbiAgICBlbHNlIGlmIChpc0J1ZmZlcihtZXNzYWdlKSlcclxuICAgICAgbWVzc2FnZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG1lc3NhZ2UsIDApO1xyXG4gICAgZWxzZSBpZiAoIUFycmF5LmlzQXJyYXkobWVzc2FnZSkgJiYgbWVzc2FnZS5jb25zdHJ1Y3RvciAhPT0gVWludDhBcnJheSlcclxuICAgICAgbWVzc2FnZSA9IG1lc3NhZ2UudG9TdHJpbmcoKTtcclxuICAgIC8vIGVsc2UsIGFzc3VtZSBieXRlIGFycmF5IGFscmVhZHlcclxuXHJcbiAgICB2YXIgbSA9IGNyeXB0LmJ5dGVzVG9Xb3JkcyhtZXNzYWdlKSxcclxuICAgICAgICBsID0gbWVzc2FnZS5sZW5ndGggKiA4LFxyXG4gICAgICAgIGEgPSAgMTczMjU4NDE5MyxcclxuICAgICAgICBiID0gLTI3MTczMzg3OSxcclxuICAgICAgICBjID0gLTE3MzI1ODQxOTQsXHJcbiAgICAgICAgZCA9ICAyNzE3MzM4Nzg7XHJcblxyXG4gICAgLy8gU3dhcCBlbmRpYW5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbS5sZW5ndGg7IGkrKykge1xyXG4gICAgICBtW2ldID0gKChtW2ldIDw8ICA4KSB8IChtW2ldID4+PiAyNCkpICYgMHgwMEZGMDBGRiB8XHJcbiAgICAgICAgICAgICAoKG1baV0gPDwgMjQpIHwgKG1baV0gPj4+ICA4KSkgJiAweEZGMDBGRjAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFBhZGRpbmdcclxuICAgIG1bbCA+Pj4gNV0gfD0gMHg4MCA8PCAobCAlIDMyKTtcclxuICAgIG1bKCgobCArIDY0KSA+Pj4gOSkgPDwgNCkgKyAxNF0gPSBsO1xyXG5cclxuICAgIC8vIE1ldGhvZCBzaG9ydGN1dHNcclxuICAgIHZhciBGRiA9IG1kNS5fZmYsXHJcbiAgICAgICAgR0cgPSBtZDUuX2dnLFxyXG4gICAgICAgIEhIID0gbWQ1Ll9oaCxcclxuICAgICAgICBJSSA9IG1kNS5faWk7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtLmxlbmd0aDsgaSArPSAxNikge1xyXG5cclxuICAgICAgdmFyIGFhID0gYSxcclxuICAgICAgICAgIGJiID0gYixcclxuICAgICAgICAgIGNjID0gYyxcclxuICAgICAgICAgIGRkID0gZDtcclxuXHJcbiAgICAgIGEgPSBGRihhLCBiLCBjLCBkLCBtW2krIDBdLCAgNywgLTY4MDg3NjkzNik7XHJcbiAgICAgIGQgPSBGRihkLCBhLCBiLCBjLCBtW2krIDFdLCAxMiwgLTM4OTU2NDU4Nik7XHJcbiAgICAgIGMgPSBGRihjLCBkLCBhLCBiLCBtW2krIDJdLCAxNywgIDYwNjEwNTgxOSk7XHJcbiAgICAgIGIgPSBGRihiLCBjLCBkLCBhLCBtW2krIDNdLCAyMiwgLTEwNDQ1MjUzMzApO1xyXG4gICAgICBhID0gRkYoYSwgYiwgYywgZCwgbVtpKyA0XSwgIDcsIC0xNzY0MTg4OTcpO1xyXG4gICAgICBkID0gRkYoZCwgYSwgYiwgYywgbVtpKyA1XSwgMTIsICAxMjAwMDgwNDI2KTtcclxuICAgICAgYyA9IEZGKGMsIGQsIGEsIGIsIG1baSsgNl0sIDE3LCAtMTQ3MzIzMTM0MSk7XHJcbiAgICAgIGIgPSBGRihiLCBjLCBkLCBhLCBtW2krIDddLCAyMiwgLTQ1NzA1OTgzKTtcclxuICAgICAgYSA9IEZGKGEsIGIsIGMsIGQsIG1baSsgOF0sICA3LCAgMTc3MDAzNTQxNik7XHJcbiAgICAgIGQgPSBGRihkLCBhLCBiLCBjLCBtW2krIDldLCAxMiwgLTE5NTg0MTQ0MTcpO1xyXG4gICAgICBjID0gRkYoYywgZCwgYSwgYiwgbVtpKzEwXSwgMTcsIC00MjA2Myk7XHJcbiAgICAgIGIgPSBGRihiLCBjLCBkLCBhLCBtW2krMTFdLCAyMiwgLTE5OTA0MDQxNjIpO1xyXG4gICAgICBhID0gRkYoYSwgYiwgYywgZCwgbVtpKzEyXSwgIDcsICAxODA0NjAzNjgyKTtcclxuICAgICAgZCA9IEZGKGQsIGEsIGIsIGMsIG1baSsxM10sIDEyLCAtNDAzNDExMDEpO1xyXG4gICAgICBjID0gRkYoYywgZCwgYSwgYiwgbVtpKzE0XSwgMTcsIC0xNTAyMDAyMjkwKTtcclxuICAgICAgYiA9IEZGKGIsIGMsIGQsIGEsIG1baSsxNV0sIDIyLCAgMTIzNjUzNTMyOSk7XHJcblxyXG4gICAgICBhID0gR0coYSwgYiwgYywgZCwgbVtpKyAxXSwgIDUsIC0xNjU3OTY1MTApO1xyXG4gICAgICBkID0gR0coZCwgYSwgYiwgYywgbVtpKyA2XSwgIDksIC0xMDY5NTAxNjMyKTtcclxuICAgICAgYyA9IEdHKGMsIGQsIGEsIGIsIG1baSsxMV0sIDE0LCAgNjQzNzE3NzEzKTtcclxuICAgICAgYiA9IEdHKGIsIGMsIGQsIGEsIG1baSsgMF0sIDIwLCAtMzczODk3MzAyKTtcclxuICAgICAgYSA9IEdHKGEsIGIsIGMsIGQsIG1baSsgNV0sICA1LCAtNzAxNTU4NjkxKTtcclxuICAgICAgZCA9IEdHKGQsIGEsIGIsIGMsIG1baSsxMF0sICA5LCAgMzgwMTYwODMpO1xyXG4gICAgICBjID0gR0coYywgZCwgYSwgYiwgbVtpKzE1XSwgMTQsIC02NjA0NzgzMzUpO1xyXG4gICAgICBiID0gR0coYiwgYywgZCwgYSwgbVtpKyA0XSwgMjAsIC00MDU1Mzc4NDgpO1xyXG4gICAgICBhID0gR0coYSwgYiwgYywgZCwgbVtpKyA5XSwgIDUsICA1Njg0NDY0MzgpO1xyXG4gICAgICBkID0gR0coZCwgYSwgYiwgYywgbVtpKzE0XSwgIDksIC0xMDE5ODAzNjkwKTtcclxuICAgICAgYyA9IEdHKGMsIGQsIGEsIGIsIG1baSsgM10sIDE0LCAtMTg3MzYzOTYxKTtcclxuICAgICAgYiA9IEdHKGIsIGMsIGQsIGEsIG1baSsgOF0sIDIwLCAgMTE2MzUzMTUwMSk7XHJcbiAgICAgIGEgPSBHRyhhLCBiLCBjLCBkLCBtW2krMTNdLCAgNSwgLTE0NDQ2ODE0NjcpO1xyXG4gICAgICBkID0gR0coZCwgYSwgYiwgYywgbVtpKyAyXSwgIDksIC01MTQwMzc4NCk7XHJcbiAgICAgIGMgPSBHRyhjLCBkLCBhLCBiLCBtW2krIDddLCAxNCwgIDE3MzUzMjg0NzMpO1xyXG4gICAgICBiID0gR0coYiwgYywgZCwgYSwgbVtpKzEyXSwgMjAsIC0xOTI2NjA3NzM0KTtcclxuXHJcbiAgICAgIGEgPSBISChhLCBiLCBjLCBkLCBtW2krIDVdLCAgNCwgLTM3ODU1OCk7XHJcbiAgICAgIGQgPSBISChkLCBhLCBiLCBjLCBtW2krIDhdLCAxMSwgLTIwMjI1NzQ0NjMpO1xyXG4gICAgICBjID0gSEgoYywgZCwgYSwgYiwgbVtpKzExXSwgMTYsICAxODM5MDMwNTYyKTtcclxuICAgICAgYiA9IEhIKGIsIGMsIGQsIGEsIG1baSsxNF0sIDIzLCAtMzUzMDk1NTYpO1xyXG4gICAgICBhID0gSEgoYSwgYiwgYywgZCwgbVtpKyAxXSwgIDQsIC0xNTMwOTkyMDYwKTtcclxuICAgICAgZCA9IEhIKGQsIGEsIGIsIGMsIG1baSsgNF0sIDExLCAgMTI3Mjg5MzM1Myk7XHJcbiAgICAgIGMgPSBISChjLCBkLCBhLCBiLCBtW2krIDddLCAxNiwgLTE1NTQ5NzYzMik7XHJcbiAgICAgIGIgPSBISChiLCBjLCBkLCBhLCBtW2krMTBdLCAyMywgLTEwOTQ3MzA2NDApO1xyXG4gICAgICBhID0gSEgoYSwgYiwgYywgZCwgbVtpKzEzXSwgIDQsICA2ODEyNzkxNzQpO1xyXG4gICAgICBkID0gSEgoZCwgYSwgYiwgYywgbVtpKyAwXSwgMTEsIC0zNTg1MzcyMjIpO1xyXG4gICAgICBjID0gSEgoYywgZCwgYSwgYiwgbVtpKyAzXSwgMTYsIC03MjI1MjE5NzkpO1xyXG4gICAgICBiID0gSEgoYiwgYywgZCwgYSwgbVtpKyA2XSwgMjMsICA3NjAyOTE4OSk7XHJcbiAgICAgIGEgPSBISChhLCBiLCBjLCBkLCBtW2krIDldLCAgNCwgLTY0MDM2NDQ4Nyk7XHJcbiAgICAgIGQgPSBISChkLCBhLCBiLCBjLCBtW2krMTJdLCAxMSwgLTQyMTgxNTgzNSk7XHJcbiAgICAgIGMgPSBISChjLCBkLCBhLCBiLCBtW2krMTVdLCAxNiwgIDUzMDc0MjUyMCk7XHJcbiAgICAgIGIgPSBISChiLCBjLCBkLCBhLCBtW2krIDJdLCAyMywgLTk5NTMzODY1MSk7XHJcblxyXG4gICAgICBhID0gSUkoYSwgYiwgYywgZCwgbVtpKyAwXSwgIDYsIC0xOTg2MzA4NDQpO1xyXG4gICAgICBkID0gSUkoZCwgYSwgYiwgYywgbVtpKyA3XSwgMTAsICAxMTI2ODkxNDE1KTtcclxuICAgICAgYyA9IElJKGMsIGQsIGEsIGIsIG1baSsxNF0sIDE1LCAtMTQxNjM1NDkwNSk7XHJcbiAgICAgIGIgPSBJSShiLCBjLCBkLCBhLCBtW2krIDVdLCAyMSwgLTU3NDM0MDU1KTtcclxuICAgICAgYSA9IElJKGEsIGIsIGMsIGQsIG1baSsxMl0sICA2LCAgMTcwMDQ4NTU3MSk7XHJcbiAgICAgIGQgPSBJSShkLCBhLCBiLCBjLCBtW2krIDNdLCAxMCwgLTE4OTQ5ODY2MDYpO1xyXG4gICAgICBjID0gSUkoYywgZCwgYSwgYiwgbVtpKzEwXSwgMTUsIC0xMDUxNTIzKTtcclxuICAgICAgYiA9IElJKGIsIGMsIGQsIGEsIG1baSsgMV0sIDIxLCAtMjA1NDkyMjc5OSk7XHJcbiAgICAgIGEgPSBJSShhLCBiLCBjLCBkLCBtW2krIDhdLCAgNiwgIDE4NzMzMTMzNTkpO1xyXG4gICAgICBkID0gSUkoZCwgYSwgYiwgYywgbVtpKzE1XSwgMTAsIC0zMDYxMTc0NCk7XHJcbiAgICAgIGMgPSBJSShjLCBkLCBhLCBiLCBtW2krIDZdLCAxNSwgLTE1NjAxOTgzODApO1xyXG4gICAgICBiID0gSUkoYiwgYywgZCwgYSwgbVtpKzEzXSwgMjEsICAxMzA5MTUxNjQ5KTtcclxuICAgICAgYSA9IElJKGEsIGIsIGMsIGQsIG1baSsgNF0sICA2LCAtMTQ1NTIzMDcwKTtcclxuICAgICAgZCA9IElJKGQsIGEsIGIsIGMsIG1baSsxMV0sIDEwLCAtMTEyMDIxMDM3OSk7XHJcbiAgICAgIGMgPSBJSShjLCBkLCBhLCBiLCBtW2krIDJdLCAxNSwgIDcxODc4NzI1OSk7XHJcbiAgICAgIGIgPSBJSShiLCBjLCBkLCBhLCBtW2krIDldLCAyMSwgLTM0MzQ4NTU1MSk7XHJcblxyXG4gICAgICBhID0gKGEgKyBhYSkgPj4+IDA7XHJcbiAgICAgIGIgPSAoYiArIGJiKSA+Pj4gMDtcclxuICAgICAgYyA9IChjICsgY2MpID4+PiAwO1xyXG4gICAgICBkID0gKGQgKyBkZCkgPj4+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNyeXB0LmVuZGlhbihbYSwgYiwgYywgZF0pO1xyXG4gIH07XHJcblxyXG4gIC8vIEF1eGlsaWFyeSBmdW5jdGlvbnNcclxuICBtZDUuX2ZmICA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XHJcbiAgICB2YXIgbiA9IGEgKyAoYiAmIGMgfCB+YiAmIGQpICsgKHggPj4+IDApICsgdDtcclxuICAgIHJldHVybiAoKG4gPDwgcykgfCAobiA+Pj4gKDMyIC0gcykpKSArIGI7XHJcbiAgfTtcclxuICBtZDUuX2dnICA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XHJcbiAgICB2YXIgbiA9IGEgKyAoYiAmIGQgfCBjICYgfmQpICsgKHggPj4+IDApICsgdDtcclxuICAgIHJldHVybiAoKG4gPDwgcykgfCAobiA+Pj4gKDMyIC0gcykpKSArIGI7XHJcbiAgfTtcclxuICBtZDUuX2hoICA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XHJcbiAgICB2YXIgbiA9IGEgKyAoYiBeIGMgXiBkKSArICh4ID4+PiAwKSArIHQ7XHJcbiAgICByZXR1cm4gKChuIDw8IHMpIHwgKG4gPj4+ICgzMiAtIHMpKSkgKyBiO1xyXG4gIH07XHJcbiAgbWQ1Ll9paSAgPSBmdW5jdGlvbiAoYSwgYiwgYywgZCwgeCwgcywgdCkge1xyXG4gICAgdmFyIG4gPSBhICsgKGMgXiAoYiB8IH5kKSkgKyAoeCA+Pj4gMCkgKyB0O1xyXG4gICAgcmV0dXJuICgobiA8PCBzKSB8IChuID4+PiAoMzIgLSBzKSkpICsgYjtcclxuICB9O1xyXG5cclxuICAvLyBQYWNrYWdlIHByaXZhdGUgYmxvY2tzaXplXHJcbiAgbWQ1Ll9ibG9ja3NpemUgPSAxNjtcclxuICBtZDUuX2RpZ2VzdHNpemUgPSAxNjtcclxuXHJcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobWVzc2FnZSwgb3B0aW9ucykge1xyXG4gICAgaWYgKG1lc3NhZ2UgPT09IHVuZGVmaW5lZCB8fCBtZXNzYWdlID09PSBudWxsKVxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lsbGVnYWwgYXJndW1lbnQgJyArIG1lc3NhZ2UpO1xyXG5cclxuICAgIHZhciBkaWdlc3RieXRlcyA9IGNyeXB0LndvcmRzVG9CeXRlcyhtZDUobWVzc2FnZSwgb3B0aW9ucykpO1xyXG4gICAgcmV0dXJuIG9wdGlvbnMgJiYgb3B0aW9ucy5hc0J5dGVzID8gZGlnZXN0Ynl0ZXMgOlxyXG4gICAgICAgIG9wdGlvbnMgJiYgb3B0aW9ucy5hc1N0cmluZyA/IGJpbi5ieXRlc1RvU3RyaW5nKGRpZ2VzdGJ5dGVzKSA6XHJcbiAgICAgICAgY3J5cHQuYnl0ZXNUb0hleChkaWdlc3RieXRlcyk7XHJcbiAgfTtcclxuXHJcbn0pKCk7XHJcbiIsImltcG9ydCB7IFRyYW5zbGF0aW9uUmVzdWx0IH0gZnJvbSAnLi4vdHJhbnNsYXRpb24nO1xuaW1wb3J0IHsgYXBwQ29uZmlnIH0gZnJvbSAnLi4vc3RvcmFnZSc7XG5cbi8vIElmIHNldCB0byB0cnVlLCB1c2UgbG9jYWwgaW1wbGVtZW50YXRpb25zIGFuZCB0dXJuIG9uIGxvZ2dpbmcuXG5jb25zdCBpc0RlYnVnID0gZmFsc2U7XG5leHBvcnQgY29uc3QgYmFzZVVybCA9IGlzRGVidWcgPyAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJyA6ICdodHRwczovL2ljaGlnb3JlYWRlci5jb20nO1xuXG5lbnVtIFN0YXR1c0NvZGUge1xuXHRPayA9IDIwMCxcblx0Q3JlYXRlZCA9IDIwMSxcblx0Tm9Db250ZW50ID0gMjA0LFxuXHRGb3JiaWRkZW4gPSA0MDMsXG5cdE5vdEZvdW5kID0gNDA0LFxuXHRUb29NYW55UmVxdWVzdHMgPSA0MjksXG5cdEludGVybmFsU2VydmVyRXJyb3IgPSA1MDBcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVc2VyIHtcblx0ZW1haWw/OiBzdHJpbmc7IC8vIFVucmVnaXN0ZXJlZCB1c2VycyBoYXZlIG5vIGVtYWlsLiBUaGV5IGFyZSB0cmFja2VkIGJ5IElQLlxuXHRzdWJzY3JpcHRpb25UaWVyOiAnZnJlZScgfCAncGFpZCc7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRDdXJyZW50VXNlcigpOiBQcm9taXNlPFVzZXI+IHtcblx0Y29uc3QgY2xpZW50VXVpZCA9IGF3YWl0IGFwcENvbmZpZy5nZXRDbGllbnRVdWlkKCk7XG5cdGNvbnN0IHJlcXVlc3QgPSBhd2FpdCBmZXRjaChcblx0XHRgJHtiYXNlVXJsfS9tZXRyaWNzP2NsaWVudFV1aWQ9JHtjbGllbnRVdWlkfSZmaW5nZXJwcmludD0ke2dldEZpbmdlcnByaW50KCl9YCxcblx0XHR7XG5cdFx0XHRtZXRob2Q6ICdHRVQnLFxuXHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xuXG5cdGlmIChyZXF1ZXN0LnN0YXR1cyAhPT0gU3RhdHVzQ29kZS5Paykge1xuXHRcdHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIHJldHJpZXZlIHVzZXIuJyk7XG5cdH1cblxuXHRyZXR1cm4gKGF3YWl0IHJlcXVlc3QuanNvbigpKSBhcyB7XG5cdFx0ZW1haWw/OiBzdHJpbmc7XG5cdFx0c3Vic2NyaXB0aW9uVGllcjogJ2ZyZWUnIHwgJ3BhaWQnO1xuXHR9O1xufVxuXG5leHBvcnQgZW51bSBMb2dpblN0YXR1cyB7XG5cdFVua25vd24sIC8vIFZhcmlvdXMgbmV0d29yayBlcnJvcnMsIGlmIHNlcnZlciBpcyBvbiBoaWdoIGxvYWQsIGV0Yy4gTm90IHdvcnRoIGhhbmRsaW5nIGF0IHRoaXMgdGltZS5cblx0VW5rbm93bkVtYWlsLFxuXHRCYWRQYXNzd29yZCxcblx0U3VjY2Vzc1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9naW4oZW1haWw6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8TG9naW5TdGF0dXM+IHtcblx0Y29uc3QgcmVxdWVzdCA9IGF3YWl0IGZldGNoKGAke2Jhc2VVcmx9L2F1dGgvbG9naW5gLCB7XG5cdFx0bWV0aG9kOiAnUE9TVCcsXG5cdFx0aGVhZGVyczoge1xuXHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuXHRcdH0sXG5cdFx0Ym9keTogSlNPTi5zdHJpbmdpZnkoeyBlbWFpbCwgcGFzc3dvcmQgfSlcblx0fSk7XG5cblx0aWYgKHJlcXVlc3Quc3RhdHVzID09PSBTdGF0dXNDb2RlLk5vdEZvdW5kKSB7XG5cdFx0cmV0dXJuIExvZ2luU3RhdHVzLlVua25vd25FbWFpbDtcblx0fVxuXG5cdGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gU3RhdHVzQ29kZS5Gb3JiaWRkZW4pIHtcblx0XHRyZXR1cm4gTG9naW5TdGF0dXMuQmFkUGFzc3dvcmQ7XG5cdH1cblxuXHRyZXR1cm4gcmVxdWVzdC5zdGF0dXMgPT09IFN0YXR1c0NvZGUuT2sgPyBMb2dpblN0YXR1cy5TdWNjZXNzIDogTG9naW5TdGF0dXMuVW5rbm93bjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvZ291dCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcblx0Y29uc3QgcmVxdWVzdCA9IGF3YWl0IGZldGNoKGAke2Jhc2VVcmx9L2F1dGgvbG9nb3V0YCwge1xuXHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdGhlYWRlcnM6IHtcblx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcblx0XHR9XG5cdH0pO1xuXG5cdHJldHVybiByZXF1ZXN0LnN0YXR1cyA9PT0gU3RhdHVzQ29kZS5Ob0NvbnRlbnQ7XG59XG5cbmV4cG9ydCBlbnVtIFNpZ251cFN0YXR1cyB7XG5cdFVua25vd24sIC8vIFZhcmlvdXMgbmV0d29yayBlcnJvcnMsIGlmIHNlcnZlciBpcyBvbiBoaWdoIGxvYWQsIGV0Yy4gTm90IHdvcnRoIGhhbmRsaW5nIGF0IHRoaXMgdGltZS5cblx0U3VjY2Vzcyxcblx0RW1haWxUYWtlblxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2lnbnVwKGVtYWlsOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPFNpZ251cFN0YXR1cz4ge1xuXHRjb25zdCByZXF1ZXN0ID0gYXdhaXQgZmV0Y2goYCR7YmFzZVVybH0vc2lnbnVwYCwge1xuXHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdGhlYWRlcnM6IHtcblx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcblx0XHR9LFxuXHRcdGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgZW1haWwsIHBhc3N3b3JkIH0pXG5cdH0pO1xuXG5cdGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gU3RhdHVzQ29kZS5Gb3JiaWRkZW4pIHtcblx0XHRyZXR1cm4gU2lnbnVwU3RhdHVzLkVtYWlsVGFrZW47XG5cdH1cblxuXHRyZXR1cm4gcmVxdWVzdC5zdGF0dXMgPT09IFN0YXR1c0NvZGUuQ3JlYXRlZCA/IFNpZ251cFN0YXR1cy5TdWNjZXNzIDogU2lnbnVwU3RhdHVzLlVua25vd247XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzdWJtaXRGZWVkYmFjayh0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcblx0Y29uc3QgcmVxdWVzdCA9IGF3YWl0IGZldGNoKGAke2Jhc2VVcmx9L2ZlZWRiYWNrYCwge1xuXHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdGhlYWRlcnM6IHtcblx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcblx0XHR9LFxuXHRcdGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdGV4dCB9KVxuXHR9KTtcblxuXHRyZXR1cm4gcmVxdWVzdC5zdGF0dXMgPT09IFN0YXR1c0NvZGUuQ3JlYXRlZDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRyYW5zbGF0ZUltYWdlKFxuXHRiYXNlNjRJbWFnZTogc3RyaW5nXG4pOiBQcm9taXNlPHsgdHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvblJlc3VsdFtdOyBlcnJvck1lc3NhZ2U/OiBzdHJpbmcgfT4ge1xuXHRjb25zdCBjbGllbnRVdWlkID0gYXdhaXQgYXBwQ29uZmlnLmdldENsaWVudFV1aWQoKTtcblx0Y29uc3QgcmVxdWVzdCA9IGF3YWl0IGZldGNoKGAke2Jhc2VVcmx9L3RyYW5zbGF0ZWAsIHtcblx0XHRtZXRob2Q6ICdQT1NUJyxcblx0XHRoZWFkZXJzOiB7XG5cdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG5cdFx0fSxcblx0XHRib2R5OiBKU09OLnN0cmluZ2lmeSh7XG5cdFx0XHRiYXNlNjRJbWFnZXM6IFtiYXNlNjRJbWFnZV0sXG5cdFx0XHRjbGllbnRVdWlkOiBjbGllbnRVdWlkLFxuXHRcdFx0ZmluZ2VycHJpbnQ6IGdldEZpbmdlcnByaW50KClcblx0XHR9KVxuXHR9KTtcblxuXHRpZiAocmVxdWVzdC5zdGF0dXMgPT09IFN0YXR1c0NvZGUuSW50ZXJuYWxTZXJ2ZXJFcnJvcikge1xuXHRcdGNvbnN0IGVycm9yTWVzc2FnZSA9ICdTZXJ2ZXIgaXMgZG93biBvciBleHBlcmllbmNpbmcgaXNzdWVzLiBTb3JyeSBmb3IgdGhlIGluY29udmVuaWVuY2UuJztcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXJyb3JNZXNzYWdlLFxuXHRcdFx0dHJhbnNsYXRpb25zOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRvcmlnaW5hbExhbmd1YWdlOiAnVW5rbm93bicsXG5cdFx0XHRcdFx0dHJhbnNsYXRlZFRleHQ6IGVycm9yTWVzc2FnZSxcblx0XHRcdFx0XHRtaW5YOiAwLFxuXHRcdFx0XHRcdG1pblk6IDAsXG5cdFx0XHRcdFx0bWF4WDogMjAwLFxuXHRcdFx0XHRcdG1heFk6IDIwMFxuXHRcdFx0XHR9XG5cdFx0XHRdXG5cdFx0fTtcblx0fVxuXG5cdGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gU3RhdHVzQ29kZS5Ub29NYW55UmVxdWVzdHMpIHtcblx0XHRjb25zdCBlcnJvck1lc3NhZ2UgPSAnT3V0IG9mIHRyYW5zbGF0aW9ucy4gU2VydmVyIGNvc3RzIGFyZSBleHBlbnNpdmUuIFVwZ3JhZGUgZm9yIG1vcmUhJztcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXJyb3JNZXNzYWdlLFxuXHRcdFx0dHJhbnNsYXRpb25zOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRvcmlnaW5hbExhbmd1YWdlOiAnVW5rbm93bicsXG5cdFx0XHRcdFx0dHJhbnNsYXRlZFRleHQ6IGVycm9yTWVzc2FnZSxcblx0XHRcdFx0XHRtaW5YOiAwLFxuXHRcdFx0XHRcdG1pblk6IDAsXG5cdFx0XHRcdFx0bWF4WDogMjAwLFxuXHRcdFx0XHRcdG1heFk6IDIwMFxuXHRcdFx0XHR9XG5cdFx0XHRdXG5cdFx0fTtcblx0fVxuXG5cdGNvbnN0IHJlc3VsdHMgPSBhd2FpdCByZXF1ZXN0Lmpzb24oKTtcblx0cmV0dXJuIHtcblx0XHR0cmFuc2xhdGlvbnM6IHJlc3VsdHMuaW1hZ2VzWzBdIGFzIFRyYW5zbGF0aW9uUmVzdWx0W11cblx0fTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvZ0ZhaWxlZFRyYW5zbGF0ZVVybCh1cmw6IHN0cmluZykge1xuXHR0cnkge1xuXHRcdGF3YWl0IGZldGNoKGAke2Jhc2VVcmx9L2xvZy90cmFuc2xhdGlvbmAsIHtcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG5cdFx0XHR9LFxuXHRcdFx0Ym9keTogSlNPTi5zdHJpbmdpZnkoe1xuXHRcdFx0XHR0cmFuc2xhdGlvblVybHM6IFt1cmxdXG5cdFx0XHR9KVxuXHRcdH0pO1xuXHR9IGNhdGNoIHtcblx0XHQvLyBEbyBub3RoaW5nLlxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJ1ZyhtZXNzYWdlKSB7XG5cdGlmIChpc0RlYnVnKSB7XG5cdFx0Y29uc29sZS5sb2cobWVzc2FnZSk7XG5cdH1cbn1cblxubGV0IGZpbmdlcnByaW50OiBzdHJpbmcgPSBudWxsOyAvLyBEbyBub3QgYWNjZXNzIHRoaXMgZGlyZWN0bHksIHVzZSBnZXRGaW5nZXJwcmludCgpLlxuZnVuY3Rpb24gZ2V0RmluZ2VycHJpbnQoKSB7XG5cdGlmIChmaW5nZXJwcmludCkge1xuXHRcdHJldHVybiBmaW5nZXJwcmludDtcblx0fVxuXG5cdC8vIEluaXRpYWxpemUgZmluZ2VycHJpbnQuXG5cdGNvbnN0IHdlYkdsUmVuZGVyZXIgPSBnZXRXZWJHbFJlbmRlcmVyKCk7XG5cdGNvbnN0IGhhcmR3YXJlID0gZ2V0SGFyZHdhcmUoKTtcblx0Y29uc3QgY29ubmVjdGlvblN0cmluZyA9IGdldENvbm5lY3Rpb25TdHJpbmcoKTtcblx0Y29uc3QgdGltZXpvbmVDb2RlID0gbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpO1xuXHRmaW5nZXJwcmludCA9IGJ0b2EoYCR7d2ViR2xSZW5kZXJlcn0tJHtoYXJkd2FyZX0tJHtjb25uZWN0aW9uU3RyaW5nfS0ke3RpbWV6b25lQ29kZX1gKTtcblxuXHRyZXR1cm4gZmluZ2VycHJpbnQ7XG59XG5cbmZ1bmN0aW9uIGdldFdlYkdsUmVuZGVyZXIoKSB7XG5cdGNvbnN0IGdsID0gbmV3IE9mZnNjcmVlbkNhbnZhcygwLCAwKS5nZXRDb250ZXh0KCd3ZWJnbCcpO1xuXHRpZiAoIWdsKSB7XG5cdFx0cmV0dXJuICdub25lJztcblx0fVxuXHRjb25zdCBkZWJ1Z0luZm8gPSBnbC5nZXRFeHRlbnNpb24oJ1dFQkdMX2RlYnVnX3JlbmRlcmVyX2luZm8nKTtcblx0cmV0dXJuIGRlYnVnSW5mbyA/IGdsLmdldFBhcmFtZXRlcihkZWJ1Z0luZm8uVU5NQVNLRURfUkVOREVSRVJfV0VCR0wpIDogJ3Vua25vd24nO1xufVxuXG5mdW5jdGlvbiBnZXRIYXJkd2FyZSgpIHtcblx0Y29uc3QgaGFyZHdhcmVDb25jdXJyZW5jeSA9IG5hdmlnYXRvcj8uaGFyZHdhcmVDb25jdXJyZW5jeTtcblx0Y29uc3QgZGV2aWNlTWVtb3J5ID0gbmF2aWdhdG9yWydkZXZpY2VNZW1vcnknXTtcblx0cmV0dXJuIGAke2hhcmR3YXJlQ29uY3VycmVuY3l9LSR7ZGV2aWNlTWVtb3J5fWA7XG59XG5cbmZ1bmN0aW9uIGdldENvbm5lY3Rpb25TdHJpbmcoKSB7XG5cdGNvbnN0IHR5cGUgPSBuYXZpZ2F0b3JbJ2Nvbm5lY3Rpb24nXT8udHlwZTtcblx0Y29uc3QgcnR0ID0gbmF2aWdhdG9yWydjb25uZWN0aW9uJ10/LnJ0dDtcblx0Y29uc3QgZG93bmxpbmtNYXggPSBuYXZpZ2F0b3JbJ2Nvbm5lY3Rpb24nXT8uZG93bmxpbmtNYXg7XG5cdGNvbnN0IGVmZmVjdGl2ZVR5cGUgPSBuYXZpZ2F0b3JbJ2Nvbm5lY3Rpb24nXT8uZWZmZWN0aXZlVHlwZTtcblx0Y29uc3Qgc2F2ZURhdGEgPSBuYXZpZ2F0b3JbJ2Nvbm5lY3Rpb24nXT8uc2F2ZURhdGE7XG5cdHJldHVybiBgJHt0eXBlfS0ke3J0dH0tJHtkb3dubGlua01heH0tJHtlZmZlY3RpdmVUeXBlfS0ke3NhdmVEYXRhfWA7XG59XG4iLCIvLyBCYWNrZ3JvdW5kIHByb2Nlc3MgZm9yIHRoZSBJY2hpZ28gZXh0ZW5zaW9uLlxuLy8gVGhpcyBtb2R1bGUgc2hvdWxkIGJlIHVzZWQgdG8gcHJvY2VzcyBhc3luYyB3b3JrLlxuLy8gSGFuZGxlIGZhaWx1cmVzIGluIGEgcm9idXN0IG1hbm5lciBhbmQgYXZvaWQgdGhlIGZhaWwtZmFzdCBwYXR0ZXJuLCB1bmxlc3MgaW4gZGVidWcgbW9kZS5cbmltcG9ydCB7IGNhcHR1cmVWaXNpYmxlVGFiLCBnZXRDdXJyZW50VGFiLCBnZXRab29tRmFjdG9yLCBzZXRFeHRlbnNpb25JY29uIH0gZnJvbSAnLi4vY2hyb21lL2FzeW5jJztcbmltcG9ydCB7IGFwcENvbmZpZyB9IGZyb20gJy4uL3N0b3JhZ2UnO1xuaW1wb3J0IHsgZGVidWcgfSBmcm9tICcuLi9hcGknO1xuaW1wb3J0IHsgaW5pdFNhdmVUcmFuc2xhdGVkSW1hZ2VDb250ZXh0TWVudSB9IGZyb20gJy4vc2F2ZVRyYW5zbGF0ZWRJbWFnZS9zYXZlVHJhbnNsYXRlZEltYWdlRmVhdHVyZSc7XG5pbXBvcnQgeyBpbml0U2F2ZUFsbFRyYW5zbGF0ZWRJbWFnZUNvbnRleHRNZW51IH0gZnJvbSAnLi9zYXZlVHJhbnNsYXRlZEltYWdlL3NhdmVBbGxUcmFuc2xhdGVkSW1hZ2VGZWF0dXJlJztcbmltcG9ydCB7IHRyYW5zbGF0ZSB9IGZyb20gJy4vdHJhbnNsYXRlV2l0aFNjYWxpbmcnO1xuaW1wb3J0IHsgVHJhbnNsYXRpb25SZXN1bHRzIH0gZnJvbSAnLi4vdHJhbnNsYXRpb24nO1xuaW1wb3J0ICogYXMgbWQ1IGZyb20gJ21kNSc7XG5cbmluaXRTYXZlVHJhbnNsYXRlZEltYWdlQ29udGV4dE1lbnUoKTtcbmluaXRTYXZlQWxsVHJhbnNsYXRlZEltYWdlQ29udGV4dE1lbnUoKTtcblxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uIChtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuXHRoYW5kbGVNZXNzYWdlcyhtZXNzYWdlLCBzZW5kZXIpLnRoZW4oc2VuZFJlc3BvbnNlKTtcblx0cmV0dXJuIHRydWU7XG59KTtcblxuY29uc3Qgb3V0Z29pbmdUcmFuc2xhdGlvblJlcXVlc3RzID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZU1lc3NhZ2VzKG1lc3NhZ2UsIHNlbmRlcjogY2hyb21lLnJ1bnRpbWUuTWVzc2FnZVNlbmRlcikge1xuXHRpZiAoIW1lc3NhZ2UpIHtcblx0XHRkZWJ1ZyhgTWVzc2FnZSBtdXN0IG5vdCBiZSBlbXB0eS5cXG4gc2VuZGVyOlxcbiAke0pTT04uc3RyaW5naWZ5KHNlbmRlcil9YCk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0c3dpdGNoIChtZXNzYWdlLmtpbmQpIHtcblx0XHRjYXNlICd0cmFuc2xhdGVJbWFnZSc6XG5cdFx0XHRjb25zdCB0cmFuc2xhdGVFcnJvck1lc3NhZ2UgPSB2YWxpZGF0ZUltYWdlTWVzc2FnZShtZXNzYWdlKTtcblx0XHRcdGlmICh0cmFuc2xhdGVFcnJvck1lc3NhZ2UpIHtcblx0XHRcdFx0ZGVidWcoYCR7dHJhbnNsYXRlRXJyb3JNZXNzYWdlfVxcbiBtZXNzYWdlOlxcbiAke0pTT04uc3RyaW5naWZ5KG1lc3NhZ2UpfWApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGltYWdlSWRlbnRpdHkgPSBtZDUobWVzc2FnZS5pbWFnZS5zcmMpO1xuXG5cdFx0XHQvLyBBbHJlYWR5IHRyYW5zbGF0aW5nIHRoZSBpbWFnZS5cblx0XHRcdGlmIChvdXRnb2luZ1RyYW5zbGF0aW9uUmVxdWVzdHMuaGFzKGltYWdlSWRlbnRpdHkpKSB7XG5cdFx0XHRcdHJldHVybiAnRnVsbFF1ZXVlJztcblx0XHRcdH1cblxuXHRcdFx0aWYgKG91dGdvaW5nVHJhbnNsYXRpb25SZXF1ZXN0cy5zaXplID49IDQpIHtcblx0XHRcdFx0cmV0dXJuICdGdWxsUXVldWUnO1xuXHRcdFx0fVxuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRvdXRnb2luZ1RyYW5zbGF0aW9uUmVxdWVzdHMuYWRkKGltYWdlSWRlbnRpdHkpO1xuXHRcdFx0XHRjb25zdCB0cmFuc2xhdGlvbiA9IGF3YWl0IHRyYW5zbGF0ZShtZXNzYWdlLmltYWdlLCBtZXNzYWdlLmluY2x1ZGVCYXNlNjREYXRhKTtcblx0XHRcdFx0cmV0dXJuIHRyYW5zbGF0aW9uO1xuXHRcdFx0fSBmaW5hbGx5IHtcblx0XHRcdFx0b3V0Z29pbmdUcmFuc2xhdGlvblJlcXVlc3RzLmRlbGV0ZShpbWFnZUlkZW50aXR5KTtcblx0XHRcdH1cblxuXHRcdGNhc2UgJ3RyYW5zbGF0ZVNuYXBzaG90Jzpcblx0XHRcdGNvbnN0IHNuYXBzaG90RXJyb3JNZXNzYWdlID0gdmFsaWRhdGVTbmFwc2hvdE1lc3NhZ2UobWVzc2FnZSk7XG5cdFx0XHRpZiAoc25hcHNob3RFcnJvck1lc3NhZ2UpIHtcblx0XHRcdFx0ZGVidWcoYCR7c25hcHNob3RFcnJvck1lc3NhZ2V9XFxuIG1lc3NhZ2U6XFxuICR7SlNPTi5zdHJpbmdpZnkobWVzc2FnZSl9YCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc25hcHNob3QgPSBhd2FpdCB0YWtlU25hcHNob3QobWVzc2FnZS5kaW1lbnNpb25zLCBzZW5kZXIudGFiKTtcblx0XHRcdGlmICghc25hcHNob3QpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzbmFwc2hvdFRyYW5zbGF0aW9uID0gYXdhaXQgdHJhbnNsYXRlKHtcblx0XHRcdFx0c3JjOiBzbmFwc2hvdC5kYXRhVXJsLFxuXHRcdFx0XHR3aWR0aDogbWVzc2FnZS5kaW1lbnNpb25zLndpZHRoLFxuXHRcdFx0XHRoZWlnaHQ6IG1lc3NhZ2UuZGltZW5zaW9ucy5oZWlnaHRcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBQb3NzaWJseSBmcmVlIHVwIG1lbW9yeS4gTWF5IG5vdCBoYXZlIGFueSBpbXBhY3QgYXQgYWxsLCBidXQgKHByb2JhYmx5KSBkb2Vzbid0IGh1cnQuXG5cdFx0XHRkZWxldGUgc25hcHNob3QuZGF0YVVybDtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dHJhbnNsYXRpb25zOiAoc25hcHNob3RUcmFuc2xhdGlvbiBhcyBUcmFuc2xhdGlvblJlc3VsdHMpLnRyYW5zbGF0aW9ucyxcblx0XHRcdFx0em9vbUZhY3Rvcjogc25hcHNob3Quem9vbUZhY3RvclxuXHRcdFx0fTtcblxuXHRcdGNhc2UgJ3NldEV4dGVuc2lvbkljb24nOlxuXHRcdFx0YXdhaXQgZG9TZXRFeHRlbnNpb25JY29uKCk7XG5cdFx0XHRyZXR1cm47XG5cblx0XHRjYXNlICdvcGVuTG9naW5Qb3B1cCc6XG5cdFx0XHRjb25zdCBjdXJyZW50VGFiID0gYXdhaXQgZ2V0Q3VycmVudFRhYigpO1xuXHRcdFx0Y2hyb21lLndpbmRvd3MuY3JlYXRlKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Zm9jdXNlZDogdHJ1ZSxcblx0XHRcdFx0XHR3aWR0aDogMzc2LFxuXHRcdFx0XHRcdGhlaWdodDogNDQwLFxuXHRcdFx0XHRcdHR5cGU6ICdwb3B1cCcsXG5cdFx0XHRcdFx0dXJsOiBgbG9naW5Qb3B1cC5odG1sP3JlZnJlc2hPbkNvbXBsZXRlVGFiSWQ9JHtjdXJyZW50VGFiLmlkfWAsXG5cdFx0XHRcdFx0dG9wOiAwLFxuXHRcdFx0XHRcdGxlZnQ6IDBcblx0XHRcdFx0fSxcblx0XHRcdFx0KCkgPT4ge31cblx0XHRcdCk7XG5cdFx0XHRyZXR1cm47XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0ZGVidWcoXG5cdFx0XHRcdGBVbnN1cHBvcnRlZCBtZXNzYWdlIGtpbmQuXFxuIHNlbmRlcjpcXG4gJHtKU09OLnN0cmluZ2lmeShcblx0XHRcdFx0XHRzZW5kZXJcblx0XHRcdFx0KX1cXG4gUmVjZWl2ZWQgbWVzc2FnZTogXFxuICR7SlNPTi5zdHJpbmdpZnkobWVzc2FnZSl9YFxuXHRcdFx0KTtcblx0fVxufVxuXG4vLyBSZXR1cm5zIGFuIGVycm9yIG1lc3NhZ2Ugc3RyaW5nIG9uIGVycm9yLlxuLy8gdW5kZWZpbmVkIG1lYW5zIHRoZXJlIGFyZSBubyBlcnJvcnMuXG5mdW5jdGlvbiB2YWxpZGF0ZUltYWdlTWVzc2FnZShtZXNzYWdlOiBhbnkpIHtcblx0bGV0IGVycm9yTWVzc2FnZSA9ICcnO1xuXG5cdGNvbnN0IGltYWdlID0gbWVzc2FnZS5pbWFnZTtcblx0aWYgKCFpbWFnZSkge1xuXHRcdHJldHVybiAndHJhbnNsYXRlSW1hZ2UgbWVzc2FnZSBtdXN0IHNldCBpbWFnZS4nO1xuXHR9XG5cblx0aWYgKCFpbWFnZS5zcmMpIHtcblx0XHRlcnJvck1lc3NhZ2UgKz0gJ3RyYW5zbGF0ZUltYWdlIG1lc3NhZ2UgbXVzdCBzZXQgaW1hZ2Uuc3JjXFxuJztcblx0fVxuXG5cdGlmICghaW1hZ2UuaGVpZ2h0KSB7XG5cdFx0ZXJyb3JNZXNzYWdlICs9ICd0cmFuc2xhdGVJbWFnZSBtZXNzYWdlIG11c3Qgc2V0IGltYWdlLmhlaWdodFxcbic7XG5cdH1cblxuXHRpZiAoIWltYWdlLndpZHRoKSB7XG5cdFx0ZXJyb3JNZXNzYWdlICs9ICd0cmFuc2xhdGVJbWFnZSBtZXNzYWdlIG11c3Qgc2V0IGltYWdlLndpZHRoXFxuJztcblx0fVxuXG5cdHJldHVybiBlcnJvck1lc3NhZ2UgPT09ICcnID8gdW5kZWZpbmVkIDogZXJyb3JNZXNzYWdlO1xufVxuXG4vLyBSZXR1cm5zIGFuIGVycm9yIG1lc3NhZ2Ugc3RyaW5nIG9uIGVycm9yLlxuLy8gdW5kZWZpbmVkIG1lYW5zIHRoZXJlIGFyZSBubyBlcnJvcnMuXG5mdW5jdGlvbiB2YWxpZGF0ZVNuYXBzaG90TWVzc2FnZShtZXNzYWdlOiBhbnkpIHtcblx0bGV0IGVycm9yTWVzc2FnZSA9ICcnO1xuXG5cdGlmIChtZXNzYWdlLmRpbWVuc2lvbnMgPT0gbnVsbCkge1xuXHRcdGVycm9yTWVzc2FnZSArPSAnTXVzdCBzdXBwbHkgZGltZW5zaW9ucyBvZiB0b3AsIGxlZnQsIHdpZHRoLCBhbmQgaGVpZ2h0Llxcbic7XG5cdH0gZWxzZSB7XG5cdFx0Y29uc3QgZGltZW5zaW9ucyA9IG1lc3NhZ2UuZGltZW5zaW9ucztcblx0XHRpZiAoIU51bWJlci5pc0ludGVnZXIoZGltZW5zaW9ucy50b3ApKSB7XG5cdFx0XHRlcnJvck1lc3NhZ2UgKz0gJ3RvcCBtdXN0IGJlIGFuIGludGVnZXIuJztcblx0XHR9XG5cdFx0aWYgKCFOdW1iZXIuaXNJbnRlZ2VyKGRpbWVuc2lvbnMubGVmdCkpIHtcblx0XHRcdGVycm9yTWVzc2FnZSArPSAnbGVmdCBtdXN0IGJlIGFuIGludGVnZXIuJztcblx0XHR9XG5cdFx0aWYgKCFOdW1iZXIuaXNJbnRlZ2VyKGRpbWVuc2lvbnMud2lkdGgpKSB7XG5cdFx0XHRlcnJvck1lc3NhZ2UgKz0gJ3dpZHRoIG11c3QgYmUgYW4gaW50ZWdlci4nO1xuXHRcdH1cblx0XHRpZiAoIU51bWJlci5pc0ludGVnZXIoZGltZW5zaW9ucy5oZWlnaHQpKSB7XG5cdFx0XHRlcnJvck1lc3NhZ2UgKz0gJ2hlaWdodCBtdXN0IGJlIGFuIGludGVnZXIuJztcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gZXJyb3JNZXNzYWdlID09PSAnJyA/IHVuZGVmaW5lZCA6IGVycm9yTWVzc2FnZTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZG9TZXRFeHRlbnNpb25JY29uKCkge1xuXHQvLyBDYWxjdWxhdGUgaWYgSWNoaWdvIFJlYWRlciBpcyBhY3RpdmUgb24gdGhlIGN1cnJlbnQgdGFiLlxuXHRjb25zdCBhY3RpdmVUYWIgPSBhd2FpdCBnZXRDdXJyZW50VGFiKCk7XG5cdGNvbnN0IGFjdGl2ZVVybHMgPSBhd2FpdCBhcHBDb25maWcuZ2V0QWN0aXZlVXJscygpO1xuXG5cdGlmIChhY3RpdmVUYWIgJiYgYWN0aXZlVXJscy5pbmNsdWRlcyhhY3RpdmVUYWIuZ2V0SG9zdE5hbWUoKSkpIHtcblx0XHRhd2FpdCBzZXRFeHRlbnNpb25JY29uKHtcblx0XHRcdHBhdGg6IGNocm9tZS5ydW50aW1lLmdldFVSTCgnaWNvbnMvMTI4eDEyOC5wbmcnKSxcblx0XHRcdHRhYklkOiBhY3RpdmVUYWIuaWRcblx0XHR9KTtcblx0fVxufVxuXG5hc3luYyBmdW5jdGlvbiB0YWtlU25hcHNob3QoXG5cdHsgdG9wLCBsZWZ0LCBoZWlnaHQsIHdpZHRoIH0sXG5cdHRhYj86IGNocm9tZS50YWJzLlRhYlxuKTogUHJvbWlzZTx7IGRhdGFVcmw6IHN0cmluZzsgem9vbUZhY3RvcjogbnVtYmVyIH0gfCB1bmRlZmluZWQ+IHtcblx0aWYgKHRhYiA9PSBudWxsKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgZGF0YVVybCA9IGF3YWl0IGNhcHR1cmVWaXNpYmxlVGFiKHRhYi53aW5kb3dJZCk7XG5cblx0Ly8gU29tZXRoaW5nIHdlbnQgd3JvbmcuIFBvc3NpYmx5IGNsb3NlZCB0YWIgb3IgcmVmcmVzaGVkLlxuXHRpZiAoIWRhdGFVcmwpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCB6b29tRmFjdG9yID0gYXdhaXQgZ2V0Wm9vbUZhY3Rvcih0YWIuaWQpO1xuXHRjb25zdCBkYXRhVXJsRmV0Y2ggPSBhd2FpdCBmZXRjaChkYXRhVXJsKTtcblx0Y29uc3QgdmlzaWJsZVRhYkJsb2IgPSBhd2FpdCBkYXRhVXJsRmV0Y2guYmxvYigpO1xuXG5cdGNvbnN0IGNhbnZhcyA9IG5ldyBPZmZzY3JlZW5DYW52YXMod2lkdGgsIGhlaWdodCk7XG5cdGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnYml0bWFwcmVuZGVyZXInKTtcblx0Y29uc3QgYml0bWFwID0gYXdhaXQgY3JlYXRlSW1hZ2VCaXRtYXAoXG5cdFx0dmlzaWJsZVRhYkJsb2IsXG5cdFx0em9vbUZhY3RvciAqIGxlZnQsXG5cdFx0em9vbUZhY3RvciAqIHRvcCxcblx0XHR6b29tRmFjdG9yICogd2lkdGgsXG5cdFx0em9vbUZhY3RvciAqIGhlaWdodFxuXHQpO1xuXHRjb250ZXh0LnRyYW5zZmVyRnJvbUltYWdlQml0bWFwKGJpdG1hcCk7XG5cblx0Y29uc3Qgc25pcHBldEJsb2IgPSBhd2FpdCBjYW52YXMuY29udmVydFRvQmxvYigpO1xuXG5cdC8vIFdlYlAgaXMgZmFzdGVyIHRoYW4gUE5HIGFuZCBzdGlsbCBsb3NzbGVzcy5cblx0cmV0dXJuIHtcblx0XHRkYXRhVXJsOiBhd2FpdCBibG9iVG9CYXNlNjQoc25pcHBldEJsb2IpLFxuXHRcdHpvb21GYWN0b3Jcblx0fTtcbn1cblxuZnVuY3Rpb24gYmxvYlRvQmFzZTY0KGJsb2I6IEJsb2IpOiBQcm9taXNlPHN0cmluZz4ge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIF8pID0+IHtcblx0XHRjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXHRcdHJlYWRlci5vbmxvYWRlbmQgPSAoKSA9PiByZXNvbHZlKHJlYWRlci5yZXN1bHQgYXMgc3RyaW5nKTtcblx0XHRyZWFkZXIucmVhZEFzRGF0YVVSTChibG9iKTtcblx0fSk7XG59XG4iLCJpbXBvcnQgeyBleGVjdXRlU2NyaXB0IH0gZnJvbSAnLi4vLi4vY2hyb21lL2FzeW5jJztcblxuY29uc3Qgc2F2ZVRyYW5zbGF0ZWRJbWFnZU1lbnVJZCA9ICdpY2hpZ28tcmVhZGVyLXNhdmUtYWxsLXRyYW5zbGF0ZWQnO1xuXG4vLyBDb250YWlucyBhbGwgY29kZSBuZWNlc3NhcnkgdG8gc2V0dXAgYW5kIGV4ZWN1dGUgdGhlIFwiU2F2ZSBBbGwgVHJhbnNsYXRlZCBJbWFnZXNcIiByaWdodCBjbGljayBjb250ZXh0IG1lbnUuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW5pdFNhdmVBbGxUcmFuc2xhdGVkSW1hZ2VDb250ZXh0TWVudSgpIHtcblx0Ly8gQ2xlYXIgcHJldmlvdXMgY29udGV4dCBtZW51IHRvIHByZXZlbnQgXCJkdXBsaWNhdGUgY29udGV4dCBtZW51XCIgZXJyb3IuXG5cdGF3YWl0IHJlbW92ZUNvbnRleHRNZW51KHNhdmVUcmFuc2xhdGVkSW1hZ2VNZW51SWQpO1xuXHRjaHJvbWUuY29udGV4dE1lbnVzLmNyZWF0ZSh7XG5cdFx0aWQ6IHNhdmVUcmFuc2xhdGVkSW1hZ2VNZW51SWQsXG5cdFx0dGl0bGU6ICdTYXZlIEFsbCBUcmFuc2xhdGVkIEltYWdlcycsXG5cdFx0dHlwZTogJ25vcm1hbCcsXG5cdFx0Y29udGV4dHM6IFsnYWxsJ11cblx0fSk7XG5cdGNocm9tZS5jb250ZXh0TWVudXMub25DbGlja2VkLmFkZExpc3RlbmVyKFxuXHRcdGFzeW5jIChjb250ZXh0OiBjaHJvbWUuY29udGV4dE1lbnVzLk9uQ2xpY2tEYXRhLCBjdXJyZW50VGFiPzogY2hyb21lLnRhYnMuVGFiKSA9PiB7XG5cdFx0XHRpZiAoY29udGV4dD8ubWVudUl0ZW1JZCAhPT0gc2F2ZVRyYW5zbGF0ZWRJbWFnZU1lbnVJZCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGFsbEZyYW1lcyA9IGZhbHNlO1xuXHRcdFx0YXdhaXQgZXhlY3V0ZVNjcmlwdChjdXJyZW50VGFiLmlkLCAnanMvc2F2ZUFsbFRyYW5zbGF0ZWRJbWFnZUNvbnRlbnQuanMnLCBhbGxGcmFtZXMpO1xuXHRcdH1cblx0KTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlQ29udGV4dE1lbnUobWVudUlkOiBzdHJpbmcpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXHRcdGNocm9tZS5jb250ZXh0TWVudXMucmVtb3ZlKG1lbnVJZCwgKCkgPT4ge1xuXHRcdFx0aWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuXHRcdFx0XHQvLyBEbyBub3RoaW5nIGlmIGFuIGVycm9yIG9jY3Vycy4gQ2FuIGhhcHBlbiBpZiBtZW51IGl0ZW0gZG9lc24ndCBleGlzdC5cblx0XHRcdH1cblx0XHRcdHJlc29sdmUodW5kZWZpbmVkKTtcblx0XHR9KTtcblx0fSk7XG59XG4iLCJpbXBvcnQgeyBleGVjdXRlU2NyaXB0IH0gZnJvbSAnLi4vLi4vY2hyb21lL2FzeW5jJztcblxudHlwZSBJbWFnZUJhc2U2NCA9IHN0cmluZztcblxuY29uc3Qgc2F2ZVRyYW5zbGF0ZWRJbWFnZU1lbnVJZCA9ICdpY2hpZ28tcmVhZGVyLXNhdmUtdHJhbnNsYXRlZCc7XG5cbi8vIENvbnRhaW5zIGFsbCBjb2RlIG5lY2Vzc2FyeSB0byBzZXR1cCBhbmQgZXhlY3V0ZSB0aGUgXCJTYXZlIFRyYW5zbGF0ZWQgSW1hZ2VcIiByaWdodCBjbGljayBjb250ZXh0IG1lbnUuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW5pdFNhdmVUcmFuc2xhdGVkSW1hZ2VDb250ZXh0TWVudSgpIHtcblx0Ly8gQ2xlYXIgcHJldmlvdXMgY29udGV4dCBtZW51IHRvIHByZXZlbnQgXCJkdXBsaWNhdGUgY29udGV4dCBtZW51XCIgZXJyb3IuXG5cdGF3YWl0IHJlbW92ZUNvbnRleHRNZW51KHNhdmVUcmFuc2xhdGVkSW1hZ2VNZW51SWQpO1xuXHRjaHJvbWUuY29udGV4dE1lbnVzLmNyZWF0ZSh7XG5cdFx0aWQ6IHNhdmVUcmFuc2xhdGVkSW1hZ2VNZW51SWQsXG5cdFx0dGl0bGU6ICdTYXZlIFRyYW5zbGF0ZWQgSW1hZ2UnLFxuXHRcdHR5cGU6ICdub3JtYWwnLFxuXHRcdGNvbnRleHRzOiBbJ2ltYWdlJ11cblx0fSk7XG5cdGNocm9tZS5jb250ZXh0TWVudXMub25DbGlja2VkLmFkZExpc3RlbmVyKFxuXHRcdGFzeW5jIChpbWFnZTogY2hyb21lLmNvbnRleHRNZW51cy5PbkNsaWNrRGF0YSwgY3VycmVudFRhYj86IGNocm9tZS50YWJzLlRhYikgPT4ge1xuXHRcdFx0aWYgKGltYWdlPy5tZW51SXRlbUlkICE9PSBzYXZlVHJhbnNsYXRlZEltYWdlTWVudUlkKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgYWxsRnJhbWVzID0gZmFsc2U7XG5cdFx0XHRpZiAoaW1hZ2U/Lm1lZGlhVHlwZSAhPSAnaW1hZ2UnKSB7XG5cdFx0XHRcdGlmIChjdXJyZW50VGFiLmlkKSB7XG5cdFx0XHRcdFx0YXdhaXQgZXhlY3V0ZVNjcmlwdChjdXJyZW50VGFiLmlkLCAnanMvZXJyb3JEb3dubG9hZGluZ01lc3NhZ2UuanMnLCBhbGxGcmFtZXMpO1xuXHRcdFx0XHRcdGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKFxuXHRcdFx0XHRcdFx0Y3VycmVudFRhYi5pZCxcblx0XHRcdFx0XHRcdCdJbWFnZSBpcyBtaXNzaW5nIG5lY2Vzc2FyeSBkb3dubG9hZCBkYXRhLidcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFpbWFnZS5zcmNVcmwpIHtcblx0XHRcdFx0aWYgKGN1cnJlbnRUYWIuaWQpIHtcblx0XHRcdFx0XHRhd2FpdCBleGVjdXRlU2NyaXB0KGN1cnJlbnRUYWIuaWQsICdqcy9lcnJvckRvd25sb2FkaW5nTWVzc2FnZS5qcycsIGFsbEZyYW1lcyk7XG5cdFx0XHRcdFx0Y2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UoXG5cdFx0XHRcdFx0XHRjdXJyZW50VGFiLmlkLFxuXHRcdFx0XHRcdFx0J0ltYWdlIGlzIG1pc3NpbmcgbmVjZXNzYXJ5IGRvd25sb2FkIGRhdGEuJ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUb2dnbGUgb24gZG93bmxvYWQgc3Bpbm5lci5cblx0XHRcdGlmIChjdXJyZW50VGFiLmlkKVxuXHRcdFx0XHRhd2FpdCBleGVjdXRlU2NyaXB0KGN1cnJlbnRUYWIuaWQsICdqcy90b2dnbGVEb3dubG9hZExvYWRpbmdTcGlubmVyLmpzJywgYWxsRnJhbWVzKTtcblxuXHRcdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgZ2V0QmFzZTY0RGF0YShpbWFnZS5zcmNVcmwpO1xuXHRcdFx0aWYgKHJlc3VsdCA9PT0gJ0ZldGNoRXJyb3InKSB7XG5cdFx0XHRcdGF3YWl0IGV4ZWN1dGVTY3JpcHQoY3VycmVudFRhYi5pZCwgJ2pzL2Vycm9yRG93bmxvYWRpbmdNZXNzYWdlLmpzJywgYWxsRnJhbWVzKTtcblx0XHRcdFx0Y2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UoY3VycmVudFRhYi5pZCwgJ1RoaXMgc2l0ZSBoYXMgYmxvY2tlZCBleHRlbnNpb25zLicpO1xuXHRcdFx0XHRhd2FpdCBleGVjdXRlU2NyaXB0KGN1cnJlbnRUYWIuaWQsICdqcy90b2dnbGVEb3dubG9hZExvYWRpbmdTcGlubmVyLmpzJywgYWxsRnJhbWVzKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHJlc3VsdCA9PT0gJ1Vuc3VwcG9ydGVkSW1hZ2UnKSB7XG5cdFx0XHRcdGF3YWl0IGV4ZWN1dGVTY3JpcHQoY3VycmVudFRhYi5pZCwgJ2pzL2Vycm9yRG93bmxvYWRpbmdNZXNzYWdlLmpzJywgYWxsRnJhbWVzKTtcblx0XHRcdFx0Y2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UoY3VycmVudFRhYi5pZCwgJ1RoaXMgaW1hZ2Uga2luZCBpcyB1bnN1cHBvcnRlZC4nKTtcblx0XHRcdFx0YXdhaXQgZXhlY3V0ZVNjcmlwdChjdXJyZW50VGFiLmlkLCAnanMvdG9nZ2xlRG93bmxvYWRMb2FkaW5nU3Bpbm5lci5qcycsIGFsbEZyYW1lcyk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZmlsZW5hbWUgPSBpbWFnZS5zcmNVcmwuc3BsaXQoJy8nKS5wb3AoKTtcblx0XHRcdGF3YWl0IGV4ZWN1dGVTY3JpcHQoY3VycmVudFRhYi5pZCwgJ2pzL3NhdmVUcmFuc2xhdGVkSW1hZ2VDb250ZW50LmpzJywgYWxsRnJhbWVzKTtcblxuXHRcdFx0Y2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UoXG5cdFx0XHRcdGN1cnJlbnRUYWIuaWQsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRiYXNlNjREYXRhOiByZXN1bHQuYmFzZTY0RGF0YSxcblx0XHRcdFx0XHR3aWR0aDogcmVzdWx0LndpZHRoLFxuXHRcdFx0XHRcdGhlaWdodDogcmVzdWx0LmhlaWdodCxcblx0XHRcdFx0XHRmaWxlbmFtZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0Ly8gVG9nZ2xlIG9mZiBkb3dubG9hZCBzcGlubmVyLlxuXHRcdFx0XHRcdGlmIChjdXJyZW50VGFiLmlkKVxuXHRcdFx0XHRcdFx0YXdhaXQgZXhlY3V0ZVNjcmlwdChcblx0XHRcdFx0XHRcdFx0Y3VycmVudFRhYi5pZCxcblx0XHRcdFx0XHRcdFx0J2pzL3RvZ2dsZURvd25sb2FkTG9hZGluZ1NwaW5uZXIuanMnLFxuXHRcdFx0XHRcdFx0XHRhbGxGcmFtZXNcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fVxuXHQpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVDb250ZXh0TWVudShtZW51SWQ6IHN0cmluZykge1xuXHRyZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG5cdFx0Y2hyb21lLmNvbnRleHRNZW51cy5yZW1vdmUobWVudUlkLCAoKSA9PiB7XG5cdFx0XHRpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG5cdFx0XHRcdC8vIERvIG5vdGhpbmcgaWYgYW4gZXJyb3Igb2NjdXJzLiBDYW4gaGFwcGVuIGlmIG1lbnUgaXRlbSBkb2Vzbid0IGV4aXN0LlxuXHRcdFx0fVxuXHRcdFx0cmVzb2x2ZSh1bmRlZmluZWQpO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuLypcbiAqIEFsbCBjb2RlIGJlbG93IHRoaXMgbGluZSB3YXMgY29waWVkIGZyb20gYGltYWdlVXRpbHMudHNgLFxuICogYnV0IGVkaXRlZCB0byBmaXQgdGhlIGNvbnRleHR1YWwgbmVlZHMgb2YgdGhlIHNhdmUgdHJhbnNsYXRlZCBpbWFnZSBmZWF0dXJlLlxuICovXG5hc3luYyBmdW5jdGlvbiBnZXRCYXNlNjREYXRhKFxuXHRpbWFnZVNyYzogc3RyaW5nXG4pOiBQcm9taXNlPFxuXHR7IGJhc2U2NERhdGE6IEltYWdlQmFzZTY0OyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9IHwgJ0ZldGNoRXJyb3InIHwgJ1Vuc3VwcG9ydGVkSW1hZ2UnXG4+IHtcblx0Y29uc3QgaW1hZ2VEYXRhID0gYXdhaXQgZmV0Y2goaW1hZ2VTcmMpO1xuXHRpZiAoIXZhbGlkU3RhdHVzQ29kZShpbWFnZURhdGEuc3RhdHVzKSkge1xuXHRcdHJldHVybiAnRmV0Y2hFcnJvcic7XG5cdH1cblxuXHRjb25zdCBibG9iID0gYXdhaXQgaW1hZ2VEYXRhLmJsb2IoKTtcblx0aWYgKCF2YWxpZEltYWdlVHlwZShibG9iLnR5cGUpKSB7XG5cdFx0cmV0dXJuICdVbnN1cHBvcnRlZEltYWdlJztcblx0fVxuXG5cdGNvbnN0IGJpdG1hcCA9IGF3YWl0IGNyZWF0ZUltYWdlQml0bWFwKGJsb2IpO1xuXHRjb25zdCBiYXNlNjREYXRhID0gYXdhaXQgYmxvYlRvQmFzZTY0KGJsb2IpO1xuXHRyZXR1cm4geyBiYXNlNjREYXRhLCB3aWR0aDogYml0bWFwLndpZHRoLCBoZWlnaHQ6IGJpdG1hcC5oZWlnaHQgfTtcbn1cblxuZnVuY3Rpb24gYmxvYlRvQmFzZTY0KGJsb2I6IEJsb2IpOiBQcm9taXNlPHN0cmluZz4ge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIF8pID0+IHtcblx0XHRjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXHRcdHJlYWRlci5vbmxvYWRlbmQgPSAoKSA9PiByZXNvbHZlKHJlYWRlci5yZXN1bHQgYXMgc3RyaW5nKTtcblx0XHRyZWFkZXIucmVhZEFzRGF0YVVSTChibG9iKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIHZhbGlkU3RhdHVzQ29kZShzdGF0dXNDb2RlOiBudW1iZXIpOiBib29sZWFuIHtcblx0Ly8gU2VlOiBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MaXN0X29mX0hUVFBfc3RhdHVzX2NvZGVzXG5cdHJldHVybiBzdGF0dXNDb2RlID49IDIwMCAmJiBzdGF0dXNDb2RlIDwgNDAwO1xufVxuXG5mdW5jdGlvbiB2YWxpZEltYWdlVHlwZShpbWFnZVR5cGU6IHN0cmluZykge1xuXHQvLyBUT0RPOiBNYXliZSB0cnkgYW5kIGFkZCBiaW5hcnkgYmxvYiBtaW1lIHR5cGVzIGFuZCBvdGhlciB0aGluZ3M/XG5cdGNvbnN0IHZhbGlkTWltZVR5cGVzID0gWydpbWFnZS9naWYnLCAnaW1hZ2UvanBlZycsICdpbWFnZS9wbmcnLCAnaW1hZ2Uvd2VicCcsICdpbWFnZS9ibXAnXTtcblx0cmV0dXJuIHZhbGlkTWltZVR5cGVzLmluY2x1ZGVzKGltYWdlVHlwZSk7XG59XG4iLCJpbXBvcnQgeyBkZWJ1ZywgdHJhbnNsYXRlSW1hZ2UgfSBmcm9tICcuLi9hcGknO1xuaW1wb3J0IHsgZ2V0QmFzZTY0RGF0YSB9IGZyb20gJy4vdXRpbHMvaW1hZ2VVdGlscyc7XG5pbXBvcnQgeyBUcmFuc2xhdGlvblJlc3VsdHMsIGNhbGN1bGF0ZVJlc2l6ZWRBc3BlY3RSYXRpbyB9IGZyb20gJy4uL3RyYW5zbGF0aW9uJztcblxuLy8gTm90ZSB0aGlzIGNhbiBvbmx5IGJlIGNhbGxlZCBmcm9tIGNvbnRleHRzIHdoaWNoIGNhbiBtYWtlIEhUVFAgcmVxdWVzdHMuXG4vLyBGb3IgZXhhbXBsZSwgYGJhY2tncm91bmQudHNgLlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRyYW5zbGF0ZShcblx0aW1hZ2U6IHtcblx0XHRzcmM6IHN0cmluZztcblx0XHR3aWR0aDogbnVtYmVyO1xuXHRcdGhlaWdodDogbnVtYmVyO1xuXHR9LFxuXHRpbmNsdWRlQmFzZTY0RGF0YT86IGJvb2xlYW5cbik6IFByb21pc2U8VHJhbnNsYXRpb25SZXN1bHRzIHwgJ0ZldGNoRXJyb3InIHwgJ1NpdGVBY2Nlc3NFcnJvcicgfCAnVW5zdXBwb3J0ZWRJbWFnZSc+IHtcblx0Y29uc3QgZW5jb2RlZEltYWdlID0gYXdhaXQgZ2V0U2NhbGVkQmFzZTY0RGF0YShpbWFnZSk7XG5cdGlmIChpc0ZhaWx1cmUoZW5jb2RlZEltYWdlKSkge1xuXHRcdHJldHVybiBlbmNvZGVkSW1hZ2U7XG5cdH1cblxuXHRjb25zdCByZXN1bHQgPSBhd2FpdCB0cmFuc2xhdGVJbWFnZShlbmNvZGVkSW1hZ2UuYmFzZTY0RGF0YSk7XG5cdGNvbnN0IGJhc2U2NERhdGEgPSBpbmNsdWRlQmFzZTY0RGF0YSAmJiBlbmNvZGVkSW1hZ2UuYmFzZTY0RGF0YTtcblxuXHQvLyBQb3NzaWJseSBmcmVlIHVwIG1lbW9yeS4gTWF5IG5vdCBoYXZlIGFueSBpbXBhY3QgYXQgYWxsLCBidXQgKHByb2JhYmx5KSBkb2Vzbid0IGh1cnQuXG5cdGRlbGV0ZSBlbmNvZGVkSW1hZ2UuYmFzZTY0RGF0YTtcblxuXHRyZXR1cm4ge1xuXHRcdGltYWdlOiB7IHdpZHRoOiBlbmNvZGVkSW1hZ2Uud2lkdGgsIGhlaWdodDogZW5jb2RlZEltYWdlLmhlaWdodCB9LFxuXHRcdHRyYW5zbGF0aW9uczogcmVzdWx0LnRyYW5zbGF0aW9ucyxcblx0XHRiYXNlNjREYXRhXG5cdH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFNjYWxlZEJhc2U2NERhdGEoaW1hZ2U6IHsgc3JjOiBzdHJpbmc7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH0pIHtcblx0Ly8gRG93bnNjYWxlIGV4dHJhIGxhcmdlIGltYWdlcy4gSGVscHMgcHJldmVudCBwcm9jZXNzaW5nIHRpbWVvdXRzLlxuXHRjb25zdCBbcmVzaXplZFdpZHRoLCByZXNpemVkSGVpZ2h0XSA9IGNhbGN1bGF0ZVJlc2l6ZWRBc3BlY3RSYXRpbyh7XG5cdFx0d2lkdGg6IGltYWdlLndpZHRoLFxuXHRcdGhlaWdodDogaW1hZ2UuaGVpZ2h0LFxuXHRcdGhlaWdodE1heFB4OiAxODAwLFxuXHRcdHdpZHRoTWF4UHg6IDE4MDBcblx0fSk7XG5cblx0ZGVidWcoYGg6JHtyZXNpemVkSGVpZ2h0fSB3OiR7cmVzaXplZFdpZHRofWApO1xuXG5cdGNvbnN0IHJlc2l6ZWRJbWFnZSA9IHtcblx0XHQuLi5pbWFnZSxcblx0XHRvcmlnaW5hbFdpZHRoOiBpbWFnZS53aWR0aCxcblx0XHRvcmlnaW5hbEhlaWdodDogaW1hZ2UuaGVpZ2h0LFxuXHRcdHJlc2l6ZWRXaWR0aCxcblx0XHRyZXNpemVkSGVpZ2h0XG5cdH07XG5cblx0Y29uc3QgZW5jb2RlZEltYWdlID0gYXdhaXQgZ2V0QmFzZTY0RGF0YShyZXNpemVkSW1hZ2UpO1xuXHRyZXR1cm4gZW5jb2RlZEltYWdlO1xufVxuXG5mdW5jdGlvbiBpc0ZhaWx1cmUocmVzdWx0KTogcmVzdWx0IGlzICdGZXRjaEVycm9yJyB8ICdVbnN1cHBvcnRlZEltYWdlJyB8ICdTaXRlQWNjZXNzRXJyb3InIHtcblx0cmV0dXJuIHJlc3VsdCA9PT0gJ0ZldGNoRXJyb3InIHx8IHJlc3VsdCA9PT0gJ1Vuc3VwcG9ydGVkSW1hZ2UnIHx8IHJlc3VsdCA9PT0gJ1NpdGVBY2Nlc3NFcnJvcic7XG59XG4iLCJpbXBvcnQgeyBsb2dGYWlsZWRUcmFuc2xhdGVVcmwsIGRlYnVnIH0gZnJvbSAnLi4vLi4vYXBpJztcbmltcG9ydCB7IGdldEltYWdlIH0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCB0eXBlIEltYWdlQmFzZTY0ID0gc3RyaW5nOyAvLyBFZyAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvLi4uJ1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QmFzZTY0RGF0YSh7XG5cdHNyYyxcblx0cmVzaXplZFdpZHRoLFxuXHRyZXNpemVkSGVpZ2h0LFxuXHRvcmlnaW5hbEhlaWdodCxcblx0b3JpZ2luYWxXaWR0aFxufToge1xuXHRzcmM6IHN0cmluZztcblx0cmVzaXplZFdpZHRoOiBudW1iZXI7XG5cdHJlc2l6ZWRIZWlnaHQ6IG51bWJlcjtcblx0b3JpZ2luYWxXaWR0aDogbnVtYmVyO1xuXHRvcmlnaW5hbEhlaWdodDogbnVtYmVyO1xufSk6IFByb21pc2U8XG5cdHwgeyBiYXNlNjREYXRhOiBJbWFnZUJhc2U2NDsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXIgfVxuXHR8ICdGZXRjaEVycm9yJ1xuXHR8ICdVbnN1cHBvcnRlZEltYWdlJ1xuXHR8ICdTaXRlQWNjZXNzRXJyb3InXG4+IHtcblx0bGV0IGltYWdlRGF0YTtcblx0dHJ5IHtcblx0XHRpbWFnZURhdGEgPSBhd2FpdCBnZXRJbWFnZShzcmMpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdC8vIFRoaXMgY2FuIGhhcHBlbiBpZiB0aGUgdXNlcnMgc2V0cyBJY2hpZ28gUmVhZGVyJ3MgXCJTaXRlIEFjY2Vzc1wiIHRvIFwiT24gY2xpY2tcIixcblx0XHQvLyBpbnN0ZWFkIG9mIFwiT24gYWxsIHNpdGVzXCIsIGR1ZSB0byBDT1JTLiBJdCBjYW4gYWxzbyBoYXBwZW4gaWYgcmVmZXJlciBpcyBub3QgcHJvcGVybHkgc2V0LCBvbiBzb21lIGRvbWFpbnMuXG5cdFx0YXdhaXQgbG9nRmFpbGVkVHJhbnNsYXRlVXJsKHNyYy5zdWJzdHJpbmcoMCwgMTgwKSk7XG5cdFx0cmV0dXJuICdTaXRlQWNjZXNzRXJyb3InO1xuXHR9XG5cblx0aWYgKCF2YWxpZFN0YXR1c0NvZGUoaW1hZ2VEYXRhLnN0YXR1cykpIHtcblx0XHRhd2FpdCBsb2dGYWlsZWRUcmFuc2xhdGVVcmwoc3JjLnN1YnN0cmluZygwLCAxODApKTtcblx0XHRyZXR1cm4gJ0ZldGNoRXJyb3InO1xuXHR9XG5cblx0Y29uc3QgYmxvYiA9IGF3YWl0IGltYWdlRGF0YS5ibG9iKCk7XG5cdGlmICghdmFsaWRJbWFnZVR5cGUoYmxvYi50eXBlKSkge1xuXHRcdHJldHVybiAnVW5zdXBwb3J0ZWRJbWFnZSc7XG5cdH1cblxuXHRjb25zdCBzaG91bGRSZXNpemUgPSByZXNpemVkV2lkdGggIT0gb3JpZ2luYWxXaWR0aCB8fCByZXNpemVkSGVpZ2h0ICE9IG9yaWdpbmFsSGVpZ2h0O1xuXG5cdGlmIChzaG91bGRSZXNpemUpIHtcblx0XHRkZWJ1ZyhgcmVzaXplZDogJHtyZXNpemVkV2lkdGh9LyR7b3JpZ2luYWxXaWR0aH0gOiAke3Jlc2l6ZWRIZWlnaHR9LyR7b3JpZ2luYWxIZWlnaHR9YCk7XG5cdFx0Y29uc3QgY2FudmFzID0gbmV3IE9mZnNjcmVlbkNhbnZhcyhyZXNpemVkV2lkdGgsIHJlc2l6ZWRIZWlnaHQpO1xuXHRcdGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnYml0bWFwcmVuZGVyZXInKTtcblx0XHRjb25zdCBiaXRtYXAgPSBhd2FpdCBjcmVhdGVJbWFnZUJpdG1hcChibG9iLCB7XG5cdFx0XHRyZXNpemVXaWR0aDogcmVzaXplZFdpZHRoLFxuXHRcdFx0cmVzaXplSGVpZ2h0OiByZXNpemVkSGVpZ2h0LFxuXHRcdFx0cmVzaXplUXVhbGl0eTogJ2hpZ2gnXG5cdFx0fSk7XG5cdFx0Y29udGV4dC50cmFuc2ZlckZyb21JbWFnZUJpdG1hcChiaXRtYXApO1xuXG5cdFx0Y29uc3QgcmVzaXplZEJsb2IgPSBhd2FpdCBjYW52YXMuY29udmVydFRvQmxvYigpO1xuXHRcdGNvbnN0IGJhc2U2NERhdGEgPSBhd2FpdCBibG9iVG9CYXNlNjQocmVzaXplZEJsb2IpO1xuXG5cdFx0cmV0dXJuIHsgYmFzZTY0RGF0YSwgd2lkdGg6IHJlc2l6ZWRXaWR0aCwgaGVpZ2h0OiByZXNpemVkSGVpZ2h0IH07XG5cdH0gZWxzZSB7XG5cdFx0Y29uc3QgYmFzZTY0RGF0YSA9IGF3YWl0IGJsb2JUb0Jhc2U2NChibG9iKTtcblx0XHRyZXR1cm4geyBiYXNlNjREYXRhLCB3aWR0aDogb3JpZ2luYWxXaWR0aCwgaGVpZ2h0OiBvcmlnaW5hbEhlaWdodCB9O1xuXHR9XG59XG5cbmZ1bmN0aW9uIGJsb2JUb0Jhc2U2NChibG9iOiBCbG9iKTogUHJvbWlzZTxzdHJpbmc+IHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCBfKSA9PiB7XG5cdFx0Y29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblx0XHRyZWFkZXIub25sb2FkZW5kID0gKCkgPT4gcmVzb2x2ZShyZWFkZXIucmVzdWx0IGFzIHN0cmluZyk7XG5cdFx0cmVhZGVyLnJlYWRBc0RhdGFVUkwoYmxvYik7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiB2YWxpZFN0YXR1c0NvZGUoc3RhdHVzQ29kZTogbnVtYmVyKTogYm9vbGVhbiB7XG5cdC8vIFNlZTogaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGlzdF9vZl9IVFRQX3N0YXR1c19jb2Rlc1xuXHRyZXR1cm4gc3RhdHVzQ29kZSA+PSAyMDAgJiYgc3RhdHVzQ29kZSA8IDQwMDtcbn1cblxuZnVuY3Rpb24gdmFsaWRJbWFnZVR5cGUoaW1hZ2VUeXBlOiBzdHJpbmcpIHtcblx0Ly8gVE9ETzogTWF5YmUgdHJ5IGFuZCBhZGQgYmluYXJ5IGJsb2IgbWltZSB0eXBlcyBhbmQgb3RoZXIgdGhpbmdzP1xuXHRjb25zdCB2YWxpZE1pbWVUeXBlcyA9IFsnaW1hZ2UvZ2lmJywgJ2ltYWdlL2pwZWcnLCAnaW1hZ2UvcG5nJywgJ2ltYWdlL3dlYnAnLCAnaW1hZ2UvYm1wJ107XG5cdHJldHVybiB2YWxpZE1pbWVUeXBlcy5pbmNsdWRlcyhpbWFnZVR5cGUpO1xufVxuIiwiaW1wb3J0IHsgdXBkYXRlU2Vzc2lvbkhlYWRlcnMgfSBmcm9tICcuLi8uLi9jaHJvbWUvYXN5bmMnO1xuXG4vLyBBIHNldCBvZiBjb21tb24gZnVuY3Rpb25zIHRoYXQgYXJlbid0IHdvcnRoIGdyb3VwaW5nIGFsb25lLlxuLy8gQnJlYWsgbW9kdWxlIGludG8gbXVsdGlwbGUgbW9kdWxlcyB3aGVuIGl0IGdyb3dzIHRvbyBsYXJnZSAoODAwKyBMT0MpLlxuZXhwb3J0IGZ1bmN0aW9uIHNsZWVwTXMobWlsbGlzZWNvbmRzKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbWlsbGlzZWNvbmRzKSk7XG59XG5cbmNvbnN0IE1vZGlmeUhlYWRlcnMgPSAnbW9kaWZ5SGVhZGVycycgYXMgY2hyb21lLmRlY2xhcmF0aXZlTmV0UmVxdWVzdC5SdWxlQWN0aW9uVHlwZS5NT0RJRllfSEVBREVSUztcbmNvbnN0IFNldEhlYWRlciA9ICdzZXQnIGFzIGNocm9tZS5kZWNsYXJhdGl2ZU5ldFJlcXVlc3QuSGVhZGVyT3BlcmF0aW9uLlNFVDtcbmNvbnN0IFJlcXVlc3QgPSAneG1saHR0cHJlcXVlc3QnIGFzIGNocm9tZS5kZWNsYXJhdGl2ZU5ldFJlcXVlc3QuUmVzb3VyY2VUeXBlLlhNTEhUVFBSRVFVRVNUO1xuXG5sZXQgaWQgPSAxO1xuZnVuY3Rpb24gZ2V0SWQoKSB7XG5cdHJldHVybiBpZCsrO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0SW1hZ2Uoc3JjOiBzdHJpbmcpIHtcblx0bGV0IGhvc3RuYW1lO1xuXHR0cnkge1xuXHRcdGhvc3RuYW1lID0gbmV3IFVSTChzcmMpLmhvc3RuYW1lO1xuXHR9IGNhdGNoIHtcblx0XHRob3N0bmFtZSA9ICcnO1xuXHR9XG5cblx0Ly8gQ2hlY2sgaWYgaG9zdG5hbWUgbWF0Y2hlcyBhbnkgb2YgdGhlIHJlZmVyZXIgaGVhZGVyIHJ1bGUgaWRzLlxuXHRjb25zdCBydWxlVmFsdWVzID0gT2JqZWN0LnZhbHVlcyhydWxlcyk7XG5cdGZvciAoY29uc3QgcnVsZSBvZiBydWxlVmFsdWVzKSB7XG5cdFx0aWYgKGhvc3RuYW1lLmluY2x1ZGVzKHJ1bGUuY29uZGl0aW9uLnVybEZpbHRlcikpIHtcblx0XHRcdGNvbnN0IGNsb25lZFJ1bGUgPSB7IC4uLnJ1bGUsIGlkOiBnZXRJZCgpIH07XG5cdFx0XHR1cGRhdGVTZXNzaW9uSGVhZGVycyh7IGFkZFJ1bGVzOiBbY2xvbmVkUnVsZV0gfSk7XG5cblx0XHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IGZldGNoKHNyYyk7XG5cblx0XHRcdHVwZGF0ZVNlc3Npb25IZWFkZXJzKHsgcmVtb3ZlUnVsZUlkczogW2Nsb25lZFJ1bGUuaWRdIH0pO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cdH1cblxuXHQvLyBPdGhlcndpc2UsIHJldHVybiByZWd1bGFyIGZldGNoIHJlcXVlc3QuXG5cdHJldHVybiBhd2FpdCBmZXRjaChzcmMpO1xufVxuXG5jb25zdCBydWxlcyA9IHtcblx0cGl4aXY6IHtcblx0XHRpZDogZ2V0SWQoKSxcblx0XHRwcmlvcml0eTogMSxcblx0XHRhY3Rpb246IHtcblx0XHRcdHR5cGU6IE1vZGlmeUhlYWRlcnMsXG5cdFx0XHRyZXF1ZXN0SGVhZGVyczogW1xuXHRcdFx0XHR7IGhlYWRlcjogJ3JlZmVyZXInLCBvcGVyYXRpb246IFNldEhlYWRlciwgdmFsdWU6ICdodHRwczovL3d3dy5waXhpdi5uZXQvJyB9XG5cdFx0XHRdXG5cdFx0fSxcblx0XHRjb25kaXRpb246IHtcblx0XHRcdHVybEZpbHRlcjogJ3B4aW1nLm5ldCcsXG5cdFx0XHRyZXNvdXJjZVR5cGVzOiBbUmVxdWVzdF1cblx0XHR9XG5cdH0sXG5cdG1hbmh1YWd1aToge1xuXHRcdGlkOiBnZXRJZCgpLFxuXHRcdHByaW9yaXR5OiAxLFxuXHRcdGFjdGlvbjoge1xuXHRcdFx0dHlwZTogTW9kaWZ5SGVhZGVycyxcblx0XHRcdHJlcXVlc3RIZWFkZXJzOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRoZWFkZXI6ICdyZWZlcmVyJyxcblx0XHRcdFx0XHRvcGVyYXRpb246IFNldEhlYWRlcixcblx0XHRcdFx0XHR2YWx1ZTogJ2h0dHBzOi8vd3d3Lm1hbmh1YWd1aS5jb20vJ1xuXHRcdFx0XHR9XG5cdFx0XHRdXG5cdFx0fSxcblx0XHRjb25kaXRpb246IHtcblx0XHRcdHVybEZpbHRlcjogJ2kuaGFtcmV1cy5jb20nLFxuXHRcdFx0cmVzb3VyY2VUeXBlczogW1JlcXVlc3RdXG5cdFx0fVxuXHR9LFxuXHRoaXRvbWk6IHtcblx0XHRpZDogZ2V0SWQoKSxcblx0XHRwcmlvcml0eTogMSxcblx0XHRhY3Rpb246IHtcblx0XHRcdHR5cGU6IE1vZGlmeUhlYWRlcnMsXG5cdFx0XHRyZXF1ZXN0SGVhZGVyczogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aGVhZGVyOiAncmVmZXJlcicsXG5cdFx0XHRcdFx0b3BlcmF0aW9uOiBTZXRIZWFkZXIsXG5cdFx0XHRcdFx0dmFsdWU6ICdodHRwczovL2hpdG9taS5sYS8nXG5cdFx0XHRcdH1cblx0XHRcdF1cblx0XHR9LFxuXHRcdGNvbmRpdGlvbjoge1xuXHRcdFx0dXJsRmlsdGVyOiAnaGl0b21pLmxhJyxcblx0XHRcdHJlc291cmNlVHlwZXM6IFtSZXF1ZXN0XVxuXHRcdH1cblx0fSxcblx0a2xtYW5nYToge1xuXHRcdGlkOiBnZXRJZCgpLFxuXHRcdHByaW9yaXR5OiAxLFxuXHRcdGFjdGlvbjoge1xuXHRcdFx0dHlwZTogTW9kaWZ5SGVhZGVycyxcblx0XHRcdHJlcXVlc3RIZWFkZXJzOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRoZWFkZXI6ICdyZWZlcmVyJyxcblx0XHRcdFx0XHRvcGVyYXRpb246IFNldEhlYWRlcixcblx0XHRcdFx0XHR2YWx1ZTogJ2h0dHBzOi8va2xtYW5nYS5jb20vJ1xuXHRcdFx0XHR9XG5cdFx0XHRdXG5cdFx0fSxcblx0XHRjb25kaXRpb246IHtcblx0XHRcdHVybEZpbHRlcjogJ2tsaW12MS54eXonLFxuXHRcdFx0cmVzb3VyY2VUeXBlczogW1JlcXVlc3RdXG5cdFx0fVxuXHR9XG59O1xuIiwiLy8gTW9kdWxlIGZvciBtYWtpbmcgd29ya2luZyB3aXRoIHRoZSBDaHJvbWUgQVBJIGVhc2llci5cbi8vIFRoaXMgbWF5IGluY2x1ZGUgbWFraW5nIHRoZSBBUEkgYXN5bmMsIHNpbXBsaWZ5aW5nIHRoZSBpbnRlcmZhY2UsIG9yIG1vcmUuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudFRhYigpOiBQcm9taXNlPFxuXHQoY2hyb21lLnRhYnMuVGFiICYgeyBnZXRIb3N0TmFtZTogKCkgPT4gc3RyaW5nIH0pIHwgdW5kZWZpbmVkXG4+IHtcblx0cmV0dXJuIG5ldyBQcm9taXNlPChjaHJvbWUudGFicy5UYWIgJiB7IGdldEhvc3ROYW1lOiAoKSA9PiBzdHJpbmcgfSkgfCB1bmRlZmluZWQ+KHJlc29sdmUgPT4ge1xuXHRcdGNocm9tZS50YWJzLnF1ZXJ5KHsgY3VycmVudFdpbmRvdzogdHJ1ZSwgYWN0aXZlOiB0cnVlIH0sIGZ1bmN0aW9uICh0YWJzKSB7XG5cdFx0XHRpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG5cdFx0XHRcdHJlc29sdmUodW5kZWZpbmVkKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBjdXJyZW50VGFiOiBhbnkgPSB0YWJzWzBdO1xuXHRcdFx0aWYgKCFjdXJyZW50VGFiPy51cmwpIHtcblx0XHRcdFx0cmVzb2x2ZSh1bmRlZmluZWQpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGN1cnJlbnRUYWIuZ2V0SG9zdE5hbWUgPSAoKSA9PiB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0cmV0dXJuIG5ldyBVUkwoY3VycmVudFRhYi51cmwpLmhvc3RuYW1lO1xuXHRcdFx0XHR9IGNhdGNoIHtcblx0XHRcdFx0XHRyZXR1cm4gJyc7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRyZXNvbHZlKGN1cnJlbnRUYWIpO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVNlc3Npb25IZWFkZXJzKHJ1bGVPcHRpb25zOiBjaHJvbWUuZGVjbGFyYXRpdmVOZXRSZXF1ZXN0LlVwZGF0ZVJ1bGVPcHRpb25zKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcblx0XHRjaHJvbWUuZGVjbGFyYXRpdmVOZXRSZXF1ZXN0LnVwZGF0ZVNlc3Npb25SdWxlcyhydWxlT3B0aW9ucywgcmVzb2x2ZSk7XG5cdH0pO1xufVxuXG4vLyBXaW5kb3cgSUQgb2YgdGFiIHRvIGNhcHR1cmUsIGVnIGdldEN1cnJlbnRUYWIoKS53aW5kb3dJZDtcbmV4cG9ydCBmdW5jdGlvbiBjYXB0dXJlVmlzaWJsZVRhYih3aW5kb3dJZDogbnVtYmVyKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZTxzdHJpbmc+KHJlc29sdmUgPT5cblx0XHRjaHJvbWUudGFicy5jYXB0dXJlVmlzaWJsZVRhYih3aW5kb3dJZCwgeyBmb3JtYXQ6ICdwbmcnIH0sIHJlc29sdmUpXG5cdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRab29tRmFjdG9yKHRhYklkOiBudW1iZXIpOiBQcm9taXNlPG51bWJlcj4ge1xuXHRyZXR1cm4gbmV3IFByb21pc2U8bnVtYmVyPihyZXNvbHZlID0+IGNocm9tZS50YWJzLmdldFpvb20odGFiSWQsIHJlc29sdmUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEV4dGVuc2lvbkljb24oaWNvbjogY2hyb21lLmJyb3dzZXJBY3Rpb24uVGFiSWNvbkRldGFpbHMpOiBQcm9taXNlPGJvb2xlYW4+IHtcblx0cmV0dXJuIG5ldyBQcm9taXNlPGJvb2xlYW4+KHJlc29sdmUgPT4ge1xuXHRcdGNocm9tZS5hY3Rpb24uc2V0SWNvbihpY29uLCAoKSA9PiB7XG5cdFx0XHRyZXNvbHZlKHRydWUpO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4ZWN1dGVTY3JpcHQoXG5cdHRhYklkOiBudW1iZXIsXG5cdGZpbGVQYXRoOiBzdHJpbmcsXG5cdGFsbEZyYW1lcz86IGJvb2xlYW5cbik6IFByb21pc2U8Ym9vbGVhbj4ge1xuXHRyZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4ocmVzb2x2ZSA9PiB7XG5cdFx0Y2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KFxuXHRcdFx0eyB0YXJnZXQ6IHsgdGFiSWQsIGFsbEZyYW1lczogYWxsRnJhbWVzID8/IHRydWUgfSwgZmlsZXM6IFtmaWxlUGF0aF0gfSxcblx0XHRcdCgpID0+IHtcblx0XHRcdFx0cmVzb2x2ZSh0cnVlKTtcblx0XHRcdH1cblx0XHQpO1xuXHR9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQWxsb3dlZEZpbGVTY2hlbWVBY2Nlc3MoKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcblx0XHRjaHJvbWUuZXh0ZW5zaW9uLmlzQWxsb3dlZEZpbGVTY2hlbWVBY2Nlc3MocmVzb2x2ZSk7XG5cdH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcG9zdEJhY2tncm91bmRNZXNzYWdlKFxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2V4cGxpY2l0LW1vZHVsZS1ib3VuZGFyeS10eXBlc1xuXHRtZXNzYWdlOiBhbnlcbik6IGFueSB7XG5cdGNvbnN0IGV4dGVuc2lvbklkID0gdW5kZWZpbmVkOyAvLyB1bmRlZmluZWQgbWVhbnMgc2VuZCB0byBzZWxmLCBpbnN0ZWFkIG9mIGFub3RoZXIgZXh0ZW5zaW9uLlxuXHRjb25zdCBvcHRpb25zID0gdW5kZWZpbmVkO1xuXG5cdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcblx0XHRjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShleHRlbnNpb25JZCwgbWVzc2FnZSwgb3B0aW9ucywgcmVzb2x2ZSk7XG5cdH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3RvcmFnZUl0ZW08VD4oa2V5OiBzdHJpbmcpOiBQcm9taXNlPFQgfCB1bmRlZmluZWQ+IHtcblx0Y29uc3QgZm9ybWF0dGVkS2V5ID0gZm9ybWF0S2V5KGtleSk7XG5cdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtmb3JtYXR0ZWRLZXldLCBmdW5jdGlvbiAocmVzdWx0KSB7XG5cdFx0XHRcdHJlc29sdmUocmVzdWx0W2Zvcm1hdHRlZEtleV0pO1xuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaCB7XG5cdFx0XHQvLyBEbyBub3RoaW5nIGlmIGNhY2hlIGZhaWxzLlxuXHRcdFx0cmVzb2x2ZSh1bmRlZmluZWQpO1xuXHRcdH1cblx0fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRTdG9yYWdlSXRlbTxUPihrZXk6IHN0cmluZywgdmFsdWU6IFQpOiBQcm9taXNlPGJvb2xlYW4+IHtcblx0Y29uc3QgZm9ybWF0dGVkS2V5ID0gZm9ybWF0S2V5KGtleSk7XG5cdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgW2Zvcm1hdHRlZEtleV06IHZhbHVlIH0sICgpID0+IHtcblx0XHRcdFx0cmVzb2x2ZSh0cnVlKTtcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2gge1xuXHRcdFx0Ly8gRG8gbm90aGluZyBpZiBjYWNoZSBmYWlscy5cblx0XHRcdHJlc29sdmUoZmFsc2UpO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEtleShrZXk6IHN0cmluZykge1xuXHRjb25zdCBrZXlQcmVmaXggPSAnYXBwJztcblx0cmV0dXJuIGAke2tleVByZWZpeH0tJHtrZXl9YDtcbn1cbiIsImltcG9ydCB7IGdldFN0b3JhZ2VJdGVtLCBzZXRTdG9yYWdlSXRlbSB9IGZyb20gJy4uL2Nocm9tZS9hc3luYyc7XG5pbXBvcnQgeyB2NCBhcyB1dWlkdjQgfSBmcm9tICd1dWlkJztcblxuZXhwb3J0IGludGVyZmFjZSBBcHBDb25maWcge1xuXHQvLyBHZXRzIHRoZSBjbGllbnQgdXVpZC5cblx0Z2V0Q2xpZW50VXVpZDogKCkgPT4gUHJvbWlzZTxzdHJpbmc+O1xuXG5cdC8vIFNldC9nZXQgY3VycmVudCB1c2VyIGVtYWlsLlxuXHRnZXRFbWFpbDogKCkgPT4gUHJvbWlzZTxzdHJpbmc+O1xuXHRzZXRFbWFpbDogKGVtYWlsOiBzdHJpbmcpID0+IFByb21pc2U8Ym9vbGVhbj47XG5cblx0Ly8gU2V0L2dldCBjb25maWd1cmVkIG1hbmdhIGZvbnQgZmFtaWx5LlxuXHRnZXRGb250RmFtaWx5OiAoKSA9PiBQcm9taXNlPHN0cmluZz47XG5cdHNldEZvbnRGYW1pbHk6IChmb250RmFtaWx5OiBzdHJpbmcpID0+IFByb21pc2U8Ym9vbGVhbj47XG5cblx0Ly8gU2V0L2dldCBjb25maWd1cmVkIG1hbmdhIGZvbnQgY29sb3IuXG5cdGdldEZvbnRDb2xvcjogKCkgPT4gUHJvbWlzZTxzdHJpbmc+O1xuXHRzZXRGb250Q29sb3I6IChmb250Q29sb3I6IHN0cmluZykgPT4gUHJvbWlzZTxib29sZWFuPjtcblxuXHQvLyBTZXQvZ2V0IGNvbmZpZ3VyZWQgbWFuZ2EgZm9udCB3ZWlnaHQuXG5cdGdldEZvbnRXZWlnaHQ6ICgpID0+IFByb21pc2U8c3RyaW5nPjtcblx0c2V0Rm9udFdlaWdodDogKGZvbnRXZWlnaHQ6IHN0cmluZykgPT4gUHJvbWlzZTxib29sZWFuPjtcblxuXHQvLyBhZGQvcmVtb3ZlL2dldCBhY3RpdmUgdHJhbnNsYXRpb24gdXJscy5cblx0Ly8gQW4gYWN0aXZlIHVybCBpcyBhIHNpdGUgdGhlIGV4dGVuc2lvbiB3aWxsIHNjYW4gZm9yIHRyYW5zbGF0aW9uIG9wcG9ydHVuaXRpZXMuXG5cdGdldEFjdGl2ZVVybHM6ICgpID0+IFByb21pc2U8c3RyaW5nW10+O1xuXHRhZGRBY3RpdmVVcmw6IChhY3RpdmVVcmw6IHN0cmluZykgPT4gUHJvbWlzZTxib29sZWFuPjtcblx0cmVtb3ZlQWN0aXZlVXJsOiAoYWN0aXZlVXJsOiBzdHJpbmcpID0+IFByb21pc2U8Ym9vbGVhbj47XG59XG5cbmVudW0gS2V5cyB7XG5cdEVtYWlsID0gJ2VtYWlsJyxcblx0Rm9udEZhbWlseSA9ICdmb250RmFtaWx5Jyxcblx0Rm9udENvbG9yID0gJ2ZvbnRDb2xvcicsXG5cdEZvbnRXZWlnaHQgPSAnZm9udFdlaWdodCcsXG5cdEFjdGl2ZVVybHMgPSAnYWN0aXZlVXJscycsXG5cdENsaWVudFV1aWQgPSAnY2xpZW50VXVpZCdcbn1cblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRzID0gT2JqZWN0LmZyZWV6ZSh7XG5cdGVtYWlsOiAnJyxcblx0Zm9udEZhbWlseTogJ0NDIFdpbGQgV29yZHMnLFxuXHRmb250Q29sb3I6ICcjMDAwMDAwJyxcblx0Zm9udFdlaWdodDogJ2luaXRpYWwnXG59KTtcblxuLy8gVXNlZCB0byBjaGVjayBpZiBhbnkgb2YgdGhlIGFjdGl2ZVVybCBhcHBDb25maWcgcHJvcGVydGllcyBoYXZlIGJlZW4gYWNjZXNzZWQuXG4vLyBUaGlzIGlzIHNvIGRlZmF1bHRzIGNhbiBiZSBpbml0aWFsaXplZC5cbi8vIFRoaXMgY2Fubm90IGJlIGRvbmUgaW4gY2hyb21lLnJ1bnRpbWUub25JbnN0YWxsZWQgZHVlIHRvIHRoYXQgZXZlbnQgYmVpbmcgdHJpZ2dlcmVkIG9uIGNocm9tZSB1cGRhdGVzLFxuLy8gYW5kIG9uIGFwcCB1cGRhdGVzLlxuY29uc3QgaGFzSW5pdEFjdGl2ZVVybERlZmF1bHRzID0gJ19pc0FjdGl2ZVVybEluaXRLZXknO1xuY29uc3QgY29tbW9uTWFuZ2FTaXRlcyA9IFtdO1xuXG5leHBvcnQgY29uc3QgYXBwQ29uZmlnOiBBcHBDb25maWcgPSBPYmplY3QuZnJlZXplKHtcblx0Z2V0Q2xpZW50VXVpZDogYXN5bmMgKCkgPT4ge1xuXHRcdGNvbnN0IGNsaWVudFV1aWQgPSBhd2FpdCBnZXRTdG9yYWdlSXRlbTxzdHJpbmc+KEtleXMuQ2xpZW50VXVpZCk7XG5cdFx0aWYgKGNsaWVudFV1aWQpIHtcblx0XHRcdHJldHVybiBjbGllbnRVdWlkO1xuXHRcdH1cblxuXHRcdC8vIEluaXRpYWxpemUgY2xpZW50IHV1aWQuXG5cdFx0Ly8gSWYgc3RvcmFnZSBpcyBmdWxsLCB0aGlzIGNvdWxkIGZhaWwgcmVwZWF0ZWRseSwgYnV0IGNsaWVudCB1dWlkcyBhcmUgbm90IGNydWNpYWwuXG5cdFx0Y29uc3QgbmV3VXVpZCA9IHV1aWR2NCgpO1xuXHRcdGF3YWl0IHNldFN0b3JhZ2VJdGVtPHN0cmluZz4oS2V5cy5DbGllbnRVdWlkLCBuZXdVdWlkKTtcblx0XHRyZXR1cm4gbmV3VXVpZDtcblx0fSxcblxuXHRnZXRFbWFpbDogYXN5bmMgKCkgPT4gKGF3YWl0IGdldFN0b3JhZ2VJdGVtPHN0cmluZz4oS2V5cy5FbWFpbCkpID8/IGRlZmF1bHRzLmVtYWlsLFxuXHRzZXRFbWFpbDogYXN5bmMgKGVtYWlsOiBzdHJpbmcpID0+IGF3YWl0IHNldFN0b3JhZ2VJdGVtPHN0cmluZz4oS2V5cy5FbWFpbCwgZW1haWwpLFxuXG5cdGdldEZvbnRGYW1pbHk6IGFzeW5jICgpID0+XG5cdFx0KGF3YWl0IGdldFN0b3JhZ2VJdGVtPHN0cmluZz4oS2V5cy5Gb250RmFtaWx5KSkgPz8gZGVmYXVsdHMuZm9udEZhbWlseSxcblx0c2V0Rm9udEZhbWlseTogYXN5bmMgKGZvbnRGYW1pbHk6IHN0cmluZykgPT5cblx0XHRhd2FpdCBzZXRTdG9yYWdlSXRlbTxzdHJpbmc+KEtleXMuRm9udEZhbWlseSwgZm9udEZhbWlseSksXG5cblx0Z2V0Rm9udENvbG9yOiBhc3luYyAoKSA9PiAoYXdhaXQgZ2V0U3RvcmFnZUl0ZW08c3RyaW5nPihLZXlzLkZvbnRDb2xvcikpID8/IGRlZmF1bHRzLmZvbnRDb2xvcixcblx0c2V0Rm9udENvbG9yOiBhc3luYyAoZm9udENvbG9yOiBzdHJpbmcpID0+XG5cdFx0YXdhaXQgc2V0U3RvcmFnZUl0ZW08c3RyaW5nPihLZXlzLkZvbnRDb2xvciwgZm9udENvbG9yKSxcblxuXHRnZXRGb250V2VpZ2h0OiBhc3luYyAoKSA9PlxuXHRcdChhd2FpdCBnZXRTdG9yYWdlSXRlbTxzdHJpbmc+KEtleXMuRm9udFdlaWdodCkpID8/IGRlZmF1bHRzLmZvbnRXZWlnaHQsXG5cdHNldEZvbnRXZWlnaHQ6IGFzeW5jIChmb250V2VpZ2h0OiBzdHJpbmcpID0+XG5cdFx0YXdhaXQgc2V0U3RvcmFnZUl0ZW08c3RyaW5nPihLZXlzLkZvbnRXZWlnaHQsIGZvbnRXZWlnaHQpLFxuXG5cdGdldEFjdGl2ZVVybHM6IGFzeW5jICgpID0+IHtcblx0XHRjb25zdCBoYXNJbml0RGVmYXVsdHMgPSBhd2FpdCBnZXRTdG9yYWdlSXRlbTxib29sZWFuPihoYXNJbml0QWN0aXZlVXJsRGVmYXVsdHMpO1xuXHRcdGlmICghaGFzSW5pdERlZmF1bHRzKSB7XG5cdFx0XHRhd2FpdCBzZXRTdG9yYWdlSXRlbTxzdHJpbmdbXT4oS2V5cy5BY3RpdmVVcmxzLCBjb21tb25NYW5nYVNpdGVzKTtcblx0XHRcdGF3YWl0IHNldFN0b3JhZ2VJdGVtPGJvb2xlYW4+KGhhc0luaXRBY3RpdmVVcmxEZWZhdWx0cywgdHJ1ZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIChhd2FpdCBnZXRTdG9yYWdlSXRlbTxzdHJpbmdbXT4oS2V5cy5BY3RpdmVVcmxzKSkgPz8gW107XG5cdH0sXG5cdGFkZEFjdGl2ZVVybDogYXN5bmMgKGFjdGl2ZVVybDogc3RyaW5nKSA9PiB7XG5cdFx0Y29uc3QgaGFzSW5pdERlZmF1bHRzID0gYXdhaXQgZ2V0U3RvcmFnZUl0ZW08Ym9vbGVhbj4oaGFzSW5pdEFjdGl2ZVVybERlZmF1bHRzKTtcblx0XHRpZiAoIWhhc0luaXREZWZhdWx0cykge1xuXHRcdFx0YXdhaXQgc2V0U3RvcmFnZUl0ZW08c3RyaW5nW10+KEtleXMuQWN0aXZlVXJscywgY29tbW9uTWFuZ2FTaXRlcyk7XG5cdFx0XHRhd2FpdCBzZXRTdG9yYWdlSXRlbTxib29sZWFuPihoYXNJbml0QWN0aXZlVXJsRGVmYXVsdHMsIHRydWUpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGFjdGl2ZVVybHMgPSAoYXdhaXQgZ2V0U3RvcmFnZUl0ZW08c3RyaW5nW10+KEtleXMuQWN0aXZlVXJscykpID8/IFtdO1xuXHRcdHJldHVybiBhd2FpdCBzZXRTdG9yYWdlSXRlbTxzdHJpbmdbXT4oS2V5cy5BY3RpdmVVcmxzLCBbLi4uYWN0aXZlVXJscywgYWN0aXZlVXJsXSk7XG5cdH0sXG5cdHJlbW92ZUFjdGl2ZVVybDogYXN5bmMgKGFjdGl2ZVVybDogc3RyaW5nKSA9PiB7XG5cdFx0Y29uc3QgaGFzSW5pdERlZmF1bHRzID0gYXdhaXQgZ2V0U3RvcmFnZUl0ZW08Ym9vbGVhbj4oaGFzSW5pdEFjdGl2ZVVybERlZmF1bHRzKTtcblx0XHRpZiAoIWhhc0luaXREZWZhdWx0cykge1xuXHRcdFx0YXdhaXQgc2V0U3RvcmFnZUl0ZW08c3RyaW5nW10+KEtleXMuQWN0aXZlVXJscywgY29tbW9uTWFuZ2FTaXRlcyk7XG5cdFx0XHRhd2FpdCBzZXRTdG9yYWdlSXRlbTxib29sZWFuPihoYXNJbml0QWN0aXZlVXJsRGVmYXVsdHMsIHRydWUpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGFjdGl2ZVVybHMgPSAoYXdhaXQgZ2V0U3RvcmFnZUl0ZW08c3RyaW5nW10+KEtleXMuQWN0aXZlVXJscykpID8/IFtdO1xuXHRcdHJldHVybiBhd2FpdCBzZXRTdG9yYWdlSXRlbTxzdHJpbmdbXT4oXG5cdFx0XHRLZXlzLkFjdGl2ZVVybHMsXG5cdFx0XHRhY3RpdmVVcmxzLmZpbHRlcih1cmwgPT4gdXJsICE9PSBhY3RpdmVVcmwpXG5cdFx0KTtcblx0fVxufSk7XG4iLCJleHBvcnQgeyBhcHBDb25maWcsIEFwcENvbmZpZywgZGVmYXVsdHMgfSBmcm9tICcuL2FwcENvbmZpZyc7XHJcbiIsImV4cG9ydCBpbnRlcmZhY2UgVHJhbnNsYXRpb25SZXN1bHQge1xuXHRvcmlnaW5hbExhbmd1YWdlOiBzdHJpbmc7XG5cdHRyYW5zbGF0ZWRUZXh0OiBzdHJpbmc7XG5cdG1pblg6IG51bWJlcjtcblx0bWluWTogbnVtYmVyO1xuXHRtYXhYOiBudW1iZXI7XG5cdG1heFk6IG51bWJlcjtcblx0YmFja2dyb3VuZD86IHN0cmluZzsgLy8gQmFzZTY0IGVuY29kZWQgc3RyaW5nIHdpdGggdGhlIG9yaWdpbmFsIHRleHQgcmVtb3ZlZC5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBUcmFuc2xhdGlvblJlc3VsdHMge1xuXHRpbWFnZTogeyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9O1xuXHR0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9uUmVzdWx0W107XG5cblx0Ly8gT3B0aW9uYWwgY29udmVuaWVuY2UgcmV0dXJuLlxuXHQvLyBiYXNlNjQgZW5jb2RlZCBzdHJpbmcgb2YgdGhlIGltYWdlLlxuXHRiYXNlNjREYXRhPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2NhbGVUcmFuc2xhdGlvbihcblx0dGFyZ2V0V2lkdGg6IG51bWJlcixcblx0dGFyZ2V0SGVpZ2h0OiBudW1iZXIsXG5cdG9yaWdpbmFsV2lkdGg6IG51bWJlcixcblx0b3JpZ2luYWxIZWlnaHQ6IG51bWJlcixcblx0cmVzdWx0OiBUcmFuc2xhdGlvblJlc3VsdFxuKTogVHJhbnNsYXRpb25SZXN1bHQge1xuXHRjb25zdCBzY2FsZVggPSB0YXJnZXRXaWR0aCAvIG9yaWdpbmFsV2lkdGg7XG5cdGNvbnN0IHNjYWxlWSA9IHRhcmdldEhlaWdodCAvIG9yaWdpbmFsSGVpZ2h0O1xuXG5cdHJldHVybiB7XG5cdFx0b3JpZ2luYWxMYW5ndWFnZTogcmVzdWx0Lm9yaWdpbmFsTGFuZ3VhZ2UsXG5cdFx0dHJhbnNsYXRlZFRleHQ6IHJlc3VsdC50cmFuc2xhdGVkVGV4dCxcblx0XHRtaW5YOiBNYXRoLnJvdW5kKHNjYWxlWCAqIHJlc3VsdC5taW5YKSxcblx0XHRtaW5ZOiBNYXRoLnJvdW5kKHNjYWxlWSAqIHJlc3VsdC5taW5ZKSxcblx0XHRtYXhYOiBNYXRoLnJvdW5kKHNjYWxlWCAqIHJlc3VsdC5tYXhYKSxcblx0XHRtYXhZOiBNYXRoLnJvdW5kKHNjYWxlWSAqIHJlc3VsdC5tYXhZKSxcblx0XHRiYWNrZ3JvdW5kOiByZXN1bHQuYmFja2dyb3VuZFxuXHR9O1xufVxuXG50eXBlIFdpZHRoID0gbnVtYmVyO1xudHlwZSBIZWlnaHQgPSBudW1iZXI7XG5cbmV4cG9ydCBmdW5jdGlvbiBjYWxjdWxhdGVSZXNpemVkQXNwZWN0UmF0aW8ocGFyYW1zOiB7XG5cdHdpZHRoOiBudW1iZXI7XG5cdGhlaWdodDogbnVtYmVyO1xuXHR3aWR0aE1heFB4OiBudW1iZXI7XG5cdGhlaWdodE1heFB4OiBudW1iZXI7XG59KTogW1dpZHRoLCBIZWlnaHRdIHtcblx0Y29uc3QgeyB3aWR0aCwgaGVpZ2h0LCB3aWR0aE1heFB4LCBoZWlnaHRNYXhQeCB9ID0gcGFyYW1zO1xuXHQvLyBgYWxyZWFkeVdpdGhpbkJvdW5kc2AgaW50ZW50aW9uYWxseSB1c2VzIGB8fGAgaW5zdGVhZCBvZiBgJiZgLFxuXHQvLyBzbyB0aGF0IGltYWdlcyBzbGlnaHRseSBvdmVyIGJvdW5kcyBhcmUgbGlrZWx5IG5vdCB0b3VjaGVkLlxuXHQvLyBBbHRob3VnaCBleHBlcmltZW50aW5nIHdpdGggYCYmYCBpbnN0ZWFkIG9mIGB8fCBtYXkgYmUgdmlhYmxlLlxuXHRjb25zdCBhbHJlYWR5V2l0aGluQm91bmRzID0gd2lkdGggPD0gd2lkdGhNYXhQeCB8fCBoZWlnaHQgPD0gaGVpZ2h0TWF4UHg7XG5cdGlmIChhbHJlYWR5V2l0aGluQm91bmRzKSB7XG5cdFx0cmV0dXJuIFt3aWR0aCwgaGVpZ2h0XTtcblx0fVxuXG5cdC8vIGBNYXRoLm1heGAgKHZzIGBNYXRoLm1pbmApIGlzIGludGVudGlvbmFsbHkgdXNlZCB0byBmYXZvciBsYXJnZXIgaW1hZ2VzLlxuXHRjb25zdCByZXNpemVkQXNwZWN0UmF0aW8gPSBNYXRoLm1heChoZWlnaHRNYXhQeCAvIGhlaWdodCwgd2lkdGhNYXhQeCAvIHdpZHRoKTtcblx0cmV0dXJuIFtNYXRoLnJvdW5kKHdpZHRoICogcmVzaXplZEFzcGVjdFJhdGlvKSwgTWF0aC5yb3VuZChoZWlnaHQgKiByZXNpemVkQXNwZWN0UmF0aW8pXTtcbn1cbiIsImV4cG9ydCB7IGRlZmF1bHQgYXMgdjEgfSBmcm9tICcuL3YxLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgdjMgfSBmcm9tICcuL3YzLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgdjQgfSBmcm9tICcuL3Y0LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgdjUgfSBmcm9tICcuL3Y1LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTklMIH0gZnJvbSAnLi9uaWwuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB2ZXJzaW9uIH0gZnJvbSAnLi92ZXJzaW9uLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgdmFsaWRhdGUgfSBmcm9tICcuL3ZhbGlkYXRlLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc3RyaW5naWZ5IH0gZnJvbSAnLi9zdHJpbmdpZnkuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBwYXJzZSB9IGZyb20gJy4vcGFyc2UuanMnOyIsIi8qXG4gKiBCcm93c2VyLWNvbXBhdGlibGUgSmF2YVNjcmlwdCBNRDVcbiAqXG4gKiBNb2RpZmljYXRpb24gb2YgSmF2YVNjcmlwdCBNRDVcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9ibHVlaW1wL0phdmFTY3JpcHQtTUQ1XG4gKlxuICogQ29weXJpZ2h0IDIwMTEsIFNlYmFzdGlhbiBUc2NoYW5cbiAqIGh0dHBzOi8vYmx1ZWltcC5uZXRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2U6XG4gKiBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxuICpcbiAqIEJhc2VkIG9uXG4gKiBBIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIFJTQSBEYXRhIFNlY3VyaXR5LCBJbmMuIE1ENSBNZXNzYWdlXG4gKiBEaWdlc3QgQWxnb3JpdGhtLCBhcyBkZWZpbmVkIGluIFJGQyAxMzIxLlxuICogVmVyc2lvbiAyLjIgQ29weXJpZ2h0IChDKSBQYXVsIEpvaG5zdG9uIDE5OTkgLSAyMDA5XG4gKiBPdGhlciBjb250cmlidXRvcnM6IEdyZWcgSG9sdCwgQW5kcmV3IEtlcGVydCwgWWRuYXIsIExvc3RpbmV0XG4gKiBEaXN0cmlidXRlZCB1bmRlciB0aGUgQlNEIExpY2Vuc2VcbiAqIFNlZSBodHRwOi8vcGFqaG9tZS5vcmcudWsvY3J5cHQvbWQ1IGZvciBtb3JlIGluZm8uXG4gKi9cbmZ1bmN0aW9uIG1kNShieXRlcykge1xuICBpZiAodHlwZW9mIGJ5dGVzID09PSAnc3RyaW5nJykge1xuICAgIHZhciBtc2cgPSB1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoYnl0ZXMpKTsgLy8gVVRGOCBlc2NhcGVcblxuICAgIGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkobXNnLmxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1zZy5sZW5ndGg7ICsraSkge1xuICAgICAgYnl0ZXNbaV0gPSBtc2cuY2hhckNvZGVBdChpKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWQ1VG9IZXhFbmNvZGVkQXJyYXkod29yZHNUb01kNShieXRlc1RvV29yZHMoYnl0ZXMpLCBieXRlcy5sZW5ndGggKiA4KSk7XG59XG4vKlxuICogQ29udmVydCBhbiBhcnJheSBvZiBsaXR0bGUtZW5kaWFuIHdvcmRzIHRvIGFuIGFycmF5IG9mIGJ5dGVzXG4gKi9cblxuXG5mdW5jdGlvbiBtZDVUb0hleEVuY29kZWRBcnJheShpbnB1dCkge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIHZhciBsZW5ndGgzMiA9IGlucHV0Lmxlbmd0aCAqIDMyO1xuICB2YXIgaGV4VGFiID0gJzAxMjM0NTY3ODlhYmNkZWYnO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoMzI7IGkgKz0gOCkge1xuICAgIHZhciB4ID0gaW5wdXRbaSA+PiA1XSA+Pj4gaSAlIDMyICYgMHhmZjtcbiAgICB2YXIgaGV4ID0gcGFyc2VJbnQoaGV4VGFiLmNoYXJBdCh4ID4+PiA0ICYgMHgwZikgKyBoZXhUYWIuY2hhckF0KHggJiAweDBmKSwgMTYpO1xuICAgIG91dHB1dC5wdXNoKGhleCk7XG4gIH1cblxuICByZXR1cm4gb3V0cHV0O1xufVxuLyoqXG4gKiBDYWxjdWxhdGUgb3V0cHV0IGxlbmd0aCB3aXRoIHBhZGRpbmcgYW5kIGJpdCBsZW5ndGhcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldE91dHB1dExlbmd0aChpbnB1dExlbmd0aDgpIHtcbiAgcmV0dXJuIChpbnB1dExlbmd0aDggKyA2NCA+Pj4gOSA8PCA0KSArIDE0ICsgMTtcbn1cbi8qXG4gKiBDYWxjdWxhdGUgdGhlIE1ENSBvZiBhbiBhcnJheSBvZiBsaXR0bGUtZW5kaWFuIHdvcmRzLCBhbmQgYSBiaXQgbGVuZ3RoLlxuICovXG5cblxuZnVuY3Rpb24gd29yZHNUb01kNSh4LCBsZW4pIHtcbiAgLyogYXBwZW5kIHBhZGRpbmcgKi9cbiAgeFtsZW4gPj4gNV0gfD0gMHg4MCA8PCBsZW4gJSAzMjtcbiAgeFtnZXRPdXRwdXRMZW5ndGgobGVuKSAtIDFdID0gbGVuO1xuICB2YXIgYSA9IDE3MzI1ODQxOTM7XG4gIHZhciBiID0gLTI3MTczMzg3OTtcbiAgdmFyIGMgPSAtMTczMjU4NDE5NDtcbiAgdmFyIGQgPSAyNzE3MzM4Nzg7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSArPSAxNikge1xuICAgIHZhciBvbGRhID0gYTtcbiAgICB2YXIgb2xkYiA9IGI7XG4gICAgdmFyIG9sZGMgPSBjO1xuICAgIHZhciBvbGRkID0gZDtcbiAgICBhID0gbWQ1ZmYoYSwgYiwgYywgZCwgeFtpXSwgNywgLTY4MDg3NjkzNik7XG4gICAgZCA9IG1kNWZmKGQsIGEsIGIsIGMsIHhbaSArIDFdLCAxMiwgLTM4OTU2NDU4Nik7XG4gICAgYyA9IG1kNWZmKGMsIGQsIGEsIGIsIHhbaSArIDJdLCAxNywgNjA2MTA1ODE5KTtcbiAgICBiID0gbWQ1ZmYoYiwgYywgZCwgYSwgeFtpICsgM10sIDIyLCAtMTA0NDUyNTMzMCk7XG4gICAgYSA9IG1kNWZmKGEsIGIsIGMsIGQsIHhbaSArIDRdLCA3LCAtMTc2NDE4ODk3KTtcbiAgICBkID0gbWQ1ZmYoZCwgYSwgYiwgYywgeFtpICsgNV0sIDEyLCAxMjAwMDgwNDI2KTtcbiAgICBjID0gbWQ1ZmYoYywgZCwgYSwgYiwgeFtpICsgNl0sIDE3LCAtMTQ3MzIzMTM0MSk7XG4gICAgYiA9IG1kNWZmKGIsIGMsIGQsIGEsIHhbaSArIDddLCAyMiwgLTQ1NzA1OTgzKTtcbiAgICBhID0gbWQ1ZmYoYSwgYiwgYywgZCwgeFtpICsgOF0sIDcsIDE3NzAwMzU0MTYpO1xuICAgIGQgPSBtZDVmZihkLCBhLCBiLCBjLCB4W2kgKyA5XSwgMTIsIC0xOTU4NDE0NDE3KTtcbiAgICBjID0gbWQ1ZmYoYywgZCwgYSwgYiwgeFtpICsgMTBdLCAxNywgLTQyMDYzKTtcbiAgICBiID0gbWQ1ZmYoYiwgYywgZCwgYSwgeFtpICsgMTFdLCAyMiwgLTE5OTA0MDQxNjIpO1xuICAgIGEgPSBtZDVmZihhLCBiLCBjLCBkLCB4W2kgKyAxMl0sIDcsIDE4MDQ2MDM2ODIpO1xuICAgIGQgPSBtZDVmZihkLCBhLCBiLCBjLCB4W2kgKyAxM10sIDEyLCAtNDAzNDExMDEpO1xuICAgIGMgPSBtZDVmZihjLCBkLCBhLCBiLCB4W2kgKyAxNF0sIDE3LCAtMTUwMjAwMjI5MCk7XG4gICAgYiA9IG1kNWZmKGIsIGMsIGQsIGEsIHhbaSArIDE1XSwgMjIsIDEyMzY1MzUzMjkpO1xuICAgIGEgPSBtZDVnZyhhLCBiLCBjLCBkLCB4W2kgKyAxXSwgNSwgLTE2NTc5NjUxMCk7XG4gICAgZCA9IG1kNWdnKGQsIGEsIGIsIGMsIHhbaSArIDZdLCA5LCAtMTA2OTUwMTYzMik7XG4gICAgYyA9IG1kNWdnKGMsIGQsIGEsIGIsIHhbaSArIDExXSwgMTQsIDY0MzcxNzcxMyk7XG4gICAgYiA9IG1kNWdnKGIsIGMsIGQsIGEsIHhbaV0sIDIwLCAtMzczODk3MzAyKTtcbiAgICBhID0gbWQ1Z2coYSwgYiwgYywgZCwgeFtpICsgNV0sIDUsIC03MDE1NTg2OTEpO1xuICAgIGQgPSBtZDVnZyhkLCBhLCBiLCBjLCB4W2kgKyAxMF0sIDksIDM4MDE2MDgzKTtcbiAgICBjID0gbWQ1Z2coYywgZCwgYSwgYiwgeFtpICsgMTVdLCAxNCwgLTY2MDQ3ODMzNSk7XG4gICAgYiA9IG1kNWdnKGIsIGMsIGQsIGEsIHhbaSArIDRdLCAyMCwgLTQwNTUzNzg0OCk7XG4gICAgYSA9IG1kNWdnKGEsIGIsIGMsIGQsIHhbaSArIDldLCA1LCA1Njg0NDY0MzgpO1xuICAgIGQgPSBtZDVnZyhkLCBhLCBiLCBjLCB4W2kgKyAxNF0sIDksIC0xMDE5ODAzNjkwKTtcbiAgICBjID0gbWQ1Z2coYywgZCwgYSwgYiwgeFtpICsgM10sIDE0LCAtMTg3MzYzOTYxKTtcbiAgICBiID0gbWQ1Z2coYiwgYywgZCwgYSwgeFtpICsgOF0sIDIwLCAxMTYzNTMxNTAxKTtcbiAgICBhID0gbWQ1Z2coYSwgYiwgYywgZCwgeFtpICsgMTNdLCA1LCAtMTQ0NDY4MTQ2Nyk7XG4gICAgZCA9IG1kNWdnKGQsIGEsIGIsIGMsIHhbaSArIDJdLCA5LCAtNTE0MDM3ODQpO1xuICAgIGMgPSBtZDVnZyhjLCBkLCBhLCBiLCB4W2kgKyA3XSwgMTQsIDE3MzUzMjg0NzMpO1xuICAgIGIgPSBtZDVnZyhiLCBjLCBkLCBhLCB4W2kgKyAxMl0sIDIwLCAtMTkyNjYwNzczNCk7XG4gICAgYSA9IG1kNWhoKGEsIGIsIGMsIGQsIHhbaSArIDVdLCA0LCAtMzc4NTU4KTtcbiAgICBkID0gbWQ1aGgoZCwgYSwgYiwgYywgeFtpICsgOF0sIDExLCAtMjAyMjU3NDQ2Myk7XG4gICAgYyA9IG1kNWhoKGMsIGQsIGEsIGIsIHhbaSArIDExXSwgMTYsIDE4MzkwMzA1NjIpO1xuICAgIGIgPSBtZDVoaChiLCBjLCBkLCBhLCB4W2kgKyAxNF0sIDIzLCAtMzUzMDk1NTYpO1xuICAgIGEgPSBtZDVoaChhLCBiLCBjLCBkLCB4W2kgKyAxXSwgNCwgLTE1MzA5OTIwNjApO1xuICAgIGQgPSBtZDVoaChkLCBhLCBiLCBjLCB4W2kgKyA0XSwgMTEsIDEyNzI4OTMzNTMpO1xuICAgIGMgPSBtZDVoaChjLCBkLCBhLCBiLCB4W2kgKyA3XSwgMTYsIC0xNTU0OTc2MzIpO1xuICAgIGIgPSBtZDVoaChiLCBjLCBkLCBhLCB4W2kgKyAxMF0sIDIzLCAtMTA5NDczMDY0MCk7XG4gICAgYSA9IG1kNWhoKGEsIGIsIGMsIGQsIHhbaSArIDEzXSwgNCwgNjgxMjc5MTc0KTtcbiAgICBkID0gbWQ1aGgoZCwgYSwgYiwgYywgeFtpXSwgMTEsIC0zNTg1MzcyMjIpO1xuICAgIGMgPSBtZDVoaChjLCBkLCBhLCBiLCB4W2kgKyAzXSwgMTYsIC03MjI1MjE5NzkpO1xuICAgIGIgPSBtZDVoaChiLCBjLCBkLCBhLCB4W2kgKyA2XSwgMjMsIDc2MDI5MTg5KTtcbiAgICBhID0gbWQ1aGgoYSwgYiwgYywgZCwgeFtpICsgOV0sIDQsIC02NDAzNjQ0ODcpO1xuICAgIGQgPSBtZDVoaChkLCBhLCBiLCBjLCB4W2kgKyAxMl0sIDExLCAtNDIxODE1ODM1KTtcbiAgICBjID0gbWQ1aGgoYywgZCwgYSwgYiwgeFtpICsgMTVdLCAxNiwgNTMwNzQyNTIwKTtcbiAgICBiID0gbWQ1aGgoYiwgYywgZCwgYSwgeFtpICsgMl0sIDIzLCAtOTk1MzM4NjUxKTtcbiAgICBhID0gbWQ1aWkoYSwgYiwgYywgZCwgeFtpXSwgNiwgLTE5ODYzMDg0NCk7XG4gICAgZCA9IG1kNWlpKGQsIGEsIGIsIGMsIHhbaSArIDddLCAxMCwgMTEyNjg5MTQxNSk7XG4gICAgYyA9IG1kNWlpKGMsIGQsIGEsIGIsIHhbaSArIDE0XSwgMTUsIC0xNDE2MzU0OTA1KTtcbiAgICBiID0gbWQ1aWkoYiwgYywgZCwgYSwgeFtpICsgNV0sIDIxLCAtNTc0MzQwNTUpO1xuICAgIGEgPSBtZDVpaShhLCBiLCBjLCBkLCB4W2kgKyAxMl0sIDYsIDE3MDA0ODU1NzEpO1xuICAgIGQgPSBtZDVpaShkLCBhLCBiLCBjLCB4W2kgKyAzXSwgMTAsIC0xODk0OTg2NjA2KTtcbiAgICBjID0gbWQ1aWkoYywgZCwgYSwgYiwgeFtpICsgMTBdLCAxNSwgLTEwNTE1MjMpO1xuICAgIGIgPSBtZDVpaShiLCBjLCBkLCBhLCB4W2kgKyAxXSwgMjEsIC0yMDU0OTIyNzk5KTtcbiAgICBhID0gbWQ1aWkoYSwgYiwgYywgZCwgeFtpICsgOF0sIDYsIDE4NzMzMTMzNTkpO1xuICAgIGQgPSBtZDVpaShkLCBhLCBiLCBjLCB4W2kgKyAxNV0sIDEwLCAtMzA2MTE3NDQpO1xuICAgIGMgPSBtZDVpaShjLCBkLCBhLCBiLCB4W2kgKyA2XSwgMTUsIC0xNTYwMTk4MzgwKTtcbiAgICBiID0gbWQ1aWkoYiwgYywgZCwgYSwgeFtpICsgMTNdLCAyMSwgMTMwOTE1MTY0OSk7XG4gICAgYSA9IG1kNWlpKGEsIGIsIGMsIGQsIHhbaSArIDRdLCA2LCAtMTQ1NTIzMDcwKTtcbiAgICBkID0gbWQ1aWkoZCwgYSwgYiwgYywgeFtpICsgMTFdLCAxMCwgLTExMjAyMTAzNzkpO1xuICAgIGMgPSBtZDVpaShjLCBkLCBhLCBiLCB4W2kgKyAyXSwgMTUsIDcxODc4NzI1OSk7XG4gICAgYiA9IG1kNWlpKGIsIGMsIGQsIGEsIHhbaSArIDldLCAyMSwgLTM0MzQ4NTU1MSk7XG4gICAgYSA9IHNhZmVBZGQoYSwgb2xkYSk7XG4gICAgYiA9IHNhZmVBZGQoYiwgb2xkYik7XG4gICAgYyA9IHNhZmVBZGQoYywgb2xkYyk7XG4gICAgZCA9IHNhZmVBZGQoZCwgb2xkZCk7XG4gIH1cblxuICByZXR1cm4gW2EsIGIsIGMsIGRdO1xufVxuLypcbiAqIENvbnZlcnQgYW4gYXJyYXkgYnl0ZXMgdG8gYW4gYXJyYXkgb2YgbGl0dGxlLWVuZGlhbiB3b3Jkc1xuICogQ2hhcmFjdGVycyA+MjU1IGhhdmUgdGhlaXIgaGlnaC1ieXRlIHNpbGVudGx5IGlnbm9yZWQuXG4gKi9cblxuXG5mdW5jdGlvbiBieXRlc1RvV29yZHMoaW5wdXQpIHtcbiAgaWYgKGlucHV0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHZhciBsZW5ndGg4ID0gaW5wdXQubGVuZ3RoICogODtcbiAgdmFyIG91dHB1dCA9IG5ldyBVaW50MzJBcnJheShnZXRPdXRwdXRMZW5ndGgobGVuZ3RoOCkpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoODsgaSArPSA4KSB7XG4gICAgb3V0cHV0W2kgPj4gNV0gfD0gKGlucHV0W2kgLyA4XSAmIDB4ZmYpIDw8IGkgJSAzMjtcbiAgfVxuXG4gIHJldHVybiBvdXRwdXQ7XG59XG4vKlxuICogQWRkIGludGVnZXJzLCB3cmFwcGluZyBhdCAyXjMyLiBUaGlzIHVzZXMgMTYtYml0IG9wZXJhdGlvbnMgaW50ZXJuYWxseVxuICogdG8gd29yayBhcm91bmQgYnVncyBpbiBzb21lIEpTIGludGVycHJldGVycy5cbiAqL1xuXG5cbmZ1bmN0aW9uIHNhZmVBZGQoeCwgeSkge1xuICB2YXIgbHN3ID0gKHggJiAweGZmZmYpICsgKHkgJiAweGZmZmYpO1xuICB2YXIgbXN3ID0gKHggPj4gMTYpICsgKHkgPj4gMTYpICsgKGxzdyA+PiAxNik7XG4gIHJldHVybiBtc3cgPDwgMTYgfCBsc3cgJiAweGZmZmY7XG59XG4vKlxuICogQml0d2lzZSByb3RhdGUgYSAzMi1iaXQgbnVtYmVyIHRvIHRoZSBsZWZ0LlxuICovXG5cblxuZnVuY3Rpb24gYml0Um90YXRlTGVmdChudW0sIGNudCkge1xuICByZXR1cm4gbnVtIDw8IGNudCB8IG51bSA+Pj4gMzIgLSBjbnQ7XG59XG4vKlxuICogVGhlc2UgZnVuY3Rpb25zIGltcGxlbWVudCB0aGUgZm91ciBiYXNpYyBvcGVyYXRpb25zIHRoZSBhbGdvcml0aG0gdXNlcy5cbiAqL1xuXG5cbmZ1bmN0aW9uIG1kNWNtbihxLCBhLCBiLCB4LCBzLCB0KSB7XG4gIHJldHVybiBzYWZlQWRkKGJpdFJvdGF0ZUxlZnQoc2FmZUFkZChzYWZlQWRkKGEsIHEpLCBzYWZlQWRkKHgsIHQpKSwgcyksIGIpO1xufVxuXG5mdW5jdGlvbiBtZDVmZihhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XG4gIHJldHVybiBtZDVjbW4oYiAmIGMgfCB+YiAmIGQsIGEsIGIsIHgsIHMsIHQpO1xufVxuXG5mdW5jdGlvbiBtZDVnZyhhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XG4gIHJldHVybiBtZDVjbW4oYiAmIGQgfCBjICYgfmQsIGEsIGIsIHgsIHMsIHQpO1xufVxuXG5mdW5jdGlvbiBtZDVoaChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XG4gIHJldHVybiBtZDVjbW4oYiBeIGMgXiBkLCBhLCBiLCB4LCBzLCB0KTtcbn1cblxuZnVuY3Rpb24gbWQ1aWkoYSwgYiwgYywgZCwgeCwgcywgdCkge1xuICByZXR1cm4gbWQ1Y21uKGMgXiAoYiB8IH5kKSwgYSwgYiwgeCwgcywgdCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1kNTsiLCJleHBvcnQgZGVmYXVsdCAnMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwJzsiLCJpbXBvcnQgdmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZS5qcyc7XG5cbmZ1bmN0aW9uIHBhcnNlKHV1aWQpIHtcbiAgaWYgKCF2YWxpZGF0ZSh1dWlkKSkge1xuICAgIHRocm93IFR5cGVFcnJvcignSW52YWxpZCBVVUlEJyk7XG4gIH1cblxuICB2YXIgdjtcbiAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KDE2KTsgLy8gUGFyc2UgIyMjIyMjIyMtLi4uLi0uLi4uLS4uLi4tLi4uLi4uLi4uLi4uXG5cbiAgYXJyWzBdID0gKHYgPSBwYXJzZUludCh1dWlkLnNsaWNlKDAsIDgpLCAxNikpID4+PiAyNDtcbiAgYXJyWzFdID0gdiA+Pj4gMTYgJiAweGZmO1xuICBhcnJbMl0gPSB2ID4+PiA4ICYgMHhmZjtcbiAgYXJyWzNdID0gdiAmIDB4ZmY7IC8vIFBhcnNlIC4uLi4uLi4uLSMjIyMtLi4uLi0uLi4uLS4uLi4uLi4uLi4uLlxuXG4gIGFycls0XSA9ICh2ID0gcGFyc2VJbnQodXVpZC5zbGljZSg5LCAxMyksIDE2KSkgPj4+IDg7XG4gIGFycls1XSA9IHYgJiAweGZmOyAvLyBQYXJzZSAuLi4uLi4uLi0uLi4uLSMjIyMtLi4uLi0uLi4uLi4uLi4uLi5cblxuICBhcnJbNl0gPSAodiA9IHBhcnNlSW50KHV1aWQuc2xpY2UoMTQsIDE4KSwgMTYpKSA+Pj4gODtcbiAgYXJyWzddID0gdiAmIDB4ZmY7IC8vIFBhcnNlIC4uLi4uLi4uLS4uLi4tLi4uLi0jIyMjLS4uLi4uLi4uLi4uLlxuXG4gIGFycls4XSA9ICh2ID0gcGFyc2VJbnQodXVpZC5zbGljZSgxOSwgMjMpLCAxNikpID4+PiA4O1xuICBhcnJbOV0gPSB2ICYgMHhmZjsgLy8gUGFyc2UgLi4uLi4uLi4tLi4uLi0uLi4uLS4uLi4tIyMjIyMjIyMjIyMjXG4gIC8vIChVc2UgXCIvXCIgdG8gYXZvaWQgMzItYml0IHRydW5jYXRpb24gd2hlbiBiaXQtc2hpZnRpbmcgaGlnaC1vcmRlciBieXRlcylcblxuICBhcnJbMTBdID0gKHYgPSBwYXJzZUludCh1dWlkLnNsaWNlKDI0LCAzNiksIDE2KSkgLyAweDEwMDAwMDAwMDAwICYgMHhmZjtcbiAgYXJyWzExXSA9IHYgLyAweDEwMDAwMDAwMCAmIDB4ZmY7XG4gIGFyclsxMl0gPSB2ID4+PiAyNCAmIDB4ZmY7XG4gIGFyclsxM10gPSB2ID4+PiAxNiAmIDB4ZmY7XG4gIGFyclsxNF0gPSB2ID4+PiA4ICYgMHhmZjtcbiAgYXJyWzE1XSA9IHYgJiAweGZmO1xuICByZXR1cm4gYXJyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBwYXJzZTsiLCJleHBvcnQgZGVmYXVsdCAvXig/OlswLTlhLWZdezh9LVswLTlhLWZdezR9LVsxLTVdWzAtOWEtZl17M30tWzg5YWJdWzAtOWEtZl17M30tWzAtOWEtZl17MTJ9fDAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCkkL2k7IiwiLy8gVW5pcXVlIElEIGNyZWF0aW9uIHJlcXVpcmVzIGEgaGlnaCBxdWFsaXR5IHJhbmRvbSAjIGdlbmVyYXRvci4gSW4gdGhlIGJyb3dzZXIgd2UgdGhlcmVmb3JlXG4vLyByZXF1aXJlIHRoZSBjcnlwdG8gQVBJIGFuZCBkbyBub3Qgc3VwcG9ydCBidWlsdC1pbiBmYWxsYmFjayB0byBsb3dlciBxdWFsaXR5IHJhbmRvbSBudW1iZXJcbi8vIGdlbmVyYXRvcnMgKGxpa2UgTWF0aC5yYW5kb20oKSkuXG52YXIgZ2V0UmFuZG9tVmFsdWVzO1xudmFyIHJuZHM4ID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcm5nKCkge1xuICAvLyBsYXp5IGxvYWQgc28gdGhhdCBlbnZpcm9ubWVudHMgdGhhdCBuZWVkIHRvIHBvbHlmaWxsIGhhdmUgYSBjaGFuY2UgdG8gZG8gc29cbiAgaWYgKCFnZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAvLyBnZXRSYW5kb21WYWx1ZXMgbmVlZHMgdG8gYmUgaW52b2tlZCBpbiBhIGNvbnRleHQgd2hlcmUgXCJ0aGlzXCIgaXMgYSBDcnlwdG8gaW1wbGVtZW50YXRpb24uIEFsc28sXG4gICAgLy8gZmluZCB0aGUgY29tcGxldGUgaW1wbGVtZW50YXRpb24gb2YgY3J5cHRvIChtc0NyeXB0bykgb24gSUUxMS5cbiAgICBnZXRSYW5kb21WYWx1ZXMgPSB0eXBlb2YgY3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChjcnlwdG8pIHx8IHR5cGVvZiBtc0NyeXB0byAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcyA9PT0gJ2Z1bmN0aW9uJyAmJiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChtc0NyeXB0byk7XG5cbiAgICBpZiAoIWdldFJhbmRvbVZhbHVlcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKCkgbm90IHN1cHBvcnRlZC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91dWlkanMvdXVpZCNnZXRyYW5kb212YWx1ZXMtbm90LXN1cHBvcnRlZCcpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBnZXRSYW5kb21WYWx1ZXMocm5kczgpO1xufSIsIi8vIEFkYXB0ZWQgZnJvbSBDaHJpcyBWZW5lc3MnIFNIQTEgY29kZSBhdFxuLy8gaHR0cDovL3d3dy5tb3ZhYmxlLXR5cGUuY28udWsvc2NyaXB0cy9zaGExLmh0bWxcbmZ1bmN0aW9uIGYocywgeCwgeSwgeikge1xuICBzd2l0Y2ggKHMpIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4geCAmIHkgXiB+eCAmIHo7XG5cbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4geCBeIHkgXiB6O1xuXG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuIHggJiB5IF4geCAmIHogXiB5ICYgejtcblxuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiB4IF4geSBeIHo7XG4gIH1cbn1cblxuZnVuY3Rpb24gUk9UTCh4LCBuKSB7XG4gIHJldHVybiB4IDw8IG4gfCB4ID4+PiAzMiAtIG47XG59XG5cbmZ1bmN0aW9uIHNoYTEoYnl0ZXMpIHtcbiAgdmFyIEsgPSBbMHg1YTgyNzk5OSwgMHg2ZWQ5ZWJhMSwgMHg4ZjFiYmNkYywgMHhjYTYyYzFkNl07XG4gIHZhciBIID0gWzB4Njc0NTIzMDEsIDB4ZWZjZGFiODksIDB4OThiYWRjZmUsIDB4MTAzMjU0NzYsIDB4YzNkMmUxZjBdO1xuXG4gIGlmICh0eXBlb2YgYnl0ZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFyIG1zZyA9IHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChieXRlcykpOyAvLyBVVEY4IGVzY2FwZVxuXG4gICAgYnl0ZXMgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXNnLmxlbmd0aDsgKytpKSB7XG4gICAgICBieXRlcy5wdXNoKG1zZy5jaGFyQ29kZUF0KGkpKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoIUFycmF5LmlzQXJyYXkoYnl0ZXMpKSB7XG4gICAgLy8gQ29udmVydCBBcnJheS1saWtlIHRvIEFycmF5XG4gICAgYnl0ZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChieXRlcyk7XG4gIH1cblxuICBieXRlcy5wdXNoKDB4ODApO1xuICB2YXIgbCA9IGJ5dGVzLmxlbmd0aCAvIDQgKyAyO1xuICB2YXIgTiA9IE1hdGguY2VpbChsIC8gMTYpO1xuICB2YXIgTSA9IG5ldyBBcnJheShOKTtcblxuICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgTjsgKytfaSkge1xuICAgIHZhciBhcnIgPSBuZXcgVWludDMyQXJyYXkoMTYpO1xuXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCAxNjsgKytqKSB7XG4gICAgICBhcnJbal0gPSBieXRlc1tfaSAqIDY0ICsgaiAqIDRdIDw8IDI0IHwgYnl0ZXNbX2kgKiA2NCArIGogKiA0ICsgMV0gPDwgMTYgfCBieXRlc1tfaSAqIDY0ICsgaiAqIDQgKyAyXSA8PCA4IHwgYnl0ZXNbX2kgKiA2NCArIGogKiA0ICsgM107XG4gICAgfVxuXG4gICAgTVtfaV0gPSBhcnI7XG4gIH1cblxuICBNW04gLSAxXVsxNF0gPSAoYnl0ZXMubGVuZ3RoIC0gMSkgKiA4IC8gTWF0aC5wb3coMiwgMzIpO1xuICBNW04gLSAxXVsxNF0gPSBNYXRoLmZsb29yKE1bTiAtIDFdWzE0XSk7XG4gIE1bTiAtIDFdWzE1XSA9IChieXRlcy5sZW5ndGggLSAxKSAqIDggJiAweGZmZmZmZmZmO1xuXG4gIGZvciAodmFyIF9pMiA9IDA7IF9pMiA8IE47ICsrX2kyKSB7XG4gICAgdmFyIFcgPSBuZXcgVWludDMyQXJyYXkoODApO1xuXG4gICAgZm9yICh2YXIgdCA9IDA7IHQgPCAxNjsgKyt0KSB7XG4gICAgICBXW3RdID0gTVtfaTJdW3RdO1xuICAgIH1cblxuICAgIGZvciAodmFyIF90ID0gMTY7IF90IDwgODA7ICsrX3QpIHtcbiAgICAgIFdbX3RdID0gUk9UTChXW190IC0gM10gXiBXW190IC0gOF0gXiBXW190IC0gMTRdIF4gV1tfdCAtIDE2XSwgMSk7XG4gICAgfVxuXG4gICAgdmFyIGEgPSBIWzBdO1xuICAgIHZhciBiID0gSFsxXTtcbiAgICB2YXIgYyA9IEhbMl07XG4gICAgdmFyIGQgPSBIWzNdO1xuICAgIHZhciBlID0gSFs0XTtcblxuICAgIGZvciAodmFyIF90MiA9IDA7IF90MiA8IDgwOyArK190Mikge1xuICAgICAgdmFyIHMgPSBNYXRoLmZsb29yKF90MiAvIDIwKTtcbiAgICAgIHZhciBUID0gUk9UTChhLCA1KSArIGYocywgYiwgYywgZCkgKyBlICsgS1tzXSArIFdbX3QyXSA+Pj4gMDtcbiAgICAgIGUgPSBkO1xuICAgICAgZCA9IGM7XG4gICAgICBjID0gUk9UTChiLCAzMCkgPj4+IDA7XG4gICAgICBiID0gYTtcbiAgICAgIGEgPSBUO1xuICAgIH1cblxuICAgIEhbMF0gPSBIWzBdICsgYSA+Pj4gMDtcbiAgICBIWzFdID0gSFsxXSArIGIgPj4+IDA7XG4gICAgSFsyXSA9IEhbMl0gKyBjID4+PiAwO1xuICAgIEhbM10gPSBIWzNdICsgZCA+Pj4gMDtcbiAgICBIWzRdID0gSFs0XSArIGUgPj4+IDA7XG4gIH1cblxuICByZXR1cm4gW0hbMF0gPj4gMjQgJiAweGZmLCBIWzBdID4+IDE2ICYgMHhmZiwgSFswXSA+PiA4ICYgMHhmZiwgSFswXSAmIDB4ZmYsIEhbMV0gPj4gMjQgJiAweGZmLCBIWzFdID4+IDE2ICYgMHhmZiwgSFsxXSA+PiA4ICYgMHhmZiwgSFsxXSAmIDB4ZmYsIEhbMl0gPj4gMjQgJiAweGZmLCBIWzJdID4+IDE2ICYgMHhmZiwgSFsyXSA+PiA4ICYgMHhmZiwgSFsyXSAmIDB4ZmYsIEhbM10gPj4gMjQgJiAweGZmLCBIWzNdID4+IDE2ICYgMHhmZiwgSFszXSA+PiA4ICYgMHhmZiwgSFszXSAmIDB4ZmYsIEhbNF0gPj4gMjQgJiAweGZmLCBIWzRdID4+IDE2ICYgMHhmZiwgSFs0XSA+PiA4ICYgMHhmZiwgSFs0XSAmIDB4ZmZdO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzaGExOyIsImltcG9ydCB2YWxpZGF0ZSBmcm9tICcuL3ZhbGlkYXRlLmpzJztcbi8qKlxuICogQ29udmVydCBhcnJheSBvZiAxNiBieXRlIHZhbHVlcyB0byBVVUlEIHN0cmluZyBmb3JtYXQgb2YgdGhlIGZvcm06XG4gKiBYWFhYWFhYWC1YWFhYLVhYWFgtWFhYWC1YWFhYWFhYWFhYWFhcbiAqL1xuXG52YXIgYnl0ZVRvSGV4ID0gW107XG5cbmZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgYnl0ZVRvSGV4LnB1c2goKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnN1YnN0cigxKSk7XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeShhcnIpIHtcbiAgdmFyIG9mZnNldCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMDtcbiAgLy8gTm90ZTogQmUgY2FyZWZ1bCBlZGl0aW5nIHRoaXMgY29kZSEgIEl0J3MgYmVlbiB0dW5lZCBmb3IgcGVyZm9ybWFuY2VcbiAgLy8gYW5kIHdvcmtzIGluIHdheXMgeW91IG1heSBub3QgZXhwZWN0LiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkL3B1bGwvNDM0XG4gIHZhciB1dWlkID0gKGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDJdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgM11dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA0XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDVdXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA3XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDhdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgOV1dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMV1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxM11dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxNF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxNV1dKS50b0xvd2VyQ2FzZSgpOyAvLyBDb25zaXN0ZW5jeSBjaGVjayBmb3IgdmFsaWQgVVVJRC4gIElmIHRoaXMgdGhyb3dzLCBpdCdzIGxpa2VseSBkdWUgdG8gb25lXG4gIC8vIG9mIHRoZSBmb2xsb3dpbmc6XG4gIC8vIC0gT25lIG9yIG1vcmUgaW5wdXQgYXJyYXkgdmFsdWVzIGRvbid0IG1hcCB0byBhIGhleCBvY3RldCAobGVhZGluZyB0b1xuICAvLyBcInVuZGVmaW5lZFwiIGluIHRoZSB1dWlkKVxuICAvLyAtIEludmFsaWQgaW5wdXQgdmFsdWVzIGZvciB0aGUgUkZDIGB2ZXJzaW9uYCBvciBgdmFyaWFudGAgZmllbGRzXG5cbiAgaWYgKCF2YWxpZGF0ZSh1dWlkKSkge1xuICAgIHRocm93IFR5cGVFcnJvcignU3RyaW5naWZpZWQgVVVJRCBpcyBpbnZhbGlkJyk7XG4gIH1cblxuICByZXR1cm4gdXVpZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3RyaW5naWZ5OyIsImltcG9ydCBybmcgZnJvbSAnLi9ybmcuanMnO1xuaW1wb3J0IHN0cmluZ2lmeSBmcm9tICcuL3N0cmluZ2lmeS5qcyc7IC8vICoqYHYxKClgIC0gR2VuZXJhdGUgdGltZS1iYXNlZCBVVUlEKipcbi8vXG4vLyBJbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vTGlvc0svVVVJRC5qc1xuLy8gYW5kIGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS91dWlkLmh0bWxcblxudmFyIF9ub2RlSWQ7XG5cbnZhciBfY2xvY2tzZXE7IC8vIFByZXZpb3VzIHV1aWQgY3JlYXRpb24gdGltZVxuXG5cbnZhciBfbGFzdE1TZWNzID0gMDtcbnZhciBfbGFzdE5TZWNzID0gMDsgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91dWlkanMvdXVpZCBmb3IgQVBJIGRldGFpbHNcblxuZnVuY3Rpb24gdjEob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgdmFyIGkgPSBidWYgJiYgb2Zmc2V0IHx8IDA7XG4gIHZhciBiID0gYnVmIHx8IG5ldyBBcnJheSgxNik7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgbm9kZSA9IG9wdGlvbnMubm9kZSB8fCBfbm9kZUlkO1xuICB2YXIgY2xvY2tzZXEgPSBvcHRpb25zLmNsb2Nrc2VxICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmNsb2Nrc2VxIDogX2Nsb2Nrc2VxOyAvLyBub2RlIGFuZCBjbG9ja3NlcSBuZWVkIHRvIGJlIGluaXRpYWxpemVkIHRvIHJhbmRvbSB2YWx1ZXMgaWYgdGhleSdyZSBub3RcbiAgLy8gc3BlY2lmaWVkLiAgV2UgZG8gdGhpcyBsYXppbHkgdG8gbWluaW1pemUgaXNzdWVzIHJlbGF0ZWQgdG8gaW5zdWZmaWNpZW50XG4gIC8vIHN5c3RlbSBlbnRyb3B5LiAgU2VlICMxODlcblxuICBpZiAobm9kZSA9PSBudWxsIHx8IGNsb2Nrc2VxID09IG51bGwpIHtcbiAgICB2YXIgc2VlZEJ5dGVzID0gb3B0aW9ucy5yYW5kb20gfHwgKG9wdGlvbnMucm5nIHx8IHJuZykoKTtcblxuICAgIGlmIChub2RlID09IG51bGwpIHtcbiAgICAgIC8vIFBlciA0LjUsIGNyZWF0ZSBhbmQgNDgtYml0IG5vZGUgaWQsICg0NyByYW5kb20gYml0cyArIG11bHRpY2FzdCBiaXQgPSAxKVxuICAgICAgbm9kZSA9IF9ub2RlSWQgPSBbc2VlZEJ5dGVzWzBdIHwgMHgwMSwgc2VlZEJ5dGVzWzFdLCBzZWVkQnl0ZXNbMl0sIHNlZWRCeXRlc1szXSwgc2VlZEJ5dGVzWzRdLCBzZWVkQnl0ZXNbNV1dO1xuICAgIH1cblxuICAgIGlmIChjbG9ja3NlcSA9PSBudWxsKSB7XG4gICAgICAvLyBQZXIgNC4yLjIsIHJhbmRvbWl6ZSAoMTQgYml0KSBjbG9ja3NlcVxuICAgICAgY2xvY2tzZXEgPSBfY2xvY2tzZXEgPSAoc2VlZEJ5dGVzWzZdIDw8IDggfCBzZWVkQnl0ZXNbN10pICYgMHgzZmZmO1xuICAgIH1cbiAgfSAvLyBVVUlEIHRpbWVzdGFtcHMgYXJlIDEwMCBuYW5vLXNlY29uZCB1bml0cyBzaW5jZSB0aGUgR3JlZ29yaWFuIGVwb2NoLFxuICAvLyAoMTU4Mi0xMC0xNSAwMDowMCkuICBKU051bWJlcnMgYXJlbid0IHByZWNpc2UgZW5vdWdoIGZvciB0aGlzLCBzb1xuICAvLyB0aW1lIGlzIGhhbmRsZWQgaW50ZXJuYWxseSBhcyAnbXNlY3MnIChpbnRlZ2VyIG1pbGxpc2Vjb25kcykgYW5kICduc2VjcydcbiAgLy8gKDEwMC1uYW5vc2Vjb25kcyBvZmZzZXQgZnJvbSBtc2Vjcykgc2luY2UgdW5peCBlcG9jaCwgMTk3MC0wMS0wMSAwMDowMC5cblxuXG4gIHZhciBtc2VjcyA9IG9wdGlvbnMubXNlY3MgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubXNlY3MgOiBEYXRlLm5vdygpOyAvLyBQZXIgNC4yLjEuMiwgdXNlIGNvdW50IG9mIHV1aWQncyBnZW5lcmF0ZWQgZHVyaW5nIHRoZSBjdXJyZW50IGNsb2NrXG4gIC8vIGN5Y2xlIHRvIHNpbXVsYXRlIGhpZ2hlciByZXNvbHV0aW9uIGNsb2NrXG5cbiAgdmFyIG5zZWNzID0gb3B0aW9ucy5uc2VjcyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5uc2VjcyA6IF9sYXN0TlNlY3MgKyAxOyAvLyBUaW1lIHNpbmNlIGxhc3QgdXVpZCBjcmVhdGlvbiAoaW4gbXNlY3MpXG5cbiAgdmFyIGR0ID0gbXNlY3MgLSBfbGFzdE1TZWNzICsgKG5zZWNzIC0gX2xhc3ROU2VjcykgLyAxMDAwMDsgLy8gUGVyIDQuMi4xLjIsIEJ1bXAgY2xvY2tzZXEgb24gY2xvY2sgcmVncmVzc2lvblxuXG4gIGlmIChkdCA8IDAgJiYgb3B0aW9ucy5jbG9ja3NlcSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY2xvY2tzZXEgPSBjbG9ja3NlcSArIDEgJiAweDNmZmY7XG4gIH0gLy8gUmVzZXQgbnNlY3MgaWYgY2xvY2sgcmVncmVzc2VzIChuZXcgY2xvY2tzZXEpIG9yIHdlJ3ZlIG1vdmVkIG9udG8gYSBuZXdcbiAgLy8gdGltZSBpbnRlcnZhbFxuXG5cbiAgaWYgKChkdCA8IDAgfHwgbXNlY3MgPiBfbGFzdE1TZWNzKSAmJiBvcHRpb25zLm5zZWNzID09PSB1bmRlZmluZWQpIHtcbiAgICBuc2VjcyA9IDA7XG4gIH0gLy8gUGVyIDQuMi4xLjIgVGhyb3cgZXJyb3IgaWYgdG9vIG1hbnkgdXVpZHMgYXJlIHJlcXVlc3RlZFxuXG5cbiAgaWYgKG5zZWNzID49IDEwMDAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwidXVpZC52MSgpOiBDYW4ndCBjcmVhdGUgbW9yZSB0aGFuIDEwTSB1dWlkcy9zZWNcIik7XG4gIH1cblxuICBfbGFzdE1TZWNzID0gbXNlY3M7XG4gIF9sYXN0TlNlY3MgPSBuc2VjcztcbiAgX2Nsb2Nrc2VxID0gY2xvY2tzZXE7IC8vIFBlciA0LjEuNCAtIENvbnZlcnQgZnJvbSB1bml4IGVwb2NoIHRvIEdyZWdvcmlhbiBlcG9jaFxuXG4gIG1zZWNzICs9IDEyMjE5MjkyODAwMDAwOyAvLyBgdGltZV9sb3dgXG5cbiAgdmFyIHRsID0gKChtc2VjcyAmIDB4ZmZmZmZmZikgKiAxMDAwMCArIG5zZWNzKSAlIDB4MTAwMDAwMDAwO1xuICBiW2krK10gPSB0bCA+Pj4gMjQgJiAweGZmO1xuICBiW2krK10gPSB0bCA+Pj4gMTYgJiAweGZmO1xuICBiW2krK10gPSB0bCA+Pj4gOCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsICYgMHhmZjsgLy8gYHRpbWVfbWlkYFxuXG4gIHZhciB0bWggPSBtc2VjcyAvIDB4MTAwMDAwMDAwICogMTAwMDAgJiAweGZmZmZmZmY7XG4gIGJbaSsrXSA9IHRtaCA+Pj4gOCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRtaCAmIDB4ZmY7IC8vIGB0aW1lX2hpZ2hfYW5kX3ZlcnNpb25gXG5cbiAgYltpKytdID0gdG1oID4+PiAyNCAmIDB4ZiB8IDB4MTA7IC8vIGluY2x1ZGUgdmVyc2lvblxuXG4gIGJbaSsrXSA9IHRtaCA+Pj4gMTYgJiAweGZmOyAvLyBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGAgKFBlciA0LjIuMiAtIGluY2x1ZGUgdmFyaWFudClcblxuICBiW2krK10gPSBjbG9ja3NlcSA+Pj4gOCB8IDB4ODA7IC8vIGBjbG9ja19zZXFfbG93YFxuXG4gIGJbaSsrXSA9IGNsb2Nrc2VxICYgMHhmZjsgLy8gYG5vZGVgXG5cbiAgZm9yICh2YXIgbiA9IDA7IG4gPCA2OyArK24pIHtcbiAgICBiW2kgKyBuXSA9IG5vZGVbbl07XG4gIH1cblxuICByZXR1cm4gYnVmIHx8IHN0cmluZ2lmeShiKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdjE7IiwiaW1wb3J0IHYzNSBmcm9tICcuL3YzNS5qcyc7XG5pbXBvcnQgbWQ1IGZyb20gJy4vbWQ1LmpzJztcbnZhciB2MyA9IHYzNSgndjMnLCAweDMwLCBtZDUpO1xuZXhwb3J0IGRlZmF1bHQgdjM7IiwiaW1wb3J0IHN0cmluZ2lmeSBmcm9tICcuL3N0cmluZ2lmeS5qcyc7XG5pbXBvcnQgcGFyc2UgZnJvbSAnLi9wYXJzZS5qcyc7XG5cbmZ1bmN0aW9uIHN0cmluZ1RvQnl0ZXMoc3RyKSB7XG4gIHN0ciA9IHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChzdHIpKTsgLy8gVVRGOCBlc2NhcGVcblxuICB2YXIgYnl0ZXMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIGJ5dGVzLnB1c2goc3RyLmNoYXJDb2RlQXQoaSkpO1xuICB9XG5cbiAgcmV0dXJuIGJ5dGVzO1xufVxuXG5leHBvcnQgdmFyIEROUyA9ICc2YmE3YjgxMC05ZGFkLTExZDEtODBiNC0wMGMwNGZkNDMwYzgnO1xuZXhwb3J0IHZhciBVUkwgPSAnNmJhN2I4MTEtOWRhZC0xMWQxLTgwYjQtMDBjMDRmZDQzMGM4JztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChuYW1lLCB2ZXJzaW9uLCBoYXNoZnVuYykge1xuICBmdW5jdGlvbiBnZW5lcmF0ZVVVSUQodmFsdWUsIG5hbWVzcGFjZSwgYnVmLCBvZmZzZXQpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgdmFsdWUgPSBzdHJpbmdUb0J5dGVzKHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG5hbWVzcGFjZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG5hbWVzcGFjZSA9IHBhcnNlKG5hbWVzcGFjZSk7XG4gICAgfVxuXG4gICAgaWYgKG5hbWVzcGFjZS5sZW5ndGggIT09IDE2KSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ05hbWVzcGFjZSBtdXN0IGJlIGFycmF5LWxpa2UgKDE2IGl0ZXJhYmxlIGludGVnZXIgdmFsdWVzLCAwLTI1NSknKTtcbiAgICB9IC8vIENvbXB1dGUgaGFzaCBvZiBuYW1lc3BhY2UgYW5kIHZhbHVlLCBQZXIgNC4zXG4gICAgLy8gRnV0dXJlOiBVc2Ugc3ByZWFkIHN5bnRheCB3aGVuIHN1cHBvcnRlZCBvbiBhbGwgcGxhdGZvcm1zLCBlLmcuIGBieXRlcyA9XG4gICAgLy8gaGFzaGZ1bmMoWy4uLm5hbWVzcGFjZSwgLi4uIHZhbHVlXSlgXG5cblxuICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KDE2ICsgdmFsdWUubGVuZ3RoKTtcbiAgICBieXRlcy5zZXQobmFtZXNwYWNlKTtcbiAgICBieXRlcy5zZXQodmFsdWUsIG5hbWVzcGFjZS5sZW5ndGgpO1xuICAgIGJ5dGVzID0gaGFzaGZ1bmMoYnl0ZXMpO1xuICAgIGJ5dGVzWzZdID0gYnl0ZXNbNl0gJiAweDBmIHwgdmVyc2lvbjtcbiAgICBieXRlc1s4XSA9IGJ5dGVzWzhdICYgMHgzZiB8IDB4ODA7XG5cbiAgICBpZiAoYnVmKSB7XG4gICAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxNjsgKytpKSB7XG4gICAgICAgIGJ1ZltvZmZzZXQgKyBpXSA9IGJ5dGVzW2ldO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYnVmO1xuICAgIH1cblxuICAgIHJldHVybiBzdHJpbmdpZnkoYnl0ZXMpO1xuICB9IC8vIEZ1bmN0aW9uI25hbWUgaXMgbm90IHNldHRhYmxlIG9uIHNvbWUgcGxhdGZvcm1zICgjMjcwKVxuXG5cbiAgdHJ5IHtcbiAgICBnZW5lcmF0ZVVVSUQubmFtZSA9IG5hbWU7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1lbXB0eVxuICB9IGNhdGNoIChlcnIpIHt9IC8vIEZvciBDb21tb25KUyBkZWZhdWx0IGV4cG9ydCBzdXBwb3J0XG5cblxuICBnZW5lcmF0ZVVVSUQuRE5TID0gRE5TO1xuICBnZW5lcmF0ZVVVSUQuVVJMID0gVVJMO1xuICByZXR1cm4gZ2VuZXJhdGVVVUlEO1xufSIsImltcG9ydCBybmcgZnJvbSAnLi9ybmcuanMnO1xuaW1wb3J0IHN0cmluZ2lmeSBmcm9tICcuL3N0cmluZ2lmeS5qcyc7XG5cbmZ1bmN0aW9uIHY0KG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgcm5kcyA9IG9wdGlvbnMucmFuZG9tIHx8IChvcHRpb25zLnJuZyB8fCBybmcpKCk7IC8vIFBlciA0LjQsIHNldCBiaXRzIGZvciB2ZXJzaW9uIGFuZCBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGBcblxuICBybmRzWzZdID0gcm5kc1s2XSAmIDB4MGYgfCAweDQwO1xuICBybmRzWzhdID0gcm5kc1s4XSAmIDB4M2YgfCAweDgwOyAvLyBDb3B5IGJ5dGVzIHRvIGJ1ZmZlciwgaWYgcHJvdmlkZWRcblxuICBpZiAoYnVmKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDA7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDE2OyArK2kpIHtcbiAgICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHJuZHNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZjtcbiAgfVxuXG4gIHJldHVybiBzdHJpbmdpZnkocm5kcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHY0OyIsImltcG9ydCB2MzUgZnJvbSAnLi92MzUuanMnO1xuaW1wb3J0IHNoYTEgZnJvbSAnLi9zaGExLmpzJztcbnZhciB2NSA9IHYzNSgndjUnLCAweDUwLCBzaGExKTtcbmV4cG9ydCBkZWZhdWx0IHY1OyIsImltcG9ydCBSRUdFWCBmcm9tICcuL3JlZ2V4LmpzJztcblxuZnVuY3Rpb24gdmFsaWRhdGUodXVpZCkge1xuICByZXR1cm4gdHlwZW9mIHV1aWQgPT09ICdzdHJpbmcnICYmIFJFR0VYLnRlc3QodXVpZCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHZhbGlkYXRlOyIsImltcG9ydCB2YWxpZGF0ZSBmcm9tICcuL3ZhbGlkYXRlLmpzJztcblxuZnVuY3Rpb24gdmVyc2lvbih1dWlkKSB7XG4gIGlmICghdmFsaWRhdGUodXVpZCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ0ludmFsaWQgVVVJRCcpO1xuICB9XG5cbiAgcmV0dXJuIHBhcnNlSW50KHV1aWQuc3Vic3RyKDE0LCAxKSwgMTYpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2ZXJzaW9uOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwL2JhY2tncm91bmQudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=