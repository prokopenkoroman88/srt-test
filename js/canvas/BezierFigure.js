import CustomCanvas from './CustomCanvas.js';
import VirtualCanvas from './VirtualCanvas.js';
import RealCanvas from './RealCanvas.js';

const cControlPoint=1, cBeforePoint=2, cAfterPoint=3, cRotatePoint=4;

/*

{x, y, kind=1}
{x, y, kind=3}

{x, y, kind=2}
{x, y, kind=1}
{x, y, kind=3}

{x, y, kind=2}
{x, y, kind=1}


{control:{x,y},after:{x,y}}
{control:{x,y},before:{x,y},after:{x,y}}
{control:{x,y},before:{x,y}}


*/
function distance(x0,y0,x1,y1){
	return Math.sqrt(Math.pow(x1-x0,2) + Math.pow(y1-y0,2));
}

class Point {
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
	shift(dx,dy){
		this.x+=dx;
		this.y+=dy
	}
	distance(x,y){
		return distance(this.x, this.y, x, y);// Math.sqrt(Math.pow(x-this.x,2) + Math.pow(y-this.y,2));
	}
	isNear(x,y){
		return (this.distance(x,y)<5);
	}
};

class Rotor extends Point {
	constructor(x,y,angle=0){
		super(x,y);
		this.angle = angle;
		this.points = [];
	}
	rotate(dangle){
		if(dangle==0) return;
		for(let i=0; i<this.points.length; i++){
			let rad = this.points[i].distance(x,y);
			let angle = Math.atan2(this.points[i].y-y, this.points[i].x-x);
			angle+=dangle;
			//m.b. cos i sin perestavit'?
			this.points[i].y = y+Math.sin(angle)*rad;
			this.points[i].x = x+Math.cos(angle)*rad;
		};//i
		this.angle+=dangle;
	}
}

class Spline {
	constructor(points){
		this.controlPointIds=points;//point0,point1
		this.leverPoint=[];
		this.width = 1;
		this.color = '#000';
	}

	findFigure(){
		let layers = BezierCanvas.cnv.layers;
		console.log(layers);
		for(let i=0; i<layers.length; i++){
			let figures = layers[i].figures;
			for(let j=0; j<figures.length; j++){
				if (figures[j].splines.indexOf(this)>=0){
					return figures[j];
				};
			};//j
		};//i
	}
	get controlPoint(){
		let arr=[];
		for(let i=0; i<this.controlPointIds.length; i++)
			arr.push(this.ownFigure.points[ this.controlPointIds[i] ]);
		return arr;
	}
	toArray(){
		return [this.controlPoint[0],this.leverPoint[0],this.leverPoint[1],this.controlPoint[1]];
	}
	isNear(x,y,ownFigure=null){
		if(!ownFigure)
			ownFigure=this.findFigure();
		this.ownFigure = ownFigure;
		console.log('ownFigure=');
		console.log(this.ownFigure);
		let aDot = this.toArray();
		delete this.ownFigure;
		let oldPoint, newPoint=aDot[0];
		let c=0;
		for(let i=1; i<aDot.length; i++)
			c+=aDot[i-1].distance(aDot[i].x,aDot[i].y);
		c=c/5;//4
		//=Math.hypot(aDot);//
		for(let i=1; i<=c; i++){
			if(distance(newPoint.x, newPoint.y, x, y)<5)
				return true;
			oldPoint = newPoint;
			newPoint = findInterimBezierPoint(aDot, i/c);
		};///i++
		return false;
	}
};


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
		this.splineIds=[];
		
	}

};

class BezierFigure{// extends BezierCurve

	constructor(name=''){
		this.name=name;
		//this.rect = {x,y,w:0,h:0};
		this.points = [];//Point
		this.rotors = [];//Rotor
		this.splines = [];//Spline
		this.curves = [];//BezierCurve
		this.figures = [];//BezierFigure (and imported)
	}

