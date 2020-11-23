import { Camera } from "../lib/camera";
export declare function wait(ms: number): Promise<void>;
export declare function fakeGetCameras(cameraAmount: number, cameraTypes?: Camera.Type[], cameraLabels?: string[]): void;
