import { PixelVector } from './PixelVector.js';


class Vectorizer{
	constructor(canvas){
		this.canvas=canvas;


		this.cells = new Array(this.canvas.height);//[];//[height][width]
		for(let i=0; i<this.canvas.height; i++)
			this.cells[i] = new Array(this.canvas.width);

		this.pixelVector = new PixelVector(this.canvas);
		this.controlVector = new PixelVector(this.canvas);//?for ShowLupa


	}

	calcMu(rectSend){
		for(let i=rectSend.top; i<=rectSend.bottom; i++){

				
			if(i%100==0)console.log(i,'/',rectSend.bottom-rectSend.top);
			this.pixelVector.init(rectSend.left-1,rectSend.top+i);

			for(let j=rectSend.left; j<=rectSend.right; j++){
				this.pixelVector.nextStep();
				this.cells[i][j] = this.pixelVector.calcCellVectors();

/*
				let iArea=-1;
				for(let k=0; k<aColorAreas.length; k++){
					if(this.isOne(aColorAreas[k].color.toArray(),rgba) && aColorAreas[k].isPointNear(j,i)){ //need merge
						//
						iArea=k;
					};//isOne
				};//k
				if(iArea<0){//если не нашли
					iArea = aColorAreas.push( new ColorArea(rgba) )-1;
				};
				aColorAreas[iArea].addPoint(j,i);
*/
					//console.log(i,j,rgba2);
			};//j
		};//i
	}

	showMu(rectSend,rectDest){
		for(let i=rectDest.top; i<=rectDest.bottom; i++){
			let rgba2=[0,0,0,255];
				
			if(i%100==0)console.log(i);
			for(let j=rectDest.left; j<=rectDest.right; j++){
				let cell = this.cells[rectSend.top+i][rectSend.left+j];
				//rgba2 = this.pixelVector.getRGB(0,0);
				{
					rgba2[0] = Math.round(cell.grd*cell.gradDist*250);
					rgba2[1] = Math.round(cell.equ*250);
					rgba2[2] = 0;
				};
				//console.log(i,j,rgba2);
				this.canvas.setRGB(rectDest.left+j, rectDest.top+i, rgba2);
			};//j
		};//i
		this.canvas.put();
	}








}

export default Vectorizer;
