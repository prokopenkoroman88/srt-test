import Arrow from './../../common/Arrow.js';
import PixelColor from './../../canvas/PixelColor.js';
import Cell from './../items/Cell.js';

class CustomAnalyzer{

	constructor(model){
		this.model=model;
		if(!this.model.cells)
			this.model.initCells();
		this.initParams();
		this.init();
		this.errors=[];
	}

	get canvas(){ return this.model.canvas; }

	initParams(){
		this.params={
			logging:{
				byGrid:true,
			},
			grid:{
				height:100,
				width:100,
			},
		};
	}

	addError(text){
		this.errors.push(text);
	}

	requireStatus(statusPath, methodName='', errorText=''){
		if(!this.model.getReadyStatus(statusPath)){
			if(!errorText){
				let className=this.constructor.name;
				errorText=`${className}.${methodName} requires status '${statusPath}'`;
			};
			this.addError(errorText);
			return false;
		}
		else
			return true;
	}

	init(){}

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

	stretchRect(rect,value=1){//1 - expand, -1 - narrow
		rect.left-=value;
		rect.top-=value;
		rect.right+=value;
		rect.bottom+=value;
	}

	areCoordsOnBorder(i,j,rect){
		return (i==rect.top || j==rect.left || i==rect.bottom || j==rect.right);
	}

	areCoordsInRect(i,j,rect){
		return (i<=rect.top || j>=rect.left || i<=rect.bottom || j<=rect.right);
	}

	getNeibCell(i,j,look){
		return this.model.getCell(i,j,look);
	}

	createCell(x,y){
		let pixel = this.canvas.getPixel(x,y);
		return new Cell(x,y,pixel);
	}

	onRectPixels(rect,func){
		const bLog=this.params.logging.byGrid;
		if(bLog)
			console.log('rows between:',rect.top,rect.bottom);
		for(let i=rect.top; i<=rect.bottom; i++){
			if(bLog && i%this.params.grid.height==0)
				console.log(i);
			for(let j=rect.left; j<=rect.right; j++){
				let cell = this.model.getCell(i,j);
				if(!cell){
					cell = this.createCell(j,i);
					this.model.setCell(i,j,cell);
				};
				func(i,j,cell);
			};//j
		};//i
	}

	onSendPixels(func){
		this.onRectPixels(this.rectSend,func);
	}

	onDestPixels(func){
		this.onRectPixels(this.rectDest,func);
	}

	createLookData(cell,look,neibCell){
		return {};
	}

	onCellLooks(cell,func,startLook=0,finishLook=7){
		if(!cell)
			return;
		Arrow.forLooks(startLook,finishLook,((look)=>{
			let lookData = cell.aLookData[look];
			let neibCell = this.getNeibCell(cell.y, cell.x, look);
			if(!lookData){
				lookData = this.createLookData(cell,look,neibCell);
				cell.aLookData[look] = lookData;
			};
			func(cell,look,lookData,neibCell);
		}).bind(this));
	}

	showFon(){
		for(let i=0; i<this.rectDest.height; i++){
			for(let j=0; j<this.rectDest.width; j++){
				let rgba = this.canvas.getRGB(this.rectSend.left+j/this.scale.w, this.rectSend.top+i/this.scale.h);
				this.canvas.setRGB(this.rectDest.left+j, this.rectDest.top+i, rgba);
			};//j
		};//i
	}

	grayColor(val){
		return 'rgba('+val+','+val+','+val+','+0.5+')';
		let sVal=val.toString(16);
		if(val<16)sVal='0'+sVal;
		return '#'+sVal+sVal+sVal;
	}

	getShowedPixel(pxl){//aSubPxl2[k2]
		return {
			x : Math.round(this.rectDest.left+(pxl.x-this.rectSend.left)*this.scale.w),
			y : Math.round(this.rectDest.top +(pxl.y-this.rectSend.top )*this.scale.h),
		};
	}

}

export default CustomAnalyzer;
