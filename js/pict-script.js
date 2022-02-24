import ColorMap from './canvas/VirtualCanvas.js';
import Canvas from './canvas/RealCanvas.js';
import PixelColor from './canvas/PixelColor.js';
import { Point, Spline, BezierPoint, BezierCurve, BezierFigure, BezierCanvas } from './canvas/BezierFigure.js';
import BezierEditor from './BezierEditor.js';
import { JPGAnalyzer } from './cogn/JPG-Analyzer.js';


let editor = new BezierEditor('#top-panel','#cnv1');

let cnv1 = editor.canvas;

const imgPath = '/images/km/wenn20219628.jpg';








let imgMan = new Image();
//canvas.crossOrigin = 'anonymous';//?
document.body.append(imgMan);
imgMan.style.visibility = 'hidden';
//this.imgMan.style.display = 'none';

if(!true){

	var iter=0;
	//?///var aBezierArgs


	cnv1.resize(800,1200);//h,w
	cnv1.ctx.strokeRect(0,0,1200,800);
	//cnv1.ctx.strokeRect(20,10,100,200);

/*
//https://www.html5canvastutorials.com/tutorials/html5-canvas-bezier-curves/
    cnv1.ctx.beginPath();
    cnv1.ctx.moveTo(188, 130);
    cnv1.ctx.bezierCurveTo(140, 10, 388, 10, 388, 170);
    cnv1.ctx.lineWidth = 10;//before stroke

    cnv1.ctx.bezierCurveTo(388, 160, 408, 180, 398, 180);
    cnv1.ctx.lineWidth = 5;//before stroke



    //cnv1.ctx.closePath();
//https://www.html5canvastutorials.com/tutorials/html5-canvas-shape-fill/
//https://www.html5canvastutorials.com/advanced/html5-canvas-animation-stage/

	cnv1.ctx.fillStyle='rgb(255,0,255)';
	cnv1.ctx.fill();

      // line color
    cnv1.ctx.strokeStyle = 'black';
    cnv1.ctx.stroke();




	cnv1.refreshImageData();
/*
	cnv1.canvas.addEventListener('click', function(event){
		console.log(event);
		let x=event.offsetX;
		let y=event.offsetY;
		console.log(x,y);

		iter = (iter+1)%3;


	});
*/



}
else{
imgMan.src = imgPath;

		imgMan.addEventListener('load', function(){

			console.log('imgMan.onLoad:');
			console.log(this);
			//Main.self.manMap.resize(400,200);
			cnv1.resize(imgMan.clientHeight,imgMan.clientWidth);
			cnv1.applImage(imgMan,{x:0,y:0});//, w:200,h:400
			//Main.self.manMap.ctx.drawImage(Main.self.imgMan, 30, 10, 150, 160);//?//, kuda.w, kuda.h);

			//Main.self.manMap.put();


		//Main.self.manMap.ctx = Main.self.manMap.canvas.getContext('2d');

		
		//?//Main.self.manMap.resize(Main.self.manMap.canvas.height,Main.self.manMap.canvas.width);

		//Main.self.manMap.refreshImageData();


			cnv1.refreshImageData();


			//document.body.remove(imgMan);
			imgMan.remove();
		});
};





/*
function isOne(rgba1,rgba2){
	for(let i=0;i<4;i++)
		if(rgba1[i]!=rgba2[i]) return false;
	return true;
};


function grad(rgba1,rgba2,coef){
	let res=[0,0,0,255];
	coef = (Math.sin(coef*Math.PI-Math.PI/2)+1)/2;//0..1
	for(let z=0; z<3; z++)
		res[z] =   Math.round(rgba1[z] + (rgba2[z]  - rgba1[z])*coef);
	return res;
};
*/



