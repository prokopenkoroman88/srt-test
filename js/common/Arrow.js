//import { aWindRose, aPointSect } from './../system.js';

const aWindRose=//aArrow
[{dx: 0,dy:-1}
,{dx: 1,dy:-1}
,{dx: 1,dy: 0}
,{dx: 1,dy: 1}
,{dx: 0,dy: 1}
,{dx:-1,dy: 1}
,{dx:-1,dy: 0}
,{dx:-1,dy:-1}
,{dx: 0,dy: 0}
];

const aPointSect=
[[7,0,1]
,[6,8,2]
,[5,4,3]
];

export default class Arrow{
	static N = 0;
	static NE = 1;
	static E = 2;
	static SE = 3;
	static S = 4;
	static SW = 5;
	static W = 6;
	static NW = 7;
	static get windRose(){
		return aWindRose;
	}
	static get pointSect(){
		return aPointSect;
	}
	static step(look){
		if(typeof look == 'string')
			look = Arrow[look];
		return aWindRose[look];
	}
	static incLook(look, incValue=1){
		return (look + incValue + 8) % 8;
	}
	static decLook(look, decValue=1){
		return (look - decValue + 8) % 8;
	}
	static invLook(look){//inverse
		return Arrow.incLook(look,4);
	}

	static forLooks(startLook,finishLook,func){
		let times=finishLook-startLook+1;
		if(finishLook<startLook) times+=8;
		let look=startLook;
		for(let iter=0; iter<times; iter++){
			func(look);
			look=Arrow.incLook(look);
		};
	}

	static angleByLook(look){
		return look/8 * 2*Math.PI;
	}
	static lookByAngle(angle){
		return (angle/(2*Math.PI) * 8)%8;
	}
}
