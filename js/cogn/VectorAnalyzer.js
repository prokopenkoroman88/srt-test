import Arrow from './../common/Arrow.js';
import PixelColor from './../canvas/PixelColor.js';
import RealCanvas from './../canvas/RealCanvas.js';
import CustomEditor from './../common/CustomEditor.js';
import Vectorizer from './Vectorizer.js';


//const mouseMv=0, mouseDn=1, mouseUp=2;
//const btnLeft=0, btnRight=2;//from https://developer.mozilla.org/ru/docs/Web/API/Element/mousedown_event
const modeArrow=0;
const lupaWidth=500, lupaScale=16*4;


export default class VectorAnalyzer extends CustomEditor{

	static get modeArrow(){ return 0; }

	static get modeLupaNone(){ return 0; }
	static get modeLupaFew(){ return 1; }
	static get modeLupaWide(){ return 2; }

	set mode(value){
/*
		switch (this._mode) {
			case VectorAnalyzer.modeArrow:
				this.btnArrow.currHTMLTag.classList.remove('active');
				break;
			default:
				break;
		};

		switch (value) {
			case VectorAnalyzer.modeArrow:
				this.btnArrow.currHTMLTag.classList.add('active');
				break;
			default:
				break;
		};
*/
		this._mode = value;
	}
	get mode(){
		return this._mode;
	}

	set lupa(value){
		switch (this._lupa) {
			case VectorAnalyzer.modeLupaNone:
				this.btnLupaNone.currHTMLTag.classList.remove('active');
				break;
			case VectorAnalyzer.modeLupaFew:
				this.btnLupaFew.currHTMLTag.classList.remove('active');
				this.tblLupa.currHTMLTag.style.display = 'none';
				break;
			case VectorAnalyzer.modeLupaWide:
				this.btnLupaWide.currHTMLTag.classList.remove('active');
				this.cnvLupa.canvas.style.display = 'none';
				break;
			default:
				break;
		};
		switch (value) {
			case VectorAnalyzer.modeLupaNone:
				this.btnLupaNone.currHTMLTag.classList.add('active');
				break;
			case VectorAnalyzer.modeLupaFew:
				this.btnLupaFew.currHTMLTag.classList.add('active');
				this.tblLupa.currHTMLTag.style.display = 'block';
				break;
			case VectorAnalyzer.modeLupaWide:
				this.btnLupaWide.currHTMLTag.classList.add('active');
				this.cnvLupa.canvas.style.display = 'block';
				break;
			default:
				break;
		};
		this._lupa = value;
	}
	get lupa(){
		return this._lupa;
	}

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
				.div('')
				.dn()
					.tag('canvas','').attr('width',lupaWidth+'px').attr('height',lupaWidth+'px')//.assignTo('cnvLupa')
				.up()
			.up()
			.button('').inner('mu').assignTo('btnMu')
			.div('separator')
			.button('').inner('none').assignTo('btnLupaNone')
			.button('').inner('Few').assignTo('btnLupaFew')
			.button('').inner('Wide').assignTo('btnLupaWide')
		.up();

		this.cnvLupa = new RealCanvas('.btns .lupa canvas');

		this.addOnClick('btnMu', function(){
			this.calcMu();
		});

