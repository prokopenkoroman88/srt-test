import { aWindRose } from './../system.js';
import PixelColor from './../canvas/PixelColor.js';
//import { PixelVector } from './PixelVector.js';
import { ColorTree, ColorArea, GradientArea, ColorThread } from './ColorArea.js';


class Isochromizer{

	static incLook(look, incValue=1){
		return (look + incValue + 8) % 8;
	}
	static decLook(look, decValue=1){
		return (look - decValue + 8) % 8;
	}

	constructor(canvas){
		this.canvas=canvas;


		this.cells = new Array(this.canvas.height);//[];//[height][width]
		for(let i=0; i<this.canvas.height; i++)
			this.cells[i] = new Array(this.canvas.width);


//?		this.tree = new ColorTree(this);
		//?//this.tree = new ColorArea(this);

	}




	scanSubPixels(rectSend){
		for(let i=rectSend.top; i<=rectSend.bottom+1; i++){
			for(let j=rectSend.left-1; j<=rectSend.right+1; j++){

				let rgba = this.canvas.getRGB(j,i);
				//свойства самого пикселя
				this.cells[i][j] = {
					brightness : PixelColor.calcBrightness(rgba),//0..255
					contrast : PixelColor.calcContrast(rgba),//0..255
					hue : PixelColor.calcHue(rgba),//0..1529
					aSub : new Array(8),
				};
			};//j++
		};//i++
		console.log('end of pixels scanning');
//====


		for(let i=rectSend.top; i<=rectSend.bottom-0; i++){

			if(i%100==0)console.log(i,'/',rectSend.bottom-rectSend.top);
//			this.pixelVector.init(rectSend.left-1,rectSend.top+i);


			let neibPixels = new Array(8);
			//let currPxl = this.canvas.getPixel(rectSend.left,i);
			//let downPxl = this.canvas.getPixel(rectSend.left,i+1);

			for(let j=rectSend.left; j<=rectSend.right-0; j++){

				//currPxl = rightPxl;
				//downPxl = pxl
				//let cell = this.cells[i][j];

				let currPxl = this.cells[i][j];//.pxl;//.getPixel(j  ,i  );
				neibPixels[2] = this.cells[i  ][j+1];//.pxl;//.getPixel(j+1,i  );
				neibPixels[3] = this.cells[i+1][j+1];//.pxl;//.getPixel(j+1,i+1);
				neibPixels[4] = this.cells[i+1][j  ];//.pxl;//.getPixel(j  ,i+1);
				neibPixels[5] = this.cells[i+1][j-1];//.pxl;//.getPixel(j-1,i+1);
/*

	getBrightness(){//Яркость [0..1] снизу вверх
		return PixelColor.calcBrightness(this.toArray())/255;
	}

	getContrast(){//Контраст [0..1] от центральной оси к поверхности шара 
		return PixelColor.calcContrast(this.toArray())/255;
	}

	getHue(){//Оттенок [0..2*PI] по кругу все цвета радуги
		return PixelColor.calcHue(this.toArray())/1529*2*Math.PI;
	}


*/





				for(let currLook=2; currLook<=5; currLook++){


					//свойства субпикселей
					let subPixelBridge = {
						bridgeBrightness:[],
						bridgeContrast:[],
						bridgeHue:[],
					};


					let neibLook = Isochromizer.incLook(currLook, 4);
					let dx = aWindRose[currLook].dx;
					let dy = aWindRose[currLook].dy;

					let neibPxl = neibPixels[currLook];

//=======================
					let currBrightness = Math.round(currPxl.brightness);//0..255
					let neibBrightness = Math.round(neibPxl.brightness);//0..255
					let delta=neibBrightness-currBrightness;
					if(delta===0){
						//
					};
					if(Math.abs(delta)===1){
						//
					};
					if(Math.abs(delta)>1){
						//Math.sign()
						let sgn=1;
						if(delta<0)
							sgn=-1;

						for(let iBridge = 1; iBridge < Math.abs(delta); iBridge++){
							//[i]
							let val = currBrightness + iBridge*sgn;
							//if(Math.round(val)%2==0)//реже
							subPixelBridge.bridgeBrightness.push({
								x : j + dx*iBridge/Math.abs(delta),
								y : i + dy*iBridge/Math.abs(delta),
								value : val,
								//value:currBrightness + iBridge*sgn,
							});

						};

					};
//========================

					//связь мостиком:
					this.cells[i   ][j   ].aSub[currLook] = subPixelBridge;
					this.cells[i+dy][j+dx].aSub[neibLook] = subPixelBridge;
					console.log('Bridge: ', i, j, ' with ', dy, dx, 'look', currLook, neibLook);
				};//look++

			};//j++
		};//i++



	}



