import { CustomNeuron, CustomNeuralLayer, CustomNeuralNetwork } from './CustomNeural.js';



/*

attr1          [interval]         [interval]
attr2 [interval]       [interval]
attr3                          [interval]         [interval]






attribs  intervals        attr classes           classes                   defuzzyfication


Attr1
          interval1        >min  Class1
          interval2
          interval3        >min  Class2

                                                  >max   class1
Attr2
          interval1        >min  Class1
          interval2                                                                result Class
          interval3        >min  Class2

                                                  >max   class2

Attr3
          interval1        >min  Class1
          interval2
          interval3        >min  Class2



        neuron.class='1'    neuron.class='1'        neuron.class='1'
        neuron.attr='2'     neuron.attr='2'
        neuron.interval=[_3/4 7\8_]




*/



class FuzzyNeuron extends CustomNeuron{
	constructor(layer){
		super(layer);
		this.minFuzzy=0;
		this.minSolid=0;
		this.maxSolid=0;
		this.maxFuzzy=0;
		this.class=-1;
	}

	mu(){
		//
	}

	discriminant(){
		return this.mu();
	}

}




class FuzzyNeuralNetwork extends CustomNeuralNetwork{
	constructor(){
		super();
		this.attributes=[];
		this.classes=[];
	}

}