		this.addOnClick('btnLupaNone', function(){
			this.lupa=VectorAnalyzer.modeLupaNone;
		});
		this.addOnClick('btnLupaFew', function(){
			this.lupa=VectorAnalyzer.modeLupaFew;
		});
		this.addOnClick('btnLupaWide', function(){
			this.lupa=VectorAnalyzer.modeLupaWide;
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
			/**/this.showFewLupa(event.offsetX,event.offsetY);
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

	showFewLupa(x,y){
		//if(this.lupa!=VectorAnalyzer.modeLupaFew)return;
		//PixelVector:
		this.vectorizer.controlVector.initRoundArrays(8);
		this.vectorizer.controlVector.fill(x,y);//.init(x,y)
		let aClrCoord = this.vectorizer.controlVector.createClrCoord();
		let cell = this.vectorizer.cells[y][x];
		this.vectorizer.controlVector.calc(aClrCoord, cell);
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
						+(pxl.getHue()/Math.PI*180+(vector.colorDelta.long)/Math.PI*180*vector.length).toFixed(0)+'deg,'
						//+(pxl.getHue()*360).toFixed(0)+'deg,'
						+(pxl.getContrast()*100*1.6).toFixed(1)+'%,' //1.6?
						+(pxl.getBrightness()*100+((vector.colorDelta.lat/(Math.PI/2))*50)*vector.length ).toFixed(1)+'%'//0..1 + -PI/2..+PI/2
						+')';
						
						tds[i*5+j].innerHTML+='<div class="vector" style="  --clr:'+clr+';'
							+' --hue:'+(vector.colorDelta.long/Math.PI*180).toFixed(0)+'deg;'
							+' --light:'+(50+vector.colorDelta.lat/Math.PI*50).toFixed(0)+'%;'
							+' width:'+vector.width.toFixed(0)+'px;'
							+' height:'+vector.length*100+'px;'
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
			console.log('avgAngle',cv.sides[0].avgAngle, cv.sides[1].avgAngle);
			console.log('skoAngle',cv.sides[0].skoAngle, cv.sides[1].skoAngle);
		};
	}//showLupa

	showWideLupa(x,y){
		console.log(x,y);

		function toCnv(x2,y2){
			return {
				x:Math.round(lupaWidth/2 + (x2-x)*lupaScale),
				y:Math.round(lupaWidth/2 + (y2-y)*lupaScale)
			};
		};
		function toCell(j,i){
			return {
				x:Math.round(x+(j-lupaWidth/2)/lupaScale),
				y:Math.round(y+(i-lupaWidth/2)/lupaScale),
			};
		};
		function circlePreparing(x){//radius=x in [0..1]
			x=Math.max(0,Math.min(x,1));
			let y=Math.pow(1-Math.pow(1-x,2),0.5)/2;
			return y;
		};

		//print vectors:
		let x0=toCell(0,0).x;
		let x1=toCell(lupaWidth,lupaWidth).x;
		let y0=toCell(0,0).y;
		let y1=toCell(lupaWidth,lupaWidth).y;

		for(let cy=y0; cy<=y1; cy++){
			for(let cx=x0; cx<=x1; cx++){
				let cell = this.vectorizer.cells[cy][cx];
				//console.log(cy,cx,cell);
				if(!cell)continue;
				let rgba = this.canvas.getRGB(cx,cy);
				let pnt = toCnv(cx,cy);
				for(let i=-lupaScale/2; i<lupaScale/2; i++ )
					for(let j=-lupaScale/2; j<lupaScale/2; j++ )
						this.cnvLupa.setRGB(pnt.x+j,pnt.y+i,rgba);
			};
		};
		this.cnvLupa.put();

		for(let cy=y0; cy<=y1; cy++){
			for(let cx=x0; cx<=x1; cx++){
				let cell = this.vectorizer.cells[cy][cx];
				console.log(cy,cx,cell);
				if(!cell)continue;
				if(!cell.vectors)continue;
				let p0 = toCnv(cx,cy);//moveTo
				console.log('p0',p0);

				let d0, d1=cell.dist[7];
				let pnt0={}, pnt1={};

				if(true){
				let vectorAngle=Arrow.angleByLook(7);
				let vectorDist, radius0=cell.dist[7];//0.5-cell.dist[7]/2;//*1*lupaScale
				vectorDist=circlePreparing(radius0/2);
				//if(radius0>=0 && radius0<=2)
				//	vectorDist=	Math.pow(1-Math.pow(1-radius0/2,2),0.5)/2;

				let nx = (cx + Math.sin(vectorAngle) * vectorDist);
				let ny = (cy - Math.cos(vectorAngle) * vectorDist);
				pnt1 = toCnv(nx,ny);//lineTo
				};

				cell.dist.forEach((radius,look)=>{
					d0=d1;
					d1=radius;//cell.dist[look]
					pnt0=pnt1;
					let vectorAngle=Arrow.angleByLook(look);
					let vectorDist=1+0.5;
					vectorDist=circlePreparing(radius/2);

					let nx = (cx + Math.sin(vectorAngle) * vectorDist);
					let ny = (cy - Math.cos(vectorAngle) * vectorDist);
					pnt1 = toCnv(nx,ny);//lineTo
					console.log(pnt0,pnt1);
					if(cx==x && cy==y)
						this.cnvLupa.paintStandardLine(pnt0,pnt1,'white');
					else
						this.cnvLupa.paintStandardLine(pnt0,pnt1,'gray');
				},this);


				cell.vectors.forEach((vector)=>{
					let vectorAngle=vector.angle;//Arrow.angleByLook(vector.angle);
					let vectorDist = vector.length*0.05*lupaScale;
					vectorDist = circlePreparing(vector.length);
					//let vectorDist = 3+Math.log(vector.dist);//*1*lupaScale;
					if(vectorDist<0)
						vectorDist=0.01;
					let nx = (cx + Math.sin(vectorAngle) * vectorDist);
					let ny = (cy - Math.cos(vectorAngle) * vectorDist);
					let p1 = toCnv(nx,ny);//lineTo
					console.log('p1',p1);
					let clr=//'hsl(0deg,10%,'+(50+vector.colorDelta.lat/Math.PI*50).toFixed(0)+'%)';
					'hsl('+(vector.colorDelta.long/Math.PI*180).toFixed(0)+'deg,100%,'+(50+vector.colorDelta.lat/Math.PI*50).toFixed(0)+'%)';
					this.cnvLupa.paintStandardLine(p0,p1,clr);

					let widthAngle=vector.width//Arrow.angleByLook(vector.width);
					let vectorAngleL=vectorAngle-widthAngle/2;
					let vectorAngleR=vectorAngle+widthAngle/2;

					nx = (cx + Math.sin(vectorAngleL) * vectorDist);
					ny = (cy - Math.cos(vectorAngleL) * vectorDist);
					let p1L = toCnv(nx,ny);//lineTo
					this.cnvLupa.paintStandardLine(p0,p1L,clr);

					nx = (cx + Math.sin(vectorAngleR) * vectorDist);
					ny = (cy - Math.cos(vectorAngleR) * vectorDist);
					let p1R = toCnv(nx,ny);//lineTo
					this.cnvLupa.paintStandardLine(p0,p1R,clr);

					let vectorAngleL2=vectorAngle-widthAngle/4;
					let vectorAngleR2=vectorAngle+widthAngle/4;

					nx = (cx + Math.sin(vectorAngleL2) * vectorDist);
					ny = (cy - Math.cos(vectorAngleL2) * vectorDist);
					let p1L2 = toCnv(nx,ny);//lineTo

					nx = (cx + Math.sin(vectorAngleR2) * vectorDist);
					ny = (cy - Math.cos(vectorAngleR2) * vectorDist);
					let p1R2 = toCnv(nx,ny);//lineTo

					//this.cnvLupa.paintStandardLine(p1L,p1R,clr);
					this.cnvLupa.paintStandardLine(p1L,p1L2,clr);
					this.cnvLupa.paintStandardLine(p1L2,p1,clr);
					this.cnvLupa.paintStandardLine(p1,p1R2,clr);
					this.cnvLupa.paintStandardLine(p1R2,p1R,clr);
				},this);
			};//cx
		};//cy

	}//showWideLupa

}
