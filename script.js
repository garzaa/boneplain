var bones = 0;
var height = 0;
var maxBones = 0;

// ticks per second
const tickRate = 1 / 5;
const frameRate = 1 / 60;

var focusLoseTime = 0;

let buffs = {
  collectMultiplier: 1,
};

let stats = {
  boneClicks: 0,
  handGatheredBones: 0,
}

// atmosphere: 10,000,000 m
// everest: 8,848 m

let boughtItems = {};

let boneRate = 0;

function gatherBone() {
  let toTake = 1 * buffs.collectMultiplier;
  bones += toTake;
  
  takeBone(1 * buffs.collectMultiplier);
  updateBoneDisplay();
  stats.boneClicks += 1;
  stats.handGatheredBones += toTake;
}

function getBoneRate(itemName) {
  if (!(itemName in plain.entities)) {
    return 0;
  }
  let bm = buffs[itemName].boneMultiplier || 1;
  let m = 1;
  for (let i=0; i<buffs[itemName].multipliers.length; i++) {
    m = buffs[itemName].multipliers[i](m);
  }
  return store[itemName].boneRate * bm * m * plain.entities[itemName].count;
}

function updateAllTooltips() {
  tooltips = document.querySelectorAll(".tooltip");
  document.addEventListener("mousemove", tooltipHover, false);
  Object.keys(store).forEach(itemName => updateItemTooltip(itemName))
}

function updateItemTooltip(itemName) {
  let i = store[itemName];
  let t = "";
  if (i.detail) t += "<em>" + i.detail + "</em>";
  let rate = getBoneRate(itemName);
  
  if (plain.count(itemName) > 0) t += "<br>" + (rate/plain.count(itemName)).toFixed(2) + " bones/sec.";
  else t += "<br>" + i.boneRate + " bones/sec.";

  if (i.layerRate) t += "<br>+" + i.layerRate + " meters stacked/sec.";
  if (itemName in plain.entities) {
    t +=
      "<br>" +
      plain.entities[itemName].count +
      " " +
      itemName +
      "s: " +
      rate.toFixed(2) +
      " bones/sec";
  }

  document.getElementById(itemName+"StoreTitle").textContent = itemWithCount(i, itemName)

  /// ThiS IS NOT BEING SEAT
  i.tooltip.html(t);
}

function buyUpgrade(upgradeName, skipCost = false) {
  let item = upgrades[upgradeName];
  if (!skipCost) {
    if (bones < item.cost) return;
    bones -= item.cost;
  }
  item.onBuy();
  item.button?.remove();
  upgrades.bought.push(upgradeName);
  $("#boughtUpgrades").append(
    "<li class='boughtUpgrade' id='"+upgradeName+"Bought'><h3>" +
      upgradeName +
      "</h3>" +
      "</li>",
  );

  let t = document.createElement("span");
  t.className = "tooltip";
  t.innerHTML = "<em>" + item.detail + "</em><br>" + item.effect;
  document.getElementById(upgradeName+"Bought").appendChild(t);
  delete upgrades[upgradeName];
  updateAllTooltips();
}

const plain = {
  entities: {},
  add: function (entityName) {
    if (entityName in this.entities) {
      this.entities[entityName].count += 1;
    } else {
      this.entities[entityName] = {};
      this.entities[entityName].count = 1;
      this.entities[entityName].entity = store[entityName];
    }
  },
  count: function (entityName) {
    if (entityName in this.entities) {
      return this.entities[entityName].count;
    } else {
      return 0;
    }
  },
};

function buyItem(item, itemName, useCost = true) {
  if (useCost) {
    if (bones < item.cost) {
      return;
    }
    bones -= item.cost;
  }
  item.cost =
    item.cost + item.cost * ("rampOverride" in item ? item.rampOverride : 0.15);
  document.getElementById(item.text+'StoreButtonCost').innerText = "Buy 1 (" + Math.ceil(item.cost) + ")"
  item.onBuy();
  updateItemTooltip(itemName);
}

var boneDisplay = $("#numBones");
var towerHeight = $("#towerHeight");
function updateBoneDisplay() {
  // update store display with unlocked items
  for (const [itemName, item] of Object.entries(store)) {
    if (
      (maxBones >= item.cost * 0.5 || item.seen) &&
      (!item.hasOwnProperty("predicate") || item.predicate())
    ) {
      item.storeButton.show();
      item.seen = true;
      item.storeButton
        .prop("disabled", bones < item.cost);
    } else {
      item.storeButton.hide();
    }
  }

  towerHeight.text(height.toFixed(2) + " m");

  for (const [upgradename, upgrade] of Object.entries(upgrades)) {
    if (!upgrade.cost) continue;
    if (
      maxBones >= upgrade.cost * 0.25 &&
      (!upgrade.hasOwnProperty("predicate") || upgrade.predicate())
    ) {
      upgrade.button.show();
    } else {
      upgrade.button.hide();
    }
    upgrade.button
      .children("button")
      .first()
      .prop("disabled", bones < upgrade.cost);
  }
}