	findByCoords(arrName,x,y){
		arrName+='s';
		for(let i=0; i<this[arrName].length; i++){
			if(this[arrName][i].isNear(x,y,this)){
				console.log('Figure.'+arrName+' = '+i);
				return i;
			};
		};
		return -1;		
	}
	findPointByCoords(x,y){
		return this.findByCoords('point',x,y);
/*
		for(let i=0; i<this.points.length; i++){
			if(this.points[i].isNear(x,y))
				return i;
		};
		return -1;
*/
	}
	findRotorByCoords(x,y){
		return this.findByCoords('rotor',x,y);
/*
		for(let i=0; i<this.rotors.length; i++){
			if(this.rotors[i].isNear(x,y))
				return i;
		};
		return -1;
*/
	}
	findSplineByCoords(x,y){
		return this.findByCoords('spline',x,y);
/*
		for(let i=0; i<this.splines.length; i++){
			if(this.splines[i].isNear(x,y))
				return i;
		};
		return -1;		
*/
	}
};

class BezierLayer{
	constructor(){
		this.figures = [];//BezierFigure (and imported)
	}
	findByCoords(arrName,x,y){
		for(let i=0; i<this.figures.length; i++){
			let id = this.figures[i].findByCoords(arrName,x,y);
			if(id>=0){
				let res={figure:i};
				res[arrName] = id;
				console.log(res);
				return res;
				//return {figure:i, arrName:id};
			};
		};//
				let res={figure:-1};
				res[arrName] = -1;
				return res;
		//return {figure:-1, arrName:-1};
	}
}

function findInterimBezierPoint(aDot, coef){//interim point
		function middle(dot1,dot2,coef){
			return {
				x: dot1.x + (dot2.x-dot1.x)*coef,
				y: dot1.y + (dot2.y-dot1.y)*coef,
			};
		};

/*
		let aPnt=[{}, {},{}, {},{},{}, {},{},{},{}];
		aPnt[9]=aDot[3];
		aPnt[8]=aDot[2];
		aPnt[7]=aDot[1];
		aPnt[6]=aDot[0];

		aPnt[5]=middle(aPnt[8], aPnt[9], coef);
		aPnt[4]=middle(aPnt[7], aPnt[8], coef);
		aPnt[3]=middle(aPnt[6], aPnt[7], coef);

		aPnt[2]=middle(aPnt[4], aPnt[5], coef);
		aPnt[1]=middle(aPnt[3], aPnt[4], coef);

		aPnt[0]=middle(aPnt[1], aPnt[2], coef);
//wrapped code:*/
		let n=aDot.length;
		let i2=(n*n+n)/2;//10 6 3 1
		let i1=i2-n;//6 3 1 0
		let aPnt = new Array(i2);
		for(let i=0; i<n; i++)
			aPnt[i1+i]=aDot[i];
		for(let lvl=n-1; lvl>0; lvl--){//степень
			for(let j=lvl; j>0; j--){//точки
				i1--;
				aPnt[i1]=middle(aPnt[i1+lvl], aPnt[i1+lvl+1], coef);
			};
		};

		return aPnt[0];
}

class BezierCanvas extends RealCanvas{

	static cnv=null;

	init(selector){
		super.init(selector);
		console.log('BezierCanvas.init('+selector+')');
		console.log(this.canvas);
		//this.points = [];
		//this.splines = [];
		this.content = {
			layers : [],
		};
		BezierCanvas.cnv = this;
	}


/*
	findPointByCoords(x,y){
		for(let i=0; i<this.points.length; i++){
			if(this.points[i].isNear(x,y))
				return i;
		};
		return -1;
	}

	findSplineByCoords(x,y){
		for(let i=0; i<this.splines.length; i++){
			if(this.splines[i].isNear(x,y))
				return i;
		};
		return -1;		
	}
*/

	findByCoords(arrName,x,y){
		for(let i=0; i<this.content.layers.length; i++){
			let res = this.content.layers[i].findByCoords(arrName,x,y);
			if(res[arrName]>=0){
				res.layer=i;
				console.log(res);
				return res;
				//return {layer:i, figure:res.figure, ''''+arrName+'''':res[arrName]};
			};
		};//
				let res={layer:-1, figure:-1};
				res[arrName] = -1;
				return res;
		//return {layer:-1, figure:-1, ''''+arrName+'''':-1};
	}

	/*paintPoint(point,rgba){
			let x=Math.round(point.x);
			let y=Math.round(point.y);
			this.setRGB(x,y,rgba);//canvas
		};*/

