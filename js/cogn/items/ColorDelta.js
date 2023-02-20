

class ColorDelta{
	constructor(coords1, coords2){
		this.lat=0;
		this.rad=0;
		this.long=0;
		this.init(coords1, coords2);
	}

	init(coords1, coords2){//ColorCoords or ColorDelta
		if(!coords1 || !coords2)
			return;
		this.lat = coords2.lat - coords1.lat;//Широта, яскравість -PI .. +PI
		this.rad = coords2.rad - coords1.rad;//Радіус, контраст -1 .. +1
		this.long = coords2.long - coords1.long;//Довгота, відтінок -PI .. +PI

		this.normalize();
	}

	normalize(){
//longitude delta:
//   -2*PI      -PI    0    PI     2*PI
//     +0     PI              -PI  -0
		if(this.long>Math.PI)
			this.long-=(2*Math.PI);
		if(this.long<-Math.PI)
			this.long+=(2*Math.PI);
	}

}

export default ColorDelta;
