import Arrow from './../common/Arrow.js';
import PixelColor from './../canvas/PixelColor.js';
import CustomEditor from './../common/CustomEditor.js';
import Vectorizer from './Vectorizer.js';


//const mouseMv=0, mouseDn=1, mouseUp=2;
//const btnLeft=0, btnRight=2;//from https://developer.mozilla.org/ru/docs/Web/API/Element/mousedown_event
const modeArrow=0;


export default class VectorAnalyzer extends CustomEditor{

	static get modeArrow(){ return 0; }
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
	}

	initPanel(){

		let arr = new Array(5);
		for(let i=0; i<5; i++)
		{
			arr[i] = new Array(5);
			for(let j=0; j<5; j++)
				arr[i][j]='';//i+','+j;
		};

		this.root
		.div('btns')
		  .dn()
			.div('lupa')//.attr('style','  ')
			  .dn()
				.table().assignTo('tblLupa')
				  .dn()
					.trtd('','',arr)
				  .up()
			  .up()
			.button('').inner('mu').assignTo('btnMu')
		  .up();

		this.addOnClick('btnMu', function(){
			this.calcMu();
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
				console.log(event);
				console.log(event.target);
				//console.log(event.target.clientX,event.target.clientY);
				console.log(event.offsetX,event.offsetY);
				this.showLupa(event.offsetX+this.rectSend.left-1,event.offsetY);
				if(this.pressed){
					console.log('onMouse',kak);
					this.oldX=event.clientX;
					this.oldY=event.clientY;
				};
			}; break;
			default:break;
		};

	}

	calcMu(){
		//init  this.vectorizer.vectors
		this.rectSend.top=0;
		this.rectSend.bottom=this.canvas.height-1;
		this.rectSend.left=Math.round(this.canvas.width/3);
		this.rectSend.right=this.rectSend.left+Math.round(this.canvas.width/3);
		this.rectSend.top=300;
		this.rectSend.bottom=800;
		this.rectSend.left+=200;
		this.rectSend.right-=100;
/*
		this.rectSend.top=610;
		this.rectSend.bottom=650;//-35;
		this.rectSend.left=1180;
		this.rectSend.right=1220;//-35;
//*/
		this.vectorizer.calcMu(this.rectSend);
		this.vectorizer.gatherMu(this.rectSend);

		this.rectDest.top=0;
		this.rectDest.bottom=this.canvas.height-1;
		this.rectDest.left=0;
		this.rectDest.right=this.rectDest.left+Math.round(this.canvas.width/3);
//?		this.vectorizer.showMu(this.rectSend, this.rectDest);
	}

	showLupa(x,y){
		//PixelVector:
		this.vectorizer.controlVector.fill(x,y);//.init(x,y)
		this.vectorizer.controlVector.calc();
		let  cv = this.vectorizer.controlVector;
		let tbl = this.tblLupa.currHTMLTag;
		let tds = tbl.querySelectorAll('td');

		//цвета окружающих ячеек:
		for(let i=0; i<5; i++){
			for(let j=0; j<5; j++){
				let rgba = this.canvas.getPixel(x+j-2,y+i-2);
				if(!rgba) continue;
				tds[i*5+j].style.backgroundColor=rgba.toColor();
				tds[i*5+j].style.color=rgba.inverse().toColor();
				tds[i*5+j].innerHTML='';
			};//j
		};//i

		//широта - изменение яркости, широта - изменение оттенка, радиус - величина изменений
		for(let i=0; i<8; i++){
			let xx=2+Arrow.windRose[i].dx;
			let yy=2+Arrow.windRose[i].dy;

			let cmps='';
			let cell = this.vectorizer.cells[y+yy][x+xx];
			console.log(cell);
			if(cell && cell.cmps)
			cell.cmps.forEach( function(element, index) {
				cmps+=' '+element.toFixed(1);
			});
			tds[yy*5+xx].innerHTML = 
cmps;
//			 'ш'+cv.angle[i].lat.toFixed(2)+'<br>'
//			+'д'+cv.angle[i].long.toFixed(2)+'<br>'
//			+'r'+cv.dist[i].toFixed(2);
		};//i++

		let mu_Equal=cv.mu_Equal;
		if(mu_Equal)
			mu_Equal=Math.round(mu_Equal*100)/100;
		let mu_Grad=cv.mu_Grad;
		if(mu_Grad)
			mu_Grad=Math.round(mu_Grad*100)/100;
		tds[2*5+2].innerHTML = 'эк='+mu_Equal+'<br>гр='+mu_Grad;

		for(let i=0; i<5; i++){
			for(let j=0; j<5; j++){
				let cell = this.vectorizer.cells[y+i-2][x+j-2];
				//console.log(x+j-2,y+i-2,this.rgba);
				let pxl  = this.canvas.getPixel(x+j-2,y+i-2);//исходный пиксель
				let pxl2 = this.canvas.getPixel(x+j-2,y+i-2);//получаемый соседний пиксель
				if(cell && cell.vectors){

					cell.vectors.forEach((vector)=>{
						//вектор изменения цвета

						let clr = 'hsl('
						+(pxl.getHue()/Math.PI*180+(vector.colorDelta.long)/Math.PI*180*vector.dist).toFixed(0)+'deg,'
						//+(pxl.getHue()*360).toFixed(0)+'deg,'
						+(pxl.getContrast()*100*1.6).toFixed(1)+'%,' //1.6?
						+(pxl.getBrightness()*100+((vector.colorDelta.lat/(Math.PI/2))*50)*vector.dist ).toFixed(1)+'%'//0..1 + -PI/2..+PI/2
						+')';
						
						tds[i*5+j].innerHTML+='<div class="vector" style="  --clr:'+clr+';'
							+' --hue:'+(vector.colorDelta.long/Math.PI*180).toFixed(0)+'deg;'
							+' --light:'+(50+vector.colorDelta.lat/Math.PI*50).toFixed(0)+'%;'
							+' width:'+vector.wide.toFixed(0)+'px;'
							+' height:'+vector.dist*100+'px;'
							+' transform:rotate('+((vector.angle-4)/8*360).toFixed(0)+'deg);'
							+'"></div>';
					});

				};
			};//j
		};//i

		let sideCount=cv.aMinDist.length;
		console.log('sideCount',sideCount);
		//this.avgAngle=new Array(sideCount);
		//this.skoAngle=new Array(sideCount);

		if(sideCount==2){
			console.log('side', cv.sides[0], cv.sides[1]);
			console.log('bridge', cv.getBridge(0), cv.getBridge(1));
			console.log('avgAngle',cv.avgAngle[0], cv.avgAngle[1]);
			console.log('skoAngle',cv.skoAngle[0], cv.skoAngle[1]);
		};
	}//showLupa

}
