import RealCanvas from './RealCanvas.js';

function distance(x0,y0,x1,y1){	return Math.sqrt(Math.pow(x1-x0,2) + Math.pow(y1-y0,2)); };

class TriangleFiller{

	constructor(canvas){
		this.canvas=canvas;
		this.points=[];
		this.areas=[];

		this.aPercAngle = new Array(3);
		this.aWorkDist = new Array(3);
		this.aDot = new Array(3);
		//
		this.rgba = [0,0,0,255];
	}

	testInit(){
		this.points=[
			{x:40, y:40, rgba:[255,0,0,255]},
			{x:10, y:10, rgba:[0,255,0,255]},
			{x:20, y:90, rgba:[0,0,255,255]},
			{x:90, y:20, rgba:[255,0,255,255]},
		];

		this.areas=[
			{pointIds:[0,1,2]},
			{pointIds:[1,0,3]},
			{pointIds:[2,0,3]},
		];

		this.points.push({x:150, y:50, rgba:[Math.random()*255,Math.random()*255,Math.random()*255,255]})
		for(let i=0; i<6; i++){
			let angle=i/6*2*Math.PI;
			let x1 = this.points[4].x + Math.sin(angle)*45 + Math.random()*30-15;
			let y1 = this.points[4].y - Math.cos(angle)*45 + Math.random()*30-15;
			this.points.push({x:x1, y:y1, rgba:[0,0,0/*Math.random()*255,Math.random()*255,Math.random()*255*/,255]});
		};
		for(let i=0; i<6; i++){
			this.areas.push({pointIds:[4,5+(i),5+(i+1)%6]});
		};
/*
//----------
		this.points.push({x:229, y:50, rgba:[Math.random()*255,Math.random()*255,Math.random()*255,255]})
		for(let i=0; i<4; i++){
			let angle=i/6*2*Math.PI;
			let x1 = this.points[11].x + Math.sin(angle)*45 + Math.random()*30-15;
			let y1 = this.points[11].y - Math.cos(angle)*45 + Math.random()*30-15;
			this.points.push({x:x1, y:y1, rgba:[Math.random()*255,Math.random()*255,Math.random()*255,255]});
		};
		for(let i=0; i<3; i++){
			this.areas.push({pointIds:[11,12+(i),12+(i+1)]});
		};
		this.areas.push({pointIds:[11,15,7]});
		this.areas.push({pointIds:[11,7,6]});
		this.areas.push({pointIds:[11,6,12]});
//------------
		this.points.push({x:190, y:120, rgba:[Math.random()*255,Math.random()*255,Math.random()*255,255]})
		for(let i=2; i<5; i++){
			let angle=i/6*2*Math.PI;
			let x1 = this.points[16].x + Math.sin(angle)*45 + Math.random()*30-15;
			let y1 = this.points[16].y - Math.cos(angle)*45 + Math.random()*30-15;
			this.points.push({x:x1, y:y1, rgba:[Math.random()*255,Math.random()*255,Math.random()*255,255]});
		};
		this.areas.push({pointIds:[16,7,15]});
		this.areas.push({pointIds:[16,15,17]});
		this.areas.push({pointIds:[16,17,18]});
		this.areas.push({pointIds:[16,18,19]});
		this.areas.push({pointIds:[16,19,8]});
		this.areas.push({pointIds:[16,8,7]});
*/

		this.height = 200;
		this.width = 300;
	}

