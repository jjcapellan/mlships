/** Rename vars */
var Neat = neataptic.Neat;
var Methods = neataptic.methods;
var Config = neataptic.config;
var Architect = neataptic.architect;

class IAmanager {
  constructor(scene, network, population) {
    this.scene = scene;
    this.network = network;
    this.size = GLOBALS.POPULATION_AMOUNT;
    this.population = population;
    if(!network){
      console.log('no network');
      this.network = new Architect.Random(GLOBALS.INPUTS_SIZE, GLOBALS.START_HIDDEN_SIZE, 2);
    }
    
    this.init();
  }

  init() {
    let t = this;
    this.neat = new neataptic.Neat(6, 2, null, {
      mutation: [
        Methods.mutation.ADD_NODE,
        Methods.mutation.SUB_NODE,
        Methods.mutation.ADD_CONN,
        Methods.mutation.SUB_CONN,
        Methods.mutation.MOD_WEIGHT,
        Methods.mutation.MOD_BIAS,
        Methods.mutation.MOD_ACTIVATION,
        Methods.mutation.ADD_GATE,
        Methods.mutation.SUB_GATE,
        Methods.mutation.ADD_SELF_CONN,
        Methods.mutation.SUB_SELF_CONN,
        Methods.mutation.ADD_BACK_CONN,
        Methods.mutation.SUB_BACK_CONN
      ],
      popsize: t.size,
      mutationRate: GLOBALS.MUTATION_RATE,
      mutationAmount: GLOBALS.MUTATION_AMOUNT,
      equal: true,
      provenance: Math.round(GLOBALS.PROVENANCE_PERCENT * t.size),
      elitism: Math.round(GLOBALS.ELITISM_PERCENT * t.size),
      network: t.network
    });

    if(this.population){
      this.neat.import(t.population[1]);
      this.neat.generation = parseInt(this.population[0]);
    }

    

    this.maxScore = 0; // Max score of all generations
    this.actualMaxScore = 0; // Max score of last generation
  } // end init()

}
