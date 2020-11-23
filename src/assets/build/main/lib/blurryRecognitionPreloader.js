"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlurryRecognitionPreloader = void 0;
var tslib_1 = require("tslib");
var eventemitter3_1 = require("eventemitter3");
var barcode_1 = require("./barcode");
var browserHelper_1 = require("./browserHelper");
var engineLoader_1 = require("./engineLoader");
var engineWorker_1 = require("./workers/engineWorker");
var BlurryRecognitionPreloaderEventEmitter = /** @class */ (function (_super) {
    tslib_1.__extends(BlurryRecognitionPreloaderEventEmitter, _super);
    function BlurryRecognitionPreloaderEventEmitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BlurryRecognitionPreloaderEventEmitter;
}(eventemitter3_1.EventEmitter));
var BlurryRecognitionPreloader = /** @class */ (function () {
    function BlurryRecognitionPreloader(preload) {
        this.eventEmitter = new eventemitter3_1.EventEmitter();
        this.queuedBlurryRecognitionSymbologies = Array.from(BlurryRecognitionPreloader.availableBlurryRecognitionSymbologies.values());
        this.readyBlurryRecognitionSymbologies = new Set();
        this.preload = preload;
    }
    BlurryRecognitionPreloader.create = function (preload) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var browserName, worker_1;
            return tslib_1.__generator(this, function (_a) {
                if (preload) {
                    browserName = browserHelper_1.BrowserHelper.userAgentInfo.getBrowser().name;
                    if (browserName != null && browserName.includes("Edge")) {
                        worker_1 = new Worker(URL.createObjectURL(new Blob(["(" + BlurryRecognitionPreloader.workerIndexedDBSupportTestFunction.toString() + ")()"], {
                            type: "text/javascript",
                        })));
                        return [2 /*return*/, new Promise(function (resolve) {
                                worker_1.onmessage = function (message) {
                                    worker_1.terminate();
                                    resolve(new BlurryRecognitionPreloader(message.data));
                                };
                            })];
                    }
                }
                return [2 /*return*/, new BlurryRecognitionPreloader(preload)];
            });
        });
    };
    // istanbul ignore next
    BlurryRecognitionPreloader.workerIndexedDBSupportTestFunction = function () {
        try {
            indexedDB.deleteDatabase("scandit_indexeddb_support_test");
            // @ts-ignore
            postMessage(true);
        }
        catch (error) {
            // @ts-ignore
            postMessage(false);
        }
    };
    BlurryRecognitionPreloader.prototype.prepareBlurryTables = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alreadyAvailable, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        alreadyAvailable = true;
                        if (!this.preload) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.checkBlurryTablesAlreadyAvailable()];
                    case 2:
                        alreadyAvailable = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        // istanbul ignore next
                        console.error(error_1);
                        return [3 /*break*/, 4];
                    case 4:
                        if (alreadyAvailable) {
                            this.queuedBlurryRecognitionSymbologies = [];
                            this.readyBlurryRecognitionSymbologies = new Set(BlurryRecognitionPreloader.availableBlurryRecognitionSymbologies);
                            this.eventEmitter.emit("blurryTablesUpdate", new Set(this.readyBlurryRecognitionSymbologies));
                        }
                        else {
                            this.engineWorker = new Worker(URL.createObjectURL(engineWorker_1.engineWorkerBlob));
                            this.engineWorker.onmessage = this.engineWorkerOnMessage.bind(this);
                            engineLoader_1.EngineLoader.load(this.engineWorker, true, true);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    BlurryRecognitionPreloader.prototype.on = function (eventName, listener) {
        // istanbul ignore else
        if (eventName === "blurryTablesUpdate") {
            if (this.readyBlurryRecognitionSymbologies.size ===
                BlurryRecognitionPreloader.availableBlurryRecognitionSymbologies.size) {
                listener(this.readyBlurryRecognitionSymbologies);
            }
            else {
                this.eventEmitter.on(eventName, listener);
            }
        }
    };
    BlurryRecognitionPreloader.prototype.updateBlurryRecognitionPriority = function (scanSettings) {
        var newQueuedBlurryRecognitionSymbologies = this.queuedBlurryRecognitionSymbologies.slice();
        this.getEnabledSymbologies(scanSettings).forEach(function (symbology) {
            var symbologyQueuePosition = newQueuedBlurryRecognitionSymbologies.indexOf(symbology);
            if (symbologyQueuePosition !== -1) {
                newQueuedBlurryRecognitionSymbologies.unshift(newQueuedBlurryRecognitionSymbologies.splice(symbologyQueuePosition, 1)[0]);
            }
        });
        this.queuedBlurryRecognitionSymbologies = newQueuedBlurryRecognitionSymbologies;
    };
    BlurryRecognitionPreloader.prototype.isBlurryRecognitionAvailable = function (scanSettings) {
        var _this = this;
        var enabledBlurryRecognitionSymbologies = this.getEnabledSymbologies(scanSettings);
        return enabledBlurryRecognitionSymbologies.every(function (symbology) {
            return _this.readyBlurryRecognitionSymbologies.has(symbology);
        });
    };
    BlurryRecognitionPreloader.prototype.getEnabledSymbologies = function (scanSettings) {
        return Array.from(BlurryRecognitionPreloader.availableBlurryRecognitionSymbologies.values()).filter(function (symbology) {
            return scanSettings.isSymbologyEnabled(symbology);
        });
    };
    BlurryRecognitionPreloader.prototype.createNextBlurryTableSymbology = function () {
        var symbology;
        do {
            symbology = this.queuedBlurryRecognitionSymbologies.shift();
        } while (symbology != null && this.readyBlurryRecognitionSymbologies.has(symbology));
        // istanbul ignore else
        if (symbology != null) {
            this.engineWorker.postMessage({
                type: "create-blurry-table",
                symbology: symbology,
            });
        }
    };
    BlurryRecognitionPreloader.prototype.checkBlurryTablesAlreadyAvailable = function () {
        return new Promise(function (resolve) {
            var openDbRequest = indexedDB.open(BlurryRecognitionPreloader.writableDataPath);
            function handleErrorOrNew() {
                var _a;
                (_a = openDbRequest === null || openDbRequest === void 0 ? void 0 : openDbRequest.result) === null || _a === void 0 ? void 0 : _a.close();
                // this.error
                resolve(false);
            }
            openDbRequest.onupgradeneeded = function () {
                try {
                    openDbRequest.result.createObjectStore(BlurryRecognitionPreloader.fsObjectStoreName);
                }
                catch (error) {
                    // Ignored
                }
            };
            openDbRequest.onsuccess = function () {
                try {
                    var transaction = openDbRequest.result.transaction(BlurryRecognitionPreloader.fsObjectStoreName, "readonly");
                    transaction.onerror = handleErrorOrNew;
                    var storeKeysRequest_1 = transaction
                        .objectStore(BlurryRecognitionPreloader.fsObjectStoreName)
                        .getAllKeys();
                    storeKeysRequest_1.onsuccess = function () {
                        openDbRequest.result.close();
                        if (BlurryRecognitionPreloader.blurryTableFiles.every(function (file) {
                            return storeKeysRequest_1.result.indexOf(file) !== -1;
                        })) {
                            return resolve(true);
                        }
                        else {
                            return resolve(false);
                        }
                    };
                    storeKeysRequest_1.onerror = handleErrorOrNew;
                }
                catch (error) {
                    handleErrorOrNew.call({ error: error });
                }
            };
            openDbRequest.onblocked = openDbRequest.onerror = handleErrorOrNew;
        });
    };
    BlurryRecognitionPreloader.prototype.engineWorkerOnMessage = function (ev) {
        var _this = this;
        var data = ev.data;
        // istanbul ignore else
        if (data[1] != null) {
            switch (data[0]) {
                case "context-created":
                    this.createNextBlurryTableSymbology();
                    break;
                case "create-blurry-table-result":
                    this.readyBlurryRecognitionSymbologies.add(data[1]);
                    if ([barcode_1.Barcode.Symbology.EAN8, barcode_1.Barcode.Symbology.EAN13, barcode_1.Barcode.Symbology.UPCA, barcode_1.Barcode.Symbology.UPCE].includes(data[1])) {
                        this.readyBlurryRecognitionSymbologies.add(barcode_1.Barcode.Symbology.EAN13);
                        this.readyBlurryRecognitionSymbologies.add(barcode_1.Barcode.Symbology.EAN8);
                        this.readyBlurryRecognitionSymbologies.add(barcode_1.Barcode.Symbology.UPCA);
                        this.readyBlurryRecognitionSymbologies.add(barcode_1.Barcode.Symbology.UPCE);
                    }
                    else if ([barcode_1.Barcode.Symbology.CODE32, barcode_1.Barcode.Symbology.CODE39].includes(data[1])) {
                        this.readyBlurryRecognitionSymbologies.add(barcode_1.Barcode.Symbology.CODE32);
                        this.readyBlurryRecognitionSymbologies.add(barcode_1.Barcode.Symbology.CODE39);
                    }
                    this.eventEmitter.emit("blurryTablesUpdate", new Set(this.readyBlurryRecognitionSymbologies));
                    if (this.readyBlurryRecognitionSymbologies.size ===
                        BlurryRecognitionPreloader.availableBlurryRecognitionSymbologies.size) {
                        // Avoid data not being persisted if IndexedDB operations in WebWorker are slow
                        setTimeout(function () {
                            _this.engineWorker.terminate();
                        }, 250);
                    }
                    else {
                        this.createNextBlurryTableSymbology();
                    }
                    break;
                // istanbul ignore next
                default:
                    break;
            }
        }
    };
    BlurryRecognitionPreloader.writableDataPath = "/scandit_sync_folder_preload";
    BlurryRecognitionPreloader.fsObjectStoreName = "FILE_DATA";
    // From AndroidLowEnd
    BlurryRecognitionPreloader.blurryTableFiles = [
        "/1a3f08f42d1332344e3cebb5c53d9837.scandit",
        "/32e564a3408a1555c8e1c437fee00d36.scandit",
        "/3d90c055e483d26cc356c4a9e1b1fb37.scandit",
        "/5f91576bc7215e09de2c145cccca50de.scandit",
        "/e078b48a2b083e551246567e8cdf1b9c.scandit",
        "/eadf9b9d40ca243665e4ee7cbd7ba109.scandit",
        "/58c55d55c191d83754ff25398170a396.scandit",
        "/98908cb667cf64cf863486b6a7aafe8b.scandit",
        "/e171da0d56d58dc63b105a2f4dc5dce0.scandit",
        "/0ae170296d3653ad308e7fa192d42fb6.scandit",
        "/89dfec6b19b94e2bd9459388c7d2fefb.scandit",
        "/e4d5141cd8ed672df64dca4f0bd1709e.scandit",
        "/4243724f7555e82c259850107c30914f.scandit",
        "/59c85c98c5674dd1072254ea6bd6ef92.scandit",
        "/76ca9155b19b81b4ea4a209c9c2154a4.scandit",
        "/59a53ea1435408779834719fa6c2cabd.scandit",
        "/6fa564c6d98a4cf360aead27987f9546.scandit",
        "/cd5894907b6dd4d3ab237f353db43625.scandit",
    ].map(function (path) {
        return "" + BlurryRecognitionPreloader.writableDataPath + path;
    });
    // Roughly ordered by priority
    BlurryRecognitionPreloader.availableBlurryRecognitionSymbologies = new Set([
        barcode_1.Barcode.Symbology.EAN13,
        barcode_1.Barcode.Symbology.EAN8,
        barcode_1.Barcode.Symbology.CODE32,
        barcode_1.Barcode.Symbology.CODE39,
        barcode_1.Barcode.Symbology.CODE128,
        barcode_1.Barcode.Symbology.CODE93,
        barcode_1.Barcode.Symbology.INTERLEAVED_2_OF_5,
        barcode_1.Barcode.Symbology.MSI_PLESSEY,
        barcode_1.Barcode.Symbology.UPCA,
        barcode_1.Barcode.Symbology.UPCE,
    ]);
    return BlurryRecognitionPreloader;
}());
exports.BlurryRecognitionPreloader = BlurryRecognitionPreloader;
//# sourceMappingURL=blurryRecognitionPreloader.js.map