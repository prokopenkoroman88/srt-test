import Arrow from './../common/Arrow.js';
import { PixelVector } from './PixelVector.js';
import CustomAnalyzer from './CustomAnalyzer.js';
import ColorCoords from './items/ColorCoords.js';
import ColorDelta from './items/ColorDelta.js';
import { ColorTree, ColorArea, GradientArea, ColorThread } from './ColorArea.js';


class Vectorizer extends CustomAnalyzer{
	constructor(canvas){
		super(canvas);

		this.pixelVector = new PixelVector(this.canvas);
		this.controlVector = new PixelVector(this.canvas);//?for ShowLupa

		this.tree = new ColorTree(this);
		//?//this.tree = new ColorArea(this);

	}

	createCell(x,y){
		let cell = super.createCell(x,y);
		let pixel = this.canvas.getPixel(x,y);
		//cell.clrCoord = pixel.getColorCoords();
		cell.clrCoord = new ColorCoords(pixel);
		return cell;
	}//overrided

	createLookData(cell,look){
		let neibCell = this.getNeibCell(cell.y, cell.x, look);
		if(neibCell)
			return {
				clrCoord:neibCell.clrCoord,
			};
	}//overrided

	calcMu(rectSend){
		this.rectSend = rectSend;

		console.log('SCAN pixels:');
		this.stretchRect(this.rectSend,1);//expand
		this.onSendPixels((i,j,cell)=>{});

		console.log('CALC vectors:');
		this.stretchRect(this.rectSend,-1);//narrow
		let aClrCoord = new Array(8);
		this.pixelVector.initRoundArrays(8);
		this.onSendPixels(((i,j,cell)=>{
			let emptyCell=false;
			this.onCellLooks(cell,((cell,look,lookData)=>{
				if(!lookData){ emptyCell=true; return; };
				aClrCoord[look] = lookData.clrCoord;
			}).bind(this));
			if(emptyCell) return;
			this.pixelVector.calcCellVectors(aClrCoord, cell);
		}).bind(this));
/*
		for(let i=rectSend.top; i<=rectSend.bottom; i++){

				
			if(i%100==0)console.log(i,'/',rectSend.bottom-rectSend.top);
			this.pixelVector.init(rectSend.left-1,i);//!//rectSend.top+

			for(let j=rectSend.left; j<=rectSend.right; j++){
				this.pixelVector.nextStep();
				this.cells[i][j] = this.pixelVector.calcCellVectors();
				this.cells[i][j].x=j;
				this.cells[i][j].y=i;

			};//j
		};//i
//*/
	}