function frameUpdate(interval) {
  let add = 0;
  let layerAdd = 0;
  for (const [name, boneSource] of Object.entries(plain.entities)) {
    let rate = getBoneRate(name);
    add += rate;
    layerAdd +=
      boneSource.count * (boneSource.entity.layerRate || 0);
  }
  boneRate = add;
  bones += (add * interval);
  // you can have negative bones with cranes
  bones = Math.max(bones, 0);
  height += layerAdd * interval;
  bonesPerSecondDisplay.text((add).toFixed(2) + " BpS");
  layersPerSecondDisplay.text((layerAdd / interval).toFixed(2) + " MpS");

  maxBones = Math.max(bones, maxBones);
  let b = Math.round(bones);
  let s = b == 1 ? " bone" : " bones";
  boneDisplay.text(b + s);
}

var bonesPerSecondDisplay = $("#bonesPerSecond");
var layersPerSecondDisplay = $("#layersPerSecond");
function tick(interval) {
  updateBoneDisplay();
}

$("#gather").click(gatherBone);

var logContainer = $("#log");
let muteLog = false;
function log(text) {
  if (muteLog) return;
  logContainer.prepend("<p>" + text + "</p>");
  // if above 20 messages, remove
  if (logContainer.children().length > 20) {
    logContainer.find("p:last").remove();
  }
}

$(window).focus(function () {
  if (focusLoseTime > 0) {
    let interval = Math.floor(Date.now() / 1000) - focusLoseTime;
    tick(interval);
    frameUpdate(interval);
  }
});

$(window).blur(function () {
  focusLoseTime = Math.floor(Date.now() / 1000);
});

var costThresholds = [];
var heightThresholds = [];

var tooltips = [];
$(document).ready(function () {
  log("Infinite bones stretch out in all directions.");
  log(
    "You awaken on a <span class='gray'>BONE PLAIN</span> under a starry sky.",
  );
  populateStore();
  updateBoneDisplay();

  setInterval(tick, tickRate * 1000, tickRate);
  tick(tickRate);
  setInterval(frameUpdate, frameRate * 1000, frameRate);
  setInterval(autoBoneTake, 100);
});

function autoBoneTake() {
  if ((Math.random() * boneRate / 100) > 1) {
    takeBone(1);
  }
  if ((Math.random() * boneRate / 1000) > 1) {
    takeBone(1);
  }
  if ((Math.random() * boneRate / 10000) > 1) {
    takeBone(1);
  }
  if ((Math.random() * boneRate / 100000) > 1) {
    takeBone(1);
  }
}

function itemWithCount(item, itemName) {
  let c = plain.count(itemName);
  if (c == 0) {
    return item.text
  }
  if (c == 1) {
    return "1 " + item.text;
  } else {
    return c + " " + item.text + "S"
  }
}

function makeStoreButton(item, itemName) {
  let title = itemWithCount(item, itemName)
  return $("<button class='storeButton boneButton' id='"+item.text+"StoreRow'><h2 class='storeButtonTitle' id='"+itemName+"StoreTitle'>"+title+"</h2><h3 class='storeButtonTitle' id='"+item.text+"StoreButtonCost'>Buy 1 (" + item.cost + ")</h3></button>"); 
}