	setScale(rectSend,rectDest){
		this.rectSend=rectSend;
		this.rectDest=rectDest;


		this.rectSend.width = this.rectSend.right - this.rectSend.left + 1;
		this.rectDest.width = this.rectDest.right - this.rectDest.left + 1;
		this.rectSend.height = this.rectSend.bottom - this.rectSend.top + 1;
		this.rectDest.height = this.rectDest.bottom - this.rectDest.top + 1;
		this.scale={
			w : this.rectDest.width / this.rectSend.width,
			h : this.rectDest.height / this.rectSend.height,
		};

	}


	showFon(){
		for(let i=0; i<this.rectDest.height; i++){
			for(let j=0; j<this.rectDest.width; j++){
				let rgba = this.canvas.getRGB(this.rectSend.left+j/this.scale.w, this.rectSend.top+i/this.scale.h);
				this.canvas.setRGB(this.rectDest.left+j, this.rectDest.top+i, rgba);

			};//j
		};//i
	}


	onSendPixels(func){
		for(let i=this.rectSend.top; i<this.rectSend.bottom; i++){
			for(let j=this.rectSend.left; j<this.rectSend.right; j++){
				let cell = this.cells[i][j];
				func(i,j,cell);
			};//j
		};//i
	}


	onCellLooks(cell,func,startLook=0,finishLook=7){//Brightness???? Contrast???? Hue???
		for(let look=startLook; look!=finishLook; look=Isochromizer.incLook(look) ){//look=Isochromizer.incLook(look)
			//console.log(cell, look, cell.aSub[look] );
			if(!cell.aSub[look])continue;
			let aSubPxl = cell.aSub[look].bridgeBrightness;
			func(cell,look,aSubPxl);//?
		};
	}

	onSubpixelBridge(aSubPxl,func){
		//if(!aSubPxl)return;
		for(let k=0; k<aSubPxl.length; k++){
			let pxl = aSubPxl[k];
			func(k,pxl);
		};
	}

	grayColor(val){
		let sVal=val.toString(16);
		if(val<16)sVal='0'+sVal;
		return '#'+sVal+sVal+sVal;
	}








	getNeibBridge(cell,look,pm){
		let look2 = Isochromizer.incLook(look,pm);
		if(!cell.aSub[look2])
			return null;
		let aSubPxl2 = cell.aSub[look2].bridgeBrightness;
		return aSubPxl2;
	}

	indexOfPxlByVal(aSubPxl,val){
		let index=-1;
		//console.log(aSubPxl);
		if(!aSubPxl || aSubPxl.length==0)return; // || aSubPxl.length==0
		try {
			let n=aSubPxl.length-1;
			let value0 = Math.round(aSubPxl[0].value);
			let valueN = Math.round(aSubPxl[n].value);
			val=Math.round(val);
			if( value0<=val && val<=valueN || value0>=val && val>=valueN ){		
				this.onSubpixelBridge(aSubPxl,function(k,pxl){
					try {
						if(index<0 && pxl && Math.round(pxl.value)==Math.round(val)){
							index=k;
						};					
					} catch(e) {
						// statements
						console.log(e);
					};

				});
			};
		} catch(e) {
			console.log(e);
			console.log(aSubPxl);
			console.log(val);
		};

		return index;//aSubPxl[index].val=val
/*

							for(let k2=0; k2<aSubPxl2.length; k2++){
								if(Math.round(aSubPxl2[k2].value)==val){
									//
									p1.x=rectDest.left+(aSubPxl2[k2].x-rectSend.left)*scaleW;
									p1.y=rectDest.top +(aSubPxl2[k2].y-rectSend.top )*scaleH;
									this.canvas.paintStandardLine(p0, p1, lineColor);
									console.log('line+1 ',i,j,look,' to ',look2, p0, p1, p1.x-p0.x, p1.y-p0.y);
									break;
								};
							};
*/

	}


