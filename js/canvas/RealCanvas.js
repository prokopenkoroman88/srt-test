import CustomCanvas from './CustomCanvas.js';
import VirtualCanvas from './VirtualCanvas.js';
import PixelColor from './PixelColor.js';

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
		this.ctx = this.canvas.getContext('2d', { willReadFrequently:true });
		//Multiple readback operations using getImageData are faster with the willReadFrequently attribute set to true

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


	paintLine(from={x:0,y:0}, to={x:0,y:0}, color, opacity=1){
		if(!opacity)
			return;
		let rgba=color;
		if(!Array.isArray(rgba)){
			let pixel = new PixelColor(color);
			rgba=pixel.toArray();
		};

		let vH=Math.abs(to.y-from.y);//+1
		let vW=Math.abs(to.x-from.x);//+1
		let N=vH>vW?vH:vW;
		if(!N)
			return;
		let di=(to.y-from.y)/N;//+1
		let dj=(to.x-from.x)/N;//+1
		for(let k=0; k<N; k++){

			let i=Math.round(from.y+k*di);
			let j=Math.round(from.x+k*dj);
			if( (i<0)||(i>=this.height)||(j<0)||(j>=this.width) )
				continue;
			if(opacity<1){
				let rgba_old=this.getRGB(j,i);
				let rgba_new=this.encodeColor(
					rgba_old[0] + (rgba[0]-rgba_old[0])*opacity,
					rgba_old[1] + (rgba[1]-rgba_old[1])*opacity,
					rgba_old[2] + (rgba[2]-rgba_old[2])*opacity,
					rgba_old[3] + (rgba[3]-rgba_old[3])*opacity,
				);
				this.setRGB(j,i,rgba_new);
			}
			else
				this.setRGB(j,i,rgba);
		}
		//need put() after
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