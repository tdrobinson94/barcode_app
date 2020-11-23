import { Camera } from "./camera";
/**
 * A helper object to interact with cameras.
 */
export declare namespace CameraAccess {
    /**
     * @hidden
     *
     * To be accessed directly only for tests.
     *
     * The mapping from deviceIds to camera objects.
     */
    const deviceIdToCameraObjects: Map<string, Camera>;
    /**
     * @hidden
     *
     * To be accessed directly only for tests.
     *
     * The list of inaccessible deviceIds.
     */
    const inaccessibleDeviceIds: Set<string>;
    /**
     * @hidden
     *
     * Return the main camera corresponsing to the given camera type.
     *
     * @param cameras The array of available [[Camera]] objects.
     * @param cameraType The wanted camera type.
     * @returns The main camera matching the wanted camera type.
     */
    function getMainCameraForType(cameras: Camera[], cameraType: Camera.Type): Camera | undefined;
    /**
     * @hidden
     *
     * Sort the given cameras in order of priority of access based on the given camera type.
     *
     * @param cameras The array of available [[Camera]] objects.
     * @param cameraType The preferred camera type.
     * @returns The sorted cameras.
     */
    function sortCamerasForCameraType(cameras: Camera[], cameraType: Camera.Type): Camera[];
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
    function adjustCamerasFromCameraStream(mediaStreamTrack: MediaStreamTrack, cameras: Camera[], cameraType: Camera.Type): Camera | undefined;
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
    function getCameras(refreshDevices?: boolean): Promise<Camera[]>;
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
    function accessCameraStream(resolutionFallbackLevel: number, camera: Camera): Promise<MediaStream>;
    /**
     * @hidden
     *
     * Mark a camera to be inaccessible and thus excluded from the camera list returned by [[getCameras]].
     *
     * @param camera The camera to mark to be inaccessible.
     */
    function markCameraAsInaccessible(camera: Camera): void;
}
