import Arrow from './../common/Arrow.js';
import Zigzag from './../common/Zigzag.js';
import CustomCanvas from './../canvas/CustomCanvas.js';
//import VirtualCanvas from './../canvas/VirtualCanvas.js';
//import RealCanvas from './../canvas/RealCanvas.js';
import Cell from './items/Cell.js';
import Hill from './items/Hill.js';
import ColorDelta from './items/ColorDelta.js';
import Vector from './items/Vector.js';
import PixelColor from './../canvas/PixelColor.js';



const ca_None=0,ca_Equal=1,ca_Grad=2,ca_I=3,ca_Y=4,ca_X=5,ca_Dot=6,ca_Bunt=7;


class PixelVector{//+9.2.22


	constructor(canvas){
		//
		this.cnv=canvas;

		//какие цвета окружают с 8-ми сторон текущую точку [j,i]
		this.a9Pxl=[[null,null,null],[null,null,null],[null,null,null]];

		this.zigzag = new Zigzag( ((item1,item2)=>{return (item2-item1).toFixed(3)}) );

	}

	fill(x,y)//init(this.x0+0, this.y0+i)
	{
		this.x=x;//=-1
		this.y=y;
		let rgba;
			//a9Pxl:
			for(let i1=0; i1<=2; i1++){
				for(let j1=0; j1<=2; j1++)
					delete this.a9Pxl[i1][j1];
				for(let j1=0/*!!!*/; j1<=2; j1++){
					rgba=this.cnv.getRGB(this.x+(j1-1), this.y+(i1-1));//с учетом смещения для 8 окружающих пикселей

					this.a9Pxl[i1][j1] = new PixelColor(rgba);
				};//j1
			};//i1
	}

	init(x,y)//init(this.x0+0, this.y0+i)
	{
		this.x=x;//=-1
		this.y=y;
		let rgba;
			//a9Pxl:
			for(let i1=0; i1<=2; i1++){
				for(let j1=0; j1<=2; j1++)
					delete this.a9Pxl[i1][j1];
				for(let j1=1; j1<=2; j1++){
					rgba=this.cnv.getRGB(this.x+(j1-1), this.y+(i1-1));//с учетом смещения для 8 окружающих пикселей

					this.a9Pxl[i1][j1] = new PixelColor(rgba);
				};//j1
			};//i1
	}


	nextStep(){
		this.x++;
		//какие цвета окружают с 8-ми сторон следующую точку [j,i]
		let rgba;
				//a9Pxl:
				for(let i1=0; i1<=2; i1++){
					delete this.a9Pxl[i1][0];
					for(let j1=1; j1<=2; j1++){
						this.a9Pxl[i1][j1-1] = this.a9Pxl[i1][j1];
					};//j1
					rgba=this.cnv.getRGB(this.x+1, this.y+(i1-1));//с учетом смещения для 8 окружающих пикселей
					this.a9Pxl[i1][2] = new PixelColor(rgba);
				};//i1


	}

	getColor(dx,dy){
		return this.a9Pxl[dy+1][dx+1];//PixelColor
	}

	getRGB(dx,dy){
		return this.getColor(dx,dy).toArray();
	}

	static dist(d1,d2){
		return Math.sqrt( Math.pow(d1.x-d2.x,2) + Math.pow(d1.y-d2.y,2) + Math.pow(d1.z-d2.z,2) );
	}

	static angle(d1,d2){
/*
		let longitude=Math.atan2(d2.y-d1.y, d2.x-d1.x);//долгота оттенок
		let latitude =Math.atan2(d2.z-d1.z, Math.sqrt( Math.pow(d2.x-d1.x,2) + Math.pow(d2.y-d1.y,2) ) );//широта  яркость
		return {lat:latitude, long:longitude};
*/
		return new ColorDelta(d1,d2);
	}

	static gaussian(x, a=1, b=0, c=1){
		return a*Math.exp(-((x-b)*(x-b))/(2*c*c));
	}

