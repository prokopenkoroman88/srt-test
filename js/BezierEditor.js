import Tag from './common/tag-editor.js';
import { Point, Spline, BezierPoint, BezierCurve, BezierFigure, BezierCanvas } from './canvas/BezierFigure.js';
import PixelColor from './canvas/PixelColor.js';

const mouseMv=0, mouseDn=1, mouseUp=2;
const btnLeft=0, btnRight=2;//from https://developer.mozilla.org/ru/docs/Web/API/Element/mousedown_event
const modeArrow=0, modeAddLayer=1, modeAddPoint=2;

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

		this.btnAddPoint.currHTMLTag.addEventListener('click', function(){
			BezierEditor.editor.mode=modeAddPoint;
			BezierEditor.editor.iter=-1;
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
					let iPoint;
					iPoint = this.canvas.findPointByCoords(x,y);

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
					console.log('iPoint=',iPoint);

					if(iPoint>=0)
						this.currPoint = this.canvas.points[iPoint]
					else
						this.currPoint = null;

					if(this.currPoint){
					console.log('Point[].x,y=',this.currPoint.x, this.currPoint.y);
						this.canvas.ctx.beginPath();
						this.canvas.ctx.arc(this.currPoint.x,this.currPoint.y, 5, 0, Math.PI*2, true);
						this.canvas.ctx.stroke();
						this.refresh();
					};




				}; break;
				case mouseUp:{

					if(this.currPoint){

						this.currPoint.x=x;
						this.currPoint.y=y;

						//fill by white?
						this.refresh();

						//this.currPoint=null;
					};


				}; break;
				};//switch



			}; break;
			case modeAddLayer:
			{

			}; break;
			case modeAddPoint:
			{

		if(kak==mouseDn){

			if(this.iter==-1){
				this.addPoint(x,y);
				this.canvas.ctx.beginPath();
				this.canvas.ctx.moveTo(x, y);

				this.iter = 0;
			}
			else
			{
				this.args[this.iter]={x:x,y:y};
				this.iter = (this.iter+1)%3;

				if(this.iter==0){
					this.addSpline(this.args);
					this.canvas.ctx.bezierCurveTo(this.args[0].x, this.args[0].y,  this.args[1].x, this.args[1].y,   this.args[2].x, this.args[2].y  );

					//закрашивать надо в конце
					//this.canvas.ctx.fillStyle='rgb(255,255,0)';
					//this.canvas.ctx.fill();

					// line color
					this.canvas.ctx.strokeStyle = 'red';
					this.canvas.ctx.stroke();


					this.refresh();
					this.paintSpline(this.currSpline);

				};
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
		this.canvas.paintBezier3(aDot,clr);
		this.canvas.paintBezier(aDot,clr);
		this.canvas.put();
	}

	refresh(){
		//this.canvas.put();
		this.canvas.refreshImageData();
	}

}
