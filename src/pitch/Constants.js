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
	{ name:'Goal', width: 100, height: 300, viewBoxScale: 1 },
	{ name:'Small Goal', width: 50, height: 150, viewBoxScale: 2 },
	{ name:'Ladder', width: 100, height: 350, viewBoxScale: 1 },
	{ name:'Cone', width: 70, height: 85, viewBoxScale: 3 },
	{ name:'Flag', width: 130, height: 280, viewBoxScale: 2 }
];

function RemoveTags(str) {
	if ((str===null) || (str===''))
	{	 return str;	}
	// Regular expression to identify HTML tags in 
	// the input string. Replacing the identified 
	// HTML tag with a null string.
	return str.replace( /(<([^>]+)>)/ig, '');
}

export { ElementIDPrefix, ExtrasType, ExtrasDefaults, RemoveTags }