	f(){

					try{
						if(i>0 && j>0 && i<sendH-1 && j<sendW-1){
						look2 = Isochromizer.incLook(look,pm);
						aSubPxl2 = cell.aSub[look2].bridgeBrightness;

							//поиск такого же субпикселя как aSubPxl[k] на соседнем мосту aSubPxl2
							let k2;
							for(k2=0; k2<aSubPxl2.length; k2++){
								if(Math.round(aSubPxl2[k2].value)==val){
									//
									p1.x=rectDest.left+(aSubPxl2[k2].x-rectSend.left)*scaleW;
									p1.y=rectDest.top +(aSubPxl2[k2].y-rectSend.top )*scaleH;
									this.canvas.paintStandardLine(p0, p1, lineColor);
									console.log('line+1 ',i,j,look,' to ',look2, p0, p1, p1.x-p0.x, p1.y-p0.y);
									break;
								};
							};

						};
					} catch(e) {

						console.log(e);
					};



	}



	areCoordsOnBorder(i,j,rect){
		return (i==rect.top || j==rect.left || i==rect.bottom || j==rect.right);
	}


	getNeibCell(i,j,look){
		let dy=aWindRose[look].dy;
		let dx=aWindRose[look].dx;
		return this.cells[i+dy][j+dx];
	}



