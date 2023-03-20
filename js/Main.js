import PixelColor from './canvas/PixelColor.js';
import ColorMap from './canvas/VirtualCanvas.js';
import Canvas from './canvas/RealCanvas.js';


export default class Main {


	static self;

	constructor(selector=''){
		//if(selector)
			this.init(selector);
	}


	init(selector){



		Main.self=this;





		this.gameField=document.querySelector('#game-field');//=gf
		console.log('this.gameField');
		console.log(this.gameField);

		this.gameRect=document.querySelector('#game-rect');
		this.gameRect.style.visibility = 'hidden';

		this.rect={
	x0:-1,
	y0:-1,
	x1:-1,
	y1:-1,
};


		this.pb = new Canvas('#game-field canvas.dn');
		this.pb2 = new Canvas('#game-field canvas.up');



		this.gameField.addEventListener('mousedown', function(e){
//console.log('mousedown');



let field=e;

//while(field)
//console.log('field.target');
//console.log(field.target);	


	let rect = Main.self.rect;

		rect.x0=field.offsetX;
		rect.y0=field.offsetY;
		rect.x1=field.offsetX;
		rect.y1=field.offsetY;



		Main.self.gameRect.style.top=rect.y0+'px';
		Main.self.gameRect.style.left=rect.x0+'px';


		Main.self.gameRect.style.height=(rect.y1-rect.y0)+'px';
		Main.self.gameRect.style.width=(rect.x1-rect.x0)+'px';


Main.self.gameRect.style.visibility = 'visible';


//console.log('xy = '+Main.self.rect.x0 +', '+ Main.self.rect.y0 );
//console.log(e);


});




		this.gameField.addEventListener('mousemove', function(e){
//	console.log('mousemove');	

	let field=e;//.target;



	let id = field.target.id;
	//'game-rect'
	//''  canvas.up


	if (field.target == Main.self.gameRect){
//		console.log('gameRect');


//		console.log(Main.self.rect);

		if(Main.self.rect.x1>Main.self.rect.x0)
			Main.self.rect.x1=field.offsetX + Main.self.rect.x0;
		else
			Main.self.rect.x1=field.offsetX + Main.self.rect.x1;

		if(Main.self.rect.y1>Main.self.rect.y0)
			Main.self.rect.y1=field.offsetY + Main.self.rect.y0;
		else
			Main.self.rect.y1=field.offsetY + Main.self.rect.y1;
//		console.log(Main.self.rect);




	};

	if (field.target == Main.self.pb2.canvas){
//		console.log('pb2.canvas');


		//field.target.parenElement

		Main.self.rect.x1=field.offsetX;
		Main.self.rect.y1=field.offsetY;


	};


	let rect={};
	rect.x0=Main.self.rect.x0;
	rect.x1=Main.self.rect.x1;
	rect.y0=Main.self.rect.y0;
	rect.y1=Main.self.rect.y1	


	if(rect.y0>rect.y1){
		let tmp=rect.y0;
		rect.y0=rect.y1;
		rect.y1=tmp;
	};

	if(rect.x0>rect.x1){
		let tmp=rect.x0;
		rect.x0=rect.x1;
		rect.x1=tmp;
	};



		//console.log('field.target');
		//console.log(field.target);	

		//console.log('xy = '+rect.x1 +', '+ rect.y1 );


		Main.self.gameRect.style.top=rect.y0+'px';
		Main.self.gameRect.style.left=rect.x0+'px';


		Main.self.gameRect.style.height=(rect.y1-rect.y0)+'px';
		Main.self.gameRect.style.width=(rect.x1-rect.x0)+'px';


});



		this.gameField.addEventListener('mouseup', function(e){
			console.log('mouseup');	
/*
		let rect = Main.self.rect;
rect.x0=-1;
rect.y0=-1;
rect.x1=-1;
rect.y1=-1;

console.log('xy = '+rect.x1 +', '+ rect.y1 );


		Main.self.gameRect.style.top=rect.y0+'px';
		Main.self.gameRect.style.left=rect.x0+'px';


		Main.self.gameRect.style.height=(rect.y1-rect.y0)+'px';
		Main.self.gameRect.style.width=(rect.x1-rect.x0)+'px';

*/
		Main.self.gameRect.style.visibility = 'hidden';


		});



		this.manMap=new Canvas('');//'canvas.third');

this.loaded=false;
this.imgMan = new Image();
//canvas.crossOrigin = 'anonymous';//?
document.body.append(this.imgMan);
this.imgMan.style.visibility = 'hidden';
//this.imgMan.style.display = 'none';

this.imgMan.src = './../images/units/man.bmp';

		this.imgMan.addEventListener('load', function(){

			console.log('imgMan.onLoad:');
			console.log(this);
			//Main.self.manMap.resize(400,200);
			Main.self.manMap.resize(Main.self.imgMan.clientHeight,Main.self.imgMan.clientWidth);
			Main.self.manMap.applImage(Main.self.imgMan,{x:0,y:0});//, w:200,h:400
			//Main.self.manMap.ctx.drawImage(Main.self.imgMan, 30, 10, 150, 160);//?//, kuda.w, kuda.h);

			//Main.self.manMap.put();


		//Main.self.manMap.ctx = Main.self.manMap.canvas.getContext('2d');

		
		//?//Main.self.manMap.resize(Main.self.manMap.canvas.height,Main.self.manMap.canvas.width);

		//Main.self.manMap.refreshImageData();


			Main.self.manMap.refreshImageData();

			Main.self.loaded=true;
		});

		//this.manMap.applImage(imgMan,{x:0,y:0});

		this.timer1 = setInterval(this.run, 5000);//125




	}//init

	onRectDown(){



	}

	onRectMove(){



	}

	onRectUp(){



	}





	resize(height,width){
		this.gameField.style.height = height+'px';
		this.gameField.style.width = width+'px';

		this.pb.resize(height,width);

		this.pb2.resize(height,width);
		this.pb2.paintRect(0,0,250,200,[255,128,255,100]);//+16.7.21


	}


	createCanvas(){

//+3.7.21
// Создаёт элемент canvas
var img32 = document.createElement('canvas');
//var img32 = new Image();
img32.setAttribute('width',32);
img32.setAttribute('height',32);

	}




	run(){
		console.log('run');
		

		if(!Main.self.loaded) return;
		//console.log(Main.self.imgMan);//<img src="images/units/man.bmp">
		console.log(Main.self.manMap);

		//?//Main.self.manMap.refreshImageData();
		console.log( Main.self.manMap.data[4]   );



		let x=Math.round(Math.random()*100+200);
		let y=Math.round(Math.random()*100+200);
		//!!!//Main.self.pb2.applMapFast(x,y,Main.self.manMap);
		Main.self.pb2.appl(Main.self.manMap, {x:x,y:y},  {x:32*4,y:32*17,w:32,h:32} );

		//Main.self.pb2.applImage(Main.self.imgMan,{x:0,y:0, w:200,h:400});

		//?//		
		Main.self.pb2.put();

	}//run



}//export Main