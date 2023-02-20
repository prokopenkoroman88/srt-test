import Arrow from './../../common/Arrow.js';

class CustomSector{
	constructor(){
		this.look=0;
		this.sectors=0;
	}

	set bounds(value){
		let z0=value.startBound;
		let z1=value.finishBound;
		if(z1<z0)z1+=8;
		this.look = ((z0 + z1)/2%8);
		this.sectors = z1-z0;//+1;
	}
	get bounds(){
		return{
			startBound:this.z0,
			finishBound:this.z1,
		};
	}

	get z0(){ return (this.look - this.sectors/2 +8)%8; }
	get z1(){ return (this.look + this.sectors/2 +8)%8; }

	set angle(value) { this.look = Arrow.lookByAngle(value); }
	get angle() { return  Arrow.angleByLook(this.look); }

	set width(value) { this.sectors = Arrow.lookByAngle(value); }
	get width() { return  Arrow.angleByLook(this.sectors); }

}

export default CustomSector;
