import Tag from './../common/tag-editor.js';
import CustomCanvas from './../canvas/CustomCanvas.js';
import VirtualCanvas from './../canvas/VirtualCanvas.js';
import RealCanvas from './../canvas/RealCanvas.js';

import PixelColor from './../canvas/PixelColor.js';
import PixelGradient from './../canvas/PixelGradient.js';
import { PixelVector } from './PixelVector.js';

import AreaTree from './../canvas/AreaTree.js';
import ColorArea from './ColorArea.js';



class JPGAnalyzer extends RealCanvas{


	static dots=[];
	rgba;

		x0=8*105;
		y0=8*287;

		x1=0;
		y1=0;

		//w=8*20;//80;//0;
		//h=8*2;//100;//00;
		w=8*80;//0;
		h=8*50;//00;


	//this == cnv1
	initRect(){

		console.log('show');
		console.log(this);
		console.log(this.ctx);
		for(let i=0; i<this.h; i++)
		for(let j=0; j<this.w; j++)
		{
			this.rgba=this.getRGB(this.x0+j,this.y0+i);
			this.setRGB(this.x1+j,this.y1+i,this.rgba);
			//console.log(i,j,rgba);
		};


		this.canvas.addEventListener('click', function(){


		});


		this.areaTree = new AreaTree();
		console.log(this.areaTree);
		this.areaTree.addPoint(300,100);
		console.log(this.areaTree);
		this.areaTree.addPoint(301,100);
		console.log(this.areaTree);  //data: 206158430208n
		this.areaTree.subPoint(300,100);
		console.log(this.areaTree);
		console.log(this.areaTree);
		this.areaTree.addPoint(302,100);



/*
		console.log( this.areaTree.item1.data[0] );
		console.log( this.areaTree.item2.data[0] );


//parseInt('0fffffff',16)<<32 ||           //   1000000000000000
//'0fffffff'+'ffffffff'

//                                                     100000000000000    'feff6fff5ff0f5'
		//parseInt('',16)  для чисел больше 6 байт - работает нечетко в младших разрядах
		this.areaTree.item1.data[0] = BigInt( parseInt('ff345678',16)) <<32n | BigInt( parseInt('ff987654',16)) ;//123456789123456789n;
		console.log( this.areaTree.item1.data[0].toString(16) );
		this.areaTree.item1.data[0] = this.areaTree.item1.data[0] - 3n;
		console.log( this.areaTree.item1.data[0].toString(16) );


		this.areaTree.item1.data[0] = BigInt( parseInt('f000000000000',16));//123456789123456789n;
		console.log( this.areaTree.item1.data[0].toString(16) );		
		
		this.areaTree.item2.data[0] = BigInt( Math.pow(2,17) ) + BigInt( Math.pow(2,27) )   ;//123456789123456789n;
		console.log( this.areaTree.item2.data[0] );	

		this.areaTree.item1.data[0] = this.areaTree.item1.data[0] | this.areaTree.item2.data[0];
		console.log( this.areaTree.item1.data[0] );	
		console.log( this.areaTree.item1.data[0].toString(16)+'h' );	



		let hex = '0ff';
		hex = parseInt(hex, 16);
		console.log(hex);

*/

	}

	buildControlPanel(panelSelector){//'#top-panel'
		let topPanel = document.querySelector(panelSelector);
		this.root = new Tag(this,topPanel);
		this.initPanel();
		this.controlVector = new PixelVector(this);
	}