	prepareAreas(){
		for(let i=0; i<this.areas.length; i++){
			if(!this.areas[i].aDot){
				this.areas[i].aDot = new Array(this.areas[i].pointIds.length);
				for(let k=0; k<this.areas[i].aDot.length; k++)
					this.areas[i].aDot[k] = this.points[this.areas[i].pointIds[k]];
			};
			this.areas[i].rect={
				x0:Math.min(this.areas[i].aDot[0].x, this.areas[i].aDot[1].x, this.areas[i].aDot[2].x),
				y0:Math.min(this.areas[i].aDot[0].y, this.areas[i].aDot[1].y, this.areas[i].aDot[2].y),
				x1:Math.max(this.areas[i].aDot[0].x, this.areas[i].aDot[1].x, this.areas[i].aDot[2].x),
				y1:Math.max(this.areas[i].aDot[0].y, this.areas[i].aDot[1].y, this.areas[i].aDot[2].y),
			}
			//
			if(!this.areas[i].aPairAngle)
				this.areas[i].aPairAngle = new Array(this.areas[i].pointIds.length);
			let paSum=0;

			for(let j=0; j<this.areas[i].aPairAngle.length; j++){
				let p1=this.areas[i].aDot[j];
				let p2=this.areas[i].aDot[(j+2)%3];
				this.areas[i].aPairAngle[j] = Math.atan2( p2.y-p1.y , p2.x-p1.x );// [-PI .. +PI]
			};//j++
			for(let j=0; j<this.areas[i].aPairAngle.length; j++){
				let deltaPairAngle=this.areas[i].aPairAngle[j]-this.areas[i].aPairAngle[(j+2)%3]
				if(deltaPairAngle<-Math.PI)
					deltaPairAngle+=2*Math.PI;
				if(deltaPairAngle>Math.PI)
					deltaPairAngle-=2*Math.PI;
				console.log(i,j,deltaPairAngle);
				paSum+=deltaPairAngle;
			};
			console.log('paSum['+i+']='+paSum);
			if(paSum<0){//== -2*Math.PI если против часовой стрелки
				[this.areas[i].pointIds[1],this.areas[i].pointIds[2]] = [this.areas[i].pointIds[2],this.areas[i].pointIds[1]];
				[this.areas[i].aDot[1],this.areas[i].aDot[2]] = [this.areas[i].aDot[2],this.areas[i].aDot[1]];
				for(let j=0; j<this.areas[i].aPairAngle.length; j++){
					let p1=this.areas[i].aDot[j];
					let p2=this.areas[i].aDot[(j+2)%3];
					this.areas[i].aPairAngle[j] = Math.atan2( p2.y-p1.y , p2.x-p1.x );// [-PI .. +PI]
				};//j++

				paSum=0;
				for(let j=0; j<this.areas[i].aPairAngle.length; j++){
					let deltaPairAngle=this.areas[i].aPairAngle[j]-this.areas[i].aPairAngle[(j+2)%3]
					if(deltaPairAngle<-Math.PI)
						deltaPairAngle+=2*Math.PI;
					if(deltaPairAngle>Math.PI)
						deltaPairAngle-=2*Math.PI;
					console.log(i,j,deltaPairAngle);
					paSum+=deltaPairAngle;
				};
				console.log('paSum['+i+']='+paSum);//== 2*Math.PI теперь по часовой стрелке
			};
		};//i++
	}

	renderArea(j, i, area){
		if(i<area.rect.y0 || i>area.rect.y1 || j<area.rect.x0 || j>area.rect.x1)
			return false;

		let in3 = 0;
		for(let k=0; k<3; k++){
			let angleL = area.aPairAngle[(k+1)%3] + Math.PI;
			if(angleL>Math.PI)angleL-=(2*Math.PI);
			let angleC = Math.atan2( i-area.aDot[k].y ,j-area.aDot[k].x );// [-PI .. +PI] // work angle
			let angleR = area.aPairAngle[k];
			if(angleR<angleL){
				if(angleC<angleR)
					angleC+=(2*Math.PI);
				angleR+=(2*Math.PI);
			};
			if((angleL-0.01)<=angleC && angleC<=(angleR+0.01)){
				in3++;
				this.aPercAngle[k]=(angleC-angleL)/(angleR-angleL);//[0..1]
				this.aWorkDist[k]=distance(j,i, area.aDot[k].x,area.aDot[k].y);
			}
			else break;
		};

		//console.log('*',i,j,in3);
		if(in3!==3)
			return false;

		let maxDist=0;
		for(let z=0; z<3; z++)
			maxDist+=this.aWorkDist[z]/2;

		for(let z=0; z<3; z++)
			this.aWorkDist[z]=this.aWorkDist[z]/maxDist;

		this.calcRGBA(area);
		this.canvas.setRGB(j,i,this.rgba);
		return true;
	}

	calcRGBA(area){
		let aPercAngle=this.aPercAngle;
		let aWorkDist=this.aWorkDist;
		function calcCoeff(iDot, invers=false){
			let percAngle = aPercAngle[iDot];
			if(invers)
				percAngle = 1-percAngle;
			percAngle=(Math.sin((percAngle-0.5)*Math.PI)+1)/2;
			return percAngle*aWorkDist[iDot];
		};
		for(let z=0; z<3; z++){
			let value = 0;
			for(let iDot=0; iDot<3; iDot++)
				value += area.aDot[iDot].rgba[z]*(calcCoeff((iDot+1+1)%3,true) + calcCoeff((iDot+2-1)%3,) )/2 ;
			this.rgba[z] = Math.round(value);
			/*this.rgba[z] =
			Math.round(
				area.aDot[0].rgba[z]*(calcCoeff(1,true) + calcCoeff(2) )/2  +
				area.aDot[1].rgba[z]*(calcCoeff(2,true) + calcCoeff(0) )/2  +  
				area.aDot[2].rgba[z]*(calcCoeff(0,true) + calcCoeff(1) )/2    
			); */
		};
	}

	render(){
		this.prepareAreas();


		for(let i=0; i<this.height; i++)
		for(let j=0; j<this.width; j++)
		{


			for(let iArea=0; iArea<this.areas.length; iArea++){
				if(this.renderArea(j, i, this.areas[iArea]))
					break;
			};//iArea


		};//i,j
		this.canvas.put();

	}

}

export default TriangleFiller;

/*
             aDot[0] 
             /    \
          aPercAngle[0]  


  1=aDot[1]

                          0=aDot[2]
*/
