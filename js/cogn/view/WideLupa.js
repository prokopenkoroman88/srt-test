import Arrow from './../../common/Arrow.js';
import Angle from './../../common/Angle.js';
import CustomView from './../custom/CustomView.js'
import ColorDelta from './../items/ColorDelta.js';


export default class WideLupa extends CustomView{

	control={
			mode:{
				names:[],
				btns:[],
				choiced:[],//names
			},
		};

	setMode(name){
		let index = this.control.mode.names.indexOf(name);
		if(index<0)
			return;
		this.control.mode.btns[index].classList.add('active');
		index = this.control.mode.choiced.indexOf(name);
		if(index<0)
			this.control.mode.choiced.push(name);
	}

	resetMode(name){
		let index = this.control.mode.names.indexOf(name);
		if(index<0)
			return;
		this.control.mode.btns[index].classList.remove('active');
		index = this.control.mode.choiced.indexOf(name);
		if(index>=0)
			this.control.mode.choiced.splice(index,1);
	}

	toggleMode(name){
		let index = this.control.mode.names.indexOf(name);
		if(index<0)
			return;
		this.control.mode.btns[index].classList.toggle('active');
		index = this.control.mode.choiced.indexOf(name);
		if(index<0)
			this.control.mode.choiced.push(name);
		else
			this.control.mode.choiced.splice(index,1);
	}

	isMode(name){
		return this.control.mode.choiced.indexOf(name)>=0;
	}

	assembleScheme(){
		let scheme = {
			tag:'div',
			children:[
				this.assembleSchemeControl(),
				this.assembleSchemeCanvas(),
			],
		};
		return scheme;
	}

	assembleSchemeControl(){
		let scheme = {
			tag:'div',
			children:[
				this.assembleSchemeInputs(),
				this.assembleSchemeButtons(),
			],
		};
		return scheme;
	}

	assembleSchemeInputs(){
		let scheme = {
			tag:'div',
			css:'inputs',
			children:[
				{
					tag:'label',
					attrs:{
						for:'wild-lupa-input-width',
					},
					children:'ширина',
				},
				{
					tag:'input',
					attrs:{
						id:'wild-lupa-input-width',
						type:'number',
						style:{
							width:'50px',
						},
						value:this.lupaWidth,
						oninput:((event)=>{
							let value = event.target.value;
							if(!Number.isNaN(value)){
								this.lupaWidth = value;
								this.canvas.resize(this.lupaWidth,this.lupaWidth);
							};
						}).bind(this),
					}
				},
				{
					tag:'label',
					attrs:{
						for:'wild-lupa-input-scale',
					},
					children:'масштаб',
				},
				{
					tag:'input',
					attrs:{
						id:'wild-lupa-input-scale',
						type:'number',
						style:{
							width:'50px',
						},
						value:this.lupaScale,
						oninput:((event)=>{
							let value = event.target.value;
							if(!Number.isNaN(value))
								this.lupaScale = value;
						}).bind(this),
					}
				},
			],
		};
		return scheme;
	}

	assembleSchemeButtons(){
		let scheme = {
			tag:'div',
			children:[
				this.assembleSchemeCommonButtons(),
				this.assembleSchemeModeButtons(),
			],
		};
		return scheme;
	}

	assembleSchemeCommonButtons(){
		let scheme = {
			tag:'span',//div display:inline-block
			children:[
				this.editor.sch_btn('&#x1F503;',()=>{//&#10227; &#x27F3;
					this.refresh();
				}),
			],
		};
		return scheme;
	}

	assembleSchemeModeButtons(){
		this.control.mode.names=['hue', 'satur', 'light', 'value', 'delta1', 'delta2', 'dist', 'vector',];

		let scheme = {
			tag:'span',//div display:inline-block
			css:'btns',
			name:'mode_btns',
			children:[
				//mode names order must match:
				this.editor.sch_btn('H',()=>{//&#x1F308;
					this.toggleMode('hue');
					this.resetMode('satur');
					this.resetMode('light');
				}),
				this.editor.sch_btn('S',()=>{
					this.toggleMode('satur');
					this.resetMode('hue');
					this.resetMode('light');
				}),
				this.editor.sch_btn('L',()=>{//&#x1F505;
					this.toggleMode('light');
					this.resetMode('hue');
					this.resetMode('satur');
				}),
				this.editor.sch_btn('<i>f</i>',()=>{
					this.toggleMode('value');
				}),
				this.editor.sch_btn('<i>f\'</i>',()=>{
					this.toggleMode('delta1');
				}),
				this.editor.sch_btn('<i>f\'\'</i>',()=>{
					this.toggleMode('delta2');
				}),
				this.editor.sch_btn('dist',()=>{
					this.toggleMode('dist');
				}),
				this.editor.sch_btn('vector',()=>{
					this.toggleMode('vector');
				}),
			],
		};
		return scheme;
	}

