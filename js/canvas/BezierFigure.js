//import CustomCanvas from './CustomCanvas.js';
//import VirtualCanvas from './VirtualCanvas.js';
//import RealCanvas from './RealCanvas.js';

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

class FigureItem{
	get array(){ return ''; }
	get index(){ return this.ownFigure[this.array].indexOf(this); }
	constructor(ownerFigure){
		this.ownFigure=ownerFigure;
	}
}

class Point extends FigureItem{
	get array(){ return 'points'; }
	constructor(ownerFigure,x,y){
		super(ownerFigure);
		this.x = x;
		this.y = y;
		this.width = 1;
		this.color = '#000';
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
	get array(){ return 'rotors'; }
	constructor(ownerFigure,x,y,angle=0){
		super(ownerFigure,x,y);
		this.angle = angle;
		this.points = [];
		this.rotors = [];//?
	}
	rotate(dangle){
		if(dangle==0) return;
		console.log('points of rotor:');
		console.log(this.points);
		for(let i=0; i<this.points.length; i++){
			let rad = this.points[i].distance(this.x,this.y);
			let angle = Math.atan2(this.points[i].y-this.y, this.points[i].x-this.x)+Math.PI/2;
			angle+=dangle;
			console.log('y0=',this.points[i].y,' x0=',this.points[i].x);
			this.points[i].y = Math.round((this.y-Math.cos(angle)*rad)*10)/10;
			this.points[i].x = Math.round((this.x+Math.sin(angle)*rad)*10)/10;
			console.log('y1=',this.points[i].y,' x1=',this.points[i].x, 'rad=', rad);
		};//i
		this.angle+=dangle;
	}
}

class BezierSpline extends FigureItem{
	get array(){ return 'splines'; }
	constructor(ownerFigure,points){
		super(ownerFigure);

		points=points.map((point)=>{
			let res;
			switch (typeof point) {
				case 'object': res = point; break;
				case 'number': res = ownerFigure.points[point]; break;
				//case 'string': res = this.dotByName(dot); break;
			};
			return res;
		},this);



		this.points=points;//point0,point1
	}

