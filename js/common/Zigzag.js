
const cBtm=0, cUp=1, cTop=2, cDn=3, cNone=4;

class ExtremumList{

	constructor(){
		this.list=[];
	}

	add(start,kind,value){
		//console.log('Zigzag.add(',start,kind,')',this.list);
		let item={
			start:start,
			count:1,
			kind:kind,
			minValue:value,//?//this.arr[start],
			maxValue:value,//?//this.arr[start],
		};
		return this.list.push(item)-1;
	}

	checkKind(zLast,zCurr){
				if(this.list[zLast].kind==cDn && this.list[zCurr].kind==cUp)
					this.list[zLast].kind=cBtm;
				if(this.list[zLast].kind==cUp && this.list[zCurr].kind==cDn)
					this.list[zLast].kind=cTop;
	}

	wrap(){
		for(let z=this.list.length-1; z>0; z--){
			//слияние схожих по направлению участков:
			if((this.list[z].kind==cDn && this.list[z-1].kind==cDn) || (this.list[z].kind==cUp && this.list[z-1].kind==cUp)){
				this.list[z-1].minValue = Math.min(this.list[z-1].minValue,this.list[z].minValue);
				this.list[z-1].maxValue = Math.max(this.list[z-1].maxValue,this.list[z].maxValue);
				this.list[z-1].count+=this.list[z].count;
				this.list.splice(z, 1);
			};
		};
	}

	checkLastKind(zCurr){
		if(this.list[zCurr].kind==cUp)
			this.list[zCurr].kind=cTop;//before cBtm at [0]
	}

}


class Zigzag{

	constructor(compare=null){
		this.value_list = [];
		this.extr_list = new ExtremumList();
		if(compare)
			this.compare=compare;
	}

	compare(item1,item2){return (item2-item1).toFixed(3)}

	putArray(values,cmpFunc){//array of numbers
		this.value_list=values;
		let c=this.value_list.length;

		let iMin=this.findMinIndex();//индекс минимального значения

		this.extr_list.list=[];//массив секторов с цветовыми расстояниями от цветовых координат центрального пикселя
		let iLast=iMin;
		let zCurr=this.add(iLast, cBtm), zLast=-1;//z=Zigzag

		for(let i0=iMin+1; i0<c+iMin; i0++){
			let iCurr=i0 % c;//т.к. м.б. i0>8
			let delta = this.compare((this.value_list[iCurr]), (this.value_list[iLast]));

			if(delta==0)
				this.extr_list.list[zCurr].count++;
			else
			{
				zLast=zCurr;
				zCurr=this.add(iCurr, delta>0?cUp:cDn);
				this.extr_list.checkKind(zLast,zCurr);
			};//delta<>0

			iLast=iCurr;
		};//i0
		this.extr_list.checkLastKind(zCurr);

		this.extr_list.wrap();//cUp cDn

		this.initMinMax();
	}

	findMinIndex(){
		let c=this.value_list.length;
		let iMin=0;
		for(let i=1; i<c; i++){
			if(this.compare((this.value_list[i]),(this.value_list[iMin]))<0)
				iMin=i;
		};
		return iMin;
	}

	add(start,kind){
		return this.extr_list.add(start,kind,this.value_list[start]);
	}

	initMinMax(){
		this.aMin=[];
		this.aMax=[];
		this.extr_list.list.forEach( function(item, index) {
			if(item.kind==cBtm)
				this.aMin.push(index);
			if(item.kind==cTop)
				this.aMax.push(index);
		},this);
	}


	getMin(index){
		index = index % this.aMin.length;
		return this.extr_list.list[this.aMin[index]];
	}

	getMax(index){
		index = index % this.aMax.length;
		return this.extr_list.list[this.aMax[index]];
	}

	getMinItem(index){
		return this.value_list[this.getMin(index)];
	}

	getMaxItem(index){
		return this.value_list[this.getMax(index)];
	}


	getBounds(extremum0,extremum1){//between extremums
		return{
			startBound :extremum0.start + extremum0.count-1,//z0
			finishBound:extremum1.start,//z1
			//z0 & z1 - направления розы ветров, где мосты, между мостами - крылья градиента
		};
	}

	getHighBounds(index){//between mins
		let extremum0 = this.getMin(index);
		let extremum1 = this.getMin(index+1);
		return this.getBounds(extremum0,extremum1);
	}

	getLowBounds(index){//between maxs
		let extremum0 = this.getMax(index);
		let extremum1 = this.getMax(index+1);
		return this.getBounds(extremum0,extremum1); //indices of .value_list :    end of max(index)   begin of max(index+1)
	}

}

export default Zigzag;
