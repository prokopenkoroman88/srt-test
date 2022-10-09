
class AreaItem{
	count=0;

	static bitToNumber(num){
		return 1n << BigInt(num);
	}




	static coordsToBitNum(x,y){
		return y*8+x;
	}

	static bitNumToCoords(num){
		return {x: num % 8, y:Math.floor(num/8),};
	}





}


class AreaItem1 extends AreaItem{//8*8

	constructor(){
		super();
		this.data = new BigUint64Array([0n])[0];
	}




	

	getBit(num){
		return (BigInt(this.data & AreaItem.bitToNumber(num)) != 0n);
	}


	setBit(num){
		this.data |= AreaItem.bitToNumber(num);
	}



	resetBit(num){
		//console.log('data before sub 0x'+this.data.toString(16));
		//this.data &= BigInt( !AreaItem.bitToNumber(num));
		this.data -= AreaItem.bitToNumber(num);
		//console.log('data after  sub 0x'+this.data.toString(16));
	}

	getCount(){

		const aBitCount=[0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4];
		let res=0;
		let data = BigInt( this.data );
		for(let i=0; i<16; i++ ){

			let tetr = Number(data & 15n);
			res+=aBitCount[tetr];
			data = BigInt(data / 16n);

		};
		return res;
	}



/*

		//parseInt('',16)  для чисел больше 6 байт - работает нечетко в младших разрядах
		this.areaTree.item1.data[0] = BigInt( parseInt('ff345678',16)) <<32n | BigInt( parseInt('ff987654',16)) ;//123456789123456789n;
		console.log( this.areaTree.item1.data[0].toString(16) );
		this.areaTree.item1.data[0] = this.areaTree.item1.data[0] - 3n;
		console.log( this.areaTree.item1.data[0].toString(16) );


		this.areaTree.item1.data[0] = BigInt( parseInt('f000000000000',16));//123456789123456789n;
		console.log( this.areaTree.item1.data[0].toString(16) );		
		
		this.areaTree.item2.data[0] = BigInt( Math.pow(2,17) ) + BigInt( Math.pow(2,27) )   ;//123456789123456789n;
		console.log( this.areaTree.item2.data[0] );	

		this.areaTree.item1.data[0] = this.areaTree.item1.data[0] | this.areaTree.item2.data[0];
		console.log( this.areaTree.item1.data[0] );	
		console.log( this.areaTree.item1.data[0].toString(16)+'h' );	

*/



}


class AreaItem2 extends AreaItem{//64*64

	constructor(parent){
		super();
		this.a = new Uint8Array(8*8);
		this.list=[parent];//of AreaItem1
	}

	getTop(){
		return this.list[0];
	}

	getLevel(){
		let lvl=3;

		let item=null;

		if(this.getTop)
			item=this.getTop();
		while (item) {
			item = item.getTop();
			lvl--;
		};

		return lvl;
	}


	getCellIndex(x,y=0){
		let index=AreaItem.coordsToBitNum(x,y);
		return this.a[index];
	}


	getCell(x,y=0){
		let li=this.getCellIndex(x,y);
		if(li<1)
			return null
		else
			return this.list[li];
	}

	getCellAnyWay(x,y=0){
		let index=AreaItem.coordsToBitNum(x,y);
		let li=this.a[index];//let li=this.getCellIndex(x,y);
		let cell;
				if(!li){
					/*
					if(this.getLevel()==1)
						cell = new AreaItem1()//(this)
					else
						cell = new AreaItem2(this);
					li = this.list.push(cell)-1;
					this.a[index] = li;
					*/
					li = this.addCell(index);
				};
				cell = this.list[li];

		return cell;
	}

	addCell(x,y=0){
		let index=AreaItem.coordsToBitNum(x,y);
		let cell;
		if(this.getLevel()==1)
			cell = new AreaItem1()//(this)
		else
			cell = new AreaItem2(this);
		let li = this.list.push(cell)-1;
		this.a[index] = li;
		return li;//listIndex
	}



}







export default class AreaTree{

	aCoords=[{},{},{},{}];//координаты точки на каждом уровне
	rect={x0:32000,y0:32000, x1:-1,y1:-1};
	count=0;

	constructor(parent=null){
		this.tree = new AreaItem2(null);//(this);
		this.parent=parent;
		this.children=[];
	}


	prepareCoords(x,y){
		for(let i=0; i<4; i++){
			this.aCoords[i].x = (x >> (i*3)) & 7;
			this.aCoords[i].y = (y >> (i*3)) & 7;
		};//i++		
	}


	hasPoint(x,y){
		this.prepareCoords(x,y);



		let currItem=this.tree;
		for(let lvl=3; lvl>=0; lvl--){
			//

			let index = AreaItem.coordsToBitNum(this.aCoords[lvl].x, this.aCoords[lvl].y);
			

			if(lvl==0 && currItem.getCount()>0){ // d.b. currItem.count>0!!!!!
				return currItem.getBit(index);
				break;
			};


			//if(lvl==0)return false;
			let li;
			try {
				li=currItem.a[index];
			} catch(e) {
				// statements
				console.log(e);
				console.log('lvl='+lvl+ ' index='+index+' x='+x+' y='+y);
				console.log(
					this.aCoords[0].x,this.aCoords[0].y, 
					this.aCoords[1].x,this.aCoords[1].y, 
					this.aCoords[2].x,this.aCoords[2].y,       
					this.aCoords[3].x,this.aCoords[3].y,
					);
				console.log(currItem);
			}
			

			this.aCoords[lvl].li=li;//+
			let item;
			if(!li) break;

			item = currItem.list[li];
			currItem = item;

		};//lvl--

		return false;

	}