	get controlPoint(){
		return [this.points[0], this.points[this.points.length-1]];
	}
	get leverPoint(){
		let arr=[];
		for(let i=1; i<this.points.length-1; i++)
			arr.push(this.points[i]);
		return arr;
	}
	isNear(x,y){
		let oldPoint, newPoint=this.points[0];
		let c=0;
		for(let i=1; i<this.points.length; i++)
			c+=this.points[i-1].distance(this.points[i].x,this.points[i].y);
		c=c/5;//4
		//=Math.hypot(aDot);//
		for(let i=1; i<=c; i++){
			if(distance(newPoint.x, newPoint.y, x, y)<5)
				return true;
			oldPoint = newPoint;
			newPoint = findInterimBezierPoint(this.points, i/c);
		};///i++
		return false;
	}
};





class BezierCurve extends FigureItem{
	get array(){ return 'curves'; }
	constructor(ownerFigure){
		super(ownerFigure);
		this.splines=[];
		
	}
	isNear(x,y){
		//
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

	findByCoords(attrName,x,y){
		let arrName=attrName+'s';
		let res={};
		for(let i=0; i<this[arrName].length; i++){
			if(this[arrName][i].isNear(x,y,this)){
				console.log('Figure.'+arrName+' = '+i);
				res[attrName]=i;
				return res;//i;
			};
		};
		res[attrName]=-1;
		return res;//-1;		
	}
	findPointByCoords(x,y){
		return this.findByCoords('point',x,y);
	}
	findRotorByCoords(x,y){
		return this.findByCoords('rotor',x,y);
	}
	findSplineByCoords(x,y){
		return this.findByCoords('spline',x,y);
	}
};

class BezierLayer{
	constructor(){
		this.figures = [];//BezierFigure (and imported)
	}
	findByCoords(attrName,x,y){
		for(let i=0; i<this.figures.length; i++){
			let res = this.figures[i].findByCoords(attrName,x,y);
			if(res[attrName]>=0){
				res.figure=i;
				console.log(res);
				return res;
			};
		};//
				let res={};//{figure:-1};
				res[attrName] = -1;
				res.figure=-1;
				return res;
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

class BezierScreen{
	constructor(canvas){
		this.canvas=canvas;
		console.log(this.canvas);
		this.content = {
			layers : [],
		};
	}



	findByCoords(attrName,x,y){
		for(let i=0; i<this.content.layers.length; i++){
			let res = this.content.layers[i].findByCoords(attrName,x,y);
			if(res[attrName]>=0){
				res.layer=i;
				console.log(res);
				return res;
			};
		};//
				let res={};//{layer:-1, figure:-1};
				res[attrName] = -1;
				res.figure=-1;
				res.layer=-1;
				return res;
	}

	paintPoint(point,rgba){
			let x=Math.round(point.x);
			let y=Math.round(point.y);
			this.canvas.setRGB(x,y,rgba);//canvas
	}

	paintBezier(aDot, color){//PixelColor color



		let rgba=Array.isArray(color)?color:color.toArray();//[128,255,224,255];

		//console.log('bezier ');
		//console.log(aDot);


		let oldPoint, newPoint=aDot[0];
		let c=0;
		for(let i=1;i<aDot.length;i++)
			c+=distance(aDot[i-1].x,aDot[i-1].y,aDot[i].x,aDot[i].y);
		//c=c/2;//4
		//=Math.hypot(aDot);//
		for(let i=1; i<=c; i++){
			oldPoint = newPoint;
			newPoint = findInterimBezierPoint(aDot, i/c);
			//console.log(i );
			this.paintPoint(newPoint,rgba);
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


console.log('aDot=');
console.log(aDot);
console.log(ax,bx,cx,rx,sx,px,qx);
console.log(ay,by,cy,ry,sy,py,qy);
//x^3 + r*x^2 + s*x + t = 0; //r=b/a s=c/a t=d/a
//y = x+r/3 | x = y-r/3
//y^3 + p*y + q = 0; // p = (3*s - r^2)/3, q = (2*r^3)/27 - r*s/3 + t
function cardano(p,q){
	let x = Math.pow( -q/2 - Math.pow(q*q/4 + p*p*p/27,1/2) ,1/3) + Math.pow( -q/2 + Math.pow(q*q/4 + p*p*p/27,1/2) ,1/3);
	return x;
}

function gaussian(x, a=1, b=0, c=1){
	return a*Math.exp(-((x-b)*(x-b))/(2*c*c));
}

function bezier_roots(a,b,c,d,val=1){
//http://www.sopromat.info/catalog/view/javascript/048.js
	function sqrt3(D){
		return D>=0?Math.pow(D,1/3):-Math.pow(-D,1/3);
	};

	let koren1={},koren2={},koren3={},z_1,z_2;

		let r=b/a,
		    s=c/a,
		    t=d/a,
		    p=(3*s-Math.pow(r,2))/3,//-Math[sopr_0x1370('0x17')] = pow
		    q=2/27*Math.pow(r,3)-r*s/3+t,
		    D=Math.pow(p/3,3)+Math.pow(q/2,2);
		    //console.log('D='+D);

		//if(Math.abs(D)<1)//
		if(D>-1e-10&&D<1e-10)
			D=0;
		else 
			if(D>0xe8d4a51000||D<-0xe8d4a51000)
				console.log('D is too large = '+D);

		if(D>0){//рівняння має один дійсний корінь і два комплексні
			z_1=sqrt3(-q/2+Math.pow(D,0.5));
			z_2=sqrt3(-q/2-Math.pow(D,0.5));
			koren1.real=(z_1+z_2-r/3)*val;//[sopr_0x1370('0x16')](_0x46f248);
			koren2.real=(-r/3-(z_1+z_2)/2)*val;//[sopr_0x1370('0x16')](_0x46f248)+'+'+((z_1-z_2)/2*Math.pow(3,0.5))[sopr_0x1370('0x16')](_0x46f248)+'i';
			koren3.real=(-r/3-(z_1+z_2)/2)*val;//[sopr_0x1370('0x16')](_0x46f248)+'-'+((z_1-z_2)/2*Math.pow(3,0.5))[sopr_0x1370('0x16')](_0x46f248)+'i';
			koren2.im=((z_1-z_2)/2*Math.pow(3,0.5))*val;
			koren3.im=((z_1-z_2)/2*Math.pow(3,0.5))*val;
		}
		else 
			if(D===0){//всі корені рівняння є дійсними числами, при чому принаймні два з них є однаковими
				z_1=sqrt3(-q/2);
				koren1.real=(2*z_1-r/3)*val;//['numberToFixed'](_0x46f248);
				koren2.real=(-r/3-z_1)*val;//[sopr_0x1370('0x16')](_0x46f248);
				koren3.real=koren2.real;
			}
			else{//всі три корені рівняння є різними дійсними числами
				let tmp1=p>=0?Math.pow((p)/3,0.5):-Math.pow((-p)/3,0.5);//Math[sopr_0x1370('0xb')]
				let tmp2=(q/(2*Math.pow(tmp1,3)));//Math[sopr_0x1370('0xa')]
				koren1.real=(-2*tmp1*(tmp2/3)-r/3)*val;//Math[sopr_0x1370('0x13')]//[sopr_0x1370('0x16')](_0x46f248);
				koren2.real=(-2*tmp1*Math.cos(tmp2/3+2*Math.PI/3)-r/3)*val;//[sopr_0x1370('0x16')](_0x46f248);
				koren3.real=(-2*tmp1*(tmp2/3+4*Math.PI/3)-r/3)*val;//Math[sopr_0x1370('0x13')]//[sopr_0x1370('0x16')](_0x46f248);
			}

	return [koren1,koren2,koren3];
};

let this1 = this;
function paintInterim(coef,x,y,dx,dy){
	if(coef<0 || coef>1)return;
	let pnt;
	pnt = findInterimBezierPoint(aDot,coef);
	let clr = [55,255,55,255];
	//this1.setRGB(Math.round(dx+pnt.x),Math.round(dy+pnt.y) ,[55,255,55,255]);
	if(isNaN(x)){x=pnt.x; clr = [255,55,255,255] }
	if(isNaN(y))y=pnt.y;
	this1.canvas.setRGB(Math.round(dx+x),Math.round(dy+y) ,clr);
};

//for(let y=60; y<120; y++){
for(let y=0; y<600; y++){

	let dy=aDot[0].y-y;
	let ty = dy/ay;

	//let itery = discr(py,qy+ty);	
	//let itery = cardano(py,qy+ty);//? - ry/3;
	console.log('y='+y);
	let korniy = bezier_roots(ay,by,cy,dy,1);


	if(!korniy[0].im)paintInterim(korniy[0].real,NaN,y,10,0);
	if(!korniy[1].im)paintInterim(korniy[1].real,NaN,y,10,0);
	if(!korniy[2].im)paintInterim(korniy[2].real,NaN,y,10,0);


	//console.log(korniy);
//	console.log('itery='+itery, ty, dy, ay);

	//for(let x=30; x<570; x++){
	for(let x=0; x<1200; x++){

		let dx=aDot[0].x-x;
		let tx = dx/ax;
		//let iterx = discr(px,qx+tx);
		//let iterx = cardano(px,qx+tx);//? - rx/3;
//?		let kornix = bezier_roots(ax,bx,cx,dx);


//console.log('   iterx='+iterx, x);
//this.setRGB(Math.round(y/10+x) ,100+Math.round(iterx*100),[255,0,255,255]);
//this.setRGB(Math.round(iterx*100) ,100+Math.round(itery*100),[255,0,255,255]);
if(x==0){
//this.setRGB(Math.round(100+y) ,100+Math.round(itery*100),[255,0,255,255]);
//this.setRGB(100+Math.round(korniy[0].real),Math.round(0+y) ,[255,0,255,255]);
//this.setRGB(100+Math.round(korniy[1].real),Math.round(0+y) ,[255,0,255,255]);
//this.setRGB(100+Math.round(korniy[2].real),Math.round(0+y) ,[255,0,255,255]);
};
if(y==100){
//this.setRGB(100+Math.round(kornix[0].real),Math.round(100+x) ,[255,255,0,255]);
//this.setRGB(100+Math.round(kornix[1].real),Math.round(100+x) ,[255,255,0,255]);
//this.setRGB(100+Math.round(kornix[2].real),Math.round(100+x) ,[255,255,0,255]);
};



		//console.log('iterx='+iterx);
/*		//if(Math.abs(iterx - itery)<31*8){
			//console.log('iterx='+iterx, x);
			//let rgb5=grad(this.getRGB(x,y), rgba , 1/Math.pow(Math.abs(iterx - itery)+1,4)  );
			let coef = gaussian(iterx - itery);
			if(coef>1)coef=1;
			//let rgb5=grad(this.getRGB(x,y), rgba , coef  );
			let dlt = Math.abs(iterx);// - itery);
			let rgb5 = new Array(4);
			rgb5[0] = dlt & 255;
			dlt = (dlt - rgb5[0])/256;
			rgb5[1] = dlt & 255;
			dlt = (dlt - rgb5[1])/256;
			rgb5[2] = dlt & 255;
			rgb5[3]=255;
			this.setRGB(x,y,rgb5);
		//}*/

		let dlts=[];
/*
		dlts.push( Math.abs(kornix[0].real-y) );
		dlts.push( Math.abs(kornix[1].real-y) );
		dlts.push( Math.abs(kornix[2].real-y) );
		dlts.push( Math.abs(korniy[0].real-x) );
		dlts.push( Math.abs(korniy[1].real-x) );
		dlts.push( Math.abs(korniy[2].real-x) );
		dlts.sort(function(a,b){ return a-b; });
		let rgb6=grad(this.getRGB(x,y), rgba , gaussian(dlts[0])  );
		this.setRGB(x,y,rgb6);
*/

//x^3 + r*x^2 + s*x + t = 0; //r=b/a s=c/a t=d/a
//let newY = ax*x*x*x + bx*x*x + cx*x + dx; //r=b/a s=c/a t=d/a
//let newX = ay*y*y*y + by*y*y + cy*y + dy;
//console.log(newY,newX);
//let newY = x*x*x + rx*x*x + sx*x + ty; //r=b/a s=c/a t=d/a
//let rgb7 = grad(this.getRGB(x,y), [0,55,255,255] , gaussian(Math.abs(newY-y) + Math.abs(newX-x)  ,2,0,10)  );

//this.setRGB(Math.round(0+newX) ,0+Math.round(y),[200,100,150,255]);
//this.setRGB(Math.round(0+x) ,0+Math.round(newY),[200,100,150,255]);

/*
			let dlt = Math.abs(newY-newX);//Math.abs(newY-y) + Math.abs(newX-x);
			let rgb7 = new Array(4);
			rgb7[0] = dlt & 255;
			dlt = (dlt - rgb7[0])/256;
			rgb7[1] = dlt & 255;
			dlt = (dlt - rgb7[1])/256;
			rgb7[2] = dlt & 255;
			rgb7[3]=255;

this.setRGB(Math.round(0+x) ,100+Math.round(y),rgb7);
*/

	};//x
};//y

for(let x=0; x<1200; x++){
	let dx=aDot[0].x-x;
	let tx = dx/ax;
	let kornix = bezier_roots(ax,bx,cx,dx,1);

//this.setRGB(Math.round(0+x) ,100+Math.round(kornix[0].real),[255,255,0,255]);
//this.setRGB(Math.round(0+x) ,100+Math.round(kornix[1].real),[255,255,0,255]);
//this.setRGB(Math.round(0+x) ,100+Math.round(kornix[2].real),[255,255,0,255]);

/*
	let pnt;
	pnt = findInterimBezierPoint(aDot,kornix[0].real);
	this.setRGB(0+Math.round(pnt.x),Math.round(10+pnt.y) ,[55,255,55,255]);
	pnt = findInterimBezierPoint(aDot,kornix[1].real);
	this.setRGB(0+Math.round(pnt.x),Math.round(10+pnt.y) ,[55,255,55,255]);
	pnt = findInterimBezierPoint(aDot,kornix[2].real);
	this.setRGB(0+Math.round(pnt.x),Math.round(10+pnt.y) ,[55,255,55,255]);
*/
	if(!kornix[0].im)paintInterim(kornix[0].real,x,NaN,0,10);
	if(!kornix[1].im)paintInterim(kornix[1].real,x,NaN,0,10);
	if(!kornix[2].im)paintInterim(kornix[2].real,x,NaN,0,10);
};//x



}

	paintGrid(currFigure,h,w){
/*
	рисует решетку между четырьмя линиями curves
	назначение линий:
	0 верхняя
	1 правая
	2 нижняя
	3 левая
	Для пары вертикальных линий и пары горизонтальных линий:
		кол-во сплайнов д.б. одинаково
		направление сплайнов д.б. одинаково
*/
		const _Top=0, _Right=1, _Bottom=2, _Left=3;
		if(!currFigure || currFigure.curves.length!=4)return;
		let crv = currFigure.curves;
		if(crv[_Top].splines.length != crv[_Bottom].splines.length || crv[_Right].splines.length != crv[_Left].splines.length)return;

		let clr =  [50,50,50,255];//new PixelColor('#22ffee');
		if(!h)h=10;
		if(!w)w=10;

		let iSpline=0, jSpline=0;
		let aSplines = new Array(4);
		let aDots = new Array(4);

		function getSpline(_Side,num){
			aSplines[_Side] = crv[_Side].splines[num];//currFigure.splines[ crv[_Side].splineIds[num] ];
			aSplines[_Side].ownFigure = currFigure;
			aDots[_Side] = aSplines[_Side].toArray();
			//return [spline, spline.toArray()];
		};

		getSpline(_Top,jSpline);
		getSpline(_Bottom,jSpline);

		getSpline(_Left,iSpline);
		getSpline(_Right,iSpline);

		let aDist = new Array(4);
		for(let _Side=_Top; _Side<=_Left; _Side++) {
			let ctrl = aSplines[_Side].controlPoint;
			let dist = ctrl[0].distance(ctrl[1].x, ctrl[1].y);
			if(dist==0)dist=1;
			aDist[_Side]=dist;
		};

		let aDltLever = new Array(4);
		for(let _Side=_Top; _Side<=_Left; _Side++) {
			aDltLever[_Side] = new Array(2);
			let ctrl = aSplines[_Side].controlPoint;
			let lvr = aSplines[_Side].leverPoint;
			aDltLever[_Side][0] = {dx:lvr[0].x-ctrl[0].x, dy:lvr[0].y-ctrl[0].y,};
			aDltLever[_Side][1] = {dx:lvr[1].x-ctrl[1].x, dy:lvr[1].y-ctrl[1].y,};
		};

		//рисует h горизонтальных линий от верхней линии №0 до нижней линии №3
				for(let i=0; i<=h; i++){
					let aDot = new Array(4);

					let p0 = findInterimBezierPoint(aDots[_Left], i/h);//p0=aPoints[_Left]
					let p3 = findInterimBezierPoint(aDots[_Right], i/h);//p3=aPoints[_Right]

					aDot[0] = {x:p0.x, y:p0.y,};
					aDot[3] = {x:p3.x, y:p3.y,};

					let wDist = distance(p0.x, p0.y, p3.x, p3.y);
					let coefWide = wDist/aDist[_Top];

					let dltTop = aDltLever[_Top];
					let dltBottom = aDltLever[_Bottom];

					aDot[1] ={};
					aDot[1].x = p0.x+(dltTop[0].dx*(1-i/h)+dltBottom[0].dx*(i/h))*coefWide;
					aDot[1].y = p0.y+(dltTop[0].dy*(1-i/h)+dltBottom[0].dy*(i/h))*coefWide;

					aDot[2] ={};
					aDot[2].x = p3.x+(dltTop[1].dx*(1-i/h)+dltBottom[1].dx*(i/h))*coefWide;
					aDot[2].y = p3.y+(dltTop[1].dy*(1-i/h)+dltBottom[1].dy*(i/h))*coefWide;

					this.paintBezier(aDot,clr);
				};

		//рисует w вертикальных линий от левой линии №3 до правой линии №1
				for(let j=0; j<=w; j++){
					let aDot = new Array(4);

					let p0 = findInterimBezierPoint(aDots[_Top], j/w);//p0=aPoints[_Left]
					let p3 = findInterimBezierPoint(aDots[_Bottom], j/w);//p3=aPoints[_Right]

					aDot[0] = {x:p0.x, y:p0.y,};
					aDot[3] = {x:p3.x, y:p3.y,};

					let wDist = distance(p0.x, p0.y, p3.x, p3.y);
					let coefWide = wDist/aDist[_Left];

					let dltTop = aDltLever[_Left];
					let dltBottom = aDltLever[_Right];

					aDot[1] ={};
					aDot[1].x = p0.x+(dltTop[0].dx*(1-j/w)+dltBottom[0].dx*(j/w))*coefWide;
					aDot[1].y = p0.y+(dltTop[0].dy*(1-j/w)+dltBottom[0].dy*(j/w))*coefWide;

					aDot[2] ={};
					aDot[2].x = p3.x+(dltTop[1].dx*(1-j/w)+dltBottom[1].dx*(j/w))*coefWide;
					aDot[2].y = p3.y+(dltTop[1].dy*(1-j/w)+dltBottom[1].dy*(j/w))*coefWide;

					this.paintBezier(aDot,clr);
				};

		aSplines.forEach( function(spline, _Side) {
			delete spline.ownFigure;//нужно для устранения циклических ссылок перед выгрузкой в JSON
		});

		this.put();
	}







};


export { Point, Rotor, BezierSpline, BezierCurve, BezierFigure, BezierLayer, BezierScreen };