	initPanel(){

		let arr = new Array(5);
		for(let i=0; i<5; i++)
		{
			arr[i] = new Array(5);
			for(let j=0; j<5; j++)
				arr[i][j]='';//i+','+j;
		};

		JPGAnalyzer.analyzer = this;

		this.root
		.div('btns')
		  .dn()
		  	.div('lupa')//.attr('style','  ')
		  	  .dn()
		  		.table().assignTo('tblLupa')
		  		  .dn()
		  			.trtd('','',arr)
		  		  .up()
		  	  .up()
		  	.button('').inner('atan2').assignTo('btnAtan2')
		  	.button('').inner('8x8').assignTo('btn8x8')
		  	.button('').inner('mu').assignTo('btnMu')
//			.button('').inner('Arrow').assignTo('btnArrow')
//			.button('').inner('AddLayer').assignTo('btnAddLayer')
//			.button('').inner('AddPoint').assignTo('btnAddPoint')
//			.input('').attr('type','color').assignTo('inpFill')
//			.button('').inner('Fill').assignTo('btnFill')
		  .up();
/*
		this.btnArrow.currHTMLTag.addEventListener('click', function(){
			console.log('editor.mode ?');
			console.log('editor.mode ', BezierEditor.editor.mode);
			BezierEditor.editor.mode=modeArrow;
			console.log('editor.mode ', BezierEditor.editor.mode);
		});
*/
		this.btnAtan2.currHTMLTag.addEventListener('click', function(){
			//
			for(let y=-5; y<=5; y++)
				for(let x=-5; x<=5; x++)
					console.log('y='+y+' x='+x+' atan= '+Math.atan2(y, x)/Math.PI +' Пи');
		});


		this.btn8x8.currHTMLTag.addEventListener('click', function(){
			let this1 = JPGAnalyzer.analyzer;

			let rgbaCntrl, rgbaAlter, rgbaCurr, rgbaLine;
			let bMeandr; let iClr;

			for(let iCell=0; iCell<this1.height/8; iCell++){
				if(iCell%10==0)console.log(iCell*8);
				for(let jCell=0; jCell<this1.width/8; jCell++){

					iClr=0;
					for(let i=1; i<7; i++){
						for(let j=1; j<7; j++){
							rgbaCurr = this1.getRGB(jCell*8+j,iCell*8+i);
							if(iClr==0){
								rgbaLine=rgbaCurr;
								iClr=1
							}
							else
							if(iClr==1){
								if(!this1.isOne(rgbaCurr,rgbaLine))
									iClr=3;
							};
							if(iClr==3)	break;
						};
						if(iClr==3)	break;
					};

					if(iClr==1){
						for(let i=0; i<8; i++){
							this1.setRGB(jCell*8+0,iCell*8+i,rgbaLine);
							this1.setRGB(jCell*8+7,iCell*8+i,rgbaLine);
						};
						for(let j=1; j<7; j++){
							this1.setRGB(jCell*8+j,iCell*8+0,rgbaLine);
							this1.setRGB(jCell*8+j,iCell*8+7,rgbaLine);
						};
					};

/*
					//top:
					rgbaCntrl = this1.getRGB(jCell*8+0,iCell*8+0);
					rgbaAlter = this1.getRGB(jCell*8+1,iCell*8+0);
					bMeandr = !this1.isOne(rgbaCntrl,rgbaAlter);
					for(let j=2; j<8; j++){
						if(!bMeandr)break;
						rgbaCurr = this1.getRGB(jCell*8+j,iCell*8+0);
						bMeandr = bMeandr && this1.isOne(rgbaCurr, j%2==0?rgbaCntrl:rgbaAlter);
						//
					};//j

					if(bMeandr){
						iClr=0;
						for(let j=0; j<8; j++){
							rgbaCurr = this1.getRGB(jCell*8+j,iCell*8+1);
							if(iClr==0){
								rgbaLine=rgbaCurr;
								if(this1.isOne(rgbaCurr, rgbaCntrl))
									iClr=1;
								else
								if(this1.isOne(rgbaCurr, rgbaAlter))
									iClr=2;
								else
									iClr=3;
							}//iClr==0
							else
							if(iClr==1||iClr==2){
								if(!this1.isOne(rgbaCurr, rgbaLine))
									iClr=3;
							};//iClr==1,2
							if(iClr==3)break;
						};//j
						if(iClr<3){
							for(let j=0; j<8; j++){
								this1.setRGB(jCell*8+j,iCell*8+0,rgbaLine);
							};
						};
					};//bMeandr

//========================
					//bottom:
					rgbaCntrl = this1.getRGB(jCell*8+0,iCell*8+7);
					rgbaAlter = this1.getRGB(jCell*8+1,iCell*8+7);
					bMeandr = !this1.isOne(rgbaCntrl,rgbaAlter);
					for(let j=2; j<8; j++){
						if(!bMeandr)break;
						rgbaCurr = this1.getRGB(jCell*8+j,iCell*8+7);
						bMeandr = bMeandr && this1.isOne(rgbaCurr, j%2==0?rgbaCntrl:rgbaAlter);
						//
					};//j

					if(bMeandr){
						iClr=0;
						for(let j=0; j<8; j++){
							rgbaCurr = this1.getRGB(jCell*8+j,iCell*8+6);
							if(iClr==0){
								rgbaLine=rgbaCurr;
								if(this1.isOne(rgbaCurr, rgbaCntrl))
									iClr=1;
								else
								if(this1.isOne(rgbaCurr, rgbaAlter))
									iClr=2;
								else
									iClr=3;
							}//iClr==0
							else
							if(iClr==1||iClr==2){
								if(!this1.isOne(rgbaCurr, rgbaLine))
									iClr=3;
							};//iClr==1,2
							if(iClr==3)break;
						};//j
						if(iClr<3){
							for(let j=0; j<8; j++){
								this1.setRGB(jCell*8+j,iCell*8+7,rgbaLine);
							};
						};
					};//bMeandr
*/





				};//jCell
			};//iCell
			this1.put();
		});

		this.btnMu.currHTMLTag.addEventListener('click', function(){

			let this1 = JPGAnalyzer.analyzer;
			let pixelVector = new PixelVector(this1);




			for(let i=0; i<this1.height; i++){

				let a=[];
				let rgba2=[0,0,0,0];
				
				if(i%10==0)console.log(i);
				pixelVector.init(Math.round(this1.width/3)-1/*this1.x1-1*/,this1.y1+i);

				for(let j=0; j<this1.width/3; j++){
					pixelVector.nextStep();
					pixelVector.calc();

					rgba2 = pixelVector.getRGB(0,0);
					let grd=pixelVector.mu_Grad;
					if(!grd)grd=0;
					let equ=pixelVector.mu_Equal;
					if(!equ)equ=0;


					/*if(equ==1 && grd==0){
						rgba2[0]=255;
						rgba2[1]=255;
						rgba2[2]=255;
					}
					else*/
					{
						rgba2[0] = Math.round(grd*250);
						rgba2[1] = Math.round(equ*250);
						rgba2[2] = 0;
					};
					//console.log(i,j,rgba2);
					this1.setRGB(this1.x1+j, this1.y1+i, rgba2);

				};//j
			};//i
			this1.put();

		});
	}

