import PixelColor from './PixelColor.js';

export default class CustomCanvas {




	static  normByte(value){
		if(value<0) return 0;
		if(value>255) return 255;
		return value;
	}


	static encodeColor(r,g,b,a=255){
		r=CustomCanvas.normByte(r);
		g=CustomCanvas.normByte(g);
		b=CustomCanvas.normByte(b);
		a=CustomCanvas.normByte(a);
		return [r,g,b,a];
	}

// (r,g,b,a) [r,g,b,a] {r,g,b,a} '#rrggbb'?  'rgba(,,,)'



	static newImage(src){
		let img = new Image();
		//canvas.crossOrigin = 'anonymous';//?
		img.src = src;//'images/units/man.bmp';
	}





	constructor(){
		this.height=0;
		this.width=0;
		this.data = null;//new Uint8ClampedArray(this.height*this.width*4);
	}

	resize(height,width){
		this.height=height;
		this.width=width;
	}


	setRGB(x,y,rgba){
		let i = (y*this.width+x) * 4;
		//this.imageData.data.splice(i, 4, rgba);
		for(let j=0; j<4; j++)
		this.data[i+j]=rgba[j];//rgba=[r,g,b,a]//.imageData.data[i+j]
		//console.log(x, y, i, rgba[0], this.imageData.data[i+0]);

	}

	getRGB(x,y){
		let rgba=[];
		let i = (y*this.width+x) * 4;
		//this.imageData.data.splice(i, 4, rgba);
		for(let j=0; j<4; j++)
		rgba.push(this.data[i+j]);//rgba=[r,g,b,a]
		return rgba;
	}

	setPixel(x,y,pixel){
		this.setRGB(x,y,pixel.toArray());
	}

	getPixel(x,y){
		let rgba=getRGB(x,y);
		return new ColorPixel(rgba);
	}



	paintRect(x,y,w,h,rgba){//+16.7.21
		for(let i=0; i<h; i++)
			for(let j=0; j<w; j++)
				this.setRGB(x+j, y+i, rgba);
	}


	applMap(x,y, cm){//(x,y, ColorMap cm)
		let h=cm.height;
		let w=cm.width;
		console.log('applMap',h,w, x, y);
		for(let i=0; i<h; i++)
			for(let j=0; j<w; j++){
				//let rgba=cm.getRGB(j,i);
				//this.setRGB(x+j, y+i, rgba);
			
				//if (i>5 && i<15 && j>10 && j<30)
				//console.log(x,j,y,i,rgba, this.getRGB(x+j, y+i));//rgba
				this.setRGB(x+j, y+i, cm.getRGB(j,i));
			}
	}

	applMapFast(x,y, cm){//(x,y, ColorMap cm)
		let h=cm.height;
		let w=cm.width;
		for(let i=0; i<h; i++){
			let i0= ((y+i)*this.width+x) * 4;
			let i1= i*w*4;
			for(let j=0; j<w*4; j++)
				//this.setRGB(x+j, y+i, cm.getRGB(j,i));
				//this.data[ i0 + j ] = cm.data[ i1 + j ];
				this.data[ i0++ ] = cm.data[ i1++ ];
		};
	}



	appl(cm, kuda={}, from={}){//(x,y, ColorMap cm)


		if(kuda=={}){
			kuda.x=0;
			kuda.y=0;
		};

		if(from=={}){
			from.x=0;
			from.y=0;
		};
		if(!from.w)from.w=cm.width;
		if(!from.h)from.h=cm.height;

		let h=from.h;
		let w=from.w;

		for(let i=0; i<h; i++)
			for(let j=0; j<w; j++)
				this.setRGB(kuda.x+j, kuda.y+i, cm.getRGB(from.x+j,from.y+i));
	}




}//class CustomCanvas