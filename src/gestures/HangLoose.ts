import { Finger, FingerCurl, FingerDirection } from '../AI/FingerDescription';
import GestureDescription from '../AI/GestureDescription';

// describe hangloose gesture 🤙
const hangLooseDescription = new GestureDescription('hangloose');

// thumb:
// - curl: none (must)
// - direction vertical up (best)
// - direction diagonal up left / right (acceptable)
hangLooseDescription.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
hangLooseDescription.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);
hangLooseDescription.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.9);
hangLooseDescription.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.9);

// all other fingers:
// - curled (best)
// - half curled (acceptable)
// - pointing down is NOT acceptable
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring]) {
	hangLooseDescription.addCurl(finger, FingerCurl.FullCurl, 1.0);
	hangLooseDescription.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}

// index finger:
hangLooseDescription.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 1.0);
hangLooseDescription.addDirection(Finger.Pinky, FingerDirection.HorizontalLeft, 1.0);
hangLooseDescription.addDirection(Finger.Pinky, FingerDirection.HorizontalRight, 0.9);
hangLooseDescription.addDirection(Finger.Pinky, FingerDirection.DiagonalUpRight, 0.9);

// require the index finger to be somewhat left or right pointing
// but NOT down and NOT fully up
hangLooseDescription.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 1.0);
hangLooseDescription.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 1.0);
hangLooseDescription.addDirection(Finger.Index, FingerDirection.HorizontalRight, 1.0);
hangLooseDescription.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 1.0);

export default hangLooseDescription;
