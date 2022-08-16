export default class PixelColor {
	r;
	g;
	b;
	a=255;
	constructor(color){

		if(Array.isArray(color)){
			if(color.length == 3 || color.length == 4 ){
				this.r=color[0];
				this.g=color[1];
				this.b=color[2];
				if(color[3])
					this.a=color[3];
			}
		}
		else{
			if(color.charAt(0)!='#'){
				//https://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes/24390910
				let ctx = document.createElement("canvas").getContext("2d");
				ctx.fillStyle = color;//>=Edge9.0
	 			color = ctx.fillStyle;//'DodgerBlue'  =>  '#1e90ff'
	 		};
			//console.log(parseInt(color.substring(1,6),16)); //66051
			//this.r=parseInt(color.substring(1,2),16);
			//this.g=parseInt(color.substring(3,2),16);
			//this.b=parseInt(color.substring(5,2),16);
			this.encodeColor(parseInt(color.substring(1,3),16), parseInt(color.substring(3,5),16), parseInt(color.substring(5,7),16));
		};

	}



	static  normByte(value){
		if(value<0) return 0;
		if(value>255) return 255;
		return value;
	}


	encodeColor(r,g,b,a=255){
		this.r=PixelColor.normByte(r);
		this.g=PixelColor.normByte(g);
		this.b=PixelColor.normByte(b);
		this.a=PixelColor.normByte(a);
		//console.log(this);
		return this;
	}

// (r,g,b,a) [r,g,b,a] {r,g,b,a} '#rrggbb'?  'rgba(,,,)'

	inverse(){
		this.r=255-this.r;
		this.g=255-this.g;
		this.b=255-this.b;
		return this;
	}

	toColor(){
		function toHex(num){
			let s=num.toString(16);
			if(num<16)
				s='0'+s;
			return s;
		};
		return '#'+toHex(this.r)+toHex(this.g)+toHex(this.b);
	}

	toRGB(bOpacity=false){
		if(bOpacity)
			return 'rgba('+this.r+','+this.g+','+this.b+','+this.a+')'
		else
			return 'rgb('+this.r+','+this.g+','+this.b+')';
	}

	toHSL(){
		return 'hsl('
			+(this.getHue()/Math.PI*180).toFixed(0)+'deg,'
			+(this.getContrast()*100).toFixed(1)+'%,'
			+(this.getBrightness()*100).toFixed(1)+'%'
		+')';
	}

	toArray(){
		return [this.r, this.g, this.b, this.a];
	}

	static calcAverage(rgba){//[0..255]
		return (rgba[0]+rgba[1]+rgba[2])/3;
	}

	static calcBrightness(rgba){//[0..255]
		return PixelColor.calcAverage(rgba);
	}

	static calcContrast(rgba){//[0..255]
		return (
		Math.abs(rgba[0]-rgba[1])+
		Math.abs(rgba[1]-rgba[2])+
		Math.abs(rgba[2]-rgba[0])) /2;
	}

	static calcHue(rgba){//[0..1529]
		function calc(shift,left,center,right)
		{
			if (center==left ) return (shift+0)*255;
			if (left  ==right) return (shift+1)*255;
			if (center==right) return (shift+2)*255;

			if (left>right) return (shift+1)*255 +   Math.round((right-left)/(center-right)*255);
			if (right>left) return (shift+1)*255 +   Math.round((right-left)/(center-left)*255);
		};
		let r=rgba[0], g=rgba[1], b=rgba[2];
		let hue;

		if((r<=g)&&(g>=b)) hue=calc(1,r,g,b); //r<=g g>=b
		if((g<=b)&&(b>=r)) hue=calc(3,g,b,r); //g<=b b>=r
		if((b<=r)&&(r>=g)) hue=calc(5,b,r,g); //b<=r r>=g

		return hue % 1530;
	}

	getBrightness(){//Яркость [0..1] снизу вверх
		return PixelColor.calcBrightness(this.toArray())/255;
	}

	getContrast(){//Контраст [0..1] от центральной оси к поверхности шара 
		return PixelColor.calcContrast(this.toArray())/255;
	}

	getHue(){//Оттенок [0..2*PI] по кругу все цвета радуги
		return PixelColor.calcHue(this.toArray())/1529*2*Math.PI;
	}

	getColorCoords(){
		let radius = this.getContrast();
		return {
			x:Math.sin(this.getHue())*radius, 
			y:Math.cos(this.getHue())*radius, 
			z:this.getBrightness()*2-1
		};
		//x:[-1..1], y:[-1..1], z:[-1..1]
	}

}


/*
let c0 = [];
c0['r']=123;
c0['g']=234;
c0['b']=65;
c0['a']=255;
console.log('c0=');
console.log(c0);
[r: 123, g: 234, b: 65, a: 255]
a: 255
b: 65
g: 234
r: 123
length: 0
[[Prototype]]: Array(0)
*/

/*
let c0 ={
r:123,
g:234,
b:65,
a:255
};

console.log('c0=');
console.log(c0);

for(let key in c0){
console.log('c0.'+key+' = '+c0[key]);
};

`
c0=
script.js:51 {r: 123, g: 234, b: 65, a: 255}
a: 255
b: 65
g: 234
r: 123[[Prototype]]: Object

script.js:54 c0.r = 123
script.js:54 c0.g = 234
script.js:54 c0.b = 65
script.js:54 c0.a = 255
`


for(let i=0; i<c0.keys.length; i++){
	console.log('c0=['+i+']');
	console.log(c0[i]);
};//bad((((((((

*/