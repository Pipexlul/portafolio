// import anime from "./anime.min.js";

const body = document.body;
const tileContainer = document.querySelector(".tile-container");
const tileSize = 60;

let toggled = false;

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

const tileClick = (ev, index, rows, columns) => {
	toggled = !toggled;
	body.classList.toggle("toggled");

	anime({
		targets: ".tile",
		opacity: toggled ? 0 : 1,
		duration: 1500,
		delay: anime.stagger(60, {
			grid: [columns, rows],
			from: index,
		}),
	});
};

const createTile = (index, rows, columns) => {
	const tile = document.createElement("div");
	tile.classList.add("tile");

	toggleElemOpacity(tile, toggled);

	tile.addEventListener("click", (ev) => tileClick(ev, index, rows, columns));

	return tile;
};

const createTileGroup = (rows, columns) => {
	Array.from(Array(rows * columns)).map((elem, index) => {
		tileContainer.appendChild(createTile(index, rows, columns));
	});
};

const createGrid = () => {
	removeAllChildren(tileContainer);

	const realSize = body.clientWidth > 1000 ? tileSize * 2 : tileSize;

	const rows = Math.floor(body.clientHeight / realSize);
	const columns = Math.floor(body.clientWidth / realSize);

	tileContainer.style.setProperty("--fel-rows", rows);
	tileContainer.style.setProperty("--fel-columns", columns);

	createTileGroup(rows, columns);

	//console.log(`Created grid with ${rows} rows and ${columns} columns`);
};

createGrid();
window.addEventListener("resize", createGrid);
