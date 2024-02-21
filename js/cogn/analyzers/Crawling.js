import Arrow from './../../common/Arrow.js';
import ColorDelta from './../items/ColorDelta.js';
import CustomAnalyzer from './../custom/CustomAnalyzer.js';


class Crawling extends CustomAnalyzer{
/*
	init(){
		super.init();
	}

	createCell(x,y){
		let cell = super.createCell(x,y);
		return cell;
	}
*/
	createLookData(cell,look){
		return {
			delta:new Array(3),
		};
	}

	scanDelta0(){
		console.log('Derivative 0');
		this.onSendPixels((i,j,cell)=>{
			this.onCellLooks(cell,(cell,look,lookData)=>{
				let neibCell = this.getNeibCell(i,j,look);
				if(!neibCell)
					return;
				lookData.clrCoord = neibCell.clrCoord;//?
				lookData.delta[0] = neibCell.clrCoord;//?
				neibCell.aLookData[Arrow.invLook(look)] = lookData;//one data for both cells
			},2,5);
		});
	}

	scanDelta1(){
		console.log('Derivative 1');
		this.onSendPixels((i,j,cell)=>{
			this.onCellLooks(cell,(cell,look,lookData)=>{
				lookData.delta[1] = new ColorDelta(cell.clrCoord, lookData.delta[0]);
			},2,5);
		});
	}

	scanDelta2(){
		console.log('Derivative 2');
		this.onSendPixels((i,j,cell)=>{
			this.onCellLooks(cell,(cell,look,lookData)=>{
				let versData = cell.aLookData[Arrow.invLook(look)];
				if(lookData && versData)
					lookData.delta[2] = new ColorDelta(versData.delta[1], lookData.delta[1]);//E-W, SE-NW, S-N, SW-NE
			},2,5);
		});
	}

	scanDeltas(rectSend){
		this.rectSend=rectSend;
/*
для кожного пікселя
	розрахувати
		яскравість контраст відтінок
		різницю з 8 (або 4) сусідами

похідна 1:  0 - один колір;      не 0 - градієнт
похідна 2:  0 - рівний градієнт; не 0 - зміна градієнтів
*/
		this.onSendPixels((i,j,cell)=>{});
		this.scanDelta0();
		this.scanDelta1();
		this.scanDelta2();
	}

}

export default Crawling;
