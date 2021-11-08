export default class PixelColor {
	r;
	g;
	b;
	a=255;
	constructor(color){

		if(Array.isArray(color)){
			if(color.length in [3,4] ){
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
		console.log(this);
		return this;
	}

// (r,g,b,a) [r,g,b,a] {r,g,b,a} '#rrggbb'?  'rgba(,,,)'

	toArray(){
		return [this.r, this.g, this.b, this.a];
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