	addPoint(x,y){
		this.prepareCoords(x,y);

		if(x<this.rect.x0) this.rect.x0=x;
		if(x>this.rect.x1) this.rect.x1=x;
		if(y<this.rect.y0) this.rect.y0=y;
		if(y>this.rect.y1) this.rect.y1=y;



		let currItem=this.tree;
		for(let lvl=3; lvl>=0; lvl--){
			//

			let index = AreaItem.coordsToBitNum(this.aCoords[lvl].x, this.aCoords[lvl].y);
			//console.log('lvl='+lvl+' index='+index);


			if(lvl==0 && currItem.count<64){
				//console.log(' before c='+currItem.count+'  d='+currItem.data.toString(16));
				currItem.setBit(index);
				currItem.count++;
				this.count++;//
				//console.log(' after c='+currItem.count+'  d='+currItem.data.toString(16))
				break;
			};


			let li=currItem.a[index];
			let item;
			if(!li){
				if(lvl==1)
					item = new AreaItem1()//(currItem)
				else
					item = new AreaItem2(currItem);
				li = currItem.list.push(item)-1;
				currItem.a[index] = li;
			};
			this.aCoords[lvl].li=li;//+
			item = currItem.list[li];
			currItem = item;

		};//lvl--
		
	}

	subPoint(x,y){
		this.prepareCoords(x,y);



		let currItem=this.tree;
		for(let lvl=3; lvl>=0; lvl--){
			//

			let index = AreaItem.coordsToBitNum(this.aCoords[lvl].x, this.aCoords[lvl].y);
			

			if(lvl==0 && currItem.count>0){
				currItem.resetBit(index);
				currItem.count--;
				this.count--;
				//clear items with null count   !!!?????????
				break;
			};


			let li=currItem.a[index];
			this.aCoords[lvl].li=li;//+
			let item;
			if(!li) break;

			item = currItem.list[li];
			currItem = item;

		};//lvl--

/*
		if(x==this.rect.x0) ?//this.rect.x0=x;
		if(x==this.rect.x1) ?//this.rect.x1=x;
		if(y==this.rect.y0) ?//this.rect.y0=y;
		if(y==this.rect.y1) ?//this.rect.y1=y;
*/


	}


	isPointNear(x,y){
		if(x<this.rect.x0-1 || y<this.rect.y0-1 || x>this.rect.x1+1 || y>this.rect.y1+1 ) return false;


		for(let dy=-1; dy<=1; dy++)
		for(let dx=-1; dx<=1; dx++)
		{
			let res = this.hasPoint(x+dx,y+dy);
			if(res) return res;
		};
		return false;
	}


	isPointInRect(x,y){
		return (this.rect.x0<=x)&&(x<=this.rect.x1)&&(this.rect.y0<=y)&&(y<=this.rect.y1);
	}


	isRectCrossRect(rect){
		return ((this.rect.x0<=rect.x1)||(rect.x0<=this.rect.x1))&&((this.rect.y0<=rect.y1)||(rect.y0<=this.rect.y1));
	}


	isRectInRect(rect){
		return (this.rect.x0<=rect.x0)&&(rect.x1<=this.rect.x1)&&(this.rect.y0<=rect.y0)&&(rect.y1<=this.rect.y1);
	}


	addArea(area){


		if(area.rect.x0<this.rect.x0) this.rect.x0=area.rect.x0;
		if(area.rect.x1>this.rect.x1) this.rect.x1=area.rect.x1;
		if(area.rect.y0<this.rect.y0) this.rect.y0=area.rect.y0;
		if(area.rect.y1>this.rect.y1) this.rect.y1=area.rect.y1;


		let ourItem=this.tree;
		let otherItem=area.tree;

		let ourLevel=3, otherLvl=3;
		//???


		function obhod(level, ourItem, otherItem){

			if(level==0){
				ourItem.data = BigInt(ourItem.data | otherItem.data);
				return;
			}

			for(let index=0; index<64; index++){
				//
				if(otherItem.a[index]<1)continue;


				let item = ourItem.getCellAnyWay(index);
				/*
				let li=ourItem.a[index];
				let item;
				if(!li){
					if(lvl==1)
						item = new AreaItem1()//(ourItem)
					else
						item = new AreaItem2(ourItem);
					li = ourItem.list.push(item)-1;
					ourItem.a[index] = li;
				};
				item = ourItem.list[li];
				*/
				//obhod(level-1, item, otherItem.list[ otherItem.a[index] ] );//recursia
				obhod(level-1, item, otherItem.getCell(index) );//recursia

			};//index

		};//func

		obhod(3, ourItem, otherItem);

		this.count+=area.count;

	}

	pointInChild(x,y){
		for(let i=0; i<this.children.length; i++){
			if(this.children[i].hasPoint(x, y)){
				return i;
			};
		};
		return -1;//если точки у потомков нет
	}

}