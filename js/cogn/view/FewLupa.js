import Arrow from './../../common/Arrow.js';
import CustomView from './../custom/CustomView.js'

export default class FewLupa extends CustomView{

	assembleScheme(){
		let scheme = { tag:'table', children:[], name:'lupaFew' };
		for(let i=0; i<5; i++)
		{
			scheme.children.push({ tag:'tr', children:[] });
			for(let j=0; j<5; j++)
				scheme.children[i].children.push({ tag:'td',  });//таблиця відображення векторів
		};
		return scheme;
	}

	getVectorColor(vector, pxl){
		let h = (pxl.getHue()/Math.PI*180+(vector.colorDelta.long)/Math.PI*180*vector.length).toFixed(0);
		let s = (pxl.getContrast()*100*1.6).toFixed(1);//1.6?
		let l = (pxl.getBrightness()*100+((vector.colorDelta.lat/(Math.PI/2))*50)*vector.length ).toFixed(1);//0..1 + -PI/2..+PI/2
		let clr = `hsl(${h}deg, ${s}%, ${l}%)`;
		return clr;
	}

	assembleVectorScheme(vector, pxl){
		let clr = this.getVectorColor(vector, pxl);
		let hue = (vector.colorDelta.long/Math.PI*180).toFixed(0)+'deg';
		let light = (50+vector.colorDelta.lat/Math.PI*50).toFixed(0)+'%';
		let width = vector.width.toFixed(0)+'px';
		let height = vector.length*100+'px';
		let angle = ((vector.look-4)/8*360).toFixed(0)+'deg';

		let scheme_vector={
			css:'vector',
			attrs:{
				style:{
					'--clr':clr,
					'--hue':hue,
					'--light':light,
					'width':width,
					'height':height,
					'transform':'rotate('+angle+')',
				},
			},
		};
		return scheme_vector;
	}

	init(){
		this.tableVolume=5;
		this.tableOffset=2;
	}

	forEachTD(func){
		if(!func)
			return;
		for(let i=0; i<this.tableVolume; i++){
			let cy=this.center.y+i-this.tableOffset;
			for(let j=0; j<this.tableVolume; j++){
				let cx=this.center.x+j-this.tableOffset;
				let cell = this.model.getCell(cy,cx);
				if(!cell)
					continue;
				func(cell, {j, i}, this.tds[i*this.tableVolume+j]);
			};//j
		};//i

	}

	forEachNeib(func){
		if(!func)
			return;
		for(let look=0; look<8; look++){
			let step=Arrow.step(look);
			let xx=this.tableOffset+step.dx;
			let yy=this.tableOffset+step.dy;

			let cell = this.model.getCell(this.center.y+yy,this.center.x+xx);
			let td = this.tds[yy*this.tableVolume+xx];
			func(cell,look,td);
		};//i
	}

	refresh(){
		//PixelVector:
		this.analyzer.controlVector.initRoundArrays(8);
		this.analyzer.controlVector.fill(this.center.x,this.center.y);//.init(x,y)
		let aClrCoord = this.analyzer.controlVector.createClrCoord();
		let cell = this.model.getCell(this.center.y,this.center.x);
		this.analyzer.controlVector.calc(aClrCoord, cell);

		let  cv = this.analyzer.controlVector;
		let tbl = this.table;//this.view.tblLupa;
		this.tds = tbl.querySelectorAll('td');

		//кольори оточуючих комірок:
		this.forEachTD((cell, point, td)=>{
				let rgba = this.model.canvas.getPixel(cell.x,cell.y);
				if(!rgba) return;//continue;
				td.style.backgroundColor=rgba.toColor();
				td.style.color=rgba.inverse().toColor();
				td.innerHTML='';
		});

		//широта - зміна яскравості, довгота - зміна відтінка, радіус - величина змін
		let cmps='';
		this.forEachNeib((cell,look,td)=>{
			if(cell && cell.cmps)
				cell.cmps.forEach((cmp)=>{
					cmps+=' '+cmp.toFixed(1);
				});
			td.innerHTML = cmps
//			+'ш'+cv.angle[look].lat.toFixed(2)+'<br>'
//			+'д'+cv.angle[look].long.toFixed(2)+'<br>'
//			+'r'+cv.dist[look].toFixed(2);
		});

		let mu_Equal=cv.mu_Equal;
		if(mu_Equal)
			mu_Equal=mu_Equal.toFixed(2);

		let mu_Grad=cv.mu_Grad;
		if(mu_Grad)
			mu_Grad=mu_Grad.toFixed(2);

		this.tds[2*5+2].innerHTML = 'екв='+mu_Equal+'<br>грд='+mu_Grad;

		this.forEachTD((cell, point, td)=>{
			let pxl  = this.model.canvas.getPixel(cell.x,cell.y);//поточний піксель
			if(!cell)
				return;
			if(cell.vectors)
				cell.vectors.forEach((vector)=>{
					//вектор зміни кольору
					let scheme_vector=this.assembleVectorScheme(vector, pxl);
					this.editor.branchByScheme(scheme_vector, td);
				});
		});

		let sideCount=cv.aMinDist.length;
		console.log('sideCount',sideCount);
		//this.avgAngle=new Array(sideCount);
		//this.skoAngle=new Array(sideCount);

		if(sideCount==2){
			console.log('side', cv.sides[0], cv.sides[1]);
			console.log('bridge', cv.getBridge(0), cv.getBridge(1));
			console.log('avgAngle',cv.sides[0].avgAngle, cv.sides[1].avgAngle);
			console.log('skoAngle',cv.sides[0].skoAngle, cv.sides[1].skoAngle);
		};
	}//showLupa

}