	initRoundArrays(sectorsCount=8){
		this.sectorsCount = sectorsCount;
		this.aClrCoord = new Array(sectorsCount);//[0..1]
		this.aClrDist = new Array(sectorsCount);//[0..1]
		this.aClrAngle = new Array(sectorsCount);
	}

	createClrCoord(){
		let aClrCoord = new Array(9);//[0..1]
		for(let i=0; i<=8; i++){
			let step = Arrow.step(i);
			aClrCoord[i]= this.getColor(step.dx, step.dy).getColorCoords();
		}
		return aClrCoord;
	}

	createClrDist(aClrCoord){
		let currClrCoord = aClrCoord[8];//by aWindRose[8]
		let aClrDist = new Array(8);//[0..1]
		for(let i=0; i<8; i++)
			aClrDist[i]=PixelVector.dist(currClrCoord, aClrCoord[i]);
		return aClrDist;
	}

	createClrAngle(aClrCoord){
		let currClrCoord = aClrCoord[8];//by aWindRose[8]
		let aClrAngle = new Array(8);
		for(let i=0; i<8; i++)
			aClrAngle[i]=PixelVector.angle(currClrCoord, aClrCoord[i]);
		return aClrAngle
	}

	calcMu_EqualByMaxDist(aClrDist){
		let maxDist=0;
		aClrDist.forEach( dist=>{
			maxDist = Math.max(maxDist, dist);
		});
		let mu_Equal = (2-maxDist)/2;
		return mu_Equal;
	}

	calcMu_EqualByDistMediana(aClrDist){

		let aDistMediana = aClrDist.map((element)=>{return element;});
		
		aDistMediana.sort(function(a,b){ return a-b; });
		//8..1 = 9*4 = 36
		let mu_Equal=0;
		for(let i=0; i<8; i++){
			mu_Equal += (aDistMediana[i]*(8-i));
		};
		//console.log(aClrDist);
		//console.log(aDistMediana);
		//console.log('mu_Equal1='+mu_Equal);
		mu_Equal = PixelVector.gaussian(mu_Equal/36,1,0,0.05);//1-(mu_Equal/36);//mu_Noise
		//console.log('mu_Equal2='+mu_Equal);
		return mu_Equal;
	}//calcMu_EqualByDistMediana

	createDistZigzag(aClrDist){

		this.zigzag.putArray(aClrDist);
		return this.zigzag.extr_list;
/*
		let iMinDist=0;
		for(let i=1; i<8; i++){
			if(aClrDist[i]<aClrDist[iMinDist])
				iMinDist=i;
		};


		let aDistZigzag=[];//массив секторов с цветовыми расстояниями от цветовых координат центрального пикселя
		let iLast=iMinDist;
		let zCurr=aDistZigzag.push({start:iLast, count:1, kind:cBtm, minValue:aClrDist[iMinDist], maxValue:aClrDist[iMinDist]})-1, zLast=-1;//z=Zigzag
		for(let i0=iMinDist+1; i0<8+iMinDist; i0++){
			let iCurr=i0 % 8;//т.к. м.б. i0>8
			let delta = Math.round((aClrDist[iCurr] - aClrDist[iLast])*1000)/1000;

			if(delta==0)
				aDistZigzag[zCurr].count++;
			else
			{
				zLast=zCurr;
				zCurr=aDistZigzag.push({start:iCurr, count:1, kind:delta>0?cUp:cDn, minValue:aClrDist[iCurr], maxValue:aClrDist[iCurr]})-1;

				if(aDistZigzag[zLast].kind==cDn && aDistZigzag[zCurr].kind==cUp)
					aDistZigzag[zLast].kind=cBtm;
				if(aDistZigzag[zLast].kind==cUp && aDistZigzag[zCurr].kind==cDn)
					aDistZigzag[zLast].kind=cTop;
			};//delta<>0

			iLast=iCurr;
		};//i0
		if(aDistZigzag[zCurr].kind==cUp)
			aDistZigzag[zCurr].kind=cTop;//before cBtm at [0]

		for(let z=aDistZigzag.length-1; z>0; z--){
			//слияние схожих по направлению участков:
			if((aDistZigzag[z].kind==cDn && aDistZigzag[z-1].kind==cDn) || (aDistZigzag[z].kind==cUp && aDistZigzag[z-1].kind==cUp)){
				aDistZigzag[z-1].minValue = Math.min(aDistZigzag[z-1].minValue,aDistZigzag[z].minValue);
				aDistZigzag[z-1].maxValue = Math.max(aDistZigzag[z-1].maxValue,aDistZigzag[z].maxValue);
				aDistZigzag[z-1].count+=aDistZigzag[z].count;
				aDistZigzag.splice(z, 1);
			};
		};

		//for(let z=0; z<aDistZigzag.length; z++)
			//console.log(aDistZigzag[z]);
		return aDistZigzag;
//*/
	}//createDistZigzag

