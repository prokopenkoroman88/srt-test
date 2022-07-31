import PixelColor from './canvas/PixelColor.js';
import CustomEditor from './common/CustomEditor.js';
import TriangleFiller from './canvas/TriangleFiller.js';
//import { SpatialScreen } from './3d/figures.js';
import { TestScreen } from './3d/samples.js';
import { SpatialRender } from './3d/rendering.js';


//const mouseMv=0, mouseDn=1, mouseUp=2;
//const btnLeft=0, btnRight=2;//from https://developer.mozilla.org/ru/docs/Web/API/Element/mousedown_event
const modeArrow=0, modeAddLayer=1, modeAddFigure=2, modeAddCurve=3, modeAddRotor=4, modeAddPoint=5;


export default class SpatialEditor extends CustomEditor{

	static get modeArrow(){ return 0; }



	init(){
		super.init();

		this.screen = new TestScreen(32*10,32*10);//h,w SpatialScreen
		this.render = new SpatialRender(this.screen,this.canvas);
		this.screen.init();

		this.mode=SpatialEditor.modeArrow;
	}

	initPanel(){
		this.root
		.div('btns')
		  .dn()
			.button('').inner('Refresh').assignTo('btnRefresh')
			.button('active').inner('Arrow').assignTo('btnArrow')
			.input('').attr('type','number').assignTo('inpA')
			.input('').attr('type','number').assignTo('inpB')
			.input('').attr('type','number').assignTo('inpC')
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



		this.addOnClick('btnRefresh', function(){
			this.refresh();
		});

		this.addOnClick('btnArrow', function(){
			this.mode=SpatialEditor.modeArrow;
		});

		this.addOnInput('inpA', (value)=>{
			console.log(value);
			this.screen.eye.angles.a=value;
		});
		this.addOnInput('inpB', (value)=>{
			console.log(value);
			this.screen.eye.angles.b=value;
		});
		this.addOnInput('inpC', (value)=>{
			console.log(value);
			this.screen.eye.angles.c=value;
		});

	}

	onMouse(event,kak){


		switch (kak) {
			case CustomEditor.mouseDn:{
				this.pressed=true;
				this.oldX=event.clientX;
				this.oldY=event.clientY;
			}; break;
			case CustomEditor.mouseUp:{
				this.oldX=-1;
				this.oldY=-1;
				this.pressed=false;
			}; break;
			case CustomEditor.mouseMv:{
				if(this.pressed){
					console.log('onMouse',kak);
					console.log(event);

					console.log(this.screen.eye.space);
					console.log('eye.angles:',this.screen.eye.angles.a, this.screen.eye.angles.b, this.screen.eye.angles.c);
					let delta = {
						longitude: (event.clientX-this.oldX)/1000,
						latitude : (event.clientY-this.oldY)/1000,
					};
					this.screen.rotateAround(delta);
					console.log('eye.angles:',this.screen.eye.angles.a, this.screen.eye.angles.b, this.screen.eye.angles.c);

					this.refresh();

					this.oldX=event.clientX;
					this.oldY=event.clientY;
				};
			}; break;
			default:break;
		};

	}

	refresh(){
		console.log('refresh');

		this.render.render();
		this.canvas.refreshImageData();

	}


}
