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
    this.neat = new neataptic.Neat(3, 2, null, {
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
      popsize: GLOBALS.POPULATION_AMOUNT,
      mutationRate: GLOBALS.MUTATION_RATE,
      mutationAmount: GLOBALS.MUTATION_AMOUNT,
      equal: true,
      provenance: Math.round(GLOBALS.PROVENANCE_PERCENT * GLOBALS.POPULATION_AMOUNT),
      elitism: Math.round(GLOBALS.ELITISM_PERCENT * GLOBALS.POPULATION_AMOUNT),
      network: new Architect.Random(3, GLOBALS.START_HIDDEN_SIZE, 2)
    });

    

    this.maxScore = 0; // Max score of all generations
    this.actualMaxScore = 0; // Max score of last generation
  } // end init()

}
