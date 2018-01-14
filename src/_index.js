require('./colors')
require('tracking')
require('tracking/build/data/face-min.js')

var layers = new Array(8);
var pixelData = [];

var video = document.getElementById('video');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
// var tracker = new tracking.ObjectTracker('face');

var canvasW = canvas.width;
var canvasH = canvas.height;
var imageData;

var colors = new Colors(canvas, context)
var pixels = [];

var loadLayer = function() {

}

function loadImage(src) {

	var img = new Image();

	//drawing of the test image - img1
	img.onload = function() {
		//draw background image
		context.drawImage(img, 0, 0);
		imageData = context.getImageData(0, 0, canvasW, canvasH);

		var buf = new ArrayBuffer(imageData.data.length);
		var buf8 = new Uint8ClampedArray(buf);
		var data = new Uint32Array(buf);

		var pallet = colors.getPallet()

		// var j = 0;
		// for (var i = 0; i < data.length; i += 4) {
		// 	var grey = (0.2126 * imageData.data[i]) + (0.7152 * imageData.data[i + 1]) + (0.0722 * imageData.data[i + 2]);
		// 	data[j] =
		// 		(255 << 24) | // alpha
		// 		(grey << 16) | // blue
		// 		(grey << 8) | // green
		// 		grey; // red
		// 	j++; // Advance current the increment
		// }

		// imageData.data.set(buf8);

		for (var i = 0; i < imageData.data.length; i += 4) {
			// Make each pixel that is close to one of the primary colors that color
			for (var x = 0; x < layers.length; x++) {
				var rDiff = Math.abs(imageData.data[i] - pallet[x][0]);
				var gDiff = Math.abs(imageData.data[i + 1] - pallet[x][1]);
				var bDiff = Math.abs(imageData.data[i + 2] - pallet[x][2]);

				if (layers[x] == undefined) {
					layers[x] = new Uint8ClampedArray(imageData.data.length);
				}

				if (rDiff < 50 && gDiff < 50 && bDiff < 50) {
					layers[x][i] = pallet[x][0]
					layers[x][i + 1] = pallet[x][1]
					layers[x][i + 2] = pallet[x][2]
					layers[x][i + 3] = 255
				} else {
					layers[x][i] = 0
					layers[x][i + 1] = 0
					layers[x][i + 2] = 0
					layers[x][i + 3] = 0
				}
			}
		}
		
		// draw layers
		for (var i = 0; i < layers.length; i++) {
			var layer = new Image();

			layer.onload = (function(i) {
				return function() {
					context.drawImage(layer, 0, 0);

					layerData = context.getImageData(0, 0, canvasW, canvasH);

					// loop through by width / height and don't draw transparent pixels

					for (var x = 0; x < layerData.data.length; x += 4) {
						layerData.data[x] = layers[i][x]
						layerData.data[x+1] = layers[i][x+1]
						layerData.data[x+2] = layers[i][x+2]
						layerData.data[x+3] = layers[i][x+3]
					}

					// context.clearRect(0, 0, canvasW, canvasH);

					// console.log(layerData);
					context.putImageData(layerData, 0, 0);


				}
			})(i)

			layer.src = img.src;
			// layers[i]
		
			// break;
		}

		animate();
	};

	img.src = src;
}

loadImage('/assets/smith.jpg')

function draw() {
	var drawnPixels = []
	for (var i = 0; i < pixels.length; i += 4) {
		drawnPixels.push(pixels[i] * Math.random())
		drawnPixels.push(pixels[i + 1])
		drawnPixels.push(pixels[i + 2])
	}
	
	console.log("Draw");

	imageData.data = drawnPixels;
	context.putImageData(imageData, 0, 0);
}

function animate() {
	// call again next time we can draw
	// requestAnimationFrame(animate);
	// clear canvas
	// context.clearRect(0, 0, canvasW, canvasH);
	// draw everything
	// draw();
}

// tracker.setInitialScale(4);
// tracker.setStepSize(2);
// tracker.setEdgesDensity(0.1);
// tracking.track('#video', tracker, {
// 	camera: true
// });
// tracker.on('track', function(event) {
// 	context.clearRect(0, 0, canvas.width, canvas.height);
// 	event.data.forEach(function(rect) {
// 		context.strokeStyle = '#a64ceb';
// 		context.strokeRect(rect.x, rect.y, rect.width, rect.height);
// 		context.font = '11px Helvetica';
// 		context.fillStyle = "#fff";
// 		context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
// 		context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
// 	});
// });
// var gui = new dat.GUI();
// gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
// gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
// gui.add(tracker, 'stepSize', 1, 5).step(0.1);