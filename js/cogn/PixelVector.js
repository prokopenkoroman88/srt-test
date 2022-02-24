import CustomCanvas from './../canvas/CustomCanvas.js';
//import VirtualCanvas from './../canvas/VirtualCanvas.js';
//import RealCanvas from './../canvas/RealCanvas.js';

import PixelColor from './../canvas/PixelColor.js';



const ca_None=0,ca_Equal=1,ca_Grad=2,ca_I=3,ca_Y=4,ca_X=5,ca_Dot=6,ca_Bunt=7;


class PixelVector{//+9.2.22


	constructor(canvas){
		//
		this.cnv=canvas;

		//какие цвета окружают с 8-ми сторон текущую точку [j,i]
		this.a9Pxl=[[null,null,null],[null,null,null],[null,null,null]];


	}


	init(x,y)//init(this.x0+0, this.y0+i)
	{
		this.x=x;//=-1
		this.y=y;
			//a9Pxl:
			for(let i1=0; i1<=2; i1++){
				for(let j1=0; j1<=2; j1++)
					delete a9Pxl[i1][j1];
				for(let j1=1; j1<=2; j1++){
					rgba=this.cnv.getRGB(this.x+(j1-1), this.y+(i1-1));//с учетом смещения для 8 окружающих пикселей

					a9Pxl[i1][j1] = new PixelColor(rgba);
				};//j1
			};//i1
	}


	nextStep(){
		this.x++;


				//a9Pxl:
				for(let i1=0; i1<=2; i1++){
					delete a9Pxl[i1][0];
					for(let j1=1; j1<=2; j1++){
						a9Pxl[i1][j1-1] = a9Pxl[i1][j1];
					};//j1
					rgba=this.cnv.getRGB(this.x+1, this.y+(i1-1));//с учетом смещения для 8 окружающих пикселей
					a9Pxl[i1][2] = new PixelColor(rgba);
				};//i1


	}



	calc(){





/*
				let pixel = new PixelColor(rgba);


				pixel.getBrightness();//Яркость [0..1] снизу вверх
				pixel.getContrast();//Контраст [0..1] от центральной оси к поверхности шара 
				pixel.getHue();//Оттенок [0..2*PI] по кругу все цвета радуги
				pixel.getColorCoords();//x:[-1..1], y:[-1..1], z:[-1..1]
*/

/*
понять, что это плоскость или градиент или хребет, тавр, крест



отсортировать по сходству характеристик/цветов  ?





ca_Equal	color
ca_Grad		delta & vector
ca_Bridge://контраст с фоном
	0rays ca_Dot	1 вариант
	1ray  ??		8 вариантов
	2rays ca_I,		6+5+4+3+2+1 = 21  //4 варианта   | - / \
	3rays ca_Y,		16 вариантов: 4т 4т(диаг)  4Y 4Y(диаг)
	4rays ca_X,		2 варианта: + х





//const ca_None=0,ca_Equal=1,ca_Grad=2,ca_I=3,ca_Y=4,ca_X=5,ca_Dot=6,ca_Bunt=7;

*/





	}









}


export { PixelVector     };