class DrawMode {
	constructor(mode='select', lineArrowStart=false, lineArrowEnd=false, lineDashed=false) {
		this._mode=mode;
		this._lineArrowStart = lineArrowStart;
		this._lineArrowEnd = lineArrowEnd;
		this._lineDashed = lineDashed;
	}

	get mode() {
		return this._mode;
	}
	set mode(value) {
		console.log("Mode selected", value);
		this._mode = value;
	}
	// default modes
	// select	- select / move
	// line		- draw lines
	// square	- draw square
	// oval		- draw oval
	// text		- draw text
	get modeOptions(){
		return ['select','line','square','oval','text'];
	}

	get lineArrowStart() {
		return this._lineArrowStart;
	}
	set lineArrowStart(value) {
		console.log("Line Arrow Start", value);
		this._lineArrowStart = value;
	}

	get lineArrowEnd() {
		return this._lineArrowEnd;
	}
	set lineArrowEnd(value) {
		console.log("Line Arrow End", value);
		this._lineArrowEnd = value;
	}

	get lineDashed() {
		return this._lineDashed;
	}
	set lineDashed(value) {
		console.log("Line Dashed", value);
		this._lineDashed = value;
	}

}

export default DrawMode;