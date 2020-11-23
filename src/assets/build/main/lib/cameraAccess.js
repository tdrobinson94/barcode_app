"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraAccess = void 0;
var tslib_1 = require("tslib");
var browserCompatibility_1 = require("./browserCompatibility");
var browserHelper_1 = require("./browserHelper");
var camera_1 = require("./camera");
var customError_1 = require("./customError");
var unsupportedBrowserError_1 = require("./unsupportedBrowserError");
/**
 * A helper object to interact with cameras.
 */
var CameraAccess;
(function (CameraAccess) {
    /**
     * @hidden
     *
     * Standard error names mapping.
     */
    var standardErrorNamesMapping = new Map([
        ["DeviceCaptureError", "AbortError"],
        ["NotSupportedError", "AbortError"],
        ["ScreenCaptureError", "AbortError"],
        ["TabCaptureError", "AbortError"],
        ["TypeError", "AbortError"],
        ["InvalidStateError", "NotAllowedError"],
        ["MediaDeviceFailedDueToShutdown", "NotAllowedError"],
        ["MediaDeviceKillSwitchOn", "NotAllowedError"],
        ["PermissionDeniedError", "NotAllowedError"],
        ["PermissionDismissedError", "NotAllowedError"],
        ["DevicesNotFoundError", "NotFoundError"],
        ["SourceUnavailableError", "NotReadableError"],
        ["TrackStartError", "NotReadableError"],
        ["ConstraintNotSatisfiedError", "OverconstrainedError"],
    ]);
    /**
     * @hidden
     *
     * Handle localized camera labels. Supported languages:
     * English, German, French, Spanish (spain), Portuguese (brasil), Portuguese (portugal), Italian,
     * Chinese (simplified), Chinese (traditional), Japanese, Russian, Turkish, Dutch, Arabic, Thai, Swedish,
     * Danish, Vietnamese, Norwegian, Polish, Finnish, Indonesian, Hebrew, Greek, Romanian, Hungarian, Czech,
     * Catalan, Slovak, Ukraininan, Croatian, Malay, Hindi.
     */
    var backCameraKeywords = [
        "rear",
        "back",
        "rück",
        "arrière",
        "trasera",
        "trás",
        "traseira",
        "posteriore",
        "后面",
        "後面",
        "背面",
        "后置",
        "後置",
        "背置",
        "задней",
        "الخلفية",
        "후",
        "arka",
        "achterzijde",
        "หลัง",
        "baksidan",
        "bagside",
        "sau",
        "bak",
        "tylny",
        "takakamera",
        "belakang",
        "אחורית",
        "πίσω",
        "spate",
        "hátsó",
        "zadní",
        "darrere",
        "zadná",
        "задня",
        "stražnja",
        "belakang",
        "बैक",
    ];
    /**
     * @hidden
     *
     * The (cached) list of available devices, updated when [[getCameras]] is called for the first time and after
     * subsequent calls with the *refreshDevices* parameter enabled. The contained devices' order never changes, howver
     * their deviceIds could change when they are retrieved again after a camera access and stop in some situations.
     */
    var availableDevices;
    /**
     * @hidden
     *
     * To be accessed directly only for tests.
     *
     * The mapping from deviceIds to camera objects.
     */
    CameraAccess.deviceIdToCameraObjects = new Map();
    /**
     * @hidden
     *
     * To be accessed directly only for tests.
     *
     * The list of inaccessible deviceIds.
     */
    CameraAccess.inaccessibleDeviceIds = new Set();
    /**
     * @hidden
     *
     * @param label The camera label.
     * @returns Whether the label mentions the camera being a back-facing one.
     */
    function isBackCameraLabel(label) {
        var lowercaseLabel = label.toLowerCase();
        return backCameraKeywords.some(function (keyword) {
            return lowercaseLabel.includes(keyword);
        });
    }
    /**
     * @hidden
     *
     * Map non-standard error names to standard ones.
     *
     * @param error The error object.
     */
    function mapNonStandardErrorName(error) {
        var _a;
        var name;
        if (error.message === "Invalid constraint") {
            name = "OverconstrainedError";
        }
        else {
            name = (_a = standardErrorNamesMapping.get(error.name)) !== null && _a !== void 0 ? _a : error.name;
        }
        Object.defineProperty(error, "name", {
            value: name,
        });
    }
    /**
     * @hidden
     *
     * @param cameras The array of available [[Camera]] objects.
     * @param activeCamera The current active [[Camera]] object.
     * @param activeCameraIsBackFacing Whether *activeCamera* is facing back (environment).
     */
    function adjustCameraTypes(cameras, activeCamera, activeCameraIsBackFacing) {
        // TODO: improve logic for possible multiple front/back cameras
        if (activeCameraIsBackFacing) {
            // Correct camera types if needed
            cameras.forEach(function (camera) {
                if (camera.deviceId === activeCamera.deviceId) {
                    camera.cameraType = camera_1.Camera.Type.BACK;
                }
                else if (!isBackCameraLabel(camera.label)) {
                    camera.cameraType = camera_1.Camera.Type.FRONT;
                }
            });
        }
        else {
            activeCamera.cameraType = camera_1.Camera.Type.FRONT;
        }
    }
    /**
     * @hidden
     *
     * Return the main camera corresponsing to the given camera type.
     *
     * @param cameras The array of available [[Camera]] objects.
     * @param cameraType The wanted camera type.
     * @returns The main camera matching the wanted camera type.
     */
    function getMainCameraForType(cameras, cameraType) {
        var mainCameraForType;
        if (cameras.every(function (camera) {
            return camera.label === "";
        })) {
            // When no camera label is available cameras are already in front to back order, assume main front camera is the
            // first one and main back camera is the last one
            mainCameraForType = cameras[cameraType === camera_1.Camera.Type.FRONT ? 0 : cameras.length - 1];
        }
        else {
            mainCameraForType = cameras
                .filter(function (camera) {
                return camera.cameraType === cameraType;
            })
                .sort(function (camera1, camera2) {
                return camera1.label.localeCompare(camera2.label);
            })[0];
        }
        return mainCameraForType;
    }
    CameraAccess.getMainCameraForType = getMainCameraForType;
    /**
     * @hidden
     *
     * Sort the given cameras in order of priority of access based on the given camera type.
     *
     * @param cameras The array of available [[Camera]] objects.
     * @param cameraType The preferred camera type.
     * @returns The sorted cameras.
     */
    function sortCamerasForCameraType(cameras, cameraType) {
        if (cameras.every(function (camera) {
            return camera.label === "";
        })) {
            // When no camera label is available cameras are already in front to back order, assume front cameras are ordered
            // and back cameras are in reversed order (try to access last first)
            var frontCameras = cameras.filter(function (camera) {
                return camera.cameraType === camera_1.Camera.Type.FRONT;
            });
            var backCameras = cameras
                .filter(function (camera) {
                return camera.cameraType === camera_1.Camera.Type.BACK;
            })
                .reverse();
            cameras =
                cameraType === camera_1.Camera.Type.FRONT ? tslib_1.__spread(frontCameras, backCameras) : tslib_1.__spread(backCameras, frontCameras);
        }
        else {
            cameras.sort(function (camera1, camera2) {
                if (camera1.cameraType !== camera2.cameraType) {
                    // istanbul ignore else
                    if (camera1.cameraType === cameraType) {
                        return -1;
                    }
                    else if (camera2.cameraType === cameraType) {
                        return 1;
                    }
                }
                return camera1.label.localeCompare(camera2.label);
            });
        }
        return cameras;
    }
    CameraAccess.sortCamerasForCameraType = sortCamerasForCameraType;
    /**
     * @hidden
     *
     * Adjusts the cameras' type classification based on the given currently active video stream:
     * If the stream comes from an environment-facing camera, the camera is marked to be a back-facing camera
     * and the other cameras to be of other types accordingly (if they are not correctly set already).
     *
     * The method returns the currently active camera if it's actually the correct (main with wanted type or only) one.
     *
     * @param mediaStreamTrack The currently active `MediaStreamTrack`.
     * @param cameras The array of available [[Camera]] objects.
     * @param cameraType The wanted camera type.
     * @returns The active [[Camera]] object if the stream is actually from the correct camera.
     */
    function adjustCamerasFromCameraStream(mediaStreamTrack, cameras, cameraType) {
        var mediaTrackSettings;
        if (typeof mediaStreamTrack.getSettings === "function") {
            mediaTrackSettings = mediaStreamTrack.getSettings();
        }
        var activeCamera = cameras.find(function (camera) {
            return (camera.deviceId === (mediaTrackSettings === null || mediaTrackSettings === void 0 ? void 0 : mediaTrackSettings.deviceId) ||
                (camera.label !== "" && camera.label === mediaStreamTrack.label));
        });
        if (activeCamera != null) {
            if (cameras.some(function (camera) {
                return camera.label !== "";
            })) {
                adjustCameraTypes(cameras, activeCamera, (mediaTrackSettings === null || mediaTrackSettings === void 0 ? void 0 : mediaTrackSettings.facingMode) === "environment" || isBackCameraLabel(mediaStreamTrack.label));
            }
            var mainCameraForType = getMainCameraForType(cameras, cameraType);
            if (cameras.length === 1 || activeCamera.deviceId === (mainCameraForType === null || mainCameraForType === void 0 ? void 0 : mainCameraForType.deviceId)) {
                return activeCamera;
            }
        }
        return;
    }
    CameraAccess.adjustCamerasFromCameraStream = adjustCamerasFromCameraStream;
    /**
     * @hidden
     *
     * @param devices The list of available devices.
     * @returns The extracted list of accessible camera objects initialized from the given devices.
     */
    function extractAccessibleCamerasFromDevices(devices) {
        function createCamera(videoDevice, index, videoDevices) {
            var _a;
            if (CameraAccess.deviceIdToCameraObjects.has(videoDevice.deviceId)) {
                return CameraAccess.deviceIdToCameraObjects.get(videoDevice.deviceId);
            }
            var label = (_a = videoDevice.label) !== null && _a !== void 0 ? _a : "";
            var cameraType;
            if (videoDevices.every(function (device) {
                return device.label === "" && !CameraAccess.deviceIdToCameraObjects.has(device.deviceId);
            })) {
                // When no camera label is available, assume the camera is a front one if it's the only one or comes in the
                // first half of the list of cameras (if odd number of cameras, more likely to have more back than front ones)
                cameraType =
                    videoDevices.length === 1 || index + 1 <= videoDevices.length / 2 ? camera_1.Camera.Type.FRONT : camera_1.Camera.Type.BACK;
            }
            else {
                cameraType = isBackCameraLabel(label) ? camera_1.Camera.Type.BACK : camera_1.Camera.Type.FRONT;
            }
            return {
                deviceId: videoDevice.deviceId,
                label: label,
                cameraType: cameraType,
            };
        }
        var cameras = devices
            .filter(function (device) {
            return device.kind === "videoinput";
        })
            .map(createCamera)
            .map(function (camera) {
            CameraAccess.deviceIdToCameraObjects.set(camera.deviceId, camera);
            return camera;
        })
            .filter(function (camera) {
            // Ignore infrared cameras as they often fail to be accessed and are not useful in any case
            return !/\b(?:ir|infrared)\b/i.test(camera.label);
        })
            .filter(function (camera) {
            return !CameraAccess.inaccessibleDeviceIds.has(camera.deviceId);
        });
        if (cameras.length > 1 &&
            !cameras.some(function (camera) {
                return camera.cameraType === camera_1.Camera.Type.BACK;
            })) {
            // Check if cameras are labeled with resolution information, take the higher-resolution one in that case
            // Otherwise pick the last camera
            var backCameraIndex = cameras.length - 1;
            var cameraResolutions = cameras.map(function (camera) {
                var match = camera.label.match(/\b([0-9]+)MP?\b/i);
                if (match != null) {
                    return parseInt(match[1], 10);
                }
                return NaN;
            });
            if (!cameraResolutions.some(function (cameraResolution) {
                return isNaN(cameraResolution);
            })) {
                backCameraIndex = cameraResolutions.lastIndexOf(Math.max.apply(Math, tslib_1.__spread(cameraResolutions)));
            }
            cameras[backCameraIndex].cameraType = camera_1.Camera.Type.BACK;
        }
        return cameras;
    }
    /**
     * @hidden
     *
     * @returns The stream, if necessary, accessed to provide access to complete device information
     */
    function getStreamForDeviceAccessPermission() {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, enumerateDevices()];
                    case 1:
                        availableDevices = _b.sent();
                        if (!availableDevices
                            .filter(function (device) {
                            return device.kind === "videoinput";
                        })
                            .every(function (device) {
                            return device.label === "" && !CameraAccess.deviceIdToCameraObjects.has(device.deviceId);
                        })) return [3 /*break*/, 5];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
                                video: true,
                                audio: false,
                            })];
                    case 3: return [2 /*return*/, _b.sent()];
                    case 4:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    /**
     * @hidden
     *
     * Checks and adjust cameras' deviceId information and related information if a change is detected. We can rely on the
     * fact that devices are returned in the same order even when deviceId information changes.
     *
     * @param oldAvailableDevices The old list of available devices before deviceId information was refreshed.
     * @param newAvailableDevices The new list of available devices after deviceId information was refreshed.
     */
    function checkAndUpdateCameraDeviceIdInformation(oldAvailableDevices, newAvailableDevices) {
        if (newAvailableDevices.length > 0 &&
            oldAvailableDevices.length === newAvailableDevices.length &&
            !newAvailableDevices.every(function (device, index) {
                return oldAvailableDevices[index].deviceId === device.deviceId;
            })) {
            var deviceIdChanges_1 = {};
            oldAvailableDevices.forEach(function (device, index) {
                var _a;
                var camera = CameraAccess.deviceIdToCameraObjects.get(device.deviceId);
                if (camera == null || camera.label !== ((_a = newAvailableDevices[index].label) !== null && _a !== void 0 ? _a : "")) {
                    return;
                }
                var newDeviceId = newAvailableDevices[index].deviceId;
                deviceIdChanges_1[camera.deviceId] = newDeviceId;
                if (CameraAccess.inaccessibleDeviceIds.has(camera.deviceId)) {
                    CameraAccess.inaccessibleDeviceIds.add(newDeviceId);
                }
                camera.deviceId = newDeviceId;
                CameraAccess.deviceIdToCameraObjects.set(newDeviceId, camera);
            });
            console.debug("Detected updated camera deviceId information and updated it accordingly", deviceIdChanges_1);
        }
    }
    /**
     * Get a list of cameras (if any) available on the device, a camera access permission is requested to the user
     * the first time this method is called if needed.
     *
     * If the browser is incompatible the returned promise is rejected with a `UnsupportedBrowserError` error.
     *
     * When refreshing available devices, if updated deviceId information is detected, cameras' deviceId are updated
     * accordingly. This could happen after a camera access and stop in some situations.
     *
     * @param refreshDevices Force a call to refresh available devices via `navigator.mediaDevices.enumerateDevices()`
     * even when information is already available.
     * @returns A promise resolving to the array of available [[Camera]] objects (could be empty).
     */
    function getCameras(refreshDevices) {
        if (refreshDevices === void 0) { refreshDevices = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var browserCompatibility, stream, oldAvailableDevices, error_1, cameras;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        browserCompatibility = browserHelper_1.BrowserHelper.checkBrowserCompatibility();
                        if (!browserCompatibility.fullSupport) {
                            throw new unsupportedBrowserError_1.UnsupportedBrowserError(browserCompatibility);
                        }
                        if (!(availableDevices == null || refreshDevices)) return [3 /*break*/, 7];
                        stream = void 0;
                        oldAvailableDevices = availableDevices !== null && availableDevices !== void 0 ? availableDevices : [];
                        availableDevices = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, 6, 7]);
                        return [4 /*yield*/, getStreamForDeviceAccessPermission()];
                    case 2:
                        stream = _a.sent();
                        if (!(stream != null)) return [3 /*break*/, 4];
                        console.debug("Camera list (accessed stream for information permissions):", stream);
                        return [4 /*yield*/, enumerateDevices()];
                    case 3:
                        availableDevices = _a.sent();
                        _a.label = 4;
                    case 4:
                        console.debug.apply(console, tslib_1.__spread(["Camera list (devices):"], availableDevices));
                        checkAndUpdateCameraDeviceIdInformation(oldAvailableDevices, availableDevices);
                        return [3 /*break*/, 7];
                    case 5:
                        error_1 = _a.sent();
                        mapNonStandardErrorName(error_1);
                        throw error_1;
                    case 6:
                        if (stream != null) {
                            stream.getVideoTracks().forEach(function (track) {
                                track.stop();
                            });
                        }
                        return [7 /*endfinally*/];
                    case 7:
                        cameras = extractAccessibleCamerasFromDevices(availableDevices);
                        console.debug.apply(console, tslib_1.__spread(["Camera list (cameras): "], cameras));
                        // Return a copy of the array to allow for array mutations in other functions
                        return [2 /*return*/, tslib_1.__spread(cameras)];
                }
            });
        });
    }
    CameraAccess.getCameras = getCameras;
    /**
     * @hidden
     *
     * Call `navigator.mediaDevices.getUserMedia` asynchronously in a `setTimeout` call.
     *
     * @param getUserMediaParams The parameters for the `navigator.mediaDevices.getUserMedia` call.
     * @returns A promise resolving when the camera is accessed.
     */
    function getUserMediaDelayed(getUserMediaParams) {
        console.debug("Attempt to access camera (parameters):", getUserMediaParams.video);
        return new Promise(function (resolve, reject) {
            window.setTimeout(function () {
                var _a;
                ((_a = navigator.mediaDevices.getUserMedia(getUserMediaParams)) !== null && _a !== void 0 ? _a : Promise.reject(new customError_1.CustomError({ name: "AbortError" })))
                    .then(resolve)
                    .catch(reject);
            }, 0);
        });
    }
    /**
     * @hidden
     *
     * Get the *getUserMedia* *video* parameters to be used given a resolution fallback level and the browser used.
     *
     * @param resolutionFallbackLevel The number representing the wanted resolution, from 0 to 4,
     * resulting in higher to lower video resolutions.
     * @returns The resulting *getUserMedia* *video* parameters.
     */
    function getUserMediaVideoParams(resolutionFallbackLevel) {
        var userMediaVideoParams = {
            resizeMode: "none",
        };
        switch (resolutionFallbackLevel) {
            case 0:
                return tslib_1.__assign(tslib_1.__assign({}, userMediaVideoParams), { width: { min: 3200, ideal: 3840, max: 4096 }, height: { min: 1800, ideal: 2160, max: 2400 } });
            case 1:
                return tslib_1.__assign(tslib_1.__assign({}, userMediaVideoParams), { width: { min: 1400, ideal: 1920, max: 2160 }, height: { min: 900, ideal: 1080, max: 1440 } });
            case 2:
                return tslib_1.__assign(tslib_1.__assign({}, userMediaVideoParams), { width: { min: 960, ideal: 1280, max: 1440 }, height: { min: 480, ideal: 720, max: 960 } });
            case 3:
                return tslib_1.__assign(tslib_1.__assign({}, userMediaVideoParams), { width: { min: 640, ideal: 640, max: 800 }, height: { min: 480, ideal: 480, max: 600 } });
            default:
                return {};
        }
    }
    /**
     * @hidden
     *
     * Try to access a given camera for video input at the given resolution level.
     *
     * If a camera is inaccessible because of errors, then it's added to the inaccessible device list. If the specific
     * error is of type `OverconstrainedError` however, this procedure is done later on via a separate external logic.
     * This is done to allow checking if the camera can still be accessed via an updated deviceId when deviceId
     * information changes, or if it should then be confirmed to be considered inaccessible.
     *
     * Depending on parameters, device features and user permissions for camera access, any of the following errors
     * could be the rejected result of the returned promise:
     * - `AbortError`
     * - `NotAllowedError`
     * - `NotFoundError`
     * - `NotReadableError`
     * - `SecurityError`
     * - `OverconstrainedError`
     *
     * @param resolutionFallbackLevel The number representing the wanted resolution, from 0 to 4,
     * resulting in higher to lower video resolutions.
     * @param camera The camera to try to access for video input.
     * @returns A promise resolving to the `MediaStream` object coming from the accessed camera.
     */
    function accessCameraStream(resolutionFallbackLevel, camera) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var getUserMediaParams, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.debug("Attempt to access camera (camera):", camera);
                        getUserMediaParams = {
                            audio: false,
                            video: getUserMediaVideoParams(resolutionFallbackLevel),
                        };
                        // If it's the initial camera, use the given cameraType, otherwise use the given deviceId
                        if (camera.deviceId === "") {
                            getUserMediaParams.video.facingMode = {
                                ideal: camera.cameraType === camera_1.Camera.Type.BACK ? "environment" : "user",
                            };
                        }
                        else {
                            getUserMediaParams.video.deviceId = {
                                exact: camera.deviceId,
                            };
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, getUserMediaDelayed(getUserMediaParams)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_2 = _a.sent();
                        mapNonStandardErrorName(error_2);
                        if (error_2.name !== "OverconstrainedError") {
                            markCameraAsInaccessible(camera);
                        }
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    CameraAccess.accessCameraStream = accessCameraStream;
    /**
     * @hidden
     *
     * Mark a camera to be inaccessible and thus excluded from the camera list returned by [[getCameras]].
     *
     * @param camera The camera to mark to be inaccessible.
     */
    function markCameraAsInaccessible(camera) {
        // If it's the initial camera, do nothing
        if (camera.deviceId !== "") {
            console.debug("Camera marked to be inaccessible:", camera);
            CameraAccess.inaccessibleDeviceIds.add(camera.deviceId);
        }
    }
    CameraAccess.markCameraAsInaccessible = markCameraAsInaccessible;
    /**
     * @hidden
     *
     * Get a list of available devices in a cross-browser compatible way.
     *
     * @returns A promise resolving to the `MediaDeviceInfo` array of all available devices.
     */
    function enumerateDevices() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var devices, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(typeof navigator.enumerateDevices === "function")) return [3 /*break*/, 1];
                        return [2 /*return*/, navigator.enumerateDevices()];
                    case 1:
                        if (!(typeof navigator.mediaDevices === "object" &&
                            typeof navigator.mediaDevices.enumerateDevices === "function")) return [3 /*break*/, 2];
                        return [2 /*return*/, navigator.mediaDevices.enumerateDevices()];
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        if (((_a = window.MediaStreamTrack) === null || _a === void 0 ? void 0 : _a.getSources) == null) {
                            throw new Error();
                        }
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var _a, _b;
                                (_b = (_a = window.MediaStreamTrack) === null || _a === void 0 ? void 0 : _a.getSources) === null || _b === void 0 ? void 0 : _b.call(_a, resolve);
                            })];
                    case 3:
                        devices = _c.sent();
                        return [2 /*return*/, devices
                                .filter(function (device) {
                                return device.kind.toLowerCase() === "video" || device.kind.toLowerCase() === "videoinput";
                            })
                                .map(function (device) {
                                var _a;
                                return {
                                    deviceId: (_a = device.deviceId) !== null && _a !== void 0 ? _a : "",
                                    groupId: device.groupId,
                                    kind: "videoinput",
                                    label: device.label,
                                    toJSON: /* istanbul ignore next */ function () {
                                        return this;
                                    },
                                };
                            })];
                    case 4:
                        _b = _c.sent();
                        throw new unsupportedBrowserError_1.UnsupportedBrowserError({
                            fullSupport: false,
                            scannerSupport: true,
                            missingFeatures: [browserCompatibility_1.BrowserCompatibility.Feature.MEDIA_DEVICES],
                        });
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
})(CameraAccess = exports.CameraAccess || (exports.CameraAccess = {}));
//# sourceMappingURL=cameraAccess.js.map