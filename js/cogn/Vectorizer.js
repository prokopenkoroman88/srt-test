import { aWindRose } from './../system.js';
import { PixelVector } from './PixelVector.js';
import { ColorTree, ColorArea, GradientArea, ColorThread } from './ColorArea.js';


class Vectorizer{
	constructor(canvas){
		this.canvas=canvas;


		this.cells = new Array(this.canvas.height);//[];//[height][width]
		for(let i=0; i<this.canvas.height; i++)
			this.cells[i] = new Array(this.canvas.width);

		this.pixelVector = new PixelVector(this.canvas);
		this.controlVector = new PixelVector(this.canvas);//?for ShowLupa

		this.tree = new ColorTree(this);
		//?//this.tree = new ColorArea(this);

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



	gatherClasters(){//byClasters

		let rgba=[0,0,0,0];
		let iClr;

//		let aColorAreas=[], aReadyAreas=[];
//		let aColorBorders=[];
		
		for(let i=0; i</*10*/this.h; i++){
		//for(let i=190-40; i<200; i++){

			for(let j=0; j</*10*/this.w; j++){

				iClr=0;
				rgba = this.canvas.getRGB(j,i);
				let iArea=this.tree.findArea(j,i, rgba);
				if(iArea<0){//если не нашли
					iArea = this.tree.listNear.push( new ColorArea(this.tree, rgba) )-1;
				};
				this.tree.listNear[iArea].addPoint(j,i);

			};//j
			this.tree.cutNearToReady(i);
		};//i
		this.tree.cutNearToReady(this.canvas.h);

		console.log('2aReadyAreas.length='+this.tree.listReady.length);//16000 46000
		let cArea=this.tree.listReady.length;
	}//byClasters


	gatherMu(rectSend){

		function cmpVectors(v1,v2      ,i,j){


			let dlong=Math.abs(v1.colorDelta.long - v2.colorDelta.long);
			if(dlong>Math.PI)
				dlong=2*Math.PI-dlong;
			dlong*=((v1.dist + v2.dist)/2);
			let long  = (1-dlong/Math.PI);
			let lat   = (1-Math.abs(v1.colorDelta.lat - v2.colorDelta.lat)/Math.PI);

			let dangle= Math.abs(v1.angle - v2.angle);
			if(dangle>4)
				dangle=8-dangle;

			let angle = (1-dangle/4);
			let dist  = 1;//(1-Math.abs(v1.dist - v2.dist)/2);


			let res=//м.б. нужно нормализовать углы
				//Math.min(long,lat,angle,dist)
				//(long*lat*angle*dist)
				(long+lat+angle+dist)/4
			;


			if(isNaN(res)){
				console.log(i,j    ,v1,v2);
				/*
				console.log(i,j);
				console.log(v1,v2);
				console.log('long',(1-Math.abs(v1.colorDelta.long - v2.colorDelta.long)/Math.PI));
				console.log('lat',(1-Math.abs(v1.colorDelta.lat - v2.colorDelta.lat)/Math.PI));
				console.log('angle',(1-Math.abs(v1.angle - v2.angle)/4));
				console.log('dist',(1-Math.abs(v1.dist - v2.dist)/2));
				*/
			};

			return res;
		};



		this.tree.children=[];
		//let areas1=[];//=this.tree.listNear
		let areas2=[];
		let areas3=[];
		let gist = new Array(100);
		for(let i=0; i<100; i++)gist[i]=0;


		//for(let i=rectSend.top+500+100*0; i<=rectSend.top+700/*rectSend.bottom-3000*/; i++){
		for(let i=rectSend.top+3; i<=rectSend.bottom-2; i++){
			if(i%100==0)
				console.log(i,'/',rectSend.bottom-rectSend.top);
			//for(let j=rectSend.left+200+60*0; j<=rectSend.left+300/*rectSend.right-100*/; j++){
			for(let j=rectSend.left; j<=rectSend.right; j++){
				//console.log(j,'/',rectSend.left,rectSend.right);

				let cell = this.cells[i][j];
				cell.cmps=[];
				let area;
				if(this.tree.listNear.length>0){
					//area = this.tree.findNear
					//



					if(cell && cell.vectors && cell.vectors.length>=2){


						let neibList=[];

						for(let look=6; look!==2; look=PixelVector.incLook(look) ){
							//console.log('look',look);
							let i2 = i+aWindRose[look].dy;
							let j2 = j+aWindRose[look].dx;
							if(i2<0 || j2<0)continue;
							let neibCell = this.cells[i2][j2];
							if(!neibCell || !neibCell.vectors)continue;

							neibList.push({look:look, i:i2, j:j2, cell:neibCell, cmpValue:0, cmpCount:0, });

						};//look:6,7,0,1



						let cmpList=[];

						//console.log('cell.vectors.length=',cell.vectors.length);
						cell.vectors.forEach((selfVector,iSelfVector)=>{
							//вектор изменения цвета
							//vector.colorDelta.long
							//vector.colorDelta.lat
							//vector.dist
							//vector.wide
							//vector.angle
							//
							//selfVector kranz neibVector cmpValue
							//
							//kranz cmpValue
							//console.log('vectors['+iSelfVector+']:',selfVector);

							for(let iCell=0; iCell<neibList.length; iCell++){
								let neibCell=neibList[iCell].cell;
								for(let iNeibVector=0; iNeibVector<neibCell.vectors.length; iNeibVector++){
									let neibVector = neibCell.vectors[iNeibVector];

									let cmpValue = cmpVectors(selfVector,neibVector                ,i,j);
									if(!isNaN(cmpValue))//?????????????????????
									cmpList.push({
										iSelfVector:iSelfVector,
										iNeibCell:iCell,
										i:neibList[iCell].i,
										j:neibList[iCell].j,
										iNeibVector:iNeibVector,
										cmpValue:cmpValue
									});

								};
							};

						});

						//
						//let List=[];
						for(let iCmp=0; iCmp<cmpList.length; iCmp++){
							//console.log('iCmp',iCmp,'/',cmpList.length);
							let iCell=cmpList[iCmp].iNeibCell;
							neibList[iCell].cmpValue+=cmpList[iCmp].cmpValue;//??????????????
							neibList[iCell].cmpCount++;
						};
						//neibList[iCell].cmpValue/=cmpList.length;

						let maxCell=-1;
						for(let iCell=0; iCell<neibList.length; iCell++){
							if(neibList[iCell].cmpCount)
								neibList[iCell].cmpValue/=neibList[iCell].cmpCount;
							cell.cmps.push(neibList[iCell].cmpValue);
							//console.log('iCell',iCell,'/',neibList.length,'cmpValue='+neibList[iCell].cmpValue);
							let iGist = Math.round(neibList[iCell].cmpValue*100);
							if(iGist>=0 && iGist<100)gist[iGist]++;//
							if((maxCell<0 && neibList[iCell].cmpValue>0.75) ||(maxCell>-1 && neibList[maxCell].cmpValue<neibList[iCell].cmpValue))
								maxCell=iCell;
						};

						//find area by i,j
						//neibList[maxV].i
						//?????????????????
						if(maxCell<0)
							;//continue;
						else
						{
							for(let iArea=0; iArea<this.tree.listNear.length; iArea++){
								//console.log('iArea',iArea,'/',this.tree.listNear.length);
								if(this.tree.listNear[iArea].hasPoint(neibList[maxCell].j, neibList[maxCell].i)){
									//
									area=this.tree.listNear[iArea];
									break;
								};
							};
						};


					}//v.vectors
					else
						continue;


					//area - область, к которой примкнет точка i,j ввиду сходства векторов
					//все векторы должны соответствовать?
					//может ли точка примкнуть к нескольким областям, и со степенью принадлежности?


				};
				if(!area){
					//console.log('new area');
					area = new ColorArea(this.tree, this.canvas.getRGB(j,i));
					area.vectors=cell.vectors;//??????????????
					this.tree.listNear.push(area);
				};

				//нашли нужную область, и добавим в нее текущую точку
				area.addPoint(j, i);
				//console.log('area.addPoint');


			};//j
			this.tree.cutNearToReady(i);

		};//i
		this.tree.cutNearToReady(this.canvas.h);

		console.log('near areas.length=',this.tree.listNear.length);
		console.log('ready areas.length=',this.tree.listReady.length);
		
		for(let k=0; k< gist.length; k++)
			console.log(k/100+'..'+((k+1)/100),gist[k]);


		this.tree.listReady.forEach( function(area, index) {

			if(index%1000==0)
				console.log(index,'/',this.tree.listReady.length);

			let rgba = //[Math.round(Math.random()*255),Math.round(Math.random()*255),Math.round(Math.random()*255),255];
			area.color.toArray();


			for(let i=area.rect.y0; i<=area.rect.y1; i++){
			//for(let i=rectSend.top+500; i<=rectSend.top+700/*rectSend.bottom-3000*/; i++){
			//for(let i=rectSend.top+3; i<=rectSend.bottom-2; i++){

				for(let j=area.rect.x0; j<=area.rect.x1; j++){
				//for(let j=rectSend.left+200; j<=rectSend.left+500/*rectSend.right-100*/; j++){
				//for(let j=rectSend.left; j<=rectSend.right; j++){

					if(area.hasPoint(j,i)){
						//
						this.canvas.setRGB(j-rectSend.left,i,rgba);
					};


				};//j
			};//i



		}.bind(this));
		this.canvas.put();


		//в areas1 - список областей с общей направленностью векторов (включая дельту цветов)

		//потом пройти по этому списку areas1, объединяя области по принципу (неясно какому)
		//напр, по сходству цветов - от самых похожих до самых далеких - это м.б. вся иерархия
		//или сначала объединить плавные переходы
		//или еще выделять предметы примерно одного цвета


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
