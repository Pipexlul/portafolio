const splashScreen = document.querySelector(".splash-screen");
// const toggledBg = document.querySelector(".toggled-bg");
const splashNames = document.querySelectorAll(".splash-name > span");

const tileContainer = document.querySelector(".tile-container");
const tileSize = 60;

const progData = {
	lua: {
		elem: document.querySelector("#progress-lua"),
		known: 85,
	},
	c: {
		elem: document.querySelector("#progress-c"),
		known: 80,
	},
	cpp: {
		elem: document.querySelector("#progress-cpp"),
		known: 60,
	},
	cs: {
		elem: document.querySelector("#progress-cs"),
		known: 43,
	},
	js: {
		elem: document.querySelector("#progress-js"),
		known: 50,
	},
	ts: {
		elem: document.querySelector("#progress-ts"),
		known: 8,
	},
	go: {
		elem: document.querySelector("#progress-go"),
		known: 14,
	},
};

const isDebugging = false;

let toggled = false;
let isAnimatingTiles = false;
let didRolloutIntro = false;
let didFirstClick = false;

const removeAllChildren = (node) => {
	let child = node.firstElementChild;
	while (child) {
		node.removeChild(child);
		child = node.firstElementChild;
	}
};

const toggleElemOpacity = (elem, toggleVal) => {
	elem.style.opacity = toggleVal ? 0 : 1;
};

const firstClick = () => {
	anime({
		targets: splashNames,
		easing: "linear",
		top: "-20vh",
		opacity: 0,
		duration: 1000,
	});

	anime({
		targets: ".content",
		easing: "linear",
		opacity: 1,
		duration: 1000,
	});

	const clickableElements = document.querySelectorAll(
		".navbar, .container > .row"
	);
	clickableElements.forEach((elem, idx) => {
		elem.classList.add("make-clickable");
	});
};

const tileClick = (ev, index, rows, columns) => {
	if (!isAnimatingTiles && didRolloutIntro) {
		toggled = !toggled;
		splashScreen.classList.toggle("toggled");

		anime({
			targets: ".tile",
			opacity: toggled ? 0 : 1,
			duration: 500,
			delay: anime.stagger(250, {
				grid: [columns, rows],
				from: index,
			}),
			easing: "linear",

			begin: (anim) => {
				isAnimatingTiles = true;
				// console.log("Animating tiles");
			},

			complete: (anim) => {
				isAnimatingTiles = false;
				// console.log("Stopped Animating tiles");
			},

			// update: (anim) => {
			// 	const progress = anim.progress / 100;
			// 	toggledBg.style.opacity = toggled ? progress : 1 - progress;
			// },
		});

		if (!didFirstClick) {
			firstClick();
			didFirstClick = true;
		}
	}
};

const tileClickOneOff = (ev, index, rows, columns) => {
	if (!isAnimatingTiles && didRolloutIntro) {
		anime({
			targets: ".tile",
			opacity: [
				{ value: 0, duration: 500, easing: "easeOutSine" },
				{ value: 1, duration: 500, delay: 250, easing: "easeInSine" },
			],
			delay: anime.stagger(250, {
				grid: [columns, rows],
				from: index,
			}),

			begin: (anim) => {
				isAnimatingTiles = true;
			},

			complete: (anim) => {
				isAnimatingTiles = false;
			},
		});

		if (!didFirstClick) {
			firstClick();
			didFirstClick = true;
		}
	}
};

const createTile = (index, rows, columns) => {
	const tile = document.createElement("div");
	tile.classList.add("tile");

	// toggleElemOpacity(tile, toggled);

	tile.addEventListener("click", (ev) =>
		tileClickOneOff(ev, index, rows, columns)
	);

	return tile;
};

const createTileGroup = (rows, columns) => {
	Array.from(Array(rows * columns)).map((elem, index) => {
		tileContainer.appendChild(createTile(index, rows, columns));
	});
};

const createGrid = () => {
	removeAllChildren(tileContainer);

	const realSize = splashScreen.clientWidth > 1000 ? tileSize * 2 : tileSize;

	const rows = Math.floor(splashScreen.clientHeight / realSize);
	const columns = Math.floor(splashScreen.clientWidth / realSize);

	tileContainer.style.setProperty("--fel-rows", rows);
	tileContainer.style.setProperty("--fel-columns", columns);

	createTileGroup(rows, columns);

	//console.log(`Created grid with ${rows} rows and ${columns} columns`);
};

const firstRun = () => {
	const fadeInDelay = (index) => {
		const bodyStyle = window.getComputedStyle(document.body);
		const propertyName = "--fel-col-splash-text-delay" + (index + 1);

		return bodyStyle.getPropertyValue(propertyName);
	};

	const delayArr = Array.from(splashNames).map((elem, idx, allElems) => {
		return fadeInDelay(idx).trimStart();
	});

	const animation = anime.timeline({
		easing: "linear",
		duration: 750,
	});

	animation
		.add(
			{
				targets: splashNames[0],
				top: 0,
				opacity: 1,
			},
			parseInt(delayArr[0])
		)
		.add(
			{
				targets: splashNames[1],
				top: 0,
				opacity: 1,
			},
			"+=" + delayArr[1]
		)
		.add(
			{
				targets: splashNames[2],
				top: 0,
				opacity: 1,
				complete: (anim) => {
					didRolloutIntro = true;
				},
			},
			"+=" + delayArr[2]
		);
};

const isElemenInViewport = (element) => {
	const boundingRect = element.getBoundingClientRect();

	return (
		boundingRect.top >= 0 &&
		boundingRect.bottom <= document.documentElement.clientHeight
	);
};

const handleProgBarsVisible = (ev) => {
	for (const lang in progData) {
		const cur = progData[lang];

		if (!cur.found && isElemenInViewport(cur.elem)) {
			anime({
				targets: cur.elem,
				width: cur.known + "%",
				duration: 1000,
				easing: "easeInQuad",
			});
			cur.found = true;
		}
	}
};

createGrid();

window.addEventListener("resize", createGrid);
window.addEventListener("DOMContentLoaded", firstRun);

document.addEventListener("scroll", handleProgBarsVisible);
handleProgBarsVisible();

if (isDebugging) {
	document.querySelector(".toggled-bg").style.opacity = 1;
	document.querySelector(".splash-screen").remove();
}