	assembleSchemeCanvas(){
		let scheme = {
			tag:'canvas',
			attrs:{ width:this.lupaWidth, height:this.lupaWidth, }//+'px'
		};
		return scheme;
	}

	init(){
		this.lupaWidth=500;
		this.lupaScale=16;//*4;
	}

	paintCell(cell, point){
		let rgba = this.editor.canvas.getRGB(point.x,point.y);
		let pnt = this.toCnv(point);
		for(let i=-this.lupaScale/2; i<this.lupaScale/2; i++ )
			for(let j=-this.lupaScale/2; j<this.lupaScale/2; j++ )
				this.canvas.setRGB(pnt.x+j,pnt.y+i,rgba);
	}

	paintCellHSL(cell, point){
		if(!cell.clrCoord)return;

		const leftCell = this.model.getCell(point.y,point.x,Arrow.W);
		let fieldName, mul;

		if(this.isMode('hue'))
			fieldName='hue';
		if(this.isMode('satur'))
			fieldName='contrast';
		if(this.isMode('light'))
			fieldName='brightness';

		if(this.isMode('hue'))
			mul=-2;//?
		if(this.isMode('satur'))
			mul=-2;//?
		if(this.isMode('light'))
			mul=-2;

		let leftBar={
			value:this.pointBy(leftCell, {dx:0, dy:leftCell.clrCoord[fieldName]*mul}),
			delta1:this.pointBy(cell, {dx:-0.5, dy:cell.data('W').delta[1][fieldName]*mul}),
		};

		let currBar={
			bottom:this.pointBy(cell),
			value:this.pointBy(cell, {dx:0, dy:cell.clrCoord[fieldName]*mul}),
		};

		let rightBar={
			delta1:this.pointBy(cell, {dx:+0.5, dy:cell.data('E').delta[1][fieldName]*mul}),
		};

		this.canvas.paintLine(currBar.bottom, currBar.value, 'gray');// |
		this.canvas.paintLine(leftBar.value, currBar.value, 'white');// -
	}

	paintCellHSLDelta(cell, point){
		if(!cell.clrCoord)return;

		let fieldName, mul;

		if(this.isMode('hue'))
			fieldName='hue';
		if(this.isMode('satur'))
			fieldName='contrast';
		if(this.isMode('light'))
			fieldName='brightness';

		if(this.isMode('hue'))
			mul=-2;//?
		if(this.isMode('satur'))
			mul=-2;//?
		if(this.isMode('light'))
			mul=-2;

		let leftDelta1=cell.data('W').delta[this.deltaNumber][fieldName];
		let rightDelta1=cell.data('E').delta[this.deltaNumber][fieldName];

		let leftBar={
			delta1:this.pointBy(cell, {dx:-0.5, dy:leftDelta1*mul}),
		};

		let rightBar={
			delta1:this.pointBy(cell, {dx:+0.5, dy:rightDelta1*mul}),
		};

		let currBar={
			delta1:{
				x:this.toCnv(cell).x,
				y:(leftBar.delta1.y + rightBar.delta1.y)/2,
			},
		};

		let leftColor='yellow', rightColor='yellow';
		if(leftDelta1>0)
			leftColor='lime';
		if(leftDelta1<0)
			leftColor='red';
		if(rightDelta1>0)
			rightColor='lime';
		if(rightDelta1<0)
			rightColor='red';

		this.canvas.paintLine(leftBar.delta1, currBar.delta1, leftColor);// ~
		this.canvas.paintLine(currBar.delta1, rightBar.delta1, rightColor);// ~
		//this.canvas.paintStandardLine(leftBar.delta1, rightBar.delta1, 'yellow');// ~
	}