	isOne(rgba1,rgba2){
		for(let i=0;i<4;i++)
			if(rgba1[i]!=rgba2[i]) return false;
		return true;
	};

	plavno(){



//=======================


	for(let i=0; i<this.h; i++){

		let a=[];
		let rgba2=[0,0,0,0];

		for(let j=0; j<this.w; j++){

			this.rgba=this.getRGB(this.x1+j,this.y1+i);
			
			if(!a.length || !this.isOne(rgba2,this.rgba) ){//a[a.length-1].rgba
				if(a.length){
					//console.log(a);
					//if((j-a[a.length-1].j1<4) && a[a.length-1].rgba[0]<40)
					//	a.pop();
					//else
						a[a.length-1].j2=j-1;
				};

				a.push({rgba:this.rgba, j1:j, j2:j});
				rgba2=this.rgba;
			};



		};//j
		a[a.length-1].j2=this.w-1;//?
		//console.log(a);


		let rgbaNew=[0,0,0,255];
		for(let k=1; k<a.length; k++){
			let c1 = Math.round((a[k-1].j2+a[k-1].j1)/2);
			let c2 = Math.round((a[k  ].j2+a[k  ].j1)/2);
			let len=c2-c1;
			let gr = new PixelGradient(a[k-1].rgba, a[k].rgba, 0.5, 1); //ColorGradient

			for(let j2=0; j2<len; j2++){
				gr.coef=j2/len;
				gr.make();
				rgbaNew = gr.toArray();
				//rgbaNew = grad(a[k-1].rgba,a[k].rgba,j2/len);
				//for(let z=0; z<3; z++)
				//rgbaNew[z] =   Math.round(a[k-1].rgba[z] + (a[k  ].rgba[z]  - a[k-1].rgba[z])*j2/len);

				this.setRGB(this.x1+j2+c1,this.y1+i,rgbaNew);

			};//j2++



		};//k++




	};;//i



//============================================




	for(let j=0; j<this.w; j++){

		let a=[];
		let rgba2=[0,0,0,0];

		for(let i=0; i<this.h; i++){

			this.rgba=this.getRGB(this.x1+j,this.y1+i);
			
			if(!a.length || !this.isOne(rgba2,this.rgba) ){//a[a.length-1].rgba
				if(a.length){
					//console.log(a);
					//if((i-a[a.length-1].i1<4) && a[a.length-1].rgba[0]<40)
					//	a.pop();
					//else
						a[a.length-1].i2=i-1;
				};


				a.push({rgba:this.rgba, i1:i, i2:i});
				rgba2=this.rgba;
			};



		};//i
		a[a.length-1].i2=this.w-1;//?
		//console.log(a);


		let rgbaNew=[0,0,0,255];
		for(let k=1; k<a.length; k++){
			let c1 = Math.round((a[k-1].i2+a[k-1].i1)/2);
			let c2 = Math.round((a[k  ].i2+a[k  ].i1)/2);
			let len=c2-c1;
			let gr = new PixelGradient(a[k-1].rgba, a[k].rgba, 0.5, 1); //ColorGradient

			for(let i2=0; i2<len; i2++){
				gr.coef=i2/len;
				gr.make();
				rgbaNew = gr.toArray();
				//rgbaNew = grad(a[k-1].rgba,a[k].rgba,i2/len);
				//for(let z=0; z<3; z++)
				//rgbaNew[z] =   Math.round(a[k-1].rgba[z] + (a[k  ].rgba[z]  - a[k-1].rgba[z])*i2/len);

				this.setRGB(this.x1+j,this.y1+c1+i2,rgbaNew);

			};//j2++



		};//k++




	};//j






	}//plavno