	gatherClasters(){//byClasters
		let rgba=[0,0,0,0];
		let iClr;

		for(let i=0; i<this.h; i++){
			for(let j=0; j<this.w; j++){
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

	onGatherTree(prepareCell,findArea,prepareArea){
		for(let i=this.rectSend.top+3; i<=this.rectSend.bottom-2; i++){
			if(i%100==0)
				console.log(i,'/',this.rectSend.bottom-this.rectSend.top);
			for(let j=this.rectSend.left; j<=this.rectSend.right; j++){
				//console.log(j,'/',rectSend.left,rectSend.right);
				let cell = this.cells[i][j];
				prepareCell(i,j,cell);
				let area;
				if(this.tree.listNear.length>0){
					//area = this.tree.findNear
					area = findArea(i,j,cell,this.tree);
				};
				if(!area){
					console.log('new area', this.tree.listNear.length);
					area = new ColorArea(this.tree, this.canvas.getRGB(j,i));
					prepareArea(area,cell);
					this.tree.listNear.push(area);
				};
				//нашли нужную область, и добавим в нее текущую точку
				area.addPoint(j, i);
				//console.log('addPoint(',j,i,') area.rect=',area.rect);
				//console.log('area.addPoint');
			};//j
			this.tree.cutNearToReady(i);
		};//i
		this.tree.cutNearToReady(this.canvas.h);

		console.log('near areas.length=',this.tree.listNear.length);
		console.log('ready areas.length=',this.tree.listReady.length);
	}

	getNeibCellList(i,j,startLook=0,finishLook=7){
		let neibList=[];
		for(let look=startLook; look!==finishLook; look=Arrow.incLook(look) ){
			let neibCell = this.getNeibCell(i,j,look);
			if(!neibCell || !neibCell.vectors)continue;
			neibList.push({look:look, i:neibCell.y, j:neibCell.x, cell:neibCell, cmpValue:0, cmpCount:0, });
		};//look:6,7,0,1
		return neibList;
	}

	gatherMu(rectSend){
		//this.setScale(rectSend,rectDest);
		this.rectSend=rectSend;

		this.onSendPixels(((i,j,cell)=>{
			if(!(cell && cell.vectors && cell.vectors.length>=2))return;

			//neighboring cells with vectors
			let neibList=this.getNeibCellList(i,j, 6,2);

			//list of comparisons of the vectors of this cell with the vectors of all neighboring cells
			let cmpList=[];

			//console.log('cell.vectors.length=',cell.vectors.length);
			cell.vectors.forEach((selfVector, iSelfVector)=>{
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
				neibList.forEach((neibCell, iCell)=>{
					//console.log(neibCell,iCell);
					if(!neibCell.cell.vectors)return;
					neibCell.cell.vectors.forEach((neibVector, iNeibVector)=>{
						// statements
						let cmpValue = PixelVector.compareVectors(selfVector,neibVector                ,i,j);
						if(!isNaN(cmpValue))//?????????????????????
						cmpList.push({
							iSelfVector:iSelfVector,
							iNeibCell:iCell,
							look:neibList[iCell].look,
							i:neibList[iCell].i,
							j:neibList[iCell].j,
							iNeibVector:iNeibVector,
							cmpValue:cmpValue
						});
					});
				});
			});
			//analyz
			// одинаковые, последовательно, параллельно,

			//console.log(cmpList);
			cmpList.forEach((cmp)=>{
				//
				//i, j               cmp.i, cmp.j
				//cell               neibCell = neibList[cmp.iNeibCell].cell
				//cmp.iSelfVector    cmp.iNeibVector
				//cell.vectors[]     neibCell.vectors[]
				//         cmp.cmpValue
				//console.log(cmp);
				if(cmp.cmpValue<0.5)return;

				let selfCell = cell;
				let neibCell = neibList[cmp.iNeibCell].cell;
				let selfVector = cell.vectors[cmp.iSelfVector];
				let neibVector = neibCell.vectors[cmp.iNeibVector];
				let selfLook = cmp.look;
				let neibLook = Arrow.incLook(cmp.look,4);
				let selfAngle = Arrow.angleByLook(selfLook);
				let neibAngle = Arrow.angleByLook(neibLook);
				let selfVectorangle = Arrow.angleByLook(selfVector.angle);
				let neibVectorangle = Arrow.angleByLook(neibVector.angle);

				//положение двух векторов
				let deltaVectorAngle = neibVectorangle - selfVectorangle;
				if(Math.abs(deltaVectorAngle)>Math.PI)
					deltaVectorAngle=2*Math.PI - Math.abs(deltaVectorAngle);

				//положение соседней ячейки относительно текущего вектора
				let deltaAngle = selfAngle - selfVectorangle;
				if(Math.abs(deltaAngle)>Math.PI)
					deltaAngle=2*Math.PI - Math.abs(deltaAngle);

//				deltaAngle = deltaAngle-neibVectorangle;
//				if(Math.abs(deltaAngle)>Math.PI)
//					deltaAngle=2*Math.PI - Math.abs(deltaAngle);

				let coefDelta = PixelVector.gaussian(deltaVectorAngle,1,0,1);
				let coefSerial = PixelVector.gaussian(deltaAngle,1,0,1);
				let coefParallel = PixelVector.gaussian(Math.PI/2-Math.abs(deltaAngle),1,0,1);

				let mu_Serial = coefDelta*coefSerial;
				let mu_Parallel = coefDelta*coefParallel;
				//let mu_Serial = PixelVector.gaussian(deltaAngle,1,0,1);
				//let mu_Parallel = PixelVector.gaussian(Math.PI/2-Math.abs(deltaAngle),1,0,1);

				if(mu_Serial<0.5 && mu_Parallel<0.5)return;
				//console.log(i,j,'to',cmp.i,cmp.j,'[',cmp.iSelfVector,cmp.iNeibVector,'] angles',selfVectorangle.toFixed(2) ,selfAngle.toFixed(2) ,'coefDelta',coefDelta.toFixed(2) ,'serial',mu_Serial.toFixed(2) ,' paral',mu_Parallel.toFixed(2) );
				let param = {
					cmpValue:cmp.cmpValue,
					mu_Serial:mu_Serial,
					mu_Parallel:mu_Parallel
				};
				//console.log('cmp='+param.cmpValue.toFixed(2),'serial='+param.mu_Serial.toFixed(2),'paral='+param.mu_Parallel.toFixed(2));
				if(!selfVector.links)
					selfVector.links = [];
				selfVector.links.push({vector:neibVector, param:param});
				if(!neibVector.links)
					neibVector.links = [];
				neibVector.links.push({vector:selfVector, param:param});

//         selfCell
//               \
//            selfVector.angle


//                                 selfAngle
//                                        \
//                                       neibCell
//
			});
		}).bind(this));
		//cell[i][j].vector.links[0].vector.cell.x

		//gather areas by cells vectors:
		this.onGatherTree(
			(i,j,cell)=>{
				cell.cmps=[];
			},
			((i,j,cell,tree)=>{
					let area, cmpValue=0;
					if(cell && cell.vectors && cell.vectors.length>=2){
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

							if(selfVector.links){
								//console.log(selfVector.links);
								selfVector.links.forEach((link, iLink)=>{
									let param = link.param;
									//if(param.mu_Parallel<0.250075)return;
									//if(param.mu_Serial<0.50075)return;
									if(param.mu_Serial<0.5 && param.mu_Parallel<0.5)return;
									if(area && param.cmpValue<cmpValue)return;
									let neibVector = link.vector;
									let neibCell = neibVector.cell;
									//console.log(neibCell);
									tree.listNear.forEach( function(nearArea, iArea) {
										//console.log('hasPoint', neibCell.x, neibCell.y, nearArea);
										if(nearArea.hasPoint(neibCell.x, neibCell.y)){
											area = nearArea;
											cmpValue = param.cmpValue;
											//console.log(area);
										};
									});
								});
							}//
						});//cell.vectors
					};
					//area - область, к которой примкнет точка i,j ввиду сходства векторов
					//все векторы должны соответствовать?
					//может ли точка примкнуть к нескольким областям, и со степенью принадлежности?

					//console.log(area);
					return area;//!!!
			}).bind(this),
			(area,cell)=>{area.vectors=cell.vectors;}
		);//onGatherTree

		//print areas:
		this.tree.listReady.forEach( function(area, index) {
			if(index%1000==0)
				console.log(index,'/',this.tree.listReady.length);
			let rgba = area.color.toArray();
			console.log(index, area);
			for(let i=area.rect.y0; i<=area.rect.y1; i++){
				for(let j=area.rect.x0; j<=area.rect.x1; j++){
					if(area.hasPoint(j,i)){
						this.canvas.setRGB(j-rectSend.left,i,rgba);
					};
				};//j
			};//i
		}.bind(this));
		this.canvas.put();

		console.log(this.rectSend);
		console.log('h=',this.rectSend.bottom-this.rectSend.top, 'w=',this.rectSend.right-this.rectSend.left, 'w*h=',
		  (this.rectSend.bottom-this.rectSend.top)*(this.rectSend.right-this.rectSend.left)  );

		//в areas1 - список областей с общей направленностью векторов (включая дельту цветов)

		//потом пройти по этому списку areas1, объединяя области по принципу (неясно какому)
		//напр, по сходству цветов - от самых похожих до самых далеких - это м.б. вся иерархия
		//или сначала объединить плавные переходы
		//или еще выделять предметы примерно одного цвета
	}//gatherMu

	showMu(rectSend,rectDest){
		this.setScale(rectSend,rectDest);
		this.onSendPixels(function(i,j,cell){
			let rgba2=[0,0,0,255];
			if(i%100==0)console.log(i);
				//rgba2 = this.pixelVector.getRGB(0,0);
				{
					rgba2[0] = Math.round(cell.mu.grd*cell.gradDist*250);
					rgba2[1] = Math.round(cell.mu.equ*250);
					rgba2[2] = 0;
				};
				//console.log(i,j,rgba2);
				this.canvas.setRGB(this.rectDest.left+j-this.rectSend.left, this.rectDest.top+i-this.rectSend.top, rgba2);
		}.bind(this));
		this.canvas.put();
	}








}

export default Vectorizer;