	showSubPixels(rectSend,rectDest){
//*
		let sendW = rectSend.right - rectSend.left + 1;
		let destW = rectDest.right - rectDest.left + 1;
		let sendH = rectSend.bottom - rectSend.top + 1;
		let destH = rectDest.bottom - rectDest.top + 1;
		let scaleW = destW/sendW;
		let scaleH = destH/sendH;
//*/
		this.setScale(rectSend,rectDest);
		this.showFon();


		this.onSendPixels(function(i,j,cell){
			this.onCellLooks(cell,function(cell,look,aSubPxl){
				//
				this.onSubpixelBridge(aSubPxl,function(k,pxl){
					//
					try {


					let p0 = this.getShowedPixel(pxl);
					let val=Math.round(pxl.value);
					//let rgba = [val, val, val, 255];
					let rgba = [0, val, 0, 255];
					this.canvas.setRGB(p0.x, p0.y, rgba);
					//console.log(i);








					} catch(e) {
						// statements
						console.log(e);
					} finally {
						// statements
					}

				}.bind(this));
			}.bind(this),0,7);


		}.bind(this));

		console.log('fon showed');
/*
		for(let i=0; i<sendH; i++){
			for(let j=0; j<sendW; j++){

				for(let look=2; look<=5; look++){
					console.log(i,j, look, this.cells[rectSend.top+i][rectSend.left+j].aSub[look] );
					let aSubPxl = this.cells[rectSend.top+i][rectSend.left+j].aSub[look].bridgeBrightness;
					for(let k=0; k<aSubPxl.length; k++){
						let val=Math.round(aSubPxl[k].value);
						let rgba = [val, val, val, 255];
						let p0={
							x:rectDest.left+(aSubPxl[k].x-rectSend.left)*scaleW,
							y:rectDest.top +(aSubPxl[k].y-rectSend.top )*scaleH,
						};
						//let p1={x:0,y:0};
						this.canvas.setRGB(p0.x, p0.y, rgba);

					};//k subpixel


				};//look



			};//j
		};//i
//*/

		this.canvas.put();


//*
		this.onSendPixels(function(i,j,cell){
			console.log(i,j,cell);
			this.onCellLooks(cell,function(cell,look,aSubPxl){
				//
				this.onSubpixelBridge(aSubPxl,function(k,pxl){
					//
					if(pxl.links && pxl.links.length>=2)
						return false;


					let p0 = this.getShowedPixel(pxl);
					let p1 = {x:0,y:0};
					//this.canvas.setRGB(p0.x, p0.y, rgba);
					let val = pxl.value;//Math.round()
					let lineColor =this.grayColor(0);//val


					let aSubPxl2, k2;


					if(!this.areCoordsOnBorder(i,j,this.rectSend)){

						const line2=lineColor;//'yellow'
						const line4=lineColor;//'yellow'
						const line6=lineColor;//'aqua'
						const line0=lineColor;//'aqua'

						let look2, neibCell;

//*
						let ortho=false;


						function byNeibCell(look2){
							neibCell = this.getNeibCell(i,j,look2);
							try {
							aSubPxl2 = neibCell.aSub[look].bridgeBrightness;
							} catch(e) {
								aSubPxl2 = [];
							};
						};

						function findLine(){
							k2 = this.indexOfPxlByVal(aSubPxl2,val);
							if(k2>=0){
								let pxl2=aSubPxl2[k2];
								if(pxl2.links && pxl2.links.length>=2)
									return false;
								p1 = this.getShowedPixel(pxl2);
								console.log('+1', p0, p1);
								this.canvas.paintStandardLine(p0, p1, lineColor);
								//console.log('line+1 ',i,j,look,' to ',look2, p0, p1, p1.x-p0.x, p1.y-p0.y);
								if(!pxl2.links)
									pxl2.links=[];
								pxl2.links.push(pxl);
								if(!pxl.links)
									pxl.links=[];
								pxl.links.push(pxl2);
							};
							return k2>=0;
						};


						//чтобы не плодить изо-линии
						if(look==2 || look==6){
							byNeibCell.bind(this)(4);
							if(findLine.bind(this)()) ortho=true;
							byNeibCell.bind(this)(0);
							if(findLine.bind(this)()) ortho=true;
						};
						if(ortho)return;

						//чтобы не плодить изо-линии
						if(look==0 || look==4){
							byNeibCell.bind(this)(2);
							if(findLine.bind(this)()) ortho=true;
							byNeibCell.bind(this)(6);
							if(findLine.bind(this)()) ortho=true;
						};
						if(ortho)return;


						//чтобы не плодить изо-линии
						if(look==1 || look==5){
							byNeibCell.bind(this)(3);
							if(findLine.bind(this)()) ortho=true;
							byNeibCell.bind(this)(7);
							if(findLine.bind(this)()) ortho=true;
						};
						if(ortho)return;

						//чтобы не плодить изо-линии
						if(look==7 || look==3){
							byNeibCell.bind(this)(1);
							if(findLine.bind(this)()) ortho=true;
							byNeibCell.bind(this)(5);
							if(findLine.bind(this)()) ortho=true;
						};
						if(ortho)return;


//*/
//    i,j
//   (cell,look, p0, val, pmLook)

						aSubPxl2 = this.getNeibBridge(cell,look,1);
						findLine.bind(this)();
						aSubPxl2 = this.getNeibBridge(cell,look,-1);
						findLine.bind(this)();
					};//

				}.bind(this));
			}.bind(this),0,7);
		}.bind(this));
//*/

	}



	getShowedPixel(pxl){//aSubPxl2[k2]
		return {
			x : Math.round(this.rectDest.left+(pxl.x-this.rectSend.left)*this.scale.w),
			y : Math.round(this.rectDest.top +(pxl.y-this.rectSend.top )*this.scale.h),
		};
	}







}

export default Isochromizer;
