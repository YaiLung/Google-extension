/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/chrome/async.ts":
/*!*****************************!*\
  !*** ./src/chrome/async.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*************************************!*\
  !*** ./src/app/setExtensionIcon.ts ***!
  \*************************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const async_1 = __webpack_require__(/*! ../chrome/async */ "./src/chrome/async.ts");
setExtensionIcon();
function setExtensionIcon() {
    async_1.postBackgroundMessage({
        kind: 'setExtensionIcon'
    });
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFNLFlBQVksR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDcEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUM1QixJQUFJO1lBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUU7Z0JBQ3hELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNmLENBQUMsQ0FBQyxDQUFDO1NBQ0g7UUFBQyxXQUFNO1lBQ1AsNkJBQTZCO1lBQzdCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNmO0lBQ0YsQ0FBQyxDQUFDLENBQUM7QUFDSixDQUFDO0FBWkQsd0NBWUM7QUFFRCxTQUFTLFNBQVMsQ0FBQyxHQUFXO0lBQzdCLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQztJQUN4QixPQUFPLEdBQUcsU0FBUyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQzlCLENBQUM7Ozs7Ozs7VUN2SEQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7Ozs7O0FDdEJBLG9GQUF3RDtBQUV4RCxnQkFBZ0IsRUFBRSxDQUFDO0FBRW5CLFNBQVMsZ0JBQWdCO0lBQ3hCLDZCQUFxQixDQUFDO1FBQ3JCLElBQUksRUFBRSxrQkFBa0I7S0FDeEIsQ0FBQyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2ljaGlnby1yZWFkZXIvLi9zcmMvY2hyb21lL2FzeW5jLnRzIiwid2VicGFjazovL2ljaGlnby1yZWFkZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vaWNoaWdvLXJlYWRlci8uL3NyYy9hcHAvc2V0RXh0ZW5zaW9uSWNvbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBNb2R1bGUgZm9yIG1ha2luZyB3b3JraW5nIHdpdGggdGhlIENocm9tZSBBUEkgZWFzaWVyLlxuLy8gVGhpcyBtYXkgaW5jbHVkZSBtYWtpbmcgdGhlIEFQSSBhc3luYywgc2ltcGxpZnlpbmcgdGhlIGludGVyZmFjZSwgb3IgbW9yZS5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJyZW50VGFiKCk6IFByb21pc2U8XG5cdChjaHJvbWUudGFicy5UYWIgJiB7IGdldEhvc3ROYW1lOiAoKSA9PiBzdHJpbmcgfSkgfCB1bmRlZmluZWRcbj4ge1xuXHRyZXR1cm4gbmV3IFByb21pc2U8KGNocm9tZS50YWJzLlRhYiAmIHsgZ2V0SG9zdE5hbWU6ICgpID0+IHN0cmluZyB9KSB8IHVuZGVmaW5lZD4ocmVzb2x2ZSA9PiB7XG5cdFx0Y2hyb21lLnRhYnMucXVlcnkoeyBjdXJyZW50V2luZG93OiB0cnVlLCBhY3RpdmU6IHRydWUgfSwgZnVuY3Rpb24gKHRhYnMpIHtcblx0XHRcdGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcblx0XHRcdFx0cmVzb2x2ZSh1bmRlZmluZWQpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGN1cnJlbnRUYWI6IGFueSA9IHRhYnNbMF07XG5cdFx0XHRpZiAoIWN1cnJlbnRUYWI/LnVybCkge1xuXHRcdFx0XHRyZXNvbHZlKHVuZGVmaW5lZCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y3VycmVudFRhYi5nZXRIb3N0TmFtZSA9ICgpID0+IHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRyZXR1cm4gbmV3IFVSTChjdXJyZW50VGFiLnVybCkuaG9zdG5hbWU7XG5cdFx0XHRcdH0gY2F0Y2gge1xuXHRcdFx0XHRcdHJldHVybiAnJztcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdHJlc29sdmUoY3VycmVudFRhYik7XG5cdFx0fSk7XG5cdH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlU2Vzc2lvbkhlYWRlcnMocnVsZU9wdGlvbnM6IGNocm9tZS5kZWNsYXJhdGl2ZU5ldFJlcXVlc3QuVXBkYXRlUnVsZU9wdGlvbnMpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXHRcdGNocm9tZS5kZWNsYXJhdGl2ZU5ldFJlcXVlc3QudXBkYXRlU2Vzc2lvblJ1bGVzKHJ1bGVPcHRpb25zLCByZXNvbHZlKTtcblx0fSk7XG59XG5cbi8vIFdpbmRvdyBJRCBvZiB0YWIgdG8gY2FwdHVyZSwgZWcgZ2V0Q3VycmVudFRhYigpLndpbmRvd0lkO1xuZXhwb3J0IGZ1bmN0aW9uIGNhcHR1cmVWaXNpYmxlVGFiKHdpbmRvd0lkOiBudW1iZXIpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZz4ocmVzb2x2ZSA9PlxuXHRcdGNocm9tZS50YWJzLmNhcHR1cmVWaXNpYmxlVGFiKHdpbmRvd0lkLCB7IGZvcm1hdDogJ3BuZycgfSwgcmVzb2x2ZSlcblx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFpvb21GYWN0b3IodGFiSWQ6IG51bWJlcik6IFByb21pc2U8bnVtYmVyPiB7XG5cdHJldHVybiBuZXcgUHJvbWlzZTxudW1iZXI+KHJlc29sdmUgPT4gY2hyb21lLnRhYnMuZ2V0Wm9vbSh0YWJJZCwgcmVzb2x2ZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0RXh0ZW5zaW9uSWNvbihpY29uOiBjaHJvbWUuYnJvd3NlckFjdGlvbi5UYWJJY29uRGV0YWlscyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuXHRyZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4ocmVzb2x2ZSA9PiB7XG5cdFx0Y2hyb21lLmFjdGlvbi5zZXRJY29uKGljb24sICgpID0+IHtcblx0XHRcdHJlc29sdmUodHJ1ZSk7XG5cdFx0fSk7XG5cdH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXhlY3V0ZVNjcmlwdChcblx0dGFiSWQ6IG51bWJlcixcblx0ZmlsZVBhdGg6IHN0cmluZyxcblx0YWxsRnJhbWVzPzogYm9vbGVhblxuKTogUHJvbWlzZTxib29sZWFuPiB7XG5cdHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPihyZXNvbHZlID0+IHtcblx0XHRjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoXG5cdFx0XHR7IHRhcmdldDogeyB0YWJJZCwgYWxsRnJhbWVzOiBhbGxGcmFtZXMgPz8gdHJ1ZSB9LCBmaWxlczogW2ZpbGVQYXRoXSB9LFxuXHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRyZXNvbHZlKHRydWUpO1xuXHRcdFx0fVxuXHRcdCk7XG5cdH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBbGxvd2VkRmlsZVNjaGVtZUFjY2VzcygpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXHRcdGNocm9tZS5leHRlbnNpb24uaXNBbGxvd2VkRmlsZVNjaGVtZUFjY2VzcyhyZXNvbHZlKTtcblx0fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb3N0QmFja2dyb3VuZE1lc3NhZ2UoXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvZXhwbGljaXQtbW9kdWxlLWJvdW5kYXJ5LXR5cGVzXG5cdG1lc3NhZ2U6IGFueVxuKTogYW55IHtcblx0Y29uc3QgZXh0ZW5zaW9uSWQgPSB1bmRlZmluZWQ7IC8vIHVuZGVmaW5lZCBtZWFucyBzZW5kIHRvIHNlbGYsIGluc3RlYWQgb2YgYW5vdGhlciBleHRlbnNpb24uXG5cdGNvbnN0IG9wdGlvbnMgPSB1bmRlZmluZWQ7XG5cblx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXHRcdGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKGV4dGVuc2lvbklkLCBtZXNzYWdlLCBvcHRpb25zLCByZXNvbHZlKTtcblx0fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdG9yYWdlSXRlbTxUPihrZXk6IHN0cmluZyk6IFByb21pc2U8VCB8IHVuZGVmaW5lZD4ge1xuXHRjb25zdCBmb3JtYXR0ZWRLZXkgPSBmb3JtYXRLZXkoa2V5KTtcblx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW2Zvcm1hdHRlZEtleV0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcblx0XHRcdFx0cmVzb2x2ZShyZXN1bHRbZm9ybWF0dGVkS2V5XSk7XG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoIHtcblx0XHRcdC8vIERvIG5vdGhpbmcgaWYgY2FjaGUgZmFpbHMuXG5cdFx0XHRyZXNvbHZlKHVuZGVmaW5lZCk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFN0b3JhZ2VJdGVtPFQ+KGtleTogc3RyaW5nLCB2YWx1ZTogVCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuXHRjb25zdCBmb3JtYXR0ZWRLZXkgPSBmb3JtYXRLZXkoa2V5KTtcblx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBbZm9ybWF0dGVkS2V5XTogdmFsdWUgfSwgKCkgPT4ge1xuXHRcdFx0XHRyZXNvbHZlKHRydWUpO1xuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaCB7XG5cdFx0XHQvLyBEbyBub3RoaW5nIGlmIGNhY2hlIGZhaWxzLlxuXHRcdFx0cmVzb2x2ZShmYWxzZSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0S2V5KGtleTogc3RyaW5nKSB7XG5cdGNvbnN0IGtleVByZWZpeCA9ICdhcHAnO1xuXHRyZXR1cm4gYCR7a2V5UHJlZml4fS0ke2tleX1gO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7IHBvc3RCYWNrZ3JvdW5kTWVzc2FnZSB9IGZyb20gJy4uL2Nocm9tZS9hc3luYyc7XHJcblxyXG5zZXRFeHRlbnNpb25JY29uKCk7XHJcblxyXG5mdW5jdGlvbiBzZXRFeHRlbnNpb25JY29uKCkge1xyXG5cdHBvc3RCYWNrZ3JvdW5kTWVzc2FnZSh7XHJcblx0XHRraW5kOiAnc2V0RXh0ZW5zaW9uSWNvbidcclxuXHR9KTtcclxufVxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=