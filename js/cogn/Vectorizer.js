import { PixelVector } from './PixelVector.js';


class Vectorizer{
	constructor(canvas){
		this.canvas=canvas;


		this.vectors = new Array(this.canvas.height);//[];//[height][width]
		for(let i=0; i<this.canvas.height; i++)
			this.vectors[i] = new Array(this.canvas.width);

		this.pixelVector = new PixelVector(this.canvas);
		this.controlVector = new PixelVector(this.canvas);//?for ShowLupa


	}

	getVector(){
		let vector={
			grd: this.pixelVector.mu_Grad,
			equ: this.pixelVector.mu_Equal,
		};
		if(!vector.grd || vector.grd<0)vector.grd=0;
		if(!vector.equ || vector.equ<0)vector.equ=0;
		//vector.grd*=(+this.pixelVector.gradDist);
		vector.gradDist=(+this.pixelVector.gradDist);


		let sideCount=this.pixelVector.sides?this.pixelVector.sides.length:0;
		if(sideCount){
			vector.vectors = new Array(sideCount);
			for(let i=0; i<sideCount; i++){
				vector.vectors[i]={
					dist:this.pixelVector.dist[i],
					angle:this.pixelVector.sides[i].angle,
					wide:this.pixelVector.sides[i].wide,
					colorDelta:this.pixelVector.avgAngle[i],//long & lat
				};
			}
		};

		return vector;
	}


	calcMu(rectSend){
		for(let i=rectSend.top; i<=rectSend.bottom; i++){

				
			if(i%100==0)console.log(i,'/',rectSend.bottom-rectSend.top);
			this.pixelVector.init(rectSend.left-1,rectSend.top+i);

			for(let j=rectSend.left; j<=rectSend.right; j++){
				this.pixelVector.nextStep();
				this.pixelVector.calc();
				this.vectors[i][j] = this.getVector();

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
				let v = this.vectors[rectSend.top+i][rectSend.left+j];
				//rgba2 = this.pixelVector.getRGB(0,0);
				{
					rgba2[0] = Math.round(v.grd*v.gradDist*250);
					rgba2[1] = Math.round(v.equ*250);
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
