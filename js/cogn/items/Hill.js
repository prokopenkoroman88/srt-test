import Arrow from './../../common/Arrow.js';
import Angle from './../../common/Angle.js';
import ColorDelta from './ColorDelta.js';
import CustomSector from './CustomSector.js';

class Hill extends CustomSector{
	constructor(){
		super();
		this.avgAngle= new ColorDelta();
		this.skoAngle= new ColorDelta();
		this.avgDist =0;
	}

	byPerimeter(aClrAngle, aClrDist, func) {
		let z=Arrow.incLook(this.z0);
		while (z!=this.z1) {
			func(aClrAngle[z],aClrDist[z]);
			z=Arrow.incLook(z);
		};//avg
	}

	prepare(aClrAngle, aClrDist){
		let wide=0;
		this.byPerimeter(aClrAngle, aClrDist, ((clrAngle,clrDist)=>{
			this.avgAngle.lat+=clrAngle.lat;//brightness
			let long=clrAngle.long;
			if(long<0) long+=Math.PI*2;					
			this.avgAngle.long+=long;//hue
			this.avgDist+=clrDist;
			wide++;
		}).bind(this));
		this.avgAngle.long=this.avgAngle.long/wide;
		this.avgAngle.lat=this.avgAngle.lat/wide;
		this.avgDist=this.avgDist/wide;

		this.byPerimeter(aClrAngle, aClrDist, ((clrAngle,clrDist)=>{
			this.skoAngle.lat+=Math.pow((this.avgAngle.lat-clrAngle.lat),2);//brightness
			let long=clrAngle.long;
			if(long<0) long+=Math.PI*2;
			this.skoAngle.long+=Math.pow((this.avgAngle.long-long),2);//hue
		}).bind(this));
		this.skoAngle.long = Math.sqrt(this.skoAngle.long);
		this.skoAngle.lat  = Math.sqrt(this.skoAngle.lat );
	}

}

export default Hill;