	paintBezier(aDot, color){//PixelColor color

		let cnv=this;
		function paintPoint(point){
			let x=Math.round(point.x);
			let y=Math.round(point.y);
			cnv.setRGB(x,y,rgba);
		};


		let rgba=color.toArray();//[128,255,224,255];

		console.log('bezier ');
		console.log(aDot);


		let oldPoint, newPoint=aDot[0];
		let c=0;
		for(let i=1;i<=3;i++)
			c+=aDot[i-1].distance(aDot[i].x,aDot[i].y);
		//c=c/2;//4
		//=Math.hypot(aDot);//
		for(let i=1; i<=c; i++){
			oldPoint = newPoint;
			newPoint = findInterimBezierPoint(aDot, i/c);
			//console.log(i );
			paintPoint(newPoint);
			//console.log(aPnt);
		};///i++

		//this.canvas.put();
	}

//http://www.sopromat.info/cubic-equations-online-048.html
//https://naurok.com.ua/kubichni-rivnyannya-metod-kardano-metod-vieta-89259.html


paintBezier3(aDot, color){//bezier_cubic
var iii=0;
	function discr(p,q){
		let D = Math.pow(p/3, 3) + Math.pow((q)/2 ,2);

		if(iii<1000){
			//console.log('p,q,D: ',p,q,D);
			iii++;
		};
		if(D<0)D=Math.abs(D);//???
		let rD = Math.pow(D,1/2);// = -\/D
		if(iii<1000){
			//console.log('rD: ',rD, Math.pow(-27, 1/3));

		};
		let arg1=-q/2+rD, sgn1=1; if(arg1<0){ sgn1=-1; arg1=-arg1;  };
		let arg2=-q/2-rD, sgn2=1; if(arg2<0){ sgn2=-1; arg2=-arg2;  };
		let z1 = sgn1*Math.pow(arg1, 1/3) + sgn2*Math.pow(arg2, 1/3);

		return z1;
	};

function grad(rgba1,rgba2,coef){
	let res=[0,0,0,255];
	coef = (Math.sin(coef*Math.PI-Math.PI/2)+1)/2;//0..1
	for(let z=0; z<3; z++)
		res[z] =   Math.round(rgba1[z] + (rgba2[z]  - rgba1[z])*coef);
	return res;
};


let rgba=color.toArray();//[255,200,100,255]
//a*x^3 + b*x^2 + cx + d = 0
//x=iter  a!=0

let ax =   aDot[3].x - 3*aDot[2].x + 3*aDot[1].x -   aDot[0].x;
let bx =               3*aDot[2].x - 6*aDot[1].x + 3*aDot[0].x;
let cx =                             3*aDot[1].x - 3*aDot[0].x;
//let d =                                             aDot[0];

let rx = bx/ax;
let sx = cx/ax;

let px = (3*sx-rx*rx)/3;
let qx = 2*rx*rx*rx/27 - rx*sx/3; // + t!!
//-----------
let ay =   aDot[3].y - 3*aDot[2].y + 3*aDot[1].y -   aDot[0].y;
let by =               3*aDot[2].y - 6*aDot[1].y + 3*aDot[0].y;
let cy =                             3*aDot[1].y - 3*aDot[0].y;
//let d =                                             aDot[0];

let ry = by/ay;
let sy = cy/ay;

let py = (3*sy-ry*ry)/3;
let qy = 2*ry*ry*ry/27 - ry*sy/3; // + t!!




//for(let y=60; y<120; y++){
for(let y=0; y<600; y++){

	let dy=aDot[0].y-y;
	let ty = dy/ay;

	let itery = discr(py,qy+ty);	
//	console.log('itery='+itery, ty, dy, ay);

	//for(let x=30; x<570; x++){
	for(let x=0; x<1200; x++){

		let dx=aDot[0].x-x;
		let tx = dx/ax;
		let iterx = discr(px,qx+tx);


//console.log('   iterx='+iterx, x);
//this.setRGB(Math.round(y/10+x) ,100+Math.round(iterx*100),[255,0,255,255]);
//this.setRGB(Math.round(iterx*100) ,100+Math.round(itery*100),[255,0,255,255]);
if(x==0){
this.setRGB(Math.round(100+y) ,100+Math.round(itery*100),[255,0,255,255]);
};



		//console.log('iterx='+iterx);
		if(Math.abs(iterx - itery)<31*8){
			//console.log('iterx='+iterx, x);
			let rgb5=grad(this.getRGB(x,y), rgba , 1/Math.pow(Math.abs(iterx - itery)+1,4)  );
			this.setRGB(x,y,rgb5);
		}


	};//x
};//y




}








};


export { Point, Spline, BezierPoint, BezierCurve, BezierFigure, BezierLayer, BezierCanvas };


