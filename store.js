const layerHeight = 0.4;

// TODO: add bone hawks, zeppelins, etc predicated on certain tower heights
// then move to planets/galaxies
const store = {
	stack: {
	  text: "BONE STACK",
	  cost: 500,
	  detail: "Stack bones "+layerHeight+" meters high",
	  boneRate: 0,
	  storeButton: null,
	  rampOverride: 0,
	  onBuy: function () {
		log(
		  "You construct a giant, glistening gray-yellow layer of <span class='gray'>BONE TOWER</span>.",
		);
		height += layerHeight;
	  },
	},
	sprite: {
	  text: "BONE SPRITE",
	  cost: 10,
	  boneRate: 0.1,
	  detail: "The simplest bone construct. Brainless and feeble.",
	  storeButton: null,
	  onBuy: function () {
		log(
		  "You stick two bones together to form a <span class='blue'>BONE SPRITE</span>.<br>It flutters over to the nearest femur.",
		);
		plain.add("sprite");
	  },
	},
	imp: {
	  text: "BONE IMP",
	  cost: 100,
	  boneRate: 1,
	  detail: "Quick and nimble. Eagerly does your bidding.",
	  storeButton: null,
	  onBuy: function () {
		log(
		  "You construct a <span class='blue'>BONE IMP</span>.<br>It chuckles merrily as it begins collecting.",
		);
		plain.add("imp");
	  },
	},
	ogre: {
	  text: "BONE OGRE",
	  cost: 900,
	  boneRate: 10,
	  detail: "Large and fast, but dim-witted.",
	  storeButton: null,
	  onBuy: function () {
		log(
		  "You construct a <span class='blue'>BONE OGRE</span>.<br>It growls in satisfaction as it begins its work.",
		);
		plain.add("ogre");
	  },
	},
	golem: {
	  text: "BONE GOLEM",
	  cost: 9000,
	  boneRate: 30,
	  detail: "Giant and ungainly, but can hold many bones in its skeletal arms.",
	  storeButton: null,
	  onBuy: function () {
		log(
		  "You construct a <span class='blue'>BONE GOLEM</span>.<br>It groans as it starts up.",
		);
		plain.add("golem");
	  },
	},
	giant: {
	  text: "BONE GIANT",
	  cost: 50000,
	  boneRate: 50,
	  detail: "Massive, overwhelming, and thick.",
	  storeButton: null,
	  onBuy: function () {
		log(
		  "You construct a <span class='blue'>BONE GIANT</span>.<br>Its treetrunk-sized legs stretch into the sky.",
		);
		plain.add("giant");
	  },
	},
	carpenter: {
		text: "IMP CARPENTER",
		cost: 10000,
		boneRate: -100,
		layerRate: 0.1,
		detail: "Promote an <span class='blue'>Imp</span> to build BONE LAYERS.",
		onBuy: function () {
		  plain.add("carpenter");
		},
		predicate: () => height > 10 && boneRate > 100
	  },
	  worker: {
		text: "OGRE WORKER",
		cost: 50000,
		boneRate: -500,
		layerRate: 0.5,
		detail: "Promote an <span class='blue'>Ogre</span> to build BONE LAYERS.",
		onBuy: function () {
		  plain.add("worker");
		},
		predicate: () => height > 50 && boneRate > 500
	  },
	crane: {
	  text: "BONE CRANE",
	  cost: 100000,
	  boneRate: -10000,
	  layerRate: 1,
	  detail: "Build an automaton to perch on the side of your bone tower.",
	  onBuy: function () {
		log(
		  "You construct a <span class='gray'>BONE CRANE</span>.<br>It creaks into movement.",
		);
		plain.add("crane");
	  },
	  predicate: () => height > 100 && boneRate > 10000
	},
  };