	createMinDist(aDistZigzag=null){
/*
		let aMinDist=[];
		if(!aDistZigzag)
			aDistZigzag=this.aDistZigzag;
		for(let z=0; z<aDistZigzag.length; z++)
			if(aDistZigzag[z].kind==cBtm)
				aMinDist.push(z);		
		return aMinDist;
*/
	}

	getBridge(iBridge){
/*
		iBridge = iBridge % this.aMinDist.length;
		return this.aDistZigzag[this.aMinDist[iBridge]];
*/
		return this.zigzag.getMin(iBridge);
	}

	getSide(iSide){
		let bridge0 = this.getBridge(iSide);
		let bridge1 = this.getBridge(iSide+1);
		return{
			z0:bridge0.start + bridge0.count-1,
			z1:bridge1.start,
			//z0 & z1 - направления розы ветров, где мосты, между мостами - крылья градиента
		};
	}

	prepareBoundsToLook(bounds){//zigzag to looks
		let coeff = 1;//8/this.sectorsCount;
		return {
			startBound  : coeff*bounds.startBound,
			finishBound : coeff*bounds.finishBound,
		};
	}

	prepareSides(aClrAngle, aClrDist){
		this.sides=[];
		let sideCount=this.aMinDist.length;
		if(sideCount<2)
			return sideCount;

		sideCount=this.zigzag.aMin.length;
		this.sides = new Array(sideCount);

		for(let iSide=0; iSide<sideCount; iSide++){
			//this.sides[iSide] = this.getSide(iSide);
			let side = new Hill();
			side.bounds = this.prepareBoundsToLook( this.zigzag.getLowBounds(iSide) );
			side.prepare(aClrAngle, aClrDist);
			this.sides[iSide] =	side;
		};//for iSide
/*
			this.avgAngle=new Array(sideCount);
			this.skoAngle=new Array(sideCount);
			this.avgDist =new Array(sideCount);
			this.sides = new Array(sideCount);
			for(let iSide=0; iSide<sideCount; iSide++){
				this.sides[iSide] = this.getSide(iSide);
				let z0=this.sides[iSide].z0;
				let z1=this.sides[iSide].z1;
				//z0 & z1 - направления розы ветров, где мосты, между мостами - крылья градиента
				let z=Arrow.incLook(z0);
				//let z=(z0+1) % 8;


				let wide=0;
				this.avgAngle[iSide]={lat:0,long:0,};
				this.avgDist[iSide]=0;
				while (z!=z1) {
					//console.log('avgAngle['+iSide+']='+avgAngle[iSide]+' z='+z);
					this.avgAngle[iSide].lat+=aClrAngle[z].lat;//яркость
					let long=aClrAngle[z].long;
					if(long<0) long+=Math.PI*2;					
					this.avgAngle[iSide].long+=long;//оттенок
					this.avgDist[iSide]+=aClrDist[z];

					wide++;
					z=Arrow.incLook(z);
					//z=(z+1) % 8;					
				};//avg
				this.avgAngle[iSide].long=this.avgAngle[iSide].long/wide;
				this.avgAngle[iSide].lat=this.avgAngle[iSide].lat/wide;
				this.avgDist[iSide]=this.avgDist[iSide]/wide;


				z=Arrow.incLook(z0);
				//z=(z0+1) % 8;
				this.skoAngle[iSide]={lat:0,long:0,};
				while (z!=z1) {
					this.skoAngle[iSide].lat+=Math.pow((this.avgAngle[iSide].lat-aClrAngle[z].lat),2);//яркость
					let long=aClrAngle[z].long;
					if(long<0) long+=Math.PI*2;
					this.skoAngle[iSide].long+=Math.pow((this.avgAngle[iSide].long-long),2);//оттенок
					//console.log('skoAngle['+iSide+']: lat='+skoAngle[iSide].lat+' long='+skoAngle[iSide].long+ ' z='+z);

					z=Arrow.incLook(z);
					//z=(z+1) % 8;					
				};//sko

				this.skoAngle[iSide].long = Math.sqrt(this.skoAngle[iSide].long);
				this.skoAngle[iSide].lat  = Math.sqrt(this.skoAngle[iSide].lat );

				//aDistZigzag[z]
				if(z1<z0)z1+=8;
				//let wide=z1-z0;
				this.sides[iSide].angle = ((z0 + z1)/2%8);
				this.sides[iSide].wide = z1-z0;//+1;

			};//for iSide
//*/

		return sideCount;
	}

