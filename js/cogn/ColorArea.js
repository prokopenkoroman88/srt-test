import AreaTree from './../canvas/AreaTree.js';
import PixelColor from './../canvas/PixelColor.js';




export default class ColorArea extends AreaTree{
	owner=null;
	child:[];
	//kind:ca_None;
	constructor(rgba){
		super();

		this.color = new PixelColor(rgba);






	}
















}