function show(){

let jpgAnalyzer = new JPGAnalyzer('#cnv1');
jpgAnalyzer.initRect();
//jpgAnalyzer.plavno();
//jpgAnalyzer.vawes();
//jpgAnalyzer.byEpicenters();
//jpgAnalyzer.by3Colors();
jpgAnalyzer.byClasters();
jpgAnalyzer.put();

/*
let rgba;

let
x0=8*105,
y0=8*287,

x1=0,
y1=0,

w=8*80,
h=8*100

;

console.log('show');
for(let i=0; i<h; i++)
for(let j=0; j<w; j++)
{
	rgba=cnv1.getRGB(x0+j,y0+i);
	cnv1.setRGB(x1+j,y1+i,rgba);
	//console.log(i,j,rgba);
};



//=======================


	for(let i=0; i<h; i++){

		let a=[];
		let rgba2=[0,0,0,0];

		for(let j=0; j<w; j++){

			rgba=cnv1.getRGB(x1+j,y1+i);
			
			if(!a.length || !isOne(rgba2,rgba) ){//a[a.length-1].rgba
				if(a.length){
					//console.log(a);
					//if((j-a[a.length-1].j1<4) && a[a.length-1].rgba[0]<40)
					//	a.pop();
					//else
						a[a.length-1].j2=j-1;
				};

				a.push({rgba:rgba, j1:j, j2:j});
				rgba2=rgba;
			};



		};//j
		a[a.length-1].j2=w-1;//?
		//console.log(a);


		let rgbaNew=[0,0,0,255];
		for(let k=1; k<a.length; k++){
			let c1 = Math.round((a[k-1].j2+a[k-1].j1)/2);
			let c2 = Math.round((a[k  ].j2+a[k  ].j1)/2);
			let len=c2-c1;

			for(let j2=0; j2<len; j2++){
				rgbaNew = grad(a[k-1].rgba,a[k].rgba,j2/len);
				//for(let z=0; z<3; z++)
				//rgbaNew[z] =   Math.round(a[k-1].rgba[z] + (a[k  ].rgba[z]  - a[k-1].rgba[z])*j2/len);

				cnv1.setRGB(x1+j2+c1,y1+i,rgbaNew);

			};//j2++



		};//k++




	};;//i



//============================================




	for(let j=0; j<w; j++){

		let a=[];
		let rgba2=[0,0,0,0];

		for(let i=0; i<h; i++){

			rgba=cnv1.getRGB(x1+j,y1+i);
			
			if(!a.length || !isOne(rgba2,rgba) ){//a[a.length-1].rgba
				if(a.length){
					//console.log(a);
					//if((i-a[a.length-1].i1<4) && a[a.length-1].rgba[0]<40)
					//	a.pop();
					//else
						a[a.length-1].i2=i-1;
				};


				a.push({rgba:rgba, i1:i, i2:i});
				rgba2=rgba;
			};



		};//i
		a[a.length-1].i2=w-1;//?
		//console.log(a);


		let rgbaNew=[0,0,0,255];
		for(let k=1; k<a.length; k++){
			let c1 = Math.round((a[k-1].i2+a[k-1].i1)/2);
			let c2 = Math.round((a[k  ].i2+a[k  ].i1)/2);
			let len=c2-c1;

			for(let i2=0; i2<len; i2++){
				rgbaNew = grad(a[k-1].rgba,a[k].rgba,i2/len);
				//for(let z=0; z<3; z++)
				//rgbaNew[z] =   Math.round(a[k-1].rgba[z] + (a[k  ].rgba[z]  - a[k-1].rgba[z])*i2/len);

				cnv1.setRGB(x1+j,y1+c1+i2,rgbaNew);

			};//j2++



		};//k++




	};//j




//=======================================
//======================================== vawes



	for(let i=0; i<h; i++){

		let a=[];
		let rgba2=[0,0,0,0];

		for(let j=0; j<w; j++){

			rgba=cnv1.getRGB(x1+j,y1+i);

			if(i%2==0)
				for(let z=0; z<3; z++)
					rgba[z]-=10;
		//		for(let z=0; z<3; z++)
		//			rgba[z]-=Math.sin(i)*10;

			//if(j%2==0)
		//		for(let z=0; z<3; z++)
		//			rgba[z]-=Math.sin(j)*10;



			cnv1.setRGB(x1+j,y1+i, rgba);
			
		};//j++

	};;//i

//Main.self.manMap
//cnv1.refreshImageData();
*/




/*
let cx=148,cy=50,cw=215,ch=50;
bezier([
	{x:cx-cw/2,y:cy},
	{x:cx-cw/3,y:cy+ch},
	{x:cx+cw/3,y:cy+ch+5},
	{x:cx+cw/2,y:cy+10},
	]);

cy+=3; cx-=1; cw-=1.5;
bezier([
	{x:cx-cw/2,y:cy},
	{x:cx-cw/3,y:cy+ch},
	{x:cx+cw/3,y:cy+ch+5},
	{x:cx+cw/2,y:cy+10+1},
	]);
cy+=3;cx-=1; cw-=1.5;
bezier([
	{x:cx-cw/2,y:cy},
	{x:cx-cw/3,y:cy+ch},
	{x:cx+cw/3,y:cy+ch+5},
	{x:cx+cw/2,y:cy+10+1.5},
	]);
cy+=3;cx-=1; cw-=1.5
bezier([
	{x:cx-cw/2,y:cy},
	{x:cx-cw/3,y:cy+ch},
	{x:cx+cw/3,y:cy+ch+5},
	{x:cx+cw/2,y:cy+10+2},
	]);

//*/



//cy+=3;cx-=1; cw-=1.5
/*bezier_cubic([
	{x:1,y:0-0},
	{x:2,y:16-0},
	{x:18,y:2-0},
	{x:19,y:19-0},
	]);
*/
/*bezier_cubic([
	{x:0,y:0-0},
	{x:1,y:90-0},
	{x:91,y:90-0},
	{x:90,y:1-0},
	]);

	cnv1.put();
*/





};



