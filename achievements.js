const achievements = {
	bone: {
		title: "BONE???",
		description: "Gather your first bone",
		predicate: () => stats.boneClicks > 0,
	},
	humanbones: {
		title: "Man Sized",
		description: "Gather 206 bones",
		predicate: () => stats.handGatheredBones >= 206,
	},
	spriteFriend: {
		title: "Sprite Friend",
		description: "Have 1 Bone Sprite",
		predicate: () => plain.count("sprite") >= 1,
	},
	spriteTamer: {
		title: "Sprite Tamer",
		description: "Have 50 Bone Sprites",
		predicate: () => plain.count("sprite") >= 50,
	},
	spriteMaster: {
		title: "Sprite Master",
		description: "Have 100 Bone Sprites",
		predicate: () => plain.count("sprite") >=100,
	},
	impKeeper: {
		title: "Imp Keeper",
		description: "Have 50 Bone Imps",
		predicate: () => plain.count("imp") >= 50,
	},
	ogreHerder: {
		title: "Ogre Herder",
		description: "Have 50 Bone Ogres",
		predicate: () => plain.count("ogre") >= 50,
	},
	bonePicker: {
		title: "Bone Picker",
		description: "Collect 1 Bones per Second (BpS).",
		predicate: () => boneRate >= 1,
	},
	boneFarmer: {
		title: "Bone Farmer",
		description: "Collect 10 Bones per Second (BpS).",
		predicate: () => boneRate >= 10,
	},
	bonePlunderer: {
		title: "Bone Plunderer",
		description: "Collect 100 Bones per Second (BpS).",
		predicate: () => boneRate >= 100,
	},
	rainingMen: {
		title: "Raining Men",
		description: "Collect 206 Bones per Second (BpS).",
		predicate: () => boneRate >= 206,
	},
}

const gotten = new Set()

function getAchievement(name, quiet = false) {
	gotten.add(name)
	if (!quiet) {
		alertAchievement(name);
	}
	let a = achievements[name];
	let d = document.createElement("div");
	d.innerHTML = `
		<h3>${a.title}</h3>
		<span class="tooltip">
			<em>${a.description}</a>
		</span>
	`
	document.getElementById("cheevos").appendChild(d);
	tooltips = document.querySelectorAll(".tooltip");
}

function loadAchievements(gottenNames) {A
	gottenNames.forEach(x => getAchievement(x, quiet=true))
}

function saveAchievements() {
	return Array.from(gotten);
}

function checkAchievements() {
	Object.keys(achievements).forEach(x => checkAchievement(x))
}

function checkAchievement(name) {
	if (!gotten.has(name) && achievements[name].predicate()) {
		console.log("getting "+name)
		getAchievement(name);
	}
}

function alertAchievement(name) {
	let a = achievements[name]
	let notif = document.createElement("div");
	notif.className = "achievementNotification"
	notif.innerHTML = `
	<button>x</button>
	<super>Achievement Unlocked!</super>
	<h1>${a.title}</h1>
	<em>${a.description}</em>
	`
	document.getElementById("notifications").appendChild(notif)
	let i = setTimeout(() => notif.remove(), 5000);
	notif.querySelector("button").addEventListener("click", () => {
		clearTimeout(i);
		notif.remove();
	});
}

addEventListener("load", (event) => {
	setInterval(checkAchievements, 200);
});
