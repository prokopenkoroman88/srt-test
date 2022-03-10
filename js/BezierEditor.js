import Tag from './common/tag-editor.js';
import { Point, Spline, BezierPoint, BezierCurve, BezierFigure, BezierCanvas } from './canvas/BezierFigure.js';
import PixelColor from './canvas/PixelColor.js';

const mouseMv=0, mouseDn=1, mouseUp=2;
const btnLeft=0, btnRight=2;//from https://developer.mozilla.org/ru/docs/Web/API/Element/mousedown_event
const modeArrow=0, modeAddLayer=1, modeAddFigure=2, modeAddCurve=3, modeAddPoint=4;

export default class BezierEditor{

	static editor=null;
	constructor(selector, canvasSelector){
		if(BezierEditor.editor){
			//class??//Error '';
			return BezierEditor.editor;
		};
		BezierEditor.editor = this;
		//BezierCanvas.cnv = this.canvas;
		
		//super();
		let topPanel = document.querySelector(selector);
		this.root = new Tag(this,topPanel);
		this.initPanel();

		this.canvas = new BezierCanvas(canvasSelector);
		this.initCanvas();

		this.mode=modeArrow;
		this.iter=0;
		this.args=[{},{},{}];
		this.currPoint=null;
		this.currSpline=null;
	}

	initPanel(){
		this.root
		.div('btns')
		  .dn()
			.button('').inner('Arrow').assignTo('btnArrow')
			.button('').inner('AddLayer').assignTo('btnAddLayer')
			.button('').inner('AddFigure').assignTo('btnAddFigure')
			.button('').inner('AddCurve').assignTo('btnAddCurve')
			.button('').inner('AddPoint').assignTo('btnAddPoint')
			.input('').attr('type','color').assignTo('inpFill')
			.button('').inner('Fill').assignTo('btnFill')
		  .up();

		this.btnArrow.currHTMLTag.addEventListener('click', function(){
			console.log('editor.mode ?');
			console.log('editor.mode ', BezierEditor.editor.mode);
			BezierEditor.editor.mode=modeArrow;
			console.log('editor.mode ', BezierEditor.editor.mode);
		});

		this.btnAddLayer.currHTMLTag.addEventListener('click', function(){
			BezierEditor.editor.mode=modeAddLayer;
			console.log('editor.mode ', BezierEditor.editor.mode);
		});

		this.btnAddFigure.currHTMLTag.addEventListener('click', function(){
			BezierEditor.editor.mode=modeAddFigure;
			BezierEditor.editor.iter=-1;
			console.log('editor.mode ', BezierEditor.editor.mode);
		});

		this.btnAddCurve.currHTMLTag.addEventListener('click', function(){
			BezierEditor.editor.mode=modeAddCurve;
			BezierEditor.editor.iter=-1;
			console.log('editor.mode ', BezierEditor.editor.mode);
		});

		this.btnAddPoint.currHTMLTag.addEventListener('click', function(){
			BezierEditor.editor.mode=modeAddPoint;
			BezierEditor.editor.iter=0;//-1;
			console.log('editor.mode ', BezierEditor.editor.mode);
		});

		this.btnFill.currHTMLTag.addEventListener('click', function(){
			BezierEditor.editor.canvas.ctx.fillStyle=BezierEditor.editor.inpFill.currHTMLTag.value;
			BezierEditor.editor.canvas.ctx.fill();
			BezierEditor.editor.mode=modeArrow;//?
			console.log('editor.mode ', BezierEditor.editor.mode);
		});
	}

	initCanvas(){
		this.canvas.canvas.addEventListener('mousemove', function(event){
			BezierEditor.editor.onMouse(event,mouseMv);
		});
		this.canvas.canvas.addEventListener('mousedown', function(event){
			BezierEditor.editor.onMouse(event,mouseDn);
		});
		this.canvas.canvas.addEventListener('mouseup', function(event){
			BezierEditor.editor.onMouse(event,mouseUp);
		});
	}

	setMode(value){



		this.mode = value;
	}

	addPoint(x,y){
		this.currPoint = new Point(x,y);
		this.canvas.points.push(this.currPoint);
		return this.currPoint;
	}

	addSpline(args){
		let oldPoint = this.currPoint;
		let newPoint = this.addPoint(args[2].x, args[2].y);

		this.currSpline = new Spline([oldPoint, newPoint]);//newPoint==this.currPoint
		this.canvas.splines.push(this.currSpline);

		this.currSpline.leverPoint.push( new Point(args[0].x, args[0].y) );//after
		this.currSpline.leverPoint.push( new Point(args[1].x, args[1].y) );//before
		return this.currSpline;
	}

