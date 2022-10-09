
const activateFunctions = {
	'identity': x => {return x},//-infinity..+infinity /
	'step' : x => {return x>0?1:0},//0..1 _|`
	'sigmoid' : x => {return 1/(1+Math.exp(-x))},//0..1 _/`
	'tanh' : x => {return(Math.exp(x)-Math.exp(-x))/(Math.exp(x)+Math.exp(-x))},//-1..1 _/`
	'atan' : x => {return Math.atan(x)},//-PI/2..+PI/2  _/`
	'softsign' : x => {return x/(1+Math.abs(x))},//-1..1 _/'
	'gaussian': x => {return Math.exp(-x*x)},//0..1 _/^\_
}





class CustomNeuron{
	constructor(layer){
		this.layer=layer;//owner
		this.activation='sigmoid';
		this.output=0;
	}
	discriminant(){
		return 0;
	}
	activate(){
		this.output=this.discriminant();
		this.output = activateFunctions[this.activation](this.output);
		return this.output;
	}
}


class CustomNeuralLayer{
	constructor(network){
		this.network=network;//owner
		this.neurons=[];
		this.last=null;
		this.next=null;
	}
}


class CustomNeuralNetwork{
	constructor(){
		this.layers=[];
	}

}


class CustomNeuralNetworkCreator{
	constructor(root){
		this.root=root;
		this.currNetwork=null;
		this.currLayer=null;
		this.currNeuron=null;
	}


	addNetwork(){
		this.currNetwork = new CustomNeuralNetwork();
	}

	addLayer(){
		this.currLayer = new CustomNeuralLayer(this.currNetwork);
		this.currNetwork.layers.push(this.currLayer);
	}

	addNeuron(){
		this.currNeuron = new CustomNeuron(this.currLayer);
		this.currLayer.neurons.push(this.currNeuron);
		//setLinks(this.currNeuron)
	}



}




export { CustomNeuron, CustomNeuralLayer, CustomNeuralNetwork };
