class Branch{

	constructor(){
		this.tag=null;
		this.children=[];
	}

	get currHTMLTag(){ return this.tag }

	byIndices(indices){
		let branch = this;
		indices.forEach( (index, level)=>{
			branch = branch.children[index];
		});
		return branch;
	}

	byName(name){
		let result=null;
		function find(branch){
			if(branch.name==name)
				result = branch;
			if(result)
				return;
			if(!Array.isArray(branch.children))
				return;//it's innerHTML
			branch.children.forEach( (child, index)=>{
				if(result)
					return;
				find(child);
			});
		};
		find(this);
		return result;
	}

};


export default class Tag {

	static cr(tagName='', css='', attrs={}, children=[]){
		if(!tagName)
			tagName='div';
		let result = document.createElement(tagName);

		let cssList = css.split(' ');//'#id-of-element first-class second-class'
		if(cssList.length>0)
		cssList.forEach( function(item, i) {
			if(item!=''){
				if(item.charAt(0)=='#')
					result.id = item.slice(1);//id=""
				else
					result.classList.add(item);//class=""
			};
		});

		for(let key in attrs){
			if(key=='style'){//Array
				for(let styleKey in attrs[key]){
					let styleValue = attrs[key][styleKey];
					//result.style[styleKey] = styleValue;//style.=
					result.style.setProperty(styleKey, styleValue);//--color:
				};
			}
			else
				result[key] = attrs[key];//'onclick' must be lowercase
		};

		if(Array.isArray(children)){
			children.forEach((child)=>{
				result.append(child);
			}, this);
		}
		else
			result.innerHTML=children;

		return result;//Створює HTML тег заданої конфігурації з унутрішніми тегами
	}

	static create(scheme_tree){
		let tagName = scheme_tree.tag || '';
		let css = scheme_tree.css || '';
		let attrs = scheme_tree.attrs || {};
		let result = new Branch();
		if(scheme_tree.name)
			result.name = scheme_tree.name;
		let tags = [];//only HTML tags
		if(scheme_tree.children){
			if(Array.isArray(scheme_tree.children)){
				scheme_tree.children.forEach((scheme_branch)=>{
					let branch = Tag.create(scheme_branch);//recursion
					tags.push(branch.tag);
					result.children.push(branch);
				});
			}
			else{
				tags = scheme_tree.children;
				result.children = scheme_tree.children;
			}
		};
		result.tag = Tag.cr(tagName, css, attrs, tags);
		return result;//Повертає дерево із Branch зі створеними в них тегами
	}

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

	event(type,func){
		this.last.currHTMLTag.addEventListener(type, func);
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
	h(num, css=''){
		return this.tag('h'+num,css);
	}
	p(css=''){
		return this.tag('p',css);
	}
	span(css=''){
		return this.tag('span',css);
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


	ul(css=''){
		return this.tag('ul',css);
	}
	ol(css=''){
		return this.tag('ol',css);
	}
	li(css=''){
		return this.tag('li',css);
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