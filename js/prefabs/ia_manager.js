/** Rename vars */
var Neat = neataptic.Neat;
var Methods = neataptic.methods;
var Config = neataptic.config;
var Architect = neataptic.architect;

class IAmanager {
  constructor(scene) {
    this.scene = scene;
    this.init();
  }

  init() {
    this.neat = new neataptic.Neat(OBSTACLES_DETECTION * 4 + 3, 3, null, {
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
      popsize: POPULATION_AMOUNT,
      mutationRate: MUTATION_RATE,
      mutationAmount: MUTATION_AMOUNT,
      equal: true,
      elitism: Math.round(ELITISM_PERCENT * POPULATION_AMOUNT),
      network: new Architect.Random(OBSTACLES_DETECTION * 2 + 1, START_HIDDEN_SIZE, 2)
    });

    

    this.maxScore = 0; // Max score of all generations
    this.actualMaxScore = 0; // Max score of last generation

    /*if(localStorage.getItem('generation')){      
      this.maxScore = parseInt(localStorage.getItem('topScore'));
      this.neat.generation = parseInt(localStorage.getItem('generation'));
      let populationJSON = JSON.parse(localStorage.getItem('population'));
      this.neat.import(populationJSON);
    }*/
  } // end init()

}
