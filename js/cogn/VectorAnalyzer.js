import Arrow from './../common/Arrow.js';
import PixelColor from './../canvas/PixelColor.js';
import RealCanvas from './../canvas/RealCanvas.js';
import CustomEditor from './../common/CustomEditor.js';
import Vectorizer from './analyzers/Vectorizer.js';

import FewLupa from './view/FewLupa.js';
import WideLupa from './view/WideLupa.js';


//const mouseMv=0, mouseDn=1, mouseUp=2;
//const btnLeft=0, btnRight=2;//from https://developer.mozilla.org/ru/docs/Web/API/Element/mousedown_event
const modeArrow=0;


export default class VectorAnalyzer extends CustomEditor{

	static get modeArrow(){ return 0; }
	static get modeRectSend(){ return 1; }

	static get modeLupaNone(){ return 0; }
	static get modeLupaFew(){ return 1; }
	static get modeLupaWide(){ return 2; }

	set mode(value){
		this.control.mode.btns[this._mode || 0].classList.remove('active');
		this.control.mode.btns[value].classList.add('active');
		this._mode = value;
	}
	get mode(){
		return this._mode;
	}

	set lupa(value){
		this.control.lupa.btns[this._lupa || 0].classList.remove('active');
		this.control.lupa.btns[value].classList.add('active');
		this.view.frmFewLupa.style.display = value==VectorAnalyzer.modeLupaFew?'block':'none';
		this.view.frmWideLupa.style.display = value==VectorAnalyzer.modeLupaWide?'block':'none';
		this._lupa = value;
	}
	get lupa(){
		return this._lupa;
	}

		_mode=0;
		_lupa=0;
		x0=8*105;
		y0=8*287;
		x1=0;
		y1=0;
		//w=8*20;//80;//0;
		//h=8*2;//100;//00;
		w=8*80;//0;
		h=8*50;//00;

	init(){
		super.init();

		const w=8*80, h=8*50;
		this.rectSend={left:8*105, top:8*287, right:8*105+w, bottom:8*287+h,  };
		this.rectDest={left:8*0, top:8*0, right:w, bottom:h};

		this.vectorizer = new Vectorizer(this.canvas);

		this.mode=VectorAnalyzer.modeArrow;
		this.lupa=VectorAnalyzer.modeLupaNone;
	}

	initPanel(){

		this.panel={
			top: document.querySelector('#top-panel'),//==this.root
			left: document.querySelector('#left-panel'),
			content: document.querySelector('#content-panel'),
			right: document.querySelector('#right-panel'),
			bottom: document.querySelector('#bottom-panel'),
		};

		this.control={
			lupa:{},
			mode:{},
			cell:{},
			area:{},
		};


		let scheme_control = this.assembleControl();
		let control = this.branchByScheme(scheme_control, this.panel.top);//this.root.currHTMLTag

		this.control.mode.btns = control.byName('mode_btns').children.map((child)=>{return child.tag; });
		this.control.lupa.btns = control.byName('lupa_btns').children.map((child)=>{return child.tag; });
//		this.control.cell.btns = control.byName('cell_btns').children.map((child)=>{return child.tag; });

		this.fewLupa = new FewLupa(this);
		this.wideLupa = new WideLupa(this);

		let scheme_view = this.assembleView();
		let views = this.branchByScheme(scheme_view, this.panel.top);

		this.view = {
			coords : views.byName('coords').currHTMLTag,
			tblLupa : views.byName('lupaFew').currHTMLTag,//children[0];
			cnvLupa : new RealCanvas('#top-panel .view canvas'),

			frmFewLupa : views.byName('few lupa frame').currHTMLTag,
			frmWideLupa : views.byName('wide lupa frame').currHTMLTag,
		};

		//html tags:
		this.fewLupa.table = this.view.tblLupa;
		this.wideLupa.canvas = this.view.cnvLupa;

		document.body.addEventListener('mousemove', (event)=>{this.doDrag(event); });
		document.body.addEventListener('mouseup', (event)=>{this.endDrag(); });

	}

