import CustomSector from './CustomSector.js';


class Vector extends CustomSector{
	constructor(cell){
		super();
		this.cell=cell;
		this.initAngle(0,0,0);
	}

	initAngle(angle,length,width){
		this.angle=angle;//0..2*PI
		this.length=length;//dist;
		this.width=width;//wide
	}

	initLook(look,length,sectors){
		this.look=look;//0..7
		this.length=length;//dist;
		this.sectors=sectors;//wide
	}

}

export default Vector;
