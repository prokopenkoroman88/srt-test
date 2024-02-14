import Arrow from './../../common/Arrow.js';
import Angle from './../../common/Angle.js';
import CustomView from './../custom/CustomView.js'


export default class WideLupa extends CustomView{

	assembleScheme(){
		console.log('WideLupa.assembleScheme', this);
		let scheme = {
			tag:'canvas',
			attrs:{ width:this.lupaWidth, height:this.lupaWidth, }//+'px'
		};
		return scheme;
	}

	init(){
		this.lupaWidth=500;
		this.lupaScale=16;//*4;
	}

	paintCell(cell, point){
		let rgba = this.editor.canvas.getRGB(point.x,point.y);
		let pnt = this.toCnv(point);
		for(let i=-this.lupaScale/2; i<this.lupaScale/2; i++ )
			for(let j=-this.lupaScale/2; j<this.lupaScale/2; j++ )
				this.canvas.setRGB(pnt.x+j,pnt.y+i,rgba);
	}

	pointBy(point, angle, dist){
		let pnt={x:point.x, y:point.y};
		Angle.moveRadial(point, pnt, {angle, dist})
		pnt = this.toCnv(pnt);//lineTo
		return pnt;
	}

	paintCellDists(cell, point){
		if(!cell.dist)return;
		let p0 = this.toCnv(point);//moveTo
		//console.log('p0',p0);

		let d0, d1=cell.dist[7];
		let pnt0={}, pnt1={};
		let vectorAngle, vectorDist;

		let bCenter = point.x==this.center.x && point.y==this.center.y;

		vectorAngle=Arrow.angleByLook(7);
		let radius0=cell.dist[7];//0.5-cell.dist[7]/2;//*1*lupaScale
		vectorDist=this.circlePreparing(radius0/2)*10;
		//if(radius0>=0 && radius0<=2)
		//	vectorDist=	Math.pow(1-Math.pow(1-radius0/2,2),0.5)/2;
		pnt1 = this.pointBy(point, vectorAngle, vectorDist);

		cell.dist.forEach((radius,look)=>{
			d0=d1;
			d1=radius;//cell.dist[look]
			pnt0=pnt1;
			vectorAngle=Arrow.angleByLook(look);
			//vectorDist=1+0.5;
			vectorDist=this.circlePreparing(radius/2)*10;

			pnt1 = this.pointBy(point, vectorAngle, vectorDist);
			//console.log(pnt0,pnt1);
			this.canvas.paintStandardLine(pnt0, pnt1, bCenter?'white':'gray');
		},this);

	}

	getVectorColor(vector){
		let h,s,l;

		h=(vector.colorDelta.long/Math.PI*180).toFixed(0);
		s=100;
		l=(50+vector.colorDelta.lat/Math.PI*50).toFixed(0);

		//h=0; s=100; l=50+vector.delta;

		let clr = `hsl(${h}deg, ${s}%, ${l}%)`;
		return clr;
	}

	paintCellVectors(cell, point){
		if(!cell.vectors)return;
		let p0 = this.toCnv(point);//moveTo
		//console.log('p0',p0);

		cell.vectors.forEach((vector)=>{
			let vectorAngle=vector.angle;
			let vectorDist = vector.length;
			vectorDist = this.circlePreparing(vector.length);
			if(vectorDist<0)
				vectorDist=0.01;
			let p1 = this.pointBy(point, vectorAngle, vectorDist);
			//console.log('p1',p1, 'vectorDist:',vectorDist);

			let clr=this.getVectorColor(vector);
			this.canvas.paintStandardLine(p0,p1,clr);

			//vector width:
			let widthAngle=vector.width;

			let p1L = this.pointBy(point, vectorAngle-widthAngle/2, vectorDist);
			let p1R = this.pointBy(point, vectorAngle+widthAngle/2, vectorDist);
			this.canvas.paintStandardLine(p0,p1L,clr);
			this.canvas.paintStandardLine(p0,p1R,clr);

			let p1L2 = this.pointBy(point, vectorAngle-widthAngle/4, vectorDist);
			let p1R2 = this.pointBy(point, vectorAngle+widthAngle/4, vectorDist);
			this.canvas.paintStandardLine(p1L,p1L2,clr);
			this.canvas.paintStandardLine(p1L2,p1,clr);
			this.canvas.paintStandardLine(p1,p1R2,clr);
			this.canvas.paintStandardLine(p1R2,p1R,clr);
		},this);

	}

	refresh(x,y){
		console.log(x,y);
		this.center={x,y};
		this.forEachCell(this.paintCell.bind(this));
		this.canvas.put();
		//this.forEachCell(this.paintCellDists.bind(this));
		this.forEachCell(this.paintCellVectors.bind(this));
	}//showWideLupa

}

