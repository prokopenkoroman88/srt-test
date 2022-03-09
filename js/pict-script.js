import ColorMap from './canvas/VirtualCanvas.js';
import Canvas from './canvas/RealCanvas.js';
import PixelColor from './canvas/PixelColor.js';
import { Point, Spline, BezierPoint, BezierCurve, BezierFigure, BezierCanvas } from './canvas/BezierFigure.js';
import BezierEditor from './BezierEditor.js';
import { JPGAnalyzer } from './cogn/JPG-Analyzer.js';


let editor = new BezierEditor('#top-panel','#cnv1');
let jpgAnalyzer;

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

//
jpgAnalyzer = new JPGAnalyzer('#cnv1');//cnv1 д.б. уже готов
jpgAnalyzer.buildControlPanel('#top-panel');


	cnv1.canvas.addEventListener('click', function(event){
		console.log(event);
		let x=event.offsetX;
		let y=event.offsetY;
		console.log(x,y);


	});

	cnv1.canvas.addEventListener('mousemove', function(event){
		//console.log(event);
		let x=event.offsetX;
		let y=event.offsetY;
		console.log(x,y);

		jpgAnalyzer.showLupa(x,y);

	});


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

jpgAnalyzer.initRect();
//jpgAnalyzer.plavno();
//jpgAnalyzer.vawes();
//jpgAnalyzer.byEpicenters();
//jpgAnalyzer.by3Colors();
jpgAnalyzer.byClasters();
jpgAnalyzer.put();

/*
*/





};



/*
*/




document.querySelector('#btn-show').addEventListener('click', show);




