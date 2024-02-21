import Arrow from './../../common/Arrow.js';
import ColorCoords from './ColorCoords.js';

class Cell{
	constructor(x,y,pixel=null){
		this.x=x;
		this.y=y;
		if(pixel){
			this.clrCoord = new ColorCoords(pixel);
		}
		this.aLookData = new Array(8);
	}

	data(look){
		if(typeof look == 'string')
			look = Arrow[look];//by world sides
		return this.aLookData[look%8];
	}

	addBridge(bridge){
		if(!this.bridges)
			this.bridges=[];
		this.bridges.push(bridge);
	}

	addVector(vector){
		if(!this.vectors)
			this.vectors=[];
		this.vectors.push(vector);
	}

	setMu(name,value){
		if(!this.mu)
			this.mu={};
		value=Math.max(0,Math.min(1,value));
		this.mu[name]=value;

	}

}

export default Cell;
