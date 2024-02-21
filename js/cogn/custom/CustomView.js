
export default class CustomView{

	constructor(editor, model=null){
		this.editor=editor;
		this.model=model;
		if(!this.model)
			this.model=this.editor.model;
		this.init();
	}

	init(){}

	assembleScheme(){
		let scheme = {
		};
		return scheme;
	}

	forEachCell(func){//to CustomView
		//needs analyzer
		if(!func)
			return;
		let p0=this.toCell({x:0,y:0});
		let p1=this.toCell({x:this.lupaWidth,y:this.lupaWidth});
		let x0=p0.x, y0=p0.y, x1=p1.x, y1=p1.y;

		for(let cy=y0; cy<=y1; cy++){
			for(let cx=x0; cx<=x1; cx++){
				let cell = this.model.getCell(cy,cx);
				if(!cell)
					continue;
				func(cell, {x:cx, y:cy});
			};
		};

	}

	toCnv(point){
		return {
			x:Math.round(this.lupaWidth/2 + (point.x-this.center.x)*this.lupaScale),
			y:Math.round(this.lupaWidth/2 + (point.y-this.center.y)*this.lupaScale)
		};
	}

	toCell(point){
		return {
			x:Math.round(this.center.x+(point.x-this.lupaWidth/2)/this.lupaScale),
			y:Math.round(this.center.y+(point.y-this.lupaWidth/2)/this.lupaScale),
		};
	}

	circlePreparing(x){//radius=x in [0..1]
		x=Math.max(0,Math.min(x,1));
		let y=Math.pow(1-Math.pow(1-x,2),0.5)/2;
		return y;
	}

	paintBy(x,y){
		console.log(x,y);
		this.center={x,y};
		this.refresh();
	}

}
