import Tag from './tag-editor.js';
//import PixelColor from './canvas/PixelColor.js';
import RealCanvas from './../canvas/RealCanvas.js';
import JSONLoader from './JSON-Loader.js';


export default class CustomEditor{

	static get mouseMv(){ return 0; }
	static get mouseDn(){ return 1; }
	static get mouseUp(){ return 2; }
//from https://developer.mozilla.org/ru/docs/Web/API/Element/mousedown_event
	static get btnLeft(){ return 0; }
	static get btnRight(){ return 2; }

	constructor(panelSelector, canvasSelector){
		let topPanel = document.querySelector(panelSelector);
		this.root = new Tag(this,topPanel);
		this.initPanel();

		this.canvas = new RealCanvas(canvasSelector);
		this.initCanvas();

		this.mode=0;
		this.oldX=-1;
		this.oldY=-1;
		this.pressed=false;
		this.init();
	}

	init(){

	}

	initCanvas(){
		this.addOnCanvas('mousemove', (event)=>{this.onMouse(event,CustomEditor.mouseMv);});
		this.addOnCanvas('mousedown', (event)=>{this.onMouse(event,CustomEditor.mouseDn);});
		this.addOnCanvas('mouseup'  , (event)=>{this.onMouse(event,CustomEditor.mouseUp);});
	}


	addOnCanvas(eventName,func){
		this.canvas.canvas.addEventListener(eventName, func.bind(this));
	}

	addOnClick(btnName,func){
		this[btnName].currHTMLTag.addEventListener('click', func.bind(this));
	}

	addOnInput(inpName,func){
		this[inpName].currHTMLTag.addEventListener('input', (()=>{func.bind(this)(this[inpName].currHTMLTag.value)}).bind(this));
	}


	onMouse(event, kak){

	}
}