	vawes(){

	for(let i=0; i<this.h; i++){

		let a=[];
		let rgba2=[0,0,0,0];

		for(let j=0; j<this.w; j++){

			this.rgba=this.getRGB(this.x1+j,this.y1+i);

			if(i%2==0)
				for(let z=0; z<3; z++)
					this.rgba[z]-=10;
		//		for(let z=0; z<3; z++)
		//			rgba[z]-=Math.sin(i)*10;

			//if(j%2==0)
		//		for(let z=0; z<3; z++)
		//			rgba[z]-=Math.sin(j)*10;



			this.setRGB(this.x1+j,this.y1+i, this.rgba);
			
		};//j++

	};;//i

//Main.self.manMap
//cnv1.refreshImageData();




	}//vawes


/*


8*8      [0..7]byte   // 256


64*64     [0..7,0..7]  //4000?   


512*512   [0..7,0..7]   //4000 


4k*4k      [0..7,0..7]of byte //64




*/


	distance(x0,y0, x1,y1){
		return Math.sqrt(Math.pow(x1-x0,2) + Math.pow(y1-y0,2));
	}


	byEpicenters(){
		let dots=[
/*
			{x:30, y:50,},
			{x:130, y:50,},
			{x:40, y:180,},
			{x:130, y:150,},
			{x:90, y:250,},
			{x:190, y:50,},
			{x:340, y:195,},
*/
		];

		const dim=30;//50
		for(let i=0; i<this.h/dim; i++){
			for(let j=0; j<this.w/dim; j++){
				dots.push({x:j*dim+Math.random()*20-10,y:i*dim+Math.random()*20-10,});
			};

		};



		//получение цвета из оригинала
		for(let i=0; i<dots.length; i++){
			dots[i].rgba=this.getRGB(this.x0+dots[i].x, this.y0+dots[i].y);
		};


		let a= Array(dots.length);
		let pixel = new PixelColor([0,0,0]);

		for(let i=0; i</*10*/this.h; i++){
		//for(let i=190-40; i<200; i++){


			let rgba=[0,0,0,0];

			for(let j=0; j</*10*/this.w; j++){
			//for(let j=330-30; j<350; j++){

//				this.rgba=this.getRGB(this.x1+j,this.y1+i);
				//


				for(let k=0; k<dots.length; k++){
					//console.log(k, this.x0+j, this.y0+i,  dots[k].x, dots[k].y);
					a[k] = {dist: this.distance(this.x0*0+j, this.y0*0+i,  dots[k].x, dots[k].y   )+1};

				};//k
				//console.log(i,j,a);

				let aNeibID=[];


				let iMin=0;
				let iMax=0;
				for(let z=0; z<4; z++){

					iMin=z;
					for(let k=z+1; k<dots.length; k++){

						if(a[k].dist < a[iMin].dist) iMin=k;
						//if(a[k].dist > a[iMax].dist) iMax=k;

						//

					};//k
					let tmp = a[z];
					a[z]=a[iMin];
					a[iMin]=tmp;

					aNeibID.push(iMin);//???
					//iMax=iMin;

				};//z

				let r=0, g=0, b=0, allD=0;


				for(let k=0; k<aNeibID.length; k++){
					//
					allD+=(1/a[   k/*aNeibID[k]*/  ].dist);

				};//k

				let a2= Array(aNeibID.length);

				for(let k=0; k<aNeibID.length; k++){
					//
					let k1=aNeibID[k];//
					a2[k]=(1/a[k].dist)/allD;
					r+=a2[k]*dots[k1].rgba[0];
					g+=a2[k]*dots[k1].rgba[1];
					b+=a2[k]*dots[k1].rgba[2];

				};//k
				let a3=[];
				for(let k=0; k<aNeibID.length; k++)
					a3.push({id:aNeibID[k], dist:a[ k/*aNeibID[k]*/ ].dist, });
				//console.log(i,j,r,g,b, /*a,*/ a3, a2, allD, iMin,iMax);


				pixel.encodeColor(r,g,b);

				rgba = pixel.toArray();
				this.setRGB(this.x1+j,this.y1+i, rgba);

			};//j

		};//i






	}



