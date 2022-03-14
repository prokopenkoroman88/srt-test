export default class JSONLoader {

	constructor(obj){
		if(obj)
			this.objToStr(obj);
	}

	objToStr(obj){
		this.obj=obj;
		this.str=JSON.stringify(this.obj, null, '\t');
		//console.log(this.str);
		return this;
	}

	saveToFile(filename = "data.json", type_of = "text/plain"){
		const a = document.createElement("a");
		a.href = URL.createObjectURL(new Blob([this.str], { type: type_of }));
		a.setAttribute("download", filename);
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		return this;
	}


/*
			var fs = require('fs');
			fs.writeFile('test.json', jsonData, function(err){
				if(err)console.log(err);
			});

*/

/*
			//let ed = BezierEditor.editor.canvas;
let obj={
	points:ed.points,
	splines:ed.splines,
};


for(let i=0; i<ed.splines.length; i++){
	//
	let spline = obj.splines[i];//{controlPoint:[],leverPoint:[]};


	let ids = new Array(2);
	ids[0] = ed.points.indexOf(ed.splines[i].controlPoint[0]);
	ids[1] = ed.points.indexOf(ed.splines[i].controlPoint[1]);

	spline.controlPoint=[];
	spline.controlPoint.push(ids[0]);
	spline.controlPoint.push(ids[1]);



//	obj.splines.push(spline);
};//i
*/
/*
	idx = ed.points.indexOf(ed.splines[i].leverPoint[0]);
	spline.leverPoint.push(idx);
	idx = ed.points.indexOf(ed.splines[i].leverPoint[1]);
	spline.leverPoint.push(idx);
	spline.width = ed.splines[i].width;
	spline.color = ed.splines[i].color;
*/

/*
class JavascriptDataDownloader {

    constructor(data={}) {
        this.data = data;
    }

    download (type_of = "text/plain", filename= "\\srt-test\\data.json") {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify(this.data, null, 2)], {
            type: type_of
        }));
        a.setAttribute("download", filename);
         document.body.appendChild(a);
        a.click();
         document.body.removeChild(a);
    }
} 
//{"greetings": "Hello World"}
new JavascriptDataDownloader(obj).download();
*/
}
