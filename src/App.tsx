import { LegacyRef, useEffect, useRef, useState } from 'react'
import GestureEstimator from './AI/GestureEstimator';
import reactLogo from './assets/react.svg'
import * as Gestures from './gestures';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import { AppContainer } from './style';

function App() {
	const canva = useRef<HTMLCanvasElement | null>(null);

	const video = useRef<HTMLVideoElement | null>(null);

	const config = {
		video: { width: 640, height: 480, fps: 30 }
	}

	const landmarkColors = {
		thumb: 'red',
		index: 'blue',
		middle: 'yellow',
		ring: 'green',
		pinky: 'pink',
		wrist: 'white'
	}

	const gestureStrings = {
		'thumbs_up': '👍',
		'victory': '✌🏻',
		'hangloose': '🤙🏻'
	}

	async function createDetector() {
		return handPoseDetection.createDetector(
			handPoseDetection.SupportedModels.MediaPipeHands,
			{
				runtime: "mediapipe",
				modelType: "full",
				maxHands: 2,
				solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915`,
			}
		)
	}

	async function main() {
		const ctx = canva?.current?.getContext("2d")

		const resultLayer = {
			right: document.querySelector("#pose-result-right"),
			left: document.querySelector("#pose-result-left")
		} as { [key: string]: HTMLElement | null}
		// configure gesture estimator
		// add "✌🏻" and "👍" as sample gestures
		const knownGestures = [
			Gestures.VictoryGesture,
			Gestures.ThumbsUpGesture,
			Gestures.HangLooseGesture,
			Gestures.hockDescription
		]
		const GE = new GestureEstimator(knownGestures)

		// load handpose model
		const detector = await createDetector()
		console.log("mediaPose model loaded")

		// main estimation loop
		const estimateHands = async () => {

			// clear canvas overlay
			ctx?.clearRect(0, 0, config.video.width, config.video.height)

			if (!resultLayer.right || !resultLayer.left) return

			resultLayer.right!.innerText = ''
			resultLayer.left!.innerText = ''

			// get hand landmarks from video
			if (!video?.current) return;
			const hands = await detector.estimateHands(video?.current, {
				flipHorizontal: true
			})

			for (const hand of hands) {
				for (const keypoint of hand.keypoints) {
					const name = keypoint.name?.split('_')[0].toString().toLowerCase()
					const color = landmarkColors[name as keyof typeof landmarkColors]
					drawPoint(ctx!, keypoint.x, keypoint.y, 3, color)
				}

				const est = GE.estimate(hand.keypoints3D, 9)
				if (est && est.gestures.length > 0) {

					// find gesture with highest match score
					let result = est.gestures.reduce((p: any, c: any) => {
						return (p.score > c.score) ? p : c
					})
					const chosenHand: string = hand.handedness.toLowerCase()

					if (!resultLayer[chosenHand]) return;

					resultLayer[chosenHand]!.innerText = String(gestureStrings[result.name as keyof typeof gestureStrings])
					updateDebugInfo(est.poseData, chosenHand)
				}

			}
			// ...and so on
			setTimeout(() => { estimateHands() }, 1000 / config.video.fps)
		}

		estimateHands()
		console.log("Starting predictions")
	}

	async function initCamera(width: number, height: number, fps: number) {
		console.log(width, height, fps)

		const constraints = {
			audio: false,
			video: {
				facingMode: "user",
				width: width,
				height: height,
				frameRate: { max: fps }
			}
		}

		const video = document.querySelector("#pose-video") as any
		if (!video) return;
		video.width = width
		video.height = height

		// get video stream
		const stream = await navigator.mediaDevices.getUserMedia(constraints)
		video.srcObject = stream

		return new Promise(resolve => {
			video.onloadedmetadata = () => { resolve(video) }
		})
	}

	function drawPoint(ctx: { beginPath: () => void; arc: (arg0: any, arg1: any, arg2: any, arg3: number, arg4: number) => void; fillStyle: any; fill: () => void }, x: any, y: any, r: number, color: any) {
		ctx.beginPath()
		ctx.arc(x, y, r, 0, 2 * Math.PI)
		ctx.fillStyle = color
		ctx.fill()
	}

	function updateDebugInfo(data: [string | undefined, string | false, string | false][], hand: any) {
		const summaryTable = `#summary-${hand}`
		for (let fingerIdx in data) {
			document.querySelector(`${summaryTable} span#curl-${fingerIdx}`)!.innerHTML = String(data[fingerIdx][1])
			document.querySelector(`${summaryTable} span#dir-${fingerIdx}`)!.innerHTML = String(data[fingerIdx][2])
		}
	}

	useEffect(() => {
		console.log("Initializing app");

		initCamera(
			config.video.width, config.video.height, config.video.fps
		).then((video: any) => {
			video.play()
			video.addEventListener("loadeddata", (event: any) => {
				console.log("Camera is ready")
				main()
			})
		})

		console.log("DOM loaded");

		if (!canva ||
			!canva.current ||
			[canva?.current?.width, canva?.current?.height]
				.every(
					(v: any) => v === undefined
				)
		) return;

		canva.current.width = config.video.width
		canva.current.height = config.video.height
		console.log("Canvas initialized")
	}, [])

	return (
		<AppContainer>
			<div className="video">
				<div id="video-container">
					<video ref={video} id="pose-video" className="layer" playsInline></video>
					<canvas ref={canva} id="pose-canvas" className="layer"></canvas>
					<div id="pose-result-left" className="layer pose-result"></div>
					<br />
					<div id="pose-result-right" className="layer pose-result"></div>
				</div>
			</div>

			<div className="debug">
				<h2>Left Hand</h2>
				<table id="summary-left" className="summary">
					<thead>
						<tr>
							<th>Idx</th>
							<th>Finger</th>
							<th style={{ width: "110px" }}>Curl</th>
							<th style={{ width: "170px" }}>Direction</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>0</td>
							<td>Thumb</td>
							<td><span id="curl-0">-</span></td>
							<td><span id="dir-0">-</span></td>
						</tr>
						<tr>
							<td>1</td>
							<td>Index</td>
							<td><span id="curl-1">-</span></td>
							<td><span id="dir-1">-</span></td>
						</tr>
						<tr>
							<td>2</td>
							<td>Middle</td>
							<td><span id="curl-2">-</span></td>
							<td><span id="dir-2">-</span></td>
						</tr>
						<tr>
							<td>3</td>
							<td>Ring</td>
							<td><span id="curl-3">-</span></td>
							<td><span id="dir-3">-</span></td>
						</tr>
						<tr>
							<td>4</td>
							<td>Pinky</td>
							<td><span id="curl-4">-</span></td>
							<td><span id="dir-4">-</span></td>
						</tr>
					</tbody>
				</table>
				<br />
				<h2>Right Hand</h2>
				<table id="summary-right" className="summary">
					<thead>
						<tr>
							<th>Idx</th>
							<th>Finger</th>
							<th style={{ width: "110px" }}>Curl</th>
							<th style={{ width: "170px" }}>Direction</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>0</td>
							<td>Thumb</td>
							<td><span id="curl-0">-</span></td>
							<td><span id="dir-0">-</span></td>
						</tr>
						<tr>
							<td>1</td>
							<td>Index</td>
							<td><span id="curl-1">-</span></td>
							<td><span id="dir-1">-</span></td>
						</tr>
						<tr>
							<td>2</td>
							<td>Middle</td>
							<td><span id="curl-2">-</span></td>
							<td><span id="dir-2">-</span></td>
						</tr>
						<tr>
							<td>3</td>
							<td>Ring</td>
							<td><span id="curl-3">-</span></td>
							<td><span id="dir-3">-</span></td>
						</tr>
						<tr>
							<td>4</td>
							<td>Pinky</td>
							<td><span id="curl-4">-</span></td>
							<td><span id="dir-4">-</span></td>
						</tr>
					</tbody>
				</table>
			</div>
		</AppContainer>
	)
}

export default App
