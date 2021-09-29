const ElementIDPrefix = {
	Ball: 'bl',
	Player: 'pl',
	Square: 'sq',
	Ellipse: 'el',
	Line: 'ln',
	Text: 'txt',
	PathPlayer: 'pp',
	PathBall: 'bp',
	Extras: 'ex'
};

const ExtrasType = {
	Goal: 0,
	GoalSmall: 1,
	Ladder: 2,
	Cone: 3,
	Flag: 4
};

const ExtrasDefaults = [
	{ name:'Goal', width: 100, height: 300 },
	{ name:'Small Goal', width: 50, height: 150 },
	{ name:'Ladder', width: 150, height: 350 },
	{ name:'Cone', width: 100, height: 150 },
	{ name:'Flag', width: 100, height: 350 }
];



export { ElementIDPrefix, ExtrasType, ExtrasDefaults }