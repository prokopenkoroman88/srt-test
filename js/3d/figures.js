
function distance(x0,y0,x1,y1){
	return Math.sqrt(Math.pow(x1-x0,2) + Math.pow(y1-y0,2));
}

function spaceDistance(dot0,dot1){
	return Math.sqrt(Math.pow(dot1.x-dot0.x,2) + Math.pow(dot1.y-dot0.y,2) + Math.pow(dot1.z-dot0.z,2));
}

function spaceCenter(dots){
	let space={x:0,y:0,z:0};
	let len=dots.length;
	dots.forEach((dot)=>{
		space.x+=dot.space.x/len;
		space.y+=dot.space.y/len;
		space.z+=dot.space.z/len;
	});
	return space;
}

function rotate(center, dots, delta){

	function rotateBy(dot,vrt,hrz,ang){
			let dist = distance(center[hrz],center[vrt], dot.space[hrz],dot.space[vrt]);//2d
			let angle = Math.atan2(dot.space[hrz]-center[hrz], dot.space[vrt]-center[vrt] );
			angle+=delta[ang];
			//console.log(dot.space, angle, dist, 'd'+hrz,dot.space[hrz]-center[hrz], 'd'+vrt,dot.space[vrt]-center[vrt]  );
			//console.log(center[hrz],'+','sin(',angle,')',Math.sin(angle),'*',dist);
			dot.space[hrz] = center[hrz]+Math.sin(angle)*dist;
			dot.space[vrt] = center[vrt]+Math.cos(angle)*dist;
	};

		//console.log(center);
		dots.forEach((dot,i)=>{
			//let dist = spaceDistance(this.space, dot.space);//3d
			rotateBy(dot,'y','x','a');
			rotateBy(dot,'z','y','b');
			rotateBy(dot,'z','x','c');
			//console.log(i,dot.space);
		});

};

//==================== Spatial classes ===================

export class SpatialItem{

	constructor(space,name=''){
		//this.space={x:0,y:0,z:0};
		this.space=space;//center
		this.name=name;
		this.color=[0,0,0,0];
	}

	prepare(eye){
		//space => plane
	}

}


export class SpatialDot extends SpatialItem{

	constructor(space,name=''){
		super(space,name);
		this.plane={x:-1,y:-1};
		this.dist=-1;
	}

	prepare(eye){
		//super.prepare(eye);
		this.dist = spaceDistance(eye.space, this.space);

		let cx = this.space.x;
		let cy = this.space.y;
		let cz = this.space.z;

		let ox = eye.space.x;
		let oy = eye.space.y;
		let oz = eye.space.z;

		let dx = (cx-ox) * Math.cos(eye.angles.a) + (cy-oy) * Math.sin(-eye.angles.a);
		let dy = (oz-cz) * Math.cos(eye.angles.b) + (oy-cy) * Math.sin(-eye.angles.b);

		this.plane.x = eye.screen.width/2  + dx/(this.dist*eye.screen.coefDist)*eye.screen.coefSize;
		this.plane.y = eye.screen.height/2 + dy/(this.dist*eye.screen.coefDist)*eye.screen.coefSize;
		//console.log(this.name+' ',this.plane,'horiz:', cx,ox,'vert:',cy,oz, this.dist);
	}

}


export class SpatialSide extends SpatialItem{

	constructor(space,name=''){
		super(space,name);
		this.dots=[];//links to figure's dots
	}

	get top(){
		let i=-1;
		this.dots.forEach((dot,index)=>{
			if(i<0 ||dot.plane.y<this.dots[i].plane.y)
				i=index;
		});
		return this.dots[i];
	}

	get bottom(){
		let i=-1;
		this.dots.forEach((dot,index)=>{
			if(i<0 ||dot.plane.y>this.dots[i].plane.y)
				i=index;
		});
		return this.dots[i];
	}

	get left(){
		let i=-1;
		this.dots.forEach((dot,index)=>{
			if(i<0 ||dot.plane.x<this.dots[i].plane.x)
				i=index;
		});
		return this.dots[i];
	}

	get right(){
		let i=-1;
		this.dots.forEach((dot,index)=>{
			if(i<0 ||dot.plane.x>this.dots[i].plane.x)
				i=index;
		});
		return this.dots[i];
	}


	get topY(){
		if(!this._topY)
			this._topY=this.top.plane.y;
		return this._topY;
	}

	get bottomY(){
		if(!this._bottomY)
			this._bottomY=this.bottom.plane.y;
		return this._bottomY;
	}

