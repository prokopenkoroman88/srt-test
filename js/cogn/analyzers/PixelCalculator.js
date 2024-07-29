import Angle from './../../common/Angle.js';
import Arrow from './../../common/Arrow.js';
import CustomAnalyzer from './../custom/CustomAnalyzer.js';
import ColorCoords from './../items/ColorCoords.js';


export default class PixelCalculator extends CustomAnalyzer{

	init(){
		super.init();
		//lookData params:
		this.half=true
		this.start=2
		this.finish=5
	}

	isInverse(look){
		return (look>this.finish || look<this.start)//6,7,0,1
	}

	createCell(x,y){
		let pixel = this.canvas.getPixel(x,y);
		let cell = super.createCell(x,y, pixel);
		return cell;
	}//overrided

	createLookData(cell,look,neibCell){
		if(!neibCell)
			return;

		if(this.half){
			let innerCell = !this.areCoordsOnBorder(cell.y,cell.x,this.rectSend);
			if(innerCell && this.isInverse(look))//6,7,0,1
				return neibCell.aLookData[Arrow.invLook(look)];
		};
		return {
			clrCoord:neibCell.clrCoord,
		};
	}//overrided


	//scan every pixels

	createCells(){
		this.model.params.lookData.half=this.half;
		this.model.params.lookData.start=this.start;
		this.model.params.lookData.finish=this.finish;

		this.onSendPixels((i,j,cell)=>{});

		this.model.setReadyStatus('cells.color.coords');
		this.model.setReadyStatus('cells.half', this.model.params.lookData.half);
	}

	calcClrDists(){
		if(!this.requireStatus('cells.color.coords', 'calcClrDists'))
			return;

		this.onSendPixels((i,j,cell)=>{
			this.onCellLooks(cell,(cell,look,lookData,neibCell)=>{
				lookData.dist = Angle.dist3D(cell.clrCoord.coords, neibCell.clrCoord.coords);
			});
		});

		this.model.setReadyStatus('cells.color.dist');
	}

}
