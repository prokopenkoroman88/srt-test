import CustomCanvas from './CustomCanvas.js';
import VirtualCanvas from './VirtualCanvas.js';

export default class RealCanvas extends CustomCanvas{

	constructor(selector=''){
		super();
		//if(selector)
			this.init(selector);
	}


	init(selector){
		if(!selector){
			this.canvas=document.createElement('canvas');


			this.canvas.setAttribute('width',320);
			this.canvas.setAttribute('height',320);



		//?document.body.append(this.canvas);
		console.log(this.canvas);
		}
		else
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


	put(){
		this.ctx.putImageData(this.imageData,0,0);
	}


	applImage(img,kuda){
		console.log('kuda:');
		console.log(kuda);
		this.ctx.drawImage(img, kuda.x, kuda.y);//?//, kuda.w, kuda.h);
	}



	moveTo(p){
		this.ctx.beginPath();
		this.ctx.moveTo(p.x, p.y);
	}

	lineTo(p, lineColor='black'){
		this.ctx.lineTo(p.x, p.y);
		this.stroke({style:lineColor});
	}//paintStandardLine

	curveTo(args, lineColor='black'){
		this.ctx.bezierCurveTo(args[0].x, args[0].y,  args[1].x, args[1].y,   args[2].x, args[2].y  );
		this.stroke({style:lineColor});
	}//paintStandardCurve

	stroke(obj){
		let _strokeStyle=this.ctx.strokeStyle;
		this.ctx.strokeStyle = obj.style;//lineColor;
		this.ctx.stroke();
		this.ctx.strokeStyle=_strokeStyle;
	}

	fill(color){
		this.ctx.fillStyle=color;//'rgb(255,255,0)';
		this.ctx.fill();
	}

	circle(p, radius, lineColor='black'){
		this.ctx.beginPath();
		this.ctx.arc(p.x,p.y, radius, 0, Math.PI*2, true);
		this.stroke({style:lineColor});
	}




	paintStandardLine(p0, p1, lineColor='black'){
		this.moveTo(p0);
		this.lineTo(p1, lineColor);
	}

	startStandardCurve(p){
		this.moveTo(p);
	}


	paintStandardCurve(args, lineColor='black'){
		this.curveTo(args, lineColor);
	}

	paintStandardCircle(p,radius){
		this.ctx.beginPath();
		this.ctx.arc(p.x,p.y, radius, 0, Math.PI*2, true);
		this.ctx.stroke();
	}

}