import CustomCanvas from './CustomCanvas.js';

export default class VirtualCanvas extends CustomCanvas{

	constructor(height,width){
		super();
		this.init(height,width);
	}

	init(height,width){
		this.resize(height,width);
		//?//this.refreshImageData();
	}


	resize(height,width){
		super.resize(height,width);
		this.data = new Uint8ClampedArray(this.height*this.width*4);
		//Uint8ClampedArray()
		//https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects
		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray/Uint8ClampedArray
		// polifill: https://github.com/zloirock/core-js#ecmascript-typed-arrays
/*
		this.canvas=document.querySelector(selector);//'#game-field canvas'
		this.canvas.height=1000;
		this.canvas.width=1000;
		this.ctx = this.canvas.getContext('2d');
		this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
*/
	}


	clone(from={}){
		if(from=={}){
			from.x=0;
			from.y=0;
		};
		if(from.w)from.w=cm.width;
		if(from.h)from.h=cm.height;

		let h=from.h;
		let w=from.w;

		let kuda={x:0,y:0};

		let cm = new VirtualCanvas(h,w);
		cm.appl(this, kuda, from);
		return cm;
	}

}