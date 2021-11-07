import CustomCanvas from './CustomCanvas.js';
import VirtualCanvas from './canvas/VirtualCanvas.js';

export default class RealCanvas extends CustomCanvas{

	constructor(selector=''){
		super();
		if(selector)
			this.init(selector);
	}


	init(selector){
		this.canvas=document.querySelector(selector);//'#game-field canvas'
		this.ctx = this.canvas.getContext('2d');

		super.resize(this.canvas.height,this.canvas.width);

		this.refreshImageData();
	}


	resize(height,width){

		super.resize(height,width);

		this.canvas.height=height;//1400;
		this.canvas.width=width;//1500;

		this.refreshImageData();
	}


	refreshImageData(){
		this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		this.data=this.imageData.data;//+16.7.21 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!)))))))))))))))))))))))

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