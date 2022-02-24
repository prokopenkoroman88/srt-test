import PixelColor from './PixelColor.js';

export default class PixelGradient extends PixelColor{

	constructor(colorFrom,colorTo=undefined, coef=0.5, mode=0){
		if(!colorTo)
			colorTo=colorFrom;
		super(colorTo);
		//console.log('PixelGradient');
		//console.log(colorFrom);
		//console.log(colorTo);
		this.color1 = new PixelColor(colorFrom);
		this.color2 = new PixelColor(colorTo);
		this.coef = coef;
		this.mode = mode;

		//let color=PixelGradient::grad(this.color1.toArray(), this.color2.toArray(), this.coef, this.mode);
		//super(color);
		this.make();
	}


	setFrom(color){
		if(this.color1)
			delete this.color1;
		this.color1 = new PixelColor(color);
		this.make();
	}

	setTo(color){
		if(this.color2)
			delete this.color2;
		this.color2 = new PixelColor(color);
		this.make();
	}


	make(){
		let rgba=PixelGradient.grad(this.color1.toArray(), this.color2.toArray(), this.coef, this.mode);
		this.encodeColor(rgba[0], rgba[1], rgba[2], rgba[3]);
	}

	static grad(rgba1, rgba2, coef=0.5, mode=0){
		let res=[0,0,0,255];

		switch (mode) {
			case 0:
				break;
			case 1: coef = (Math.sin(coef*Math.PI-Math.PI/2)+1)/2;//0..1
				break;
			default:
				break;
		};
		for(let z=0; z<3; z++)
			res[z] =   Math.round(rgba1[z] + (rgba2[z]  - rgba1[z])*coef);
		return res;
	};


}
