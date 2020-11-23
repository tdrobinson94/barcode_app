/* tslint:disable:no-implicit-dependencies */
import * as sinon from "sinon";
import { Camera } from "../lib/camera";
import { CameraAccess } from "../lib/cameraAccess";
export async function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
export function fakeGetCameras(cameraAmount, cameraTypes, cameraLabels) {
    CameraAccess.getCameras.restore?.();
    sinon.stub(CameraAccess, "getCameras").resolves(
    // tslint:disable-next-line:prefer-array-literal
    Array.from(Array(cameraAmount), (_, index) => {
        const cameraType = cameraTypes?.[index] ?? Camera.Type.BACK;
        return {
            deviceId: index.toString(),
            label: cameraLabels?.[index] ?? `Fake Camera Device (${cameraType})`,
            cameraType,
        };
    }));
}
//# sourceMappingURL=utility.js.map