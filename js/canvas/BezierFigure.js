import CustomCanvas from './CustomCanvas.js';
import VirtualCanvas from './VirtualCanvas.js';
import RealCanvas from './RealCanvas.js';

function createPoint(x,y){
	return {x:x,y:y};
};

function shiftPoint(point,dx=0,dy=0){
	point.x+=dx;
	point.y+=dy;
	return point;
};


class BezierPoint {

	constructor(x,y){
		this.control= createPoint(x,y);
		this.setBefore(x,y);
		this.setAfter(x,y);
	}

	setBefore(x,y){
		this.before= createPoint(x,y);
	}

	setAfter(x,y){
		this.after= createPoint(x,y);
	}

	shift(dx,dy){
		shiftPoint(this.control,dx,dy);
		if(this.before)
			shiftPoint(this.before,dx,dy);
		if(this.after)
			shiftPoint(this.after,dx,dy);		
	}

	rotate(angle){



	}



};



class BezierCurve{

	constructor(){
		this.points=[];
		
	}

};

class BezierFigure extends BezierCurve{



};


class BezierCanvas extends RealCanvas{

//	static cnv=null;

	init(selector){
		super.init(selector);
	}



	findBezierPoint(aDot, coef){//interim point
		function middle(dot1,dot2,coef){
			return {
				x: dot1.x + (dot2.x-dot1.x)*coef,
				y: dot1.y + (dot2.y-dot1.y)*coef,
			};
		};
		//let aPnt=[{x,y},{x,y},{x,y}, {x,y},{x,y}, {x,y}];
		let aPnt=[{},{},{}, {},{}, {}];

		aPnt[0]=middle(aDot[0], aDot[1], i/c);
		aPnt[1]=middle(aDot[1], aDot[2], i/c);
		aPnt[2]=middle(aDot[2], aDot[3], i/c);


		aPnt[3]=middle(aPnt[0], aPnt[1], i/c);
		aPnt[4]=middle(aPnt[1], aPnt[2], i/c);
		
		aPnt[5]=middle(aPnt[3], aPnt[4], i/c);

		return aPnt[5];
	}





	paintBezier(aDot, color){//PixelColor color

		function paintPoint(point){
			let x=Math.round(point.x);
			let y=Math.round(point.y);
			this.canvas.setRGB(x,y,rgba);
		};


		let rgba=color.toArray();//[128,255,224,255];

		console.log('bezier ');
		console.log(aDot);


		let oldPoint, newPoint=aDot[0];
		let c=200;
		//=Math.hypot(aDot);//
		for(let i=0; i<=c; i++){
			oldPoint = newPoint;
			newPoint = this.findBezierPoint(aDot, i/c);
			//console.log(i );
			paintPoint(newPoint);
			//console.log(aPnt);
		};///i++

		//this.canvas.put();
	}








};


export { BezierPoint, BezierCurve, BezierFigure, BezierCanvas };


