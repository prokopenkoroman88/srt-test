import AreaTree from './../canvas/AreaTree.js';
import PixelColor from './../canvas/PixelColor.js';

class ColorThread extends AreaTree{
	constructor(gradientArea){
		super(gradientArea);
	}
	addChild(area, toBegin=false){
		if(toBegin)
			return this.children.unshift(area);
		else
			return this.children.push(area);
	}
}

class GradientArea extends AreaTree{
	constructor(parentArea){
		super(parentArea);
		this.equalThreads=[];//ColorThread
		this.gradThreads=[];//ColorThread
	}
	checkArea(area){
		let iEqu=-1, jEqu=-1;
		let iGrd=-1, jGrd=-1;
		if(this.children.length>0){
			if(!this.isRectCrossRect(area.rect))
				return false;

//			find or create iEqu iGrd:
			for(iEqu=0; iEqu<this.equalThreads.length; iEqu++){
				//
				for(jEqu=0; jEqu<this.equalThreads[iEqu].children.length; iEqu++){
					//
					//????  this.equalThreads[iEqu].children[jEqu] <?> area
				};
			};

			for(iGrd=0; iGrd<this.gradThreads.length; iGrd++){
				//
			};

//			iEqu=this.equalThreads.push(new ColorThread(this));
//			iGrd=this.gradThreads.push(new ColorThread(this));
			this.children.push(area);
			this.equalThreads[iEqu].addChild(area);
			this.gradThreads[iGrd].addChild(area);
			return true;
		}
		else{
			iEqu=this.equalThreads.push(new ColorThread(this));
			iGrd=this.gradThreads.push(new ColorThread(this));

			this.children.push(area);
			this.equalThreads[iEqu].addChild(area);
			this.gradThreads[iGrd].addChild(area);
			return true;
		};
		//

	}
	indicesOf(area){
		let res={
			iArea:this.children.indexOf(area),
			iEqu:-1,
			iGrd:-1,
		};
		if(res.iArea<0)return res;

		for(let iEqu=0; iEqu<this.equalThreads.length; iEqu++){
			let index = this.equalThreads[iEqu].indexOf(area);
			if(index>=0){
				res.iEqu=iEqu;
				res.jEqu=index;
				break;
			};
		};

		for(let iGrd=0; iGrd<this.gradThreads.length; iGrd++){
			let index = this.gradThreads[iGrd].indexOf(area);
			if(index>=0){
				res.iGrd=iGrd;
				res.jGrd=index;
				break;
			};
		};
		return res;
	}
}

class ColorArea extends AreaTree{
	//parent=null;
	//children=[];
	//kind:ca_None;
	constructor(parent,rgba){
		super(parent);
		this.color = new PixelColor(rgba);
	}
}

class ColorTree extends AreaTree{
	constructor(parent=null){
		super(parent);
		this.listNear=[];//aColorAreas
		this.listReady=[];//aReadyAreas
	}
	//get //

	findArea(j,i, rgba){
		let iArea=-1;
		for(let k=0; k<this.listNear.length; k++){
			if(this.isOne(this.listNear[k].color.toArray(),rgba) && this.listNear[k].isPointNear(j,i)){ //need merge
				//
				iArea=k;
			};//isOne
		};//k
	}

	cutNearToReady(bottom){
		let cArea=this.listNear.length;
		if(!cArea)return;
		for(let iArea=cArea-1; iArea>=0; iArea--){
			if(this.listNear[iArea].rect.y1 < bottom){//i or h
				//эта область уже выше просматриваемых пикселей
				this.listReady.push(this.listNear[iArea]);
				this.listNear.splice(iArea,1);
				if(this.listReady.length % 10000 == 0)
					console.log('1this.listReady.length='+this.listReady.length);
			};
		};//iArea
	}
}

export { ColorTree, ColorArea, GradientArea, ColorThread }