function populateStore() {
  let storeContainer = $("#store");
  for (const [itemName, item] of Object.entries(store)) {
    let itemButton = makeStoreButton(item, itemName).appendTo(storeContainer);
    item.storeButton = itemButton;
    buffs[itemName] = {
      boneMultiplier: 1,
      multipliers: [],
    };
    itemButton.click(function () {
      buyItem(item, itemName);
    });
    let tooltip = "<span class='tooltip'>";
    if (item.detail) tooltip += "<em>" + item.detail + "</em>";
    tooltip += "<br>+" + item.boneRate + " bones/sec";
    if (item.layerRate)
      tooltip += "<br>+" + item.layerRate + " meters stacked/sec";

    tooltip += "</span>";
    item.tooltip = $(tooltip).appendTo(itemButton);
    updateItemTooltip(itemName);
  }

  let upgradeContainer = $("#upgrades");
  for (const [upgradeName, item] of Object.entries(upgrades)) {
    // make sure it's not a function
    if (!item.cost) continue;

    let upgradeButton = $(
      "<div><button class='boneButton'>" + upgradeName + "<br>" + item.cost + "</button></div>",
    ).appendTo(upgradeContainer);
    item.button = upgradeButton;
    upgradeButton.click(function () {
      buyUpgrade(upgradeName);
    });
    let tooltip = "<span class='tooltip'>";
    if (item.detail) tooltip += "<em>" + item.detail + "</em>";
    if (item.effect) tooltip += "<br>" + item.effect;
    tooltip += "</span>";
    item.tooltip = tooltip;
    upgradeButton.append(tooltip);
  }

  tooltips = document.querySelectorAll(".tooltip");
  document.addEventListener("mousemove", tooltipHover, false);
  document.querySelectorAll('.boneButton').forEach((x) => x.addEventListener('mousedown', pop));
}

function tooltipHover(e) {
  for (var i = tooltips.length; i--; ) {
    if (window.getComputedStyle(tooltips[i], null).display == "none") {
      continue;
    }
    tooltips[i].style.left = e.pageX + "px";
    tooltips[i].style.top = e.pageY + "px";
  }
}

function saveGame() {
  window.localStorage.setItem("save", JSON.stringify(serializeGame()));
}

function loadGame() {
  loadSave(JSON.parse(window.localStorage.getItem("save")));
}

function serializeGame() {
  state = {};
  state["boughtUpgrades"] = upgrades.bought;
  state["buffs"] = buffs;
  state["entities"] = plain.entities;
  console.log(state["entities"]);
  state["bones"] = bones;
  state["maxBones"] = maxBones;
  state["height"] = height;
  state["stats"] = stats;
  log("successfully saved game");
  return state;
}

function loadSave(state) {
  // TODO: recreate all the store/upgrade buttons
  muteLog = true;
  state["boughtUpgrades"].forEach((uName) => {
    console.log("buying " + uName);
    buyUpgrade(uName, (skipCost = true));
  });
  buffs = state["buffs"];
  for (const [itemName, item] of Object.entries(state.entities)) {
    for (let i = 0; i < item["count"]; i++) {
      buyItem(store[itemName], itemName, (useCost = false));
    }
  }
  bones = state["bones"];
  maxBones = state["maxBones"];
  height = state["height"];
  stats = state["stats"];
  muteLog = false;
  log("successfully loaded game");
}

window.onbeforeunload = function () {
  saveGame();
};

if (document.body.animate) {
  document.querySelector('.boneButton').addEventListener('mousedown', pop);
}

function pop (e) {
  // Quick check if user clicked the button using a keyboard
  let count = 1 * buffs.collectMultiplier;
  if (e.clientX === 0 && e.clientY === 0) {
    const bbox = document.querySelector('#button').getBoundingClientRect();
    const x = bbox.left + bbox.width / 2;
    const y = bbox.top + bbox.height / 2;
    for (let i = 0; i < count; i++) {
      createParticle(x, y);
    }
  } else {
    for (let i = 0; i < count; i++) {
      // As we need the coordinates of the mouse, we pass them as arguments
      createParticle(e.clientX, e.clientY);
    }
  }
}

function createParticle (x, y) {
  const distance = buffs.collectMultiplier <= 1 ? 0 : 2;
  x += (Math.random() * 20 - 10 ) * distance;
  y += (Math.random() * 20 - 10 ) * distance;
  const particle = document.createElement('particle');
  document.body.appendChild(particle);
  
  // Generate a random x & y destination within a distance of 75px from the mouse
  const destinationX = x + (Math.random() - 0.5) * 2 * 75;
  const destinationY = y + (Math.random() - 0.5) * 2 * 75;

  const rotation = Math.random() * 360;

  // Store the animation in a variable as we will need it later
  const animation = particle.animate([
    {
      // Set the origin position of the particle
      // We offset the particle with half its size to center it around the mouse
      transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg)`,
      opacity: 1
    },
    {
      // We define the final coordinates as the second keyframe
      transform: `translate(${destinationX}px, ${destinationY}px)`,
      opacity: 0
    }
  ], {
    // Set a random duration from 500 to 1500ms
    duration: Math.random() * 1000 + 500,
    easing: 'cubic-bezier(0, .9, .57, 1)',
  });
  
  // When the animation is complete, remove the element from the DOM
  animation.onfinish = () => {
    particle.remove();
  };
}