	get leftX(){
		if(!this._leftX)
			this._leftX=this.left.plane.x;
		return this._leftX;
	}

	get rightX(){
		if(!this._rightX)
			this._rightX=this.right.plane.x;
		return this._rightX;
	}

	prepare(eye){
		delete this._topY;
		delete this._bottomY;
		delete this._leftX;
		delete this._rightX;

		// let sumLast=0,sumNext=0,sLast='',sNext='';
		let len=this.dots.length;//=4 or 3
		this.dotAngles = new Array(len);
		//must be after dots.prepare(eye)
		this.dots.forEach((dot, iCurr, dots)=>{
			let last=dots[(iCurr-1+len) % len];
			let next=dots[(iCurr+1+len) % len];
//			this.dotAngles[iCurr] = Math.atan2( last.plane.x-dot.plane.x , last.plane.y-dot.plane.y );// [-PI .. +PI]
//			this.dotAngles[iCurr] = Math.atan2( next.plane.x-dot.plane.x , next.plane.y-dot.plane.y );// [-PI .. +PI]

			let l=Math.atan2( last.plane.x-dot.plane.x , last.plane.y-dot.plane.y );// [-PI .. +PI]
			let n=Math.atan2( next.plane.x-dot.plane.x , next.plane.y-dot.plane.y );// [-PI .. +PI]
			this.dotAngles[iCurr]={last:l, next:n};

			// sLast+=' '+Math.round(l*10)/10;
			// sNext+=' '+Math.round(n*10)/10;

			// //if(l<0)l+=2*Math.PI;
			// //if(n<0)n+=2*Math.PI;

			// if((n-l)<-Math.PI){sumNext+=2*Math.PI; sumLast+=2*Math.PI;  };
			// if((n-l)> Math.PI){sumNext-=2*Math.PI; sumLast-=2*Math.PI;  };
			// sumLast+=l;
			// sumNext+=n;

		});//for dots
		//console.log('side ',this.name,sumNext,sumLast,    sumNext+sumLast, sumNext-sumLast  );
		//console.log('sLast',sLast);
		//console.log('sNext',sNext);

	}

	contains(x,y){//plane
		let in3=0;
		let len=this.dots.length;//=4 or 3
		let currAngles = this.dots.map((dot,i) => Math.atan2( x-dot.plane.x , y-dot.plane.y ) );

		for(let i=0; i<len; i++){
			let angleR = this.dotAngles[i].next;
			let angleC = currAngles[i];// [-PI .. +PI]
			let angleL = this.dotAngles[(i-1+len)%len].next + Math.PI;
			//let angleL = this.dotAngles[i].last;//?

			if(angleL>Math.PI)angleL-=(2*Math.PI);
			//nextAngle;

			if(angleR<angleL){
				if(angleC<angleR)
					angleC+=(2*Math.PI);
				angleR+=(2*Math.PI);
			};
			if((angleL-0.01)<=angleC && angleC<=(angleR+0.01)){
				in3++;
				//this.aPercAngle[k]=(angleC-angleL)/(angleR-angleL);//[0..1]
				//this.aWorkDist[k]=distance(j,i, area.aDot[k].x,area.aDot[k].y);
			}
			else break;

		};
		if(in3===len) return true;

//----------------------
		in3=0;
		for(let i=0; i<len; i++){
			let angleR = this.dotAngles[i].last;
			let angleC = currAngles[i];// [-PI .. +PI]
			let angleL = this.dotAngles[(i-1+len)%len].last + Math.PI;
			//let angleL = this.dotAngles[i].last;//?

			if(angleL>Math.PI)angleL-=(2*Math.PI);
			//nextAngle;

			if(angleR<angleL){
				if(angleC<angleR)
					angleC+=(2*Math.PI);
				angleR+=(2*Math.PI);
			};
			if((angleL-0.01)<=angleC && angleC<=(angleR+0.01)){
				in3++;
				//this.aPercAngle[k]=(angleC-angleL)/(angleR-angleL);//[0..1]
				//this.aWorkDist[k]=distance(j,i, area.aDot[k].x,area.aDot[k].y);
			}
			else break;

		};
		return in3===len;//точка всередині за усіма кутами

	}

