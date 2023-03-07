import { Finger, FingerCurl, FingerDirection } from '../AI/FingerDescription';
import GestureDescription from '../AI/GestureDescription';

// describe hock gesture 🤘🤘
const hockDescription = new GestureDescription('hock');

// thumb:
// - curl: full curl (best)
// - curl: half curl (acceptable)
hockDescription.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1.0);
hockDescription.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.9);

// index, middle and ring fingers:
// - curl: none (must)
// - direction: horizontal left or right (best)
// - direction: diagonal up left or right (acceptable)
for(let finger of [Finger.Index, Finger.Middle, Finger.Ring]) {
  hockDescription.addCurl(finger, FingerCurl.NoCurl, 1.0);
  hockDescription.addDirection(finger, FingerDirection.HorizontalLeft, 1.0);
  hockDescription.addDirection(finger, FingerDirection.HorizontalRight, 1.0);
  hockDescription.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.9);
  hockDescription.addDirection(finger, FingerDirection.DiagonalUpRight, 0.9);
}

// pinky finger:
// - curl: full curl (best)
// - curl: half curl (acceptable)
// - direction: horizontal left or right (best)
// - direction: diagonal up left or right (acceptable)
hockDescription.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
hockDescription.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.9);
hockDescription.addDirection(Finger.Pinky, FingerDirection.HorizontalLeft, 1.0);
hockDescription.addDirection(Finger.Pinky, FingerDirection.HorizontalRight, 1.0);
hockDescription.addDirection(Finger.Pinky, FingerDirection.DiagonalUpLeft, 0.9);
hockDescription.addDirection(Finger.Pinky, FingerDirection.DiagonalUpRight, 0.9);

// the thumb should not be pointing down
hockDescription.addDirection(Finger.Thumb, FingerDirection.VerticalDown, 0.2);

export default hockDescription;