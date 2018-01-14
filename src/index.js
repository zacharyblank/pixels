require('./colors')
require('tracking')
require('tracking/build/data/face-min.js')

// How many color layers
var layerCount 	= 15;

var layers 		= new Array(layerCount)
var img 		= document.getElementById("sourceImage");
var canvas 		= document.createElement("canvas")
var video 		= document.createElement("video")
var tracker 	= new tracking.ObjectTracker('face');
var image 		= new Image();


var setup = function() {
	canvas.width 	= img.width
	canvas.height 	= img.height
	
	video.width 	= 320
	video.height 	= 240
	video.id 		= "video"
	video.preload 	= true
	video.autoplay 	= true
	video.loop 		= true
	video.muted 	= true

	image.src = img.src;

	tracker.setInitialScale(4);
	tracker.setStepSize(2);
	tracker.setEdgesDensity(0.1);

	document.body.appendChild(canvas);
	document.body.appendChild(video);
}

image.onload = function() {
	var Layer 		= require('./layer')
	var context 	= canvas.getContext('2d');
	var colors 		= new Colors(canvas, context)
	var ratioX 		= canvas.width / video.width
	var ratioY 		= canvas.height / video.height


	context.drawImage(image, 0, 0);
	imageData = context.getImageData(0, 0, img.width, img.height);

	var pallet = colors.getPallet(layerCount)

	for (var i = 0; i < pallet.length; i++) {
		layers[i] = new Layer({
			pallet: pallet[i],
			width: canvas.width,
			height: canvas.height,
			id: i
		});
	}

	for (var i = 0; i < imageData.data.length; i += 4) {
		// Make each pixel that is close to one of the primary colors that color
		for (var x = 0; x < pallet.length; x++) {
			var rDiff = Math.abs(imageData.data[i] - pallet[x][0]);
			var gDiff = Math.abs(imageData.data[i + 1] - pallet[x][1]);
			var bDiff = Math.abs(imageData.data[i + 2] - pallet[x][2]);

			if (rDiff < 50 && gDiff < 50 && bDiff < 50) {
				layers[x].writePixel({
					r: pallet[x][0],
					g: pallet[x][1],
					b: pallet[x][2],
					a: 255
				})
			} else {
				layers[x].writePixel({
					r: 0,
					g: 0,
					b: 0,
					a: 0
				})
			}

			if (layers[x].pixels.length == canvas.width * canvas.height * 4) {
				layers[x].draw()
			}

		}
	}

	document.body.removeChild(canvas);

	tracker.on('track', function(event) {
		event.data.forEach(function(rect) {
			for (var i = layers.length - 1; i >= 0; i--) {
				if (layers[i]) {
					layers[i].move({
						x: ((((rect.x + (rect.width / 2)) * ratioX) - (canvas.width / 2)) * -1) * (i * .1),
						y: ((((rect.y + (rect.height / 2)) * ratioY) - (canvas.height / 2)) * -1) * (i * .1),
					})
				}
			}
		})
	})
}

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    	tracking.track('#video', tracker, {
			camera: true
		});
    }, function() {
    	alert('Please allow camera access and reload the page')
    });
}

setup()