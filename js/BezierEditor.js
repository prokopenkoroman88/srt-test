import Tag from './common/tag-editor.js';
import { BezierPoint, BezierCurve, BezierFigure, BezierCanvas } from './canvas/BezierFigure.js';

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
			BezierEditor.editor.mode=modeArrow;
		});

		this.btnAddLayer.currHTMLTag.addEventListener('click', function(){
			BezierEditor.editor.mode=modeAddLayer;
		});

		this.btnAddPoint.currHTMLTag.addEventListener('click', function(){
			BezierEditor.editor.mode=modeAddPoint;
			BezierEditor.editor.iter=-1;
		});

		this.btnFill.currHTMLTag.addEventListener('click', function(){
			BezierEditor.editor.canvas.ctx.fillStyle=BezierEditor.editor.inpFill.currHTMLTag.value;
			BezierEditor.editor.canvas.ctx.fill();
			BezierEditor.editor.mode=modeArrow;//?
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

	onMouse(event,kak){
		console.log('kak'+kak);
		console.log(event);

		let x=event.offsetX;
		let y=event.offsetY;
		this.button = event.button;
		console.log(x,y);

		if(kak==mouseDn){

			if(this.iter==-1){
				this.canvas.ctx.beginPath();
				this.canvas.ctx.moveTo(x, y);

				this.iter = 0;
			}
			else
			{
				this.args[this.iter]={x:x,y:y};
				this.iter = (this.iter+1)%3;

				if(this.iter==0){
					this.canvas.ctx.bezierCurveTo(this.args[0].x, this.args[0].y,  this.args[1].x, this.args[1].y,   this.args[2].x, this.args[2].y  );

					//закрашивать надо в конце
					//this.canvas.ctx.fillStyle='rgb(255,255,0)';
					//this.canvas.ctx.fill();

					// line color
					this.canvas.ctx.strokeStyle = 'red';
					this.canvas.ctx.stroke();


					this.canvas.refreshImageData();

				};
			};
		};

	}

}