	by3Colors(){//+25.1.22

		let treeGray,treeRed,treeBlue;
		treeGray = new AreaTree();
		treeRed = new AreaTree();
		treeBlue = new AreaTree();



		let rgba=[0,0,0,0];
		let iClr;
		
		for(let i=0; i</*10*/this.h; i++){
		//for(let i=190-40; i<200; i++){


			for(let j=0; j</*10*/this.w; j++){

				iClr=0;
				rgba=this.getRGB(this.x0+j, this.y0+i);



				if( rgba[0]>=25 && rgba[0]<=75 && rgba[1]>=25 && rgba[1]<=70 && rgba[2]>=25 && rgba[2]<=70 

				  &&  Math.abs(rgba[0]-rgba[1])<15  &&  Math.abs(rgba[1]-rgba[2])<15  &&  Math.abs(rgba[2]-rgba[0])<15    


				  ){
					if(rgba[0]==rgba[1] && rgba[1]==rgba[2] ){
						iClr=1;
						treeGray.addPoint(j,i);
					}
					else{
						if(rgba[0]>rgba[1] && rgba[0]>rgba[2]){
							iClr=2;
							treeRed.addPoint(j,i);
						};
						if(rgba[2]>rgba[1] && rgba[2]>rgba[0]){
							iClr=3;
							treeBlue.addPoint(j,i);
						};
					};
				};
/*
				if(iClr==1)rgba=[50,50,50,255];
				if(iClr==2)rgba=[150,50,50,255];
				if(iClr==3)rgba=[50,50,150,255];

				if(iClr>0)
					this.setRGB(this.x1+j, this.y1+i, rgba);
*/
			};//j

		};//i


		let treeMaroon = new AreaTree();
		treeMaroon.addArea( treeGray );
		treeMaroon.addArea( treeRed );



		for(let i=0; i</*10*/this.h; i++){
		//for(let i=190-40; i<200; i++){


			for(let j=0; j</*10*/this.w; j++){
				iClr=0;
//				if(treeGray.hasPoint(j,i)) iClr=1;
//				if(treeRed.hasPoint(j,i)) iClr=2;
				if(treeBlue.hasPoint(j,i)) iClr=3;
				if(treeMaroon.hasPoint(j,i)) iClr=4;

				if(iClr==1)rgba=[50,50,50,255];
				if(iClr==2)rgba=[150,50,50,255];
				if(iClr==3)rgba=[50,50,150,255];
				if(iClr==4)rgba=[100,50,50,255];

				if(iClr>0)
					this.setRGB(this.x1+j, this.y1+i, rgba);


			};//j

		};//i


	}//by3Colors

