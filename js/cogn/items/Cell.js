
class Cell{
	constructor(x,y){
		this.x=x;
		this.y=y;
		this.aLookData = new Array(8);
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
