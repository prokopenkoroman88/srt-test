import { SpatialFigure, SpatialBody, SpatialScreen } from './figures.js';


export class SpatialCube extends SpatialFigure{

	init(){
		super.init();
		//this.addDot({x:0,y:0,z:0});
		//нижні:
		this.addCorner(-1,-1,-1,'ниж лів близ');//лів близ
		this.addCorner(-1, 1,-1,'ниж лів даль');//лів даль
		this.addCorner( 1,-1,-1,'ниж прав близ');//прав близ
		this.addCorner( 1, 1,-1,'ниж прав даль');//прав даль
		//верхні:
		this.addCorner(-1,-1, 1,'верх лів близ');//лів близ
		this.addCorner(-1, 1, 1,'верх лів даль');//лів даль
		this.addCorner( 1,-1, 1,'верх прав близ');//прав близ
		this.addCorner( 1, 1, 1,'верх прав даль');//прав даль

		//за годинниковою стрілкою для зовнішнього спостерігача (не обов'язково)
		this.addSide([ 0, 2, 3, 1 ],'нижня');//0,1,3,2
		this.addSide([ 4, 5, 7, 6 ],'верхня');
		this.addSide([ 0, 1, 5, 4 ],'ліва');
		this.addSide([ 1, 3, 7, 5 ],'задня');
		this.addSide([ 3, 2, 6, 7 ],'права');
		this.addSide([ 2, 0, 4, 6 ],'передня');
		//this.addSide([ this.dots[], this.dots[], this.dots[], this.dots[]   ]);

		this.fillSidesRandomColors();
	}

}


//зрізаний паралелепіпед
export class SpatialShearedCube extends SpatialFigure{

	init(){
		super.init();

		//зріз:
		this._shear={x:0.66,y:0.66,z:0.66};
		//shear: 0-паралелепіпед  0.66-майже сфера 1-октаедр
		let dx=1-this._shear.x;//0.7;
		let dy=1-this._shear.y;//0.7;
		let dz=1-this._shear.z;//0.7;

//6*4 = 24 dots
		//нижні:
		this.addCorner(-dx,-dy,-1,'ниж лів близ');//лів близ
		this.addCorner(-dx, dy,-1,'ниж лів даль');//лів даль
		this.addCorner( dx,-dy,-1,'ниж прав близ');//прав близ
		this.addCorner( dx, dy,-1,'ниж прав даль');//прав даль
		//верхні:
		this.addCorner(-dx,-dy, 1,'ниж лів близ');//лів близ
		this.addCorner(-dx, dy, 1,'ниж лів даль');//лів даль
		this.addCorner( dx,-dy, 1,'ниж прав близ');//прав близ
		this.addCorner( dx, dy, 1,'ниж прав даль');//прав даль

		//ближні:
		this.addCorner(-dx,-1,-dz,'ниж лів близ?');//лів близ
		this.addCorner(-dx,-1, dz,'ниж лів даль?');//лів даль
		this.addCorner( dx,-1,-dz,'ниж прав близ?');//прав близ
		this.addCorner( dx,-1, dz,'ниж прав даль?');//прав даль
		//двльні:
		this.addCorner(-dx, 1,-dz,'ниж лів близ?');//лів близ
		this.addCorner(-dx, 1, dz,'ниж лів даль?');//лів даль
		this.addCorner( dx, 1,-dz,'ниж прав близ?');//прав близ
		this.addCorner( dx, 1, dz,'ниж прав даль?');//прав даль

		//ліві:
		this.addCorner(-1,-dy,-dz,'ниж лів близ?');//лів близ
		this.addCorner(-1,-dy, dz,'ниж лів даль?');//лів даль
		this.addCorner(-1, dy,-dz,'ниж прав близ?');//прав близ
		this.addCorner(-1, dy, dz,'ниж прав даль?');//прав даль
		//праві:
		this.addCorner( 1,-dy,-dz,'ниж лів близ?');//лів близ
		this.addCorner( 1,-dy, dz,'ниж лів даль?');//лів даль
		this.addCorner( 1, dy,-dz,'ниж прав близ?');//прав близ
		this.addCorner( 1, dy, dz,'ниж прав даль?');//прав даль


//18 quad + 8 tri = 26 sides
//6:
		this.addSide([ 0, 2, 3, 1 ],'нижня');
		this.addSide([ 4, 5, 7, 6 ],'верхня');
		this.addSide([ 8,10,11, 9 ],'передня');
		this.addSide([12,13,15,14 ],'задня');
		this.addSide([16,18,19,17 ],'ліва');
		this.addSide([20,21,23,22 ],'права');

//12:
		this.addSide([ 4, 6,11, 9 ],'верхня передня');
		this.addSide([ 6, 7,23,21 ],'верхня права');
		this.addSide([ 7, 5,13,15 ],'верхня задня');
		this.addSide([ 5, 4,17,19 ],'верхня ліва');

		this.addSide([10,11,21,20 ],'передня права');
		this.addSide([ 9, 8,16,17 ],'передня ліва');
		this.addSide([13,12,18,19 ],'задня ліва');
		this.addSide([15,14,22,23 ],'задня права');

		this.addSide([ 0, 2,10, 8 ],'нижня передня');
		this.addSide([ 3, 2,20,22 ],'нижня права');
		this.addSide([ 3, 1,12,14 ],'нижня задня');
		this.addSide([ 0, 1,18,16 ],'нижня ліва');

//8 трикутних:
		this.addSide([ 0, 8,16 ],'нижня передня ліва');//0, 8,16
		this.addSide([ 1,12,18 ],'нижня задня ліва');//
		this.addSide([ 2,10,20 ],'нижня передня права');//2,10,20
		this.addSide([ 3,14,22 ],'нижня задня права');//

		this.addSide([ 4, 9,17 ],'верхня передня ліва');
		this.addSide([ 5,13,19 ],'верхня задня ліва');//5,13,19
		this.addSide([ 6,11,21 ],'верхня передня права');//6,11,21
		this.addSide([ 7,15,23 ],'верхня задня права');

		this.fillSidesRandomColors();
	}

	get shear(){ return this._shear; }
	set shear(value){
		//
		this._shear.x=value.x;
		this._shear.y=value.y;
		this._shear.z=value.z;
	}

}


//----------------

export class TestScreen extends SpatialScreen{

	init(){
		super.init();
		let body = new SpatialBody({x:0,y:0,z:0},'house');
		this.bodies.push(body);
		//body.figures.push(this.cube());
		body.figures.push(this.stone());
	}

	cube(){
		let cube = new SpatialCube({x:100,y:-400,z:0},'box');
		cube.resize({x:600, y:800, z:400});
		cube.rotate({a:Math.PI/8, b:Math.PI*0, c:0}); //Math.PI/4
		//body.figures.push(cube);
		return cube;
	}

	stone(){
		let stone = new SpatialShearedCube({x:100,y:-400,z:0},'stone');
		stone.resize({x:800, y:600, z:800});
		stone.rotate({a:/*-Math.PI/8*/Math.PI/8, b:Math.PI*-1.125, c:0}); //Math.PI/4
		return stone;
	}

}