	calcMu_GradByDistZigzag(aClrAngle, aClrDist){

		let mu_Grad=0;
//		let aMinDist=[];
//		for(let z=0; z<aDistZigzag.length; z++)
//			if(aDistZigzag[z].kind==cBtm)
//				aMinDist.push(z);

		if(this.aMinDist.length==2){
			//ca_Grad
/*
			let avgAngle=new Array(2);
			let skoAngle=new Array(2);
			let avgDist =new Array(2);
			for(let iSide=0; iSide<aMinDist.length; iSide++){
				let z0=aDistZigzag[aMinDist[iSide]].start + aDistZigzag[aMinDist[iSide]].count-1;
				let z1=aDistZigzag[aMinDist[(iSide+1) % aMinDist.length]].start;
				//z0 & z1 - РЅР°РїСЂР°РІР»РµРЅРёСЏ СЂРѕР·С‹ РІРµС‚СЂРѕРІ, РіРґРµ РјРѕСЃС‚С‹, РјРµР¶РґСѓ РјРѕСЃС‚Р°РјРё - РєСЂС‹Р»СЊСЏ РіСЂР°РґРёРµРЅС‚Р°
				let z=(z0+1) % 8;


				let wide=0;
				avgAngle[iSide]={lat:0,long:0,};
				avgDist[iSide]=0;
				while (z!=z1) {
					//console.log('avgAngle['+iSide+']='+avgAngle[iSide]+' z='+z);
					avgAngle[iSide].lat+=aClrAngle[z].lat;//СЏСЂРєРѕСЃС‚СЊ
					let long=aClrAngle[z].long;
					if(long<0) long+=Math.PI*2;					
					avgAngle[iSide].long+=long;//РѕС‚С‚РµРЅРѕРє
					avgDist[iSide]+=aClrDist[z];

					wide++;
					z=(z+1) % 8;					
				};//avg
				avgAngle[iSide].long=avgAngle[iSide].long/wide;
				avgAngle[iSide].lat=avgAngle[iSide].lat/wide;
				avgDist[iSide]=avgDist[iSide]/wide;


				z=(z0+1) % 8;
				skoAngle[iSide]={lat:0,long:0,};
				while (z!=z1) {
					skoAngle[iSide].lat+=Math.pow((avgAngle[iSide].lat-aClrAngle[z].lat),2);//СЏСЂРєРѕСЃС‚СЊ
					let long=aClrAngle[z].long;
					if(long<0) long+=Math.PI*2;
					skoAngle[iSide].long+=Math.pow((avgAngle[iSide].long-long),2);//РѕС‚С‚РµРЅРѕРє
					//console.log('skoAngle['+iSide+']: lat='+skoAngle[iSide].lat+' long='+skoAngle[iSide].long+ ' z='+z);

					z=(z+1) % 8;					
				};//sko

				skoAngle[iSide].long = Math.sqrt(skoAngle[iSide].long);
				skoAngle[iSide].lat = Math.sqrt(skoAngle[iSide].lat);

				//aDistZigzag[z]

			};//for iSide
*/

			//for(let iSide=0; iSide<aMinDist.length; iSide++)
				//console.log(iSide, avgAngle[iSide]);
			//for(let iSide=0; iSide<aMinDist.length; iSide++)
				//console.log(iSide, skoAngle[iSide]);



			let gradDist=Math.sqrt(avgDist[0]+avgDist[1]);//чтоб умножить на дистанци обоих крыльев градиента

			let mu_lat = PixelVector.gaussian((avgAngle[0].lat+avgAngle[1].lat));//1
			mu_lat = mu_lat * (1-skoAngle[0].lat) * (1-skoAngle[1].lat);

			let mu_long = PixelVector.gaussian((Math.abs(avgAngle[0].long-avgAngle[1].long) - Math.PI));
			mu_long = mu_long * (1-skoAngle[0].long) * (1-skoAngle[1].long);

			mu_Grad = Math.max(mu_lat,mu_long);//?даже если градиент маленький, он всё равно градиент//*gradDist;
			mu_Grad *= gradDist;//с учетом крутизны градиента
/*
			this.mu_Grad = (avgAngle[0].lat+avgAngle[1].lat) + (skoAngle[0].lat+skoAngle[1].lat)
			 + (Math.abs(avgAngle[0].long-avgAngle[1].long) - Math.PI) + (skoAngle[0].long+skoAngle[1].long);
			 //нужно бы умножить на дистанци обоих крыльев градиента...?????
			 //чем ближе к 0 - тем лучше
			 this.mu_Grad = gaussian(this.mu_Grad, 1,0,1);
*/

		};//min dist = 2
		return mu_Grad;
	}//calcMu_GradByDistZigzag
	calcGradDist(){
		return Math.sqrt(this.sides[0].avgDist+this.sides[1].avgDist);//чтоб умножить на дистанцию обоих крыльев градиента
	}
	calcMu_Grad(){
		let mu_Grad=0;

		let mu_lat = PixelVector.gaussian(this.sides[0].avgAngle.lat+this.sides[1].avgAngle.lat);//1
		mu_lat = mu_lat * (1-this.sides[0].skoAngle.lat) * (1-this.sides[1].skoAngle.lat);

		let mu_long = PixelVector.gaussian(Math.abs(this.sides[0].avgAngle.long-this.sides[1].avgAngle.long), 1, Math.PI);
		mu_long = mu_long * (1-this.sides[0].skoAngle.long) * (1-this.sides[1].skoAngle.long);

		mu_Grad = Math.max(mu_lat,mu_long);//?даже если градиент маленький, он всё равно градиент//*gradDist;
		//mu_Grad *= this.gradDist;//с учетом крутизны градиента
/*
			this.mu_Grad = (avgAngle[0].lat+avgAngle[1].lat) + (skoAngle[0].lat+skoAngle[1].lat)
			 + (Math.abs(avgAngle[0].long-avgAngle[1].long) - Math.PI) + (skoAngle[0].long+skoAngle[1].long);
			 //нужно бы умножить на дистанци обоих крыльев градиента...?????
			 //чем ближе к 0 - тем лучше
			 this.mu_Grad = gaussian(this.mu_Grad, 1,0,1);
*/
		return mu_Grad;
	}//calcMu_Grad


