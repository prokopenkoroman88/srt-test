
export class SpatialRender{

	constructor(screen,canvas){
		this.screen = screen;
		this.canvas = canvas;
	}

	assembleSides(){
		let sides=[];
		this.screen.bodies.forEach((body)=>{
			body.figures.forEach((figure)=>{
				figure.sides.forEach((side)=>{
					sides.push(side);
				});
			});
		});
		return sides;
	}

	sortSidesY(){
		this.sidesByTop=this.assembleSides();
		this.sidesByTop.sort((side0,side1)=>{ return side0.topY - side1.topY;  });
		this.sidesByBottom=this.assembleSides();
		this.sidesByBottom.sort((side0,side1)=>{ return side0.bottomY - side1.bottomY;  });
		//
		this.indexByTop=0;
		this.indexByBottom=0;
		this.sidesByY=[];
	}

	getSidesByY(currentY){
		//додає грані при досягненні верхньої точки
		while(this.indexByTop<this.sidesByTop.length && this.sidesByTop[ this.indexByTop ].topY <= currentY  ){
			this.sidesByY.push( this.sidesByTop[ this.indexByTop ] );
			this.indexByTop++;
		};

		//видаляє грані при досягненні нижньої точки
		while(this.indexByBottom<this.sidesByBottom.length && this.sidesByBottom[ this.indexByBottom ].bottomY < currentY  ){
			let i=this.sidesByY.indexOf( this.sidesByBottom[ this.indexByBottom ] );
			this.sidesByY.splice(i,1);
			this.indexByBottom++;
		};

		//this.sidesByY is ready!
	}

	sortSidesX(){
		this.sidesByLeft=this.sidesByY.map(side=>side);
		this.sidesByLeft.sort((side0,side1)=>{ return side0.leftX - side1.leftX;  });
		this.sidesByRight=this.sidesByY.map(side=>side);
		this.sidesByRight.sort((side0,side1)=>{ return side0.rightX - side1.rightX;  });
		//
		this.indexByLeft=0;
		this.indexByRight=0;
		this.sidesByX=[];
	}

	getSidesByX(currentX){
		//додає грані при досягненні лівої точки
		while(this.indexByLeft<this.sidesByLeft.length && this.sidesByLeft[ this.indexByLeft ].leftX <= currentX  ){
			this.sidesByX.push( this.sidesByLeft[ this.indexByLeft ] );
			this.indexByLeft++;
		};

		//видаляє грані при досягненні правої точки
		while(this.indexByRight<this.sidesByRight.length && this.sidesByRight[ this.indexByRight ].rightX < currentX  ){
			let i=this.sidesByX.indexOf( this.sidesByRight[ this.indexByRight ] );
			this.sidesByX.splice(i,1);
			this.indexByRight++;
		};

		//this.sidesByX is ready!
	}

	getColor(x,y){
		let rgba=[255,255,255,255];
		//this.sidesByX.sort((side0,side1)=>{ return side0.dist - side1.dist; });//спершу найближчі
		let minDist=1000000000,dist;
		this.sidesByX.forEach((side,i)=>{
			if(side.contains(x,y)){
				//точка знаходиться в межах side/поверхні
				dist=side.dist(x,y);//dist між side.dots[].dist
				if(dist<minDist){
					//колір найближчої поверхні
					minDist=dist;
					rgba=side.color;
				};
			};
		});
		return rgba;
	}

	paintDots(){
		this.screen.bodies.forEach((body,iBody)=>{
			body.figures.forEach((figure,iFigure)=>{
				figure.dots.forEach((dot,iDot)=>{
					let plane = dot.plane;
					plane.x = Math.round(plane.x);
					plane.y = Math.round(plane.y);
					this.canvas.setRGB(plane.x, plane.y, [0,0,0,255]);
					//console.log(plane);
				});
			});
		});
	}

	render(){
		this.screen.prepare();//coords: space to plane
		
		this.sortSidesY();//sort sides by highest, and by lowest dot
		for(let i=0; i<this.screen.height; i++){
			this.getSidesByY(i);
			this.sortSidesX();//sort current sides by left and right dot or even cross!
			for(let j=0; j<this.screen.width; j++){
				this.getSidesByX(j);
				let rgba=this.getColor(j,i);//get color among sides from sidesByX
				this.canvas.setRGB(j, i, rgba);
			};//j++
		};//i++
		//this.paintDots();
		//console.log(screen);
		this.canvas.put();
	}

}
