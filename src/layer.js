module.exports = (function() {

	var pallet;

	var canvas;
	
	var context;
	
	var pixels;
	
	var imageData;

	var Layer = function(obj) {
		this.pallet = obj.pallet;
		
		this.pixels = [];

		// create the canvas for this layer
		this.canvas = document.createElement("canvas")
		this.canvas.id = "layer_" + obj.id
		this.canvas.width = obj.width
		this.canvas.height = obj.height

		this.context = this.canvas.getContext('2d');

		document.body.appendChild(this.canvas);

		return this;
	}

	Layer.prototype.writePixel = function(pixel) {
		this.pixels.push(pixel.r)
		this.pixels.push(pixel.g)
		this.pixels.push(pixel.b)
		this.pixels.push(pixel.a)
	}

	Layer.prototype.draw = function() {
		var image = new Image();
		this.context.drawImage(image, 0, 0);
		
		this.imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
		
		this.imageData.data.set(this.pixels);
		
		this.context.putImageData(this.imageData, 0, 0);
	}

	Layer.prototype.move = function(rect) {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.context.putImageData(this.imageData, rect.x, rect.y);
	}

	return Layer;
})()