	onMouse(event,kak){
		//console.log('kak'+kak);
		//console.log(event);

		let x=event.offsetX;
		let y=event.offsetY;
		this.button = event.button;
		//console.log(x,y);

		switch (this.mode) {
			case modeArrow:
			{


				switch(kak){
				case mouseDn:{
					//
					let iPoint, iSpline;
					if(this.currSpline){
						if(this.currSpline.leverPoint[0].isNear(x,y))
							this.currPoint = this.currSpline.leverPoint[0];
						else
						if(this.currSpline.leverPoint[1].isNear(x,y))
							this.currPoint = this.currSpline.leverPoint[1];
					};

					if(/*!this.currSpline &&*/ !this.currPoint){
						iPoint = this.canvas.findPointByCoords(x,y);
						if(iPoint<0)
							iSpline = this.canvas.findSplineByCoords(x,y);

/*
что мы находим?

controlPoint        repaint 1,2 Spline by controlPoint
leverPoint          repaint 1 Spline by leverPoint



points

splines

curves/figures




figure splines:[]  points:[]
object figures:[] objects?:[]
layer objects:[]




*/
					console.log('iPoint='+iPoint+', iSpline='+iSpline);

					if(iPoint>=0)
						this.currPoint = this.canvas.points[iPoint]
					else
						this.currPoint = null;
					if(iSpline>=0)
						this.currSpline = this.canvas.splines[iSpline]
					else
						this.currSpline = null;

					};


					if(this.currPoint){
					console.log('Point[].x,y=',this.currPoint.x, this.currPoint.y);
						this.paintStandardCircle(this.currPoint.x, this.currPoint.y, 5);
						this.refresh();
					};
					if(this.currSpline){

//					console.log('Point[].x,y=',this.currPoint.x, this.currPoint.y);

						this.paintStandardCircle(this.currSpline.leverPoint[0].x, this.currSpline.leverPoint[0].y, 5);
						this.paintStandardCircle(this.currSpline.leverPoint[1].x, this.currSpline.leverPoint[1].y, 5);
						this.refresh();

					};



				}; break;
				case mouseUp:{

					if(this.currPoint){

						this.currPoint.x=x;
						this.currPoint.y=y;

						//fill by white?
						this.refresh();

						this.currPoint=null;//?
					};


				}; break;
				};//switch



			}; break;
			case modeAddLayer:
			{

			}; break;
			case modeAddFigure:
			{
				if(kak==mouseDn){
					//????????????
				};
			}; break;
			case modeAddCurve:
			{
				if(kak==mouseDn){
					this.addPoint(x,y);
					this.startStandardCurve(x,y);

					this.iter = 0;
					this.mode = modeAddPoint;
				};
			}; break;
			case modeAddPoint:
			{

				if(kak==mouseDn){

				this.args[this.iter]={x:x,y:y};
				this.iter = (this.iter+1)%3;

				if(this.iter==0){
					this.addSpline(this.args);
					this.paintStandardCurve(this.args, 'red');


					this.refresh();
					this.paintSpline(this.currSpline);

				};

				};

			}; break;
			default:
			{
			}; break;
		};//switch mode

	}

	paintSpline(spline){
		//
		console.log('spline=');
		console.log(spline);
		let aDot=spline.toArray();
		let clr =  new PixelColor('#22ffee');
		//?//this.canvas.paintBezier3(aDot,clr);
		this.canvas.paintBezier(aDot,clr);
		this.canvas.put();
	}

	startStandardCurve(x,y){
		this.canvas.ctx.beginPath();
		this.canvas.ctx.moveTo(x, y);		
	}

	paintStandardCurve(args, lineColor='black'){
		this.canvas.ctx.bezierCurveTo(args[0].x, args[0].y,  args[1].x, args[1].y,   args[2].x, args[2].y  );

		//закрашивать надо в конце
		//this.canvas.ctx.fillStyle='rgb(255,255,0)';
		//this.canvas.ctx.fill();

		// line color
		this.canvas.ctx.strokeStyle = lineColor;//'red'
		this.canvas.ctx.stroke();
	}

	paintStandardCircle(x,y,radius){
		this.canvas.ctx.beginPath();
		this.canvas.ctx.arc(x,y, radius, 0, Math.PI*2, true);
		this.canvas.ctx.stroke();
	}

	refresh(){
		this.canvas.paintRect(0,0,this.canvas.width,this.canvas.height,[255,255,255,255]);
		for(let i=0; i<this.canvas.splines.length; i++){
			//
			this.paintSpline(this.canvas.splines[i]);
		};

					if(this.currPoint){
					console.log('Point[].x,y=',this.currPoint.x, this.currPoint.y);
						this.paintStandardCircle(this.currPoint.x, this.currPoint.y, 5);
						//this.refresh();
					};
					if(this.currSpline){

//					console.log('Point[].x,y=',this.currPoint.x, this.currPoint.y);

						this.paintStandardCircle(this.currSpline.leverPoint[0].x, this.currSpline.leverPoint[0].y, 5);
						this.paintStandardCircle(this.currSpline.leverPoint[1].x, this.currSpline.leverPoint[1].y, 5);
						//this.refresh();

					};


		//this.canvas.put();
		this.canvas.refreshImageData();
	}

}
