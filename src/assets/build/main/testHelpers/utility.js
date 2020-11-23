"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fakeGetCameras = exports.wait = void 0;
var tslib_1 = require("tslib");
/* tslint:disable:no-implicit-dependencies */
var sinon = tslib_1.__importStar(require("sinon"));
var camera_1 = require("../lib/camera");
var cameraAccess_1 = require("../lib/cameraAccess");
function wait(ms) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(resolve, ms);
                })];
        });
    });
}
exports.wait = wait;
function fakeGetCameras(cameraAmount, cameraTypes, cameraLabels) {
    var _a, _b;
    (_b = (_a = cameraAccess_1.CameraAccess.getCameras).restore) === null || _b === void 0 ? void 0 : _b.call(_a);
    sinon.stub(cameraAccess_1.CameraAccess, "getCameras").resolves(
    // tslint:disable-next-line:prefer-array-literal
    Array.from(Array(cameraAmount), function (_, index) {
        var _a, _b;
        var cameraType = (_a = cameraTypes === null || cameraTypes === void 0 ? void 0 : cameraTypes[index]) !== null && _a !== void 0 ? _a : camera_1.Camera.Type.BACK;
        return {
            deviceId: index.toString(),
            label: (_b = cameraLabels === null || cameraLabels === void 0 ? void 0 : cameraLabels[index]) !== null && _b !== void 0 ? _b : "Fake Camera Device (" + cameraType + ")",
            cameraType: cameraType,
        };
    }));
}
exports.fakeGetCameras = fakeGetCameras;
//# sourceMappingURL=utility.js.map