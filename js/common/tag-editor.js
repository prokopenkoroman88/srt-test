export default class Tag {

	constructor(parent,currHTMLTag){//currHTMLTag = root = div.excel
		this.init(currHTMLTag);


		if(parent.constructor.name=='Tag'){//parent is of the same class
			this.parent=parent;
			this.owner=this.parent.owner;
		}
		else{//root
			this.owner=parent;
			this.parent=null;
		};

		if(this.parent)
			this.parent.children.push(this);
		this.children=[];
		this.last=null;
	}


	init(currHTMLTag){
		this.currHTMLTag=currHTMLTag;
	}

	tag(name,css=''){

		if(!name)name='div';
		let newTag = document.createElement(name);
		let cssList = css.split(' ');//'#id-of-element first-class second-class'

		if(cssList.length>0)
		cssList.forEach( function(item, i) {
			if(item!=''){
				if(item.charAt(0)=='#')
					newTag.id = item.slice(1);//id=""
				else
					newTag.classList.add(item);//class=""
			};
		});

		this.currHTMLTag.append(newTag);//root
		this.last = new Tag(this, newTag);// = let child
		//child.parent=this;
		//this.children.push(child);
		return this;
	}


	dn(){
		if(!this.children)
			return this//?
		else
			return this.last;//this.children[ this.children.length-1 ];
	}

	up(){
		return this.parent;
	}

	assignTo(prop){//toTag
		//toTag=this;
		//obj[prop]=this.last;
		this.owner[prop]=this.last;
		return this;
	}


	inner(content){
		this.dn().currHTMLTag.innerHTML=content;
		return this;
	}


	attr(name,value=''){
		this.last.currHTMLTag.setAttribute(name,value);
		return this;
	}


	// return boolean!!!!!!!!
	isTag(tagName){
		return this.currHTMLTag.tagName.toLowerCase()==tagName.toLowerCase();
	}
//concrete tags


	div(css=''){
		return this.tag('div',css);
	}



	h1(css=''){
		return this.tag('h1',css);
	}
	h2(css=''){
		return this.tag('h2',css);
	}

	button(css=''){
		return this.tag('button',css);
	}

	input(css='', type='text'){
		//return this.tag('input',css);
		let newTag = this.tag('input',css).dn().currHTMLTag;
		//newTag.setAttribute('type',type);
		this.attr('type',type);
		return this;
	}





//tables:
	table(css=''){
		return this.tag('table',css);
	}

	tr(css=''){
		return this.tag('tr',css);
	}

	td(css=''){
		return this.tag('td',css);
	}

	//use: .table('').dn().trtd(
	trtd(cssTR, cssTD,  data){//Array
		if(!this.isTag('table'))error();

		//this.currHTMLTag = <table>
		let currTable = this;
		if(Array.isArray(data))
		for(let i=0; i<data.length; i++){
			let newTR = currTable.tr(cssTR).dn();
			if(Array.isArray(data[i]))
			for(let j=0; j<data[i].length; j++){
				//let newTD = newTR.td(cssTD).dn();
				//newTD.up().inner(data[i][j])
				newTR.td(cssTD).inner(data[i][j]);//alternative
			};//j++
		};//i++

		return this;//table
	}



}