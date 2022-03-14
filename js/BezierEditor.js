import Tag from './common/tag-editor.js';
import { Point, Spline, BezierPoint, BezierCurve, BezierFigure, BezierLayer, BezierCanvas } from './canvas/BezierFigure.js';
import PixelColor from './canvas/PixelColor.js';
import JSONLoader from './common/JSON-Loader.js';

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
		this.currCurve=null;
		this.currFigure=null;
		this.currLayer=null;
		this.createNew();
	}

	initPanel(){
		this.root
		.div('btns')
		  .dn()
			.button('active').inner('Arrow').assignTo('btnArrow')
			.button('').inner('AddLayer').assignTo('btnAddLayer')
			.button('').inner('AddFigure').assignTo('btnAddFigure')
			.button('').inner('AddCurve').assignTo('btnAddCurve')
			.button('').inner('AddPoint').assignTo('btnAddPoint')
			.input('').attr('type','color').assignTo('inpFill')
			.button('').inner('Fill').assignTo('btnFill')
			.button('').inner('SAVE').assignTo('btnSave')
		  .up()
		.div('bezier-list')
		  .dn()
			.tag('ul')
			  .dn()
				.tag('li').inner('add layer').assignTo('btnAddLayer2')
			  .up()
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

		this.btnSave.currHTMLTag.addEventListener('click', function(){
			new JSONLoader(BezierEditor.editor.canvas.content).saveToFile('data-'+(Date.now())+'.json');
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

	createNew(){
		this.canvas.layers=[];
		this.currLayer = new BezierLayer();
		this.canvas.content.layers.push(this.currLayer);
		//
		this.currFigure = new BezierFigure();
		this.currLayer.figures.push(this.currFigure);
	}

	set mode(value){


		switch (this._mode) {
			case modeArrow:
				this.btnArrow.currHTMLTag.classList.remove('active');
				break;
			case modeAddLayer:
				this.btnAddLayer.currHTMLTag.classList.remove('active');
				break;
			case modeAddFigure:
				this.btnAddFigure.currHTMLTag.classList.remove('active');
				break;
			case modeAddCurve:
				this.btnAddCurve.currHTMLTag.classList.remove('active');
				break;
			case modeAddPoint:
				this.btnAddPoint.currHTMLTag.classList.remove('active');
				break;
			default:
				break;
		};



		switch (value) {
			case modeArrow:
				this.btnArrow.currHTMLTag.classList.add('active');
				break;
			case modeAddLayer:
				this.btnAddLayer.currHTMLTag.classList.add('active');
				break;
			case modeAddFigure:
				this.btnAddFigure.currHTMLTag.classList.add('active');
				break;
			case modeAddCurve:
				this.btnAddCurve.currHTMLTag.classList.add('active');
				break;
			case modeAddPoint:
				this.btnAddPoint.currHTMLTag.classList.add('active');
				break;
			default:
				break;
		};

		this._mode = value;
	}

	get mode(){
		return this._mode;
	}

	addPoint(x,y){
		this.currPoint = new Point(x,y);
		this.currFigure.points.push(this.currPoint);//canvas
		return this.currPoint;
	}

	addSpline(args){
		let oldPoint = this.currPoint;
		let newPoint = this.addPoint(args[2].x, args[2].y);

		this.currSpline = new Spline([this.currFigure.points.indexOf(oldPoint), this.currFigure.points.indexOf(newPoint)]);//newPoint==this.currPoint
		this.currFigure.splines.push(this.currSpline);//canvas

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
					this.selectElement(x,y);
/*
					//
					let iPoint, iSpline;
					if(this.currSpline){
						if(this.currSpline.leverPoint[0].isNear(x,y))
							this.currPoint = this.currSpline.leverPoint[0];
						else
						if(this.currSpline.leverPoint[1].isNear(x,y))
							this.currPoint = this.currSpline.leverPoint[1];
					};

					if( !this.currPoint){
						iPoint = this.canvas.findPointByCoords(x,y);
						if(iPoint<0)
							iSpline = this.canvas.findSplineByCoords(x,y);
*/

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
/*
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
*/



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
					this.paintSpline(this.currSpline, this.currFigure);

				};

				};

			}; break;
			default:
			{
			}; break;
		};//switch mode

	}

	selectElement(x,y){
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

		let pathIds, iLayer=-1, iFigure=-1, iSpline=-1, iRotor=-1, iPoint=-1;

		if(this.currSpline){
			let leverPoint = this.currSpline.leverPoint;
			for(let i=0; i<leverPoint.length; i++)
				if(leverPoint[i].isNear(x,y)){
					this.currPoint = leverPoint[i];
					break;
				};
		};

		if(!this.currPoint){
			//iPoint = this.canvas.findPointByCoords(x,y);
			pathIds = this.canvas.findByCoords('point',x,y);

			if(pathIds.point>=0)
				iPoint = pathIds.point;
			else{
				pathIds = this.canvas.findByCoords('rotor',x,y);

				if(pathIds.rotor>=0)
					iRotor = pathIds.rotor;
				else{
					pathIds = this.canvas.findByCoords('spline',x,y);

					if(pathIds.spline>=0)
						iSpline = pathIds.spline;
				};
			};
			console.log(pathIds);

			iLayer = pathIds.layer;
			iFigure = pathIds.figure;

			this.currLayer = (iLayer<0)?null:this.canvas.content.layers[iLayer];
			this.currFigure = (iFigure<0)?null:this.currLayer.figures[iFigure];

			this.currPoint = (iPoint<0)?null:this.currFigure.points[iPoint];
			this.currRotor = (iRotor<0)?null:this.currFigure.rotors[iRotor];
			this.currSpline = (iSpline<0)?null:this.currFigure.splines[iSpline];

		};
		this.refresh();
	}

	paintSpline(spline, figure){
		//
		console.log('spline=');
		console.log(spline);
		spline.ownFigure = figure;
		let aDot=spline.toArray();
		delete spline.ownFigure;
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
		let layers = this.canvas.content.layers;
		for(let iLayer=0; iLayer<layers.length; iLayer++){
			let figures = layers[iLayer].figures;
			for(let iFigure=0; iFigure<figures.length; iFigure++){
				let splines = figures[iFigure].splines;
				for(let iSpline=0; iSpline<splines.length; iSpline++){
					this.paintSpline(splines[iSpline], figures[iFigure]);
				};
			};
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
