//import ColorMap from './Pic.js';
//import Canvas from './canvas.js';
import ColorMap from './canvas/VirtualCanvas.js';
import Canvas from './canvas/RealCanvas.js';
import PixelColor from './canvas/PixelColor.js';
import Main from './Main.js';


var main = new Main('');
main.resize(2000,2500);









//green rect:
let cm = new ColorMap(32,50);//h,w,bRes
cm.paintRect(0,0,50,2,[0,64,64,100]);//top
cm.paintRect(0,0,2,32,[0,64,64,100]);//left
cm.paintRect(0,30,50,2,[0,64,64,100]);//bottom
cm.paintRect(48,0,2,32,[0,64,64,100]);//right
cm.setRGB(10,20,[0,0,255,255]);





let pc = new PixelColor('rgba(16,32,48,128)');
let pc1 = new PixelColor('DodgerBlue');



//---------------------------------


function rand(rgba,diap){
	for(let i=0; i<3; i++)
		rgba[i]=ColorMap.normByte(rgba[i]+Math.random()*diap-diap/2);
	rgba[3]=255;
	return rgba;
};




//?? pb2


var img0 = new Image();
img0.height = 100;
img0.width = 100;


console.log('img0:');
console.log(img0);


var img = new Image();
var png = new Image();
//canvas.crossOrigin = 'anonymous';//?

img.src = 'images/z0.bmp';
png.src = 'images/favicon.png';
//img.crossOrigin = 'anonymous';
//png.crossOrigin = 'anonymous';


png.addEventListener('load',function(){
//????????//canvas=document.querySelector('#game-field canvas');//'.canvas'
main.pb.init('#game-field canvas.dn');

let x0=15,y0=3,w=90,h=70;
//

console.log('canvas.width='+main.pb.canvas.width);
console.log('canvas.height='+main.pb.canvas.height);

//?	ctx.drawImage(img,x0,y0,w,h);

x0=1;y0=13;

//?	ctx.drawImage(png,x0,y0,w,h);


//img.crossOrigin = 'anonymous';
//png.crossOrigin = 'anonymous';
//img.style.display='none';
//png.style.display='none';






});//png.load

//document.body.
main.pb.canvas.onmousemove = function(){

//canvas=document.querySelector('.canvas');
//ctx = canvas.getContext('2d');
//console.log('canvas.width='+canvas.width);
//console.log('canvas.height='+canvas.height);
main.pb.ctx.beginPath();
main.pb.ctx.moveTo(10,94);
main.pb.ctx.lineTo(90,94);

main.pb.ctx.stroke();
};


//img.src = 'images/z1.bmp';





function click(){


//img.style.display='none';

let x0=15,y0=3,w=50,h=70;
x0=1;y0=13;
//?	ctx.drawImage(png,x0,y0,w,h);
png.style.display='none';
//img.crossOrigin = 'anonymous';
//png.crossOrigin = 'anonymous';

var imageData = main.pb.imageData;//???????????//ctx.getImageData(0, 0, canvas.width, canvas.height);


x0=5;y0=4;


//????????????????//



console.log('imageData.length='+imageData.data.length);


for(let y=0; y<main.pb.canvas.height; y++){
	for(let x=0; x<main.pb.canvas.width; x++){

		if(((y) % 32)==0  )continue;
		if(((x) % 32)==0  )continue;

		let rgba=rand([125,225,75,255],50);
		main.pb.setRGB(x,y,rgba);
	};//x++
};//y++



/*
for(let i=0; i<imageData.data.length; i+=4){


let y=Math.floor(i/(4*canvas.width));
let x=Math.floor((i-y*4*canvas.width)/4);

if(((y) % 32)==0  )continue;
if(((x) % 32)==0  )continue;

imageData.data[i+0]=100+Math.random()*25;
imageData.data[i+1]=200+Math.random()*50;
imageData.data[i+2]=50+Math.random()*50;
imageData.data[i+3]=255;

};
//*/

  //main.pb.ctx.putImageData(imageData,0,0);
console.log('E');


//?	
w=32;h=32;
main.pb.ctx.drawImage(png,x0,y0,w,h);



main.pb.put();


};//func click

document.querySelector('button').onclick=click;

	






//pb2.applMap(50,40,cm);

//pb2.applMap(150,40,cm);






main.pb2.put();//pb2.ctx.putImageData(pb2.imageData,0,0);
//pb2.init('#game-field canvas.up');


//console.log('pb2.imageData');
//console.log(main.pb2.imageData);




var imgMan = new Image();
//canvas.crossOrigin = 'anonymous';//?

imgMan.src = 'images/units/man.bmp';

/*
let cmMan = new ColorMap(32,32);//h,w,bRes
pbTmp.ctx.drawImage(imgMan,0,0);
cmMan.copyFrom(pbTmp.dataImage,32*3,32*5);
????????????????????????


*/

//var timer1 = setInterval(run, 125);



function run(){
let mans = document.querySelectorAll('#units .unit-man');

//console.log(mans);



//7% 125ms
for(let y=0; y<400; y+=605){
	for(let x=0; x<900; x+=288){
		//main.pb.ctx.drawImage(imgMan,x,y);
		main.pb.applImage(imgMan,{x:x,y:y,w:0,h:0});
	};//x++
};//y++


/*
//8% 125ms
for(let y=0; y<400; y+=32){
	for(let x=0; x<900; x+=32){
		pb.ctx.drawImage(png,x,y);
	};//x++
};//y++
*/

/*
//15% 250ms
//27% 125ms
for(let y=0; y<400; y++){
	for(let x=0; x<900; x++){
//55%
//for(let y=0; y<pb.canvas.height; y++){
//	for(let x=0; x<pb.canvas.width; x++){

		if(((y) % 32)==0  )continue;
		if(((x) % 32)==0  )continue;

		let rgba=rand([125,225,75,255],50);
		pb.setRGB(x,y,rgba);
	};//x++
};//y++
  pb.ctx.putImageData(pb.imageData,0,0);
*/


//40%
//mans[0].style.left = parseInt(mans[0].offsetLeft)+Math.random()*10-4+'px';
//mans[0].style.top = parseInt(mans[0].offsetTop)+Math.random()*10-4+'px';

};// every 125ms