// todo: imp overseers for cranes, imp carpenters? don't just jump straight to cranes
// ogre laborers
// ogre engineers
// ogre site managers
const upgrades = {
  bought: [],
  has: function (itemName) {
    return this.bought.indexOf(itemName) >= 0;
  },
  "Bone Bag": {
    cost: 100,
    detail: "A bag to gather bones with.",
    effect:
      "Personal bone collecting is <span class='blue'>twice</span> as efficient.",
    onBuy: function () {
      buffs.collectMultiplier *= 2;
    },
  },
  "Bone Sack": {
    cost: 500,
    detail: "A larger sack to gather bones with.",
    effect:
      "Personal bone collecting is <span class='blue'>twice</span> as efficient.",
    predicate: function () {
      return upgrades.has("Bone Bag");
    },
    onBuy: function () {
      buffs.collectMultiplier *= 2;
    },
  },
  "Bone Pit": {
    cost: 10000,
    detail: "Dump the bones in the pit you dug out.",
    effect:
      "Personal bone collecting is <span class='blue'>twice</span> as efficient.",
    predicate: function () {
      return upgrades.has("Bone Sack");
    },
    onBuy: function () {
      buffs.collectMultiplier *= 2;
    },
  },
  "Sprite Impetus": {
    cost: 100,
    detail: "Give sprites a better understanding of their purpose.",
    effect: "Bone Sprites are <span class='blue'>twice</span> as efficient.",
    predicate: function () {
      return plain.count("sprite") >= 1;
    },
    onBuy: function () {
      buffs.sprite.boneMultiplier *= 2;
      log("You endow the BONE SPRITES with a bit of knowledge.");
    },
  },
  "Sprite Drive": {
    cost: 500,
    detail: "Give sprites an even better understanding of their purpose.",
    effect: "Bone Sprites are <span class='blue'>twice</span> as efficient.",
    predicate: function () {
      return plain.count("sprite") >= 10 && upgrades.has("Sprite Impetus");
    },
    onBuy: function () {
      buffs.sprite.boneMultiplier *= 2;
      log("You endow the BONE SPRITES with some desire.");
    },
  },
  "Sprite Desire": {
    cost: 10000,
    detail: "Give sprites an even better understanding of their purpose.",
    effect: "Bone Sprites are <span class='blue'>twice</span> as efficient.",
    predicate: function () {
      return plain.count("sprite") >= 20 && upgrades.has("Sprite Drive");
    },
    onBuy: function () {
      buffs.sprite.boneMultiplier *= 2;
      log("You endow the BONE SPRITES with some desire.");
    },
  },
  "Sprite Ambition": {
    cost: 50000,
    detail: "Give Sprites an internal understanding of their purpose",
    effect: "Bone Sprites are <span class='blue'>twice</span> as efficient.",
    predicate: function () {
      return plain.count("sprite") >= 50 && upgrades.has("Sprite Desire");
    },
    onBuy: function () {
      buffs.sprite.boneMultiplier *= 2;
      log("You endow the BONE SPRITES with some desire.");
    },
  },
  "Imp Treats": {
    cost: 1000,
    detail: "Makes imps excited to work faster.",
    effect: "Bone Imps are <span class='blue'>twice</span> as efficient.",
    predicate: function () {
      return plain.count("imp") >= 1;
    },
    onBuy: function () {
      buffs.imp.boneMultiplier *= 2;
      log("The BONE IMPS love their snacks.");
    },
  },
  "Imp Morsels": {
    cost: 3000,
    detail: "Makes imps excited to work faster.",
    effect: "Bone Imps are <span class='blue'>twice</span> as efficient.",
    predicate: function () {
      return plain.count("imp") >= 10 && upgrades.has("Imp Treats");
    },
    onBuy: function () {
      buffs.imp.boneMultiplier *= 2;
      log("The BONE IMPS love their little morsels.");
    },
  },
  "Imp Banquets": {
    cost: 15000,
    detail: "Makes imps more excited to work faster.",
    effect: "Bone Imps are <span class='blue'>twice</span> as efficient.",
    predicate: function () {
      return plain.count("imp") >= 30 && upgrades.has("Imp Morsels");
    },
    onBuy: function () {
      buffs.imp.boneMultiplier *= 2;
      log("The BONE IMPS love their group dinners.");
    },
  },
  "Imp Feasts": {
    cost: 15000,
    detail: "Makes imps extremely excited to work faster.",
    effect: "Bone Imps are <span class='blue'>twice</span> as efficient.",
    predicate: function () {
      return plain.count("imp") >= 500 && upgrades.has("Imp Feasts");
    },
    onBuy: function () {
      buffs.imp.boneMultiplier *= 2;
      log("The BONE IMPS love their feasts.");
    },
  },
  "Ogre Jawbreakers": {
    cost: 5000,
    detail: "Bone Ogres drool at the thought of these little white globules.",
    effect: "Bone Ogres are <span class='blue'>twice</span> as efficient.",
    predicate: function () {
      return plain.count("ogre") >= 1;
    },
    onBuy: function () {
      buffs.ogre.boneMultiplier *= 2;
      log("The BONE OGRES crunch happily.");
    },
  },
  "Sweet Jawbreakers": {
    cost: 10000,
    detail: "Bone Ogres crunch them down as they work.",
    effect: "Bone Ogres are <span class='blue'>twice</span> as efficient.",
    predicate: function () {
      return plain.count("ogre") >= 10 && upgrades.has("Ogre Jawbreakers");
    },
    onBuy: function () {
      buffs.ogre.boneMultiplier *= 2;
      log("The BONE OGRES crunch even more happily.");
    },
  },
  "Golem Grease": {
    cost: 20000,
    detail: "Golems creak less.",
    effect: "Bone Golems are <span class='blue'>twice</span> as efficient.",
    predicate: function () {
      return plain.count("golem") >= 1;
    },
    onBuy: function () {
      buffs.golem.boneMultiplier *= 2;
      log("The BONE GOLEMS love their grease.");
    },
  },
  "Improved Grease": {
    cost: 50000,
    detail: "Your Bone Golems are buttery smooth.",
    effect: "Bone Golems are <span class='blue'>twice</span> as efficient.",
    predicate: function () {
      return plain.count("golem") >= 10 && upgrades.has("Golem Grease");
    },
    onBuy: function () {
      buffs.golem.boneMultiplier *= 2;
      log("The BONE GOLEMS love their new grease.");
    },
  },
  "Eldritch Grease": {
    cost: 100000,
    detail: "Your Bone Golems' joints glow purple.",
    effect: "Bone Golems are <span class='blue'>twice</span> as efficient.",
    predicate: function () {
      return plain.count("golem") >= 40 && upgrades.has("Improved Grease");
    },
    onBuy: function () {
      buffs.golem.boneMultiplier *= 2;
      log("The BONE GOLEMS are a little too eager for their new grease.");
    },
  },
  "Imp-Biters": {
    cost: 75000,
    detail: "Give Sprites sharp teeth to encourage the Imps. Imps hate it!",
    effect: "Imps gain <span class='blue'>0.1% BpS</span> per Sprite.",
    predicate: function () {
      return plain.count("sprite") >= 10 && plain.count("imp") >= 20;
    },
    onBuy: function () {
      buffs.imp.multipliers.push((x) => {
        return x + (plain.count("sprite") * 0.01);
      });
    },
  },
  "Imp-Beaters": {
    cost: 100000,
    detail: "Give Ogres a club to encourage the Imps. Imps hate it!",
    effect: "Imps gain <span class='blue'>0.5% BpS</span> per Ogre.",
    predicate: function () {
      return plain.count("ogre") >= 10 && plain.count("imp") >= 40;
    },
    onBuy: function () {
      buffs.imp.multipliers.push((x) => {
        return x + (plain.count("ogre") * 0.05);
      });
    },
  },
  "Imp-Breakers": {
    cost: 500000,
    detail: "Give Golems permission to crush unruly Imps. Imps hate it!",
    effect: "Imps gain <span class='blue'>1% BpS</span> per Golem.",
    predicate: function () {
      return plain.count("golem") >= 20 && plain.count("imp") >= 100;
    },
    onBuy: function () {
      buffs.imp.multipliers.push((x) => {
        return x + (plain.count("golem") * 0.1);
      });
    },
  },
};