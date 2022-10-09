import { CustomNeuron, CustomNeuralLayer, CustomNeuralNetwork } from './CustomNeural.js';





class Neuron extends CustomNeuron{
	constructor(layer){
		super(layer);
		this.weights=[];
		this.weightBias=0;

	}

	summarize(){
		let inputs = this.layer.last.neurons;
		let output=this.weightBias;
		for(let i=0; i<this.weights.length; i++){
			output += this.weights[i]*inputs[i].output;
		};//i
		return output;
	}

	discriminant(){
		return this.summarize();
	}


}