	byClasters(){


		let rgba=[0,0,0,0];
		let iClr;


		let aColorAreas=[], aReadyAreas=[];
		let aColorBorders=[];


		//какие цвета окружают с 8-ми сторон текущую точку [j,i]
		let pixelVector = new PixelVector(this);


		
		for(let i=0; i</*10*/this.h; i++){
		//for(let i=190-40; i<200; i++){

/*
			//a9Pxl:
			for(let i1=0; i1<=2; i1++){
				for(let j1=0; j1<=2; j1++)
					delete a9Pxl[i1][j1];
				for(let j1=1; j1<=2; j1++){
					rgba=this.getRGB(this.x0+0+j1-2, this.y0+i+(i1-1));//с учетом смещения для 8 окружающих пикселей
					
					a9Pxl[i1][j1] = new PixelColor(rgba);
				};//j1
			};//i1
*/
			pixelVector.init(this.x0-1,this.y0+i);

			for(let j=0; j</*10*/this.w; j++){


				pixelVector.nextStep();
/*
				//a9Pxl:
				for(let i1=0; i1<=2; i1++){
					delete a9Pxl[i1][0];
					for(let j1=1; j1<=2; j1++){
						a9Pxl[i1][j1-1] = a9Pxl[i1][j1];
					};//j1
					rgba=this.getRGB(this.x0+j+1, this.y0+i+(i1-1));//с учетом смещения для 8 окружающих пикселей
					a9Pxl[i1][2] = new PixelColor(rgba);
				};//i1
*/

				iClr=0;
				rgba = pixelVector.getRGB(0,0);//a9Pxl[1][1].toArray();//rgba = this.getRGB(this.x0+j, this.y0+i);

				pixelVector.calc();//??????



				let iArea=-1;
				for(let k=0; k<aColorAreas.length; k++){
					if(this.isOne(aColorAreas[k].color.toArray(),rgba) && aColorAreas[k].isPointNear(j,i)){ //need merge
						//
						iArea=k;
					};//isOne
				};//k
				if(iArea<0){//если не нашли
					iArea = aColorAreas.push( new ColorArea(rgba) )-1;
				};
				aColorAreas[iArea].addPoint(j,i);

			};//j


			let cArea=aColorAreas.length;
			for(let iArea=cArea-1; iArea>=0; iArea--){
				if(aColorAreas[iArea].rect.y1 < i){
					//эта область уже выше просматриваемых пикселей
					aReadyAreas.push(aColorAreas[iArea]);
					aColorAreas.splice(iArea,1);
					if(aReadyAreas.length % 1000 == 0)
						console.log('1aReadyAreas.length='+aReadyAreas.length);
				};
			};//iArea


		};//i


		if(aColorAreas.length>0){
			let cArea=aColorAreas.length;
			for(let iArea=cArea-1; iArea>=0; iArea--){
				if(aColorAreas[iArea].rect.y1 < this.h){//i
					//эта область уже выше просматриваемых пикселей
					aReadyAreas.push(aColorAreas[iArea]);
					aColorAreas.splice(iArea,1);
				};
			};//iArea
		};

		console.log('2aReadyAreas.length='+aReadyAreas.length);//16000 46000

		let cArea=aReadyAreas.length;
/*
		for(let iArea=cArea-1; iArea>=0; iArea--){
			//

			if(aReadyAreas[iArea].count<100)
				aReadyAreas.splice(iArea,1);
		};
		console.log('3aReadyAreas.length='+aReadyAreas.length);//250 400
		console.log(aReadyAreas);
*/




	}//byClasters

	showLupa(x,y){
		//PixelVector:
		this.controlVector.fill(x,y);//.init(x,y)
		this.controlVector.calc();
		let tbl = this.tblLupa.currHTMLTag;
		let tds = tbl.querySelectorAll('td');
		for(let i=0; i<5; i++){
			for(let j=0; j<5; j++){
				//
				this.rgba=this.getRGB(x+j-2,y+i-2);
				//console.log(x+j-2,y+i-2,this.rgba);
				tds[i*5+j].style='background-color:rgb('+this.rgba[0]+','+this.rgba[1]+','+this.rgba[2]+'); color:rgb('+(255-this.rgba[0])+','+(255-this.rgba[1])+','+(255-this.rgba[2])+'); ';
				//
			};//j
		};//i



		const aWindRose = [ {dx: 0,dy: -1}, {dx: 1,dy:-1}, {dx: 1,dy: 0}, {dx: 1,dy: 1}, {dx: 0,dy: 1}, {dx:-1,dy: 1}, {dx:-1,dy: 0}, {dx:-1,dy:-1}, {dx: 0,dy: 0} ];

		for(let i=0; i<8; i++){
			//
			let xx=2+aWindRose[i].dx;
			let yy=2+aWindRose[i].dy;
			
			tds[yy*5+xx].innerHTML = 'ш'+Math.round(this.controlVector.angle[i].lat*100)/100 + '<br>д'+Math.round(this.controlVector.angle[i].long*100)/100 + '<br>r'+Math.round(this.controlVector.dist[i]*100)/100  ;
		};//i++

		let mu_Equal=this.controlVector.mu_Equal;
		if(mu_Equal)
			mu_Equal=Math.round(mu_Equal*100)/100;
		let mu_Grad=this.controlVector.mu_Grad;
		if(mu_Grad)
			mu_Grad=Math.round(mu_Grad*100)/100;
		tds[2*5+2].innerHTML = 'эк='+mu_Equal+'<br>гр='+mu_Grad;


	}//showLupa


};


export { JPGAnalyzer };