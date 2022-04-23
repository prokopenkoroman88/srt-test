import RealCanvas from './RealCanvas.js';

function distance(x0,y0,x1,y1){	return Math.sqrt(Math.pow(x1-x0,2) + Math.pow(y1-y0,2)); };

class TriangleFiller{

	constructor(canvas){
		this.canvas=canvas;
		this.points=[];
		this.areas=[];

		this.aWorkAngle = new Array(3);
		this.aPercAngle = new Array(3);
		this.aWorkDist = new Array(3);
		this.aDot = new Array(3);
		//
		this.rgba = [0,0,0,255];
	}

	testInit(){
		this.points=[
			{x:70, y:60, rgba:[255,0,0,255]},
			{x:10, y:10, rgba:[0,255,0,255]},
			{x:40, y:90, rgba:[0,0,255,255]},
			{x:90, y:20, rgba:[255,0,255,255]},
		];

		this.areas=[
			{pointIds:[0,1,2]},
			{pointIds:[1,0,3]},
		];
	}

	prepareAreas(){
		for(let i=0; i<this.areas.length; i++){
			//
			if(!this.areas[i].aPairAngle)
				this.areas[i].aPairAngle = new Array(this.areas[i].pointIds.length);

			for(let j=0; j<this.areas[i].aPairAngle.length; j++){
				let iP1=this.areas[i].pointIds[j];
				let p1=this.points[iP1];
				let iP2=this.areas[i].pointIds[(j+1)%3];
				let p2=this.points[iP2];
				this.areas[i].aPairAngle[j] = Math.atan2( p2.y-p1.y , p2.x-p1.x );// [-PI .. +PI]
			};//j++
		};//i++
	}

	render(){
		this.prepareAreas();


		for(let i=0; i<100; i++)
		for(let j=0; j<100; j++)
		{


			for(let iArea=0; iArea<this.areas.length; iArea++){

				let area = this.areas[iArea];
				for(let k=0; k<3; k++)
					this.aDot[k] = this.points[area.pointIds[k]];

				for(let k=0; k<3; k++)
					this.aWorkAngle[k] = Math.atan2( i-this.aDot[k].y ,j-this.aDot[k].x );// [-PI .. +PI]
				let in3 = 0;
				for(let k=0; k<3; k++){
					let angleL = area.aPairAngle[(k+2)%3] + Math.PI;
					if(angleL>Math.PI)angleL-=(2*Math.PI);
					let angleC = this.aWorkAngle[k];
					let angleR = area.aPairAngle[k];
					//aWorkAngle[k] = 
					if(angleR<angleL){
						if(angleC<angleR)
							angleC+=(2*Math.PI);
						angleR+=(2*Math.PI);
					};
					if((angleL-0.01)<=angleC && angleC<=(angleR+0.01)){
						in3++;
						this.aPercAngle[k]=(angleC-angleL)/(angleR-angleL);//[0..1]
						this.aWorkDist[k]=distance(j,i, this.aDot[k].x,this.aDot[k].y);
					};
				};
				//

				//console.log('*',i,j,in3);
				if(in3===3){

					let maxDist=0;
					for(let z=0; z<3; z++)
						maxDist+=this.aWorkDist[z]/2;

					for(let z=0; z<3; z++)
						this.aWorkDist[z]=this.aWorkDist[z]/maxDist;

					//aPercAngle[0]  
					for(let z=0; z<3; z++){
						this.rgba[z] =
						Math.round(
						this.aDot[0].rgba[z]*((1-this.aPercAngle[1])*this.aWorkDist[1] + this.aPercAngle[2]*this.aWorkDist[2] )/2  +
						this.aDot[1].rgba[z]*((1-this.aPercAngle[2])*this.aWorkDist[2] + this.aPercAngle[0]*this.aWorkDist[0] )/2  +  
						this.aDot[2].rgba[z]*((1-this.aPercAngle[0])*this.aWorkDist[0] + this.aPercAngle[1]*this.aWorkDist[1] )/2    
						); 
					};
					//
					//
					this.canvas.setRGB(j,i,this.rgba);
					break;
				};

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

//==========

		let aDot = [
			{x:70, y:60, rgba:[255,0,0,255]},
			{x:10, y:10, rgba:[0,255,0,255]},
			{x:40, y:90, rgba:[0,0,255,255]},
		];


		let aPairAngle = new Array(aDot.length);
		for(let i=0; i<aDot.length; i++)
			aPairAngle[i] = Math.atan2( aDot[(i+1)%3].y-aDot[i].y , aDot[(i+1)%3].x-aDot[i].x );

		function distance(x0,y0,x1,y1){	return Math.sqrt(Math.pow(x1-x0,2) + Math.pow(y1-y0,2)); };

		let aWorkAngle = new Array(aDot.length);
		let aPercAngle = new Array(aDot.length);
		let aWorkDist = new Array(aDot.length);
		//
		let rgba = [0,0,0,255];
		for(let i=0; i<100; i++)
		for(let j=0; j<100; j++)
		{

			for(let k=0; k<aDot.length; k++)
				aWorkAngle[k] = Math.atan2( i-aDot[k].y ,j-aDot[k].x );// [-PI .. +PI]
			let in3 = 0;
			for(let k=0; k<aDot.length; k++){
				let angleL = aPairAngle[(k+2)%3] + Math.PI;
				if(angleL>Math.PI)angleL-=(2*Math.PI);
				let angleC = aWorkAngle[k];
				let angleR = aPairAngle[k];
				//aWorkAngle[k] = 
				if(angleR<angleL){
					if(angleC<angleR)
						angleC+=(2*Math.PI);
					angleR+=(2*Math.PI);
				};
				if(angleL<=angleC && angleC<=angleR){
					in3++;
					aPercAngle[k]=(angleC-angleL)/(angleR-angleL);//[0..1]
					aWorkDist[k]=distance(j,i, aDot[k].x,aDot[k].y);
				};
			};
			//

			//console.log('*',i,j,in3);
			if(in3===3){

				let maxDist=0;
				for(let z=0; z<3; z++)
					//if(maxDist<aWorkDist[z])
						//maxDist=aWorkDist[z];
					maxDist+=aWorkDist[z]/2;


				for(let z=0; z<3; z++)
					aWorkDist[z]=aWorkDist[z]/maxDist;



				//aPercAngle[0]  
				for(let z=0; z<3; z++){
					rgba[z] =
					Math.round(
					aDot[0].rgba[z]*((1-aPercAngle[1])*aWorkDist[1] + aPercAngle[2]*aWorkDist[2] )/2  +
					aDot[1].rgba[z]*((1-aPercAngle[2])*aWorkDist[2] + aPercAngle[0]*aWorkDist[0] )/2  +  
					aDot[2].rgba[z]*((1-aPercAngle[0])*aWorkDist[0] + aPercAngle[1]*aWorkDist[1] )/2    
					); 
				};
				//
				//
				this.canvas.setRGB(j,i,rgba);
			};

		};
		this.canvas.put();
*/