/*
function bezier(aDot){


	function middle(dot1,dot2,coef){
		return {
			x: dot1.x + (dot2.x-dot1.x)*coef,
			y: dot1.y + (dot2.y-dot1.y)*coef,
		};
	};

	let xx,yy,c=200;
	let rgba=[128,255,224,255];

	//let aPnt=[{x,y},{x,y},{x,y}, {x,y},{x,y}, {x,y}];
	let aPnt=[{},{},{}, {},{}, {}];

	console.log('bezier ');
	console.log(aDot);
	for(let i=0; i<c; i++){

		//console.log(i );
		aPnt[0]=middle(aDot[0], aDot[1], i/c);
		aPnt[1]=middle(aDot[1], aDot[2], i/c);
		aPnt[2]=middle(aDot[2], aDot[3], i/c);


		aPnt[3]=middle(aPnt[0], aPnt[1], i/c);
		aPnt[4]=middle(aPnt[1], aPnt[2], i/c);
		
		aPnt[5]=middle(aPnt[3], aPnt[4], i/c);


		xx=Math.round(aPnt[5].x);
		yy=Math.round(aPnt[5].y);
		cnv1.setRGB(xx,yy,rgba);
		//console.log(aPnt);

	};///i++


	//cnv1.put();
};
*/





//x0 + (x1-x0)*coef    x1 + (x2-x1)*coef     x2 + (x3-x2)*coef  


//(x0 + (x1-x0)*coef)   +   ((x1 + (x2-x1)*coef)-(x0 + (x1-x0)*coef))*coef
//(x1 + (x2-x1)*coef)   +   ((x2 + (x3-x2)*coef)-(x1 + (x2-x1)*coef))*coef


/*
((x0 + (x1-x0)*coef)   +   ((x1 + (x2-x1)*coef)-(x0 + (x1-x0)*coef))*coef)
+
(
((x1 + (x2-x1)*coef)   +   ((x2 + (x3-x2)*coef)-(x1 + (x2-x1)*coef))*coef)
-
((x0 + (x1-x0)*coef)   +   ((x1 + (x2-x1)*coef)-(x0 + (x1-x0)*coef))*coef)
)
*coef

=

123//x

*/
/*
x0 + x1*coef-x0*coef   +   x1*coef + x2*coef2-x1*coef2-x0*coef - x1*coef2+x0*coef2

+

x1*coef + x2*coef2-x1*coef2   +   x2*coef2 + x3*coef3-x2*coef3-x1*coef2 - x2*coef3+x1*coef3
-
x0*coef - x1*coef2+x0*coef2   -   x1*coef2 - x2*coef3+x1*coef3+x0*coef2 + x1*coef3-x0*coef3

=

123//x
*/

/*
+ x1*coef3-x0*coef3- x2*coef3+x1*coef3+ x3*coef3-x2*coef3- x2*coef3+x1*coef3

- x1*coef2+x0*coef2   -   x1*coef2 +x0*coef2 + x2*coef2-x1*coef2   +   x2*coef2 -x1*coef2 - x1*coef2+x0*coef2+ x2*coef2-x1*coef2

+ x1*coef-x0*coef   +   x1*coef -x0*coef +x1*coef -x0*coef 

+ x0 

= 123//x
*/


/*
//+x1-x0-x2+x1+x3-x2-x2+x1
//-x1+x0-x1+x0+x2-x1+x2-x1-x1+x0+x2-x1   =    +x2+x2+x2   -x1-x1-x1-x1-x1-x1   +x0+x0+x0
//+x1-x0+x1-x0+x1-x0

 (x3 - 3*x2 + 3*x1 - x0)*coef^3
+ (3*x2 - 6*x1 + 3*x0)*coef^2
+(3*x1 - 3*x0)*coef
+x0
-123
=0
*/
/*
//http://www.sopromat.info/cubic-equations-online-048.html
//https://naurok.com.ua/kubichni-rivnyannya-metod-kardano-metod-vieta-89259.html

var iii=0;
function bezier_cubic(aDot){

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
for(let y=0; y<100; y++){

	let dy=aDot[0].y-y;
	let ty = dy/ay;

	let itery = discr(py,qy+ty);	
	console.log('itery='+itery, ty, dy, ay);

	//for(let x=30; x<570; x++){
	for(let x=0; x<100; x++){

		let dx=aDot[0].x-x;
		let tx = dx/ax;
		let iterx = discr(px,qx+tx);


console.log('   iterx='+iterx, x);
		//console.log('iterx='+iterx);
		if(Math.abs(iterx - itery)<31){
			//console.log('iterx='+iterx, x);
			let rgb5=grad(cnv1.getRGB(x,y), [255,200,100,255] , 1/Math.pow(Math.abs(iterx - itery)+1,4)  );
			cnv1.setRGB(x,y,rgb5);
			//cnv1.setRGB(x,y,[255,200,100,255]);
		}


	};//x
};//y




};
*/




document.querySelector('#btn-show').addEventListener('click', show);




