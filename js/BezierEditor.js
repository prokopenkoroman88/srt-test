import Tag from './common/tag-editor.js';
import { Point, Rotor, BezierSpline, BezierCurve, BezierFigure, BezierLayer, BezierCanvas } from './canvas/BezierFigure.js';
import PixelColor from './canvas/PixelColor.js';
import JSONLoader from './common/JSON-Loader.js';

const mouseMv=0, mouseDn=1, mouseUp=2;
const btnLeft=0, btnRight=2;//from https://developer.mozilla.org/ru/docs/Web/API/Element/mousedown_event
const modeArrow=0, modeAddLayer=1, modeAddFigure=2, modeAddCurve=3, modeAddRotor=4, modeAddPoint=5;

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
		this.currRotor=null;
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
			.button('').inner('AddRotor').assignTo('btnAddRotor')
			.button('').inner('AddPoint').assignTo('btnAddPoint')
			.input('').attr('type','color').assignTo('inpFill')
			.button('').inner('Fill').assignTo('btnFill')
			.button('').inner('SAVE').assignTo('btnSave')
			.button('').inner('LOAD').assignTo('btnLoad')
		  .up()
		.div('bezier-list')
		  .dn()
			.tag('ul').assignTo('ulLayer')
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
			BezierEditor.editor.addLayer();
		});

		this.btnAddFigure.currHTMLTag.addEventListener('click', function(){
			BezierEditor.editor.mode=modeAddFigure;
			BezierEditor.editor.iter=-1;
			console.log('editor.mode ', BezierEditor.editor.mode);
			BezierEditor.editor.addFigure();
		});

		this.btnAddCurve.currHTMLTag.addEventListener('click', function(){
			BezierEditor.editor.mode=modeAddCurve;
			BezierEditor.editor.iter=-1;
			console.log('editor.mode ', BezierEditor.editor.mode);
		});

		this.btnAddRotor.currHTMLTag.addEventListener('click', function(){
			BezierEditor.editor.mode=modeAddRotor;
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

		this.btnLoad.currHTMLTag.addEventListener('click', function(){
			//BezierEditor.editor.canvas.content = new JSONLoader().loadFromFile('data-1647263973432.json').obj;
			let jsonLoader = new JSONLoader().loadFromFile('./../saved/data-net.json');//1647263973432//from pages\pict-editor.html
			let int1=setInterval(function(){
				if(!jsonLoader.loaded)return;
				console.log(JSONLoader.loader.obj);
				//BezierEditor.editor.canvas.content = jsonLoader.obj;
				BezierEditor.editor.loadContent(JSONLoader.loader.obj);
				BezierEditor.editor.refresh();
				clearInterval(int1);
			}, 100);
		});

		this.ulLayer.currHTMLTag.addEventListener('click', function(event){
			console.log(event.target);
		});
	}

	loadContent(obj){//obj = JSON.parse()
		BezierEditor.editor.canvas.content.layers = [];

		let layers1 = BezierEditor.editor.canvas.content.layers;
		let layers = obj.layers;
		for(let iLayer=0; iLayer<layers.length; iLayer++){
			this.addLayer();
			layers1.push(this.currLayer);

			let figures = layers[iLayer].figures;
			let figures1= layers1[iLayer].figures;
			for(let iFigure=0; iFigure<figures.length; iFigure++){
				this.addFigure();
				figures1.push(this.currFigure);

				let points = figures[iFigure].points;
				let points1= figures1[iFigure].points;
				for(let iPoint=0; iPoint<points.length; iPoint++){
					this.currPoint = new Point(points[iPoint].x, points[iPoint].y);
					points1.push(this.currPoint);
				};

				let rotors = figures[iFigure].rotors;
				let rotors1= figures1[iFigure].rotors;
				for(let iRotor=0; iRotor<rotors.length; iRotor++){
					this.currRotor = new Rotor(rotors[iRotor].x, rotors[iRotor].y, rotors[iRotor].angle);
					this.currRotor.pointIds = rotors[iRotor].pointIds;
					rotors1.push(this.currRotor);
				};

				let splines = figures[iFigure].splines;
				let splines1= figures1[iFigure].splines;
				for(let iSpline=0; iSpline<splines.length; iSpline++){
					this.currSpline = new BezierSpline(splines[iSpline].controlPointIds);
					this.currSpline.leverPoint.push(new Point(splines[iSpline].leverPoint[0].x, splines[iSpline].leverPoint[0].y));
					this.currSpline.leverPoint.push(new Point(splines[iSpline].leverPoint[1].x, splines[iSpline].leverPoint[1].y));
					this.currSpline.color = splines[iSpline].color;
					this.currSpline.width = splines[iSpline].width;
					splines1.push(this.currSpline);
				};

				let curves = figures[iFigure].curves;
				let curves1= figures1[iFigure].curves;
				for(let iCurve=0; iCurve<curves.length; iCurve++){
					this.currCurve = new BezierCurve();
					this.currCurve.splineIds = curves[iCurve].splineIds;
					curves1.push(this.currCurve);
				};

			};
		};

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
		//this.currLayer = new BezierLayer();
		//this.canvas.content.layers.push(this.currLayer);
		//
		//this.currFigure = new BezierFigure();
		//this.currLayer.figures.push(this.currFigure);
		this.addLayer();
		this.addFigure();
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
			case modeAddRotor:
				this.btnAddRotor.currHTMLTag.classList.remove('active');
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
			case modeAddRotor:
				this.btnAddRotor.currHTMLTag.classList.add('active');
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

	addRotor(x,y){
		console.log('addRotor',x,y);
		this.currRotor = new Rotor(x,y);
		let cRotor = this.currFigure.rotors.push(this.currRotor);//canvas
		console.log('cRotor=',cRotor);
		console.log(this.currRotor);
		return this.currRotor;
	}

	addSpline(args){
		let oldPoint = this.currPoint;
		let newPoint = this.addPoint(args[2].x, args[2].y);

		this.currSpline = new BezierSpline([this.currFigure.points.indexOf(oldPoint), this.currFigure.points.indexOf(newPoint)]);//newPoint==this.currPoint
		let iSpline = this.currFigure.splines.push(this.currSpline)-1;//canvas
		if(this.currCurve)
			this.currCurve.splineIds.push(iSpline);

		this.currSpline.leverPoint.push( new Point(args[0].x, args[0].y) );//after
		this.currSpline.leverPoint.push( new Point(args[1].x, args[1].y) );//before
		return this.currSpline;
	}

	addCurve(){
		this.currCurve = new BezierCurve();
		if(!this.currFigure){
			if(!this.currLayer)
				this.currLayer = this.canvas.content.layers[0];
			this.currFigure = this.currLayer.figures[0];
		};
		this.currFigure.curves.push(this.currCurve);
		let li = document.createElement('li');
		li.innerHTML = 'Curve №'+this.currFigure.curves.indexOf(this.currCurve);
		let iLayer = this.canvas.content.layers.indexOf(this.currLayer);
		let iFigure = this.currLayer.figures.indexOf(this.currFigure);
		this.ulLayer.currHTMLTag.children[iLayer].children[0].children[iFigure].children[0].lastElementChild.before(li);
		return this.currCurve;
	}

	addFigure(){
		this.currFigure = new BezierFigure();
		if(!this.currLayer)
			this.currLayer = this.canvas.content.layers[0];
		this.currLayer.figures.push(this.currFigure);
		let li = document.createElement('li');
		li.innerHTML = 'Figure №'+this.currLayer.figures.indexOf(this.currFigure);
		let ul = document.createElement('ul');
		let liNew = document.createElement('li');
		liNew.innerHTML='add curve'
		ul.append(liNew);
		li.append(ul);
		let iLayer = this.canvas.content.layers.indexOf(this.currLayer);
		if(iLayer<0)iLayer=0;
		this.ulLayer.currHTMLTag.children[iLayer].children[0].lastElementChild.before(li);
		return this.currFigure;
	}

	addLayer(){
		this.currLayer = new BezierLayer();
		this.canvas.content.layers.push(this.currLayer);
		let li = document.createElement('li');
		li.innerHTML = 'Layer №'+this.canvas.content.layers.indexOf(this.currLayer);
		let ul = document.createElement('ul');
		let liNew = document.createElement('li');
		liNew.innerHTML='add figure'
		ul.append(liNew);
		li.append(ul);
		this.ulLayer.currHTMLTag.lastElementChild.before(li);
		return this.currLayer;
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



				}; break;
				case mouseUp:{

					if(this.currPoint){
						let bNeedShift=true;
						let pathIds = this.canvas.findByCoords('rotor',x,y);
						if(pathIds.rotor>=0){
							let rotorFigure = this.canvas.content.layers[pathIds.layer].figures[pathIds.figure];
							let iPoint = this.currFigure.points.indexOf(this.currPoint);
							bNeedShift=(this.currFigure!=rotorFigure || iPoint<0);//точку нужно переместить или подчинить ротору
							if(!bNeedShift){
								this.currRotor = rotorFigure.rotors[pathIds.rotor];
								this.currRotor.pointIds.push(iPoint);
							};
						};
						if(bNeedShift){

							this.currPoint.x=x;
							this.currPoint.y=y;
						};

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
					this.addCurve();
					this.addPoint(x,y);
					//this.startStandardCurve({x:x,y:y});

					this.iter = 0;
					this.mode = modeAddPoint;
				};
			}; break;
			case modeAddRotor:
			{
				if(kak==mouseDn){
					this.addRotor(x,y);
					this.refresh();
				};
			}; break;
			case modeAddPoint:
			{

				if(kak==mouseDn){

				this.args[this.iter]={x:x,y:y};
				this.iter = (this.iter+1)%3;

				if(this.iter==0){
					this.addSpline(this.args);
					//this.paintStandardCurve(this.args, 'red');


					this.refresh();
					//this.paintSpline(this.currSpline, this.currFigure);

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

			if(this.currRotor)
				this.currRotor.rotate(0.2,this.currFigure);//udali
			this.ulLayer.currHTMLTag.children[iLayer].classList.toggle('active');
			this.ulLayer.currHTMLTag.children[iLayer].children[0].children[iFigure].classList.toggle('active');
		};
		this.refresh();
	}

	paintSpline(spline, figure){
		//
		//console.log('spline=');
		//console.log(spline);
		spline.ownFigure = figure;
		let aDot=spline.toArray();
		delete spline.ownFigure;
		let clr =  new PixelColor('#22ffee');
		//?//this.canvas.paintBezier3(aDot,clr);
		this.canvas.paintBezier(aDot,clr);
		this.canvas.put();
	}

	paintStandardLine(p0, p1, lineColor='black'){
		this.canvas.ctx.beginPath();
		this.canvas.ctx.moveTo(p0.x, p0.y);
		this.canvas.ctx.lineTo(p1.x, p1.y);
		let _strokeStyle=this.canvas.ctx.strokeStyle;
		this.canvas.ctx.strokeStyle = lineColor;
		this.canvas.ctx.stroke();
		this.canvas.ctx.strokeStyle=_strokeStyle;
	}

	startStandardCurve(p){
		this.canvas.ctx.beginPath();
		this.canvas.ctx.moveTo(p.x, p.y);		
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

	paintStandardCircle(p,radius){
		this.canvas.ctx.beginPath();
		this.canvas.ctx.arc(p.x,p.y, radius, 0, Math.PI*2, true);
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
				let rotors = figures[iFigure].rotors;
				for(let iRotor=0; iRotor<rotors.length; iRotor++){
					this.paintStandardCircle(rotors[iRotor], 3);
				};
			};
		};
		this.canvas.paintGrid(this.currFigure,30,30);//udali ot suda

					if(this.currPoint){
						this.paintStandardCircle(this.currPoint, 5);
					};
		if(this.currRotor){
			let rotorLever = {};
			rotorLever.x = this.currRotor.x + Math.sin(this.currRotor.angle)*50;
			rotorLever.y = this.currRotor.y - Math.cos(this.currRotor.angle)*50;
			this.paintStandardCircle(this.currRotor, 5);
			this.paintStandardCircle(rotorLever, 5);
			this.paintStandardLine(this.currRotor, rotorLever, 'red');
		};
		if(this.currSpline){

//					console.log('Point[].x,y=',this.currPoint.x, this.currPoint.y);
			if(this.currFigure){
				let controlPoint = new Array(2);
				controlPoint[0] = this.currFigure.points[ this.currSpline.controlPointIds[0] ];
				controlPoint[1] = this.currFigure.points[ this.currSpline.controlPointIds[1] ];
				this.paintStandardCircle(controlPoint[0], 5);
				this.paintStandardCircle(controlPoint[1], 5);
				this.paintStandardLine(controlPoint[0], this.currSpline.leverPoint[0], 'blue');
				this.paintStandardLine(controlPoint[1], this.currSpline.leverPoint[1], 'blue');
			};

						this.paintStandardCircle(this.currSpline.leverPoint[0], 5);
						this.paintStandardCircle(this.currSpline.leverPoint[1], 5);
						//this.refresh();

		};


		//this.canvas.put();
		this.canvas.refreshImageData();
	}

}