	pointBy(point, coords={}){
		let pnt={x:point.x, y:point.y};
		Angle.move(point, pnt, coords);
		pnt = this.toCnv(pnt);//lineTo
		return pnt;
	}

	paintCellDists(cell, point){
		if(!cell.dist)return;
		let p0 = this.toCnv(point);//moveTo
		//console.log('p0',p0);

		let d0, d1=cell.dist[7];
		let pnt0={}, pnt1={};
		let vectorAngle, vectorDist;

		let bCenter = point.x==this.center.x && point.y==this.center.y;

		vectorAngle=Arrow.angleByLook(7);
		let radius0=cell.dist[7];//0.5-cell.dist[7]/2;//*1*lupaScale
		vectorDist=this.circlePreparing(radius0/2)*10;
		//if(radius0>=0 && radius0<=2)
		//	vectorDist=	Math.pow(1-Math.pow(1-radius0/2,2),0.5)/2;
		pnt1 = this.pointBy(point, {angle:vectorAngle, dist:vectorDist});

		cell.dist.forEach((radius,look)=>{
			d0=d1;
			d1=radius;//cell.dist[look]
			pnt0=pnt1;
			vectorAngle=Arrow.angleByLook(look);
			//vectorDist=1+0.5;
			vectorDist=this.circlePreparing(radius/2)*10;

			pnt1 = this.pointBy(point, {angle:vectorAngle, dist:vectorDist});
			//console.log(pnt0,pnt1);
			this.canvas.paintLine(pnt0, pnt1, bCenter?'white':'gray');
		},this);

	}

	getVectorColor(vector){
		let h,s,l;

		h=(vector.colorDelta.long/Math.PI*180).toFixed(0);
		s=100;
		l=(50+vector.colorDelta.lat/Math.PI*50).toFixed(0);

		//h=0; s=100; l=50+vector.delta;

		let clr = `hsl(${h}deg, ${s}%, ${l}%)`;
		return clr;
	}

	paintCellVectors(cell, point){
		if(!cell.vectors)return;
		let p0 = this.toCnv(point);//moveTo
		//console.log('p0',p0);

		cell.vectors.forEach((vector)=>{
			let vectorAngle=vector.angle;
			let vectorDist = vector.length;
			vectorDist = this.circlePreparing(vector.length);
			if(vectorDist<0)
				vectorDist=0.01;
			let p1 = this.pointBy(point, {angle:vectorAngle, dist:vectorDist});
			//console.log('p1',p1, 'vectorDist:',vectorDist);

			let clr=this.getVectorColor(vector);
			this.canvas.paintLine(p0,p1,clr);

			//vector width:
			let widthAngle=vector.width;

			let p1L = this.pointBy(point, {angle:vectorAngle-widthAngle/2, dist:vectorDist});
			let p1R = this.pointBy(point, {angle:vectorAngle+widthAngle/2, dist:vectorDist});
			this.canvas.paintLine(p0,p1L,clr);
			this.canvas.paintLine(p0,p1R,clr);

			let p1L2 = this.pointBy(point, {angle:vectorAngle-widthAngle/4, dist:vectorDist});
			let p1R2 = this.pointBy(point, {angle:vectorAngle+widthAngle/4, dist:vectorDist});
			this.canvas.paintLine(p1L,p1L2,clr);
			this.canvas.paintLine(p1L2,p1,clr);
			this.canvas.paintLine(p1,p1R2,clr);
			this.canvas.paintLine(p1R2,p1R,clr);
		},this);

	}

	refresh(){
		this.forEachCell(this.paintCell.bind(this));
		if(this.isMode('hue') || this.isMode('satur') || this.isMode('light')){
			if(this.isMode('value'))
				this.forEachCell(this.paintCellHSL.bind(this));
			if(this.isMode('delta1')){
				this.deltaNumber=1;
				this.forEachCell(this.paintCellHSLDelta.bind(this));
			}
			if(this.isMode('delta2')){
				this.deltaNumber=2;
				this.forEachCell(this.paintCellHSLDelta.bind(this));
			}
			delete this.deltaNumber;
		};//hsl
		if(this.isMode('dist'))
			this.forEachCell(this.paintCellDists.bind(this));
		if(this.isMode('vector'))
			this.forEachCell(this.paintCellVectors.bind(this));
		this.canvas.put();
	}//showWideLupa

}