	calc(aClrCoord, cell=null){

		if(cell){
			this.clrCoord = cell.clrCoord;
			this.x=cell.x;
			this.y=cell.y;
		};

/*
				let pixel = new PixelColor(rgba);


				pixel.getBrightness();//Яркость [0..1] снизу вверх
				pixel.getContrast();//Контраст [0..1] от центральной оси к поверхности шара 
				pixel.getHue();//Оттенок [0..2*PI] по кругу все цвета радуги
				pixel.getColorCoords();//x:[-1..1], y:[-1..1], z:[-1..1]
*/

		//let aClrCoord = this.createClrCoord();
		if(this.sectorsCount==8){
			aClrCoord.forEach( (clrCoord, look)=>{
				this.aClrCoord[look] = clrCoord;
			},this);
		}else
		if(this.sectorsCount==16){
			aClrCoord.forEach( (clrCoord, look)=>{
				this.aClrCoord[look*2] = clrCoord;
			},this);
			for(look = 1; look<sectorsCount; look+=2){
				let last=this.aClrCoord[look-1];
				let next=this.aClrCoord[look+1];
				this.aClrCoord[look] = ColorCoords.between(last,next);
			};
		};

		//let aClrDist = this.createClrDist(aClrCoord);
		this.aClrCoord.forEach( (clrCoord, look)=>{
			this.aClrDist[look] = PixelVector.dist(this.clrCoord, clrCoord);
		},this);

		//this.mu_Equal = this.calcMu_EqualByMaxDist(aClrDist);
		this.mu_Equal = this.calcMu_EqualByDistMediana(this.aClrDist);
		if(this.mu_Equal==1) return;

		//let aClrAngle = this.createClrAngle(aClrCoord);
		this.aClrCoord.forEach( (clrCoord, look)=>{
			this.aClrAngle[look] = PixelVector.angle(this.clrCoord, clrCoord);
		},this);


		this.angle=this.aClrAngle;
		this.dist =this.aClrDist;

/*
dist:
0	equal
	grad
0.5?
	contrast?
1

find mins of dist - bridges
how many bridges
*/

		//this.mu_Equal = this.calcMu_EqualByDistMediana(aClrDist);

		//массив секторов с цветовыми расстояниями от цветовых координат центрального пикселя
		this.aDistZigzag=this.createDistZigzag(this.aClrDist);
		this.aMinDist=this.zigzag.aMin;//this.createMinDist();
		let sideCount=this.prepareSides(this.aClrAngle, this.aClrDist);
		if(sideCount==2){
			this.gradDist=this.calcGradDist();
			this.mu_Grad=this.calcMu_Grad();

			if(this.mu_Grad>0.5){
				//
			};
		}
		else{
			this.gradDist=0;
			this.mu_Grad=0;
		};

//angles: [-PI..PI]
		//?//this.mu_Grad=this.calcMu_GradByDistZigzag(aDistZigzag, aClrAngle, aClrDist);






/*
понять, что это плоскость или градиент или хребет, тавр, крест



отсортировать по сходству характеристик/цветов  ?





ca_Equal	color
ca_Grad		delta & vector
ca_Bridge://контраст с фоном
	0rays ca_Dot	1 вариант
	1ray  ??		8 вариантов
	2rays ca_I,		6+5+4+3+2+1 = 21  //4 варианта   | - / \
	3rays ca_Y,		16 вариантов: 4т 4т(диаг)  4Y 4Y(диаг)
	4rays ca_X,		2 варианта: + х





//const ca_None=0,ca_Equal=1,ca_Grad=2,ca_I=3,ca_Y=4,ca_X=5,ca_Dot=6,ca_Bunt=7;

*/





	}

	calcCellVectors(aClrCoord,cell){
		this.calc(aClrCoord,cell);
		cell.setMu('grd', this.mu_Grad);
		cell.setMu('equ', this.mu_Equal);
		//cell.grd*=(+this.gradDist);
		cell.gradDist=(+this.gradDist);
		cell.dist=this.dist;


		let sideCount=this.sides?this.sides.length:0;
		if(sideCount){
			for(let i=0; i<sideCount; i++){
				let vector = new Vector(cell);
				//vector.initAngle(this.sides[i].angle,this.dist[i],this.sides[i].width);
				vector.initLook(this.sides[i].look,this.sides[i].avgDist,this.sides[i].sectors);//this.dist[i]
				vector.colorDelta=this.sides[i].avgAngle;//long & lat
				cell.addVector(vector);
			}
		};

		return cell;
	}

	static compareVectors(v1,v2      ,i=-1,j=-1){
		let dlong=Math.abs(v1.colorDelta.long - v2.colorDelta.long);
		if(dlong>Math.PI)
			dlong=2*Math.PI-dlong;
		dlong*=((v1.length + v2.length)/2);
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
	}







}


export { PixelVector     };