	assembleControl(){
		let mode_btns=[
			this.sch_btn('Arrow',()=>{this.mode=VectorAnalyzer.modeArrow}),
			this.sch_btn('RectSend',()=>{this.mode=VectorAnalyzer.modeRectSend}),
		];

		let lupa_btns=[
			this.sch_btn('none',()=>{this.lupa=VectorAnalyzer.modeLupaNone}),
			this.sch_btn('Few',()=>{this.lupa=VectorAnalyzer.modeLupaFew}),
			this.sch_btn('Wide',()=>{this.lupa=VectorAnalyzer.modeLupaWide}),
		];


		let scheme_mode = {
			css:'btns',
			name:'mode_btns',
			children:mode_btns,
		};

		let scheme_cell = {
			css:'btns',
			children:[
				//sch_btn('mu',()=>this.calcMu()),
				this.sch_btn('mu',()=>{this.vectorizer.calcMu(this.rectSend)}),
				this.sch_btn('show mu',()=>{
					this.prepareRectDest('right');
					this.vectorizer.showMu(this.rectSend, this.rectDest);
				}),
			]
		};

		let scheme_area = {
			css:'btns',
			children:[
				this.sch_btn('gather mu',()=>{this.vectorizer.gatherMu(this.rectSend)}),
			]
		};

		let scheme_lupa = {
			css:'btns',
			name:'lupa_btns',
			children:lupa_btns,
		};

		let scheme_control = this.sch_movable('CONTROL', [
				scheme_mode,
				scheme_cell,
				scheme_area,
				scheme_lupa,
			]);
		scheme_control.css+=' control';


		return scheme_control;
	}

	assembleView(){
		let scheme_vector_table = this.fewLupa.assembleScheme();
		let scheme_vector_canvas = this.wideLupa.assembleScheme();

		let scheme_view = {
				css:'view',
				children:[
					{
						css:'coords',
						name:'coords'
					},
					this.sch_movable('Few Lupa', scheme_vector_table, 'few lupa frame'),
					this.sch_movable('Wide lupa, CANVAS', scheme_vector_canvas, 'wide lupa frame'),
				]
		};

		return scheme_view;
	}

	onMouse(event,kak){
		this.view.coords.innerHTML = 'x:'+event.offsetX+', y:'+event.offsetY;
		switch (kak) {
			case CustomEditor.mouseDn:{
				this.pressed=true;
				this.oldX=event.clientX;
				this.oldY=event.clientY;
				if(this.mode==VectorAnalyzer.modeRectSend){
					console.log(event);
					this.rectSend.left = event.offsetX;
					this.rectSend.top = event.offsetY;
				}
			}; break;
			case CustomEditor.mouseUp:{
				if(this.mode==VectorAnalyzer.modeRectSend){
					this.setRect(this.rectSend, this.rectSend.left,this.rectSend.top,event.offsetX,event.offsetY);
					console.log('this.rectSend',this.rectSend);
					this.mode = VectorAnalyzer.modeArrow;
				};
				this.oldX=-1;
				this.oldY=-1;
				this.pressed=false;
			}; break;
			case CustomEditor.mouseMv:{
				console.log(event);
				console.log(event.target);
				//console.log(event.target.clientX,event.target.clientY);
				console.log(event.offsetX,event.offsetY);
				//this.showFewLupa(event.offsetX+this.rectSend.left-1,event.offsetY);
				if(this.pressed){
					console.log('onMouse',kak);
					this.oldX=event.clientX;
					this.oldY=event.clientY;
				};
			}; break;
			default:break;
		};
		if(this.pressed){//mouse event don't matter
			if(this.lupa==VectorAnalyzer.modeLupaWide)
				this.showWideLupa(event.offsetX,event.offsetY);
			if(this.lupa==VectorAnalyzer.modeLupaFew)
				this.showFewLupa(event.offsetX,event.offsetY);
		};
	}

	showFewLupa(x,y){
		this.fewLupa.analyzer=this.vectorizer;
		this.fewLupa.refresh(x,y);
	}

	showWideLupa(x,y){
		this.wideLupa.analyzer=this.vectorizer;
		this.wideLupa.refresh(x,y);
	}

}