	dist(x,y){
		let len=this.dots.length;//=4 or 3
		let dists=new Array(len);
		let allDist=0;
		let res=0;
		this.dots.forEach((dot,i) =>{
			dists[i]={
				fromEye:dot.dist,
				fromXY:distance(x, y,  dot.plane.x, dot.plane.y),
			};
			allDist+=dists[i].fromXY;
		});

		dists.forEach((dist,i)=>{
			res+=dist.fromEye*dist.fromXY/allDist;
		});
		return res;
	}

}


export class SpatialFigure extends SpatialItem{

	constructor(space,name=''){
		super(space,name);
		this.volume={x:1, y:1, z:1};//dimensions
		this.angles={a:0,b:0,c:0};
		this.dots=[];
		this.sides=[];
		this.init();
	}

	init(){
		//adding/loading of dots and sides
	}

	get width(){ return this.volume.x; }
	get length(){ return this.volume.y; }
	get depth(){ return this.volume.y; }//?
	get height(){ return this.volume.z; }

	addDot(space,name=''){
		let dot = new SpatialDot(space,name);
		return this.dots.push(dot)-1;//dots[index]
	}

	addSide(dots,name=''){
		dots = this.checkDots(dots);
		let space=spaceCenter(dots);
		let side = new SpatialSide(space,name);
		dots.forEach((dot)=>{ side.dots.push(dot); });
		return this.sides.push(side)-1;//sides[index]
	}

	addCorner(x,y,z,name=''){//-1..1
		this.addDot({
			x:this.space.x + x*this.volume.x/2,
			y:this.space.y + y*this.volume.y/2,
			z:this.space.z + z*this.volume.z/2
		},name);
	}

	dotByName(name){
		let res;
		this.dots.forEach((dot,i)=>{
			if(dot.name===name){
				res=dot;
				return dot;
			};
		});
		return res;
	}

	//перевірка масиву dots, при необхідності знаходить елементи масиву за індексом чи назвою
	checkDots(dots){
		dots = dots.map((dot,i)=>{
			let res;
			switch (typeof dot) {
				case 'object': res = dot; break;
				case 'number': res = this.dots[dot]; break;
				case 'string': res = this.dotByName(dot); break;
			};
			if(!res)
				throw new Error('Не знайдено dot['+i+'] "'+dot+'" для поверхні "'+name+'"');
			return res;
		});
		return dots;
	}

	rotate(delta){
		rotate(this.space, this.dots, delta);
		this.angles.a+=delta.a;
		this.angles.b+=delta.b;
		this.angles.c+=delta.c;
	}

	mulSize(mul){
		this.volume.x*=mul.x;
		this.volume.y*=mul.y;
		this.volume.z*=mul.z;
		this.dots.forEach((dot)=>{
			dot.space.x = this.space.x + (dot.space.x-this.space.x)*mul.x;
			dot.space.y = this.space.y + (dot.space.y-this.space.y)*mul.y;
			dot.space.z = this.space.z + (dot.space.z-this.space.z)*mul.z;
		});
	}

	resize(newVolume){
		let mul={
			x:newVolume.x/this.volume.x,
			y:newVolume.y/this.volume.y,
			z:newVolume.z/this.volume.z,
		};
		this.mulSize(mul);
	}

	fillSidesRandomColors(){
		this.sides.forEach((side,i)=>{
			side.color[0]=Math.random()*255;
			side.color[1]=Math.random()*255;
			side.color[2]=Math.random()*255;
			side.color[3]=255;
		});
	}

	prepare(eye){
		this.dots.forEach((dot)=>{ dot.prepare(eye); });
		this.sides.forEach((side)=>{ side.prepare(eye); });
	}

}


export class SpatialBody extends SpatialItem{

	constructor(space,name=''){
		super(space,name);
		this.figures=[];
	}

	prepare(eye){
		this.figures.forEach((figure)=>{ figure.prepare(eye); });
	}

}



class SpatialEye extends SpatialItem{

	constructor(screen,space,name=''){
		super(space,name);
		this.screen=screen;
		this.angles={a:0,b:0,c:0};//around z, around x
		this.angles.a=0;//-Math.PI/4;//-0.1;
		this.angles.b=-Math.PI/4;//45deg
	}

}

export class SpatialScreen{

	constructor(height,width){
		this.height=height;
		this.width=width;
		this.coefDist=0.001;
		this.coefSize=0.5*5;

		this.bodies=[];
		this.eye = new SpatialEye(this ,{x:0,z:10000,y:-10000}, 'eye');
	}

	init(){
	}

	prepare(){
		this.bodies.forEach((body)=>{ body.prepare(this.eye); });
	}

}
