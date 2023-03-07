import FingerPoseEstimator from './FingerPoseEstimator';
import { Finger, FingerCurl, FingerDirection } from './FingerDescription';
import GestureDescription from './GestureDescription';

export default class GestureEstimator {
	private estimator: FingerPoseEstimator;
	private gestures: GestureDescription[];

	constructor(knownGestures: GestureDescription[], estimatorOptions: any = {}) {
		this.estimator = new FingerPoseEstimator(estimatorOptions);
		this.gestures = knownGestures;
	}

	private getLandMarksFromKeypoints(keypoints3D: { x: number, y: number, z: number }[]) {
		return keypoints3D.map((keypoint) =>
			[keypoint.x, keypoint.y, keypoint.z]
		);
	}

	public estimate(keypoints3D: undefined | { x?: number, y?: number, z?: number }[], minScore: number) {

		let gesturesFound: { name: string, score: number }[] = [];

		if (keypoints3D && keypoints3D.filter((keypoint) => keypoint.x === undefined).length > 0) return;

		const landmarks = this.getLandMarksFromKeypoints(keypoints3D as { x: number, y: number, z: number }[]);
		const est = this.estimator.estimate(landmarks);

		let poseData: [string | undefined, string | false, string | false][] = [];
		for (let fingerIdx of Finger.all) {
			poseData.push([
				Finger.getName(fingerIdx),
				FingerCurl.getName(est.curls[fingerIdx]),
				FingerDirection.getName(est.directions[fingerIdx])
			]);
		}

		for (let gesture of this.gestures) {
			let score = gesture.matchAgainst(est.curls, est.directions);
			if (score >= minScore) {
				gesturesFound.push({
					name: gesture.name,
					score: score
				});
			}
		}

		return {
			poseData: poseData,
			gestures: gesturesFound
		};
	}
}