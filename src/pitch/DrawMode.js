class DrawMode {
	constructor() {
		this._mode='select';
		this._lineArrowStart = false;
		this._lineArrowEnd = false;
		this._lineDashed = false;
		this._color = 0;
		this._textSize = 2;
		this._pitchOverlay = 'none';
		this.onModified = null;
	}

	_modified() {
		let dm = new DrawMode();
		dm._mode = this.mode;
		dm._lineArrowStart = this.lineArrowStart;
		dm._lineArrowEnd = this.lineArrowEnd;
		dm._lineDashed = this.lineDashed;
		dm._color = this.color;
		dm._textSize = this.textSize;
		dm._pitchOverlay = this.pitchOverlay;
		// trigger event modified
		if (null !== this.onModified) {
			this.onModified(dm);
		}
	}

	// default modes
	// select	- select / move
	// line		- draw lines
	// square	- draw square
	// ellipse	- draw ellipse
	// text		- draw text
	get modeOptions(){
		return ['select','line','square','ellipse','text'];
	}

	get mode() {
		return this._mode;
	}

	set mode(value) {
		this._mode = value;
		this._modified();
	}

	get lineArrowStart() {
		return this._lineArrowStart;
	}

	set lineArrowStart(value) {
		this._lineArrowStart = value;
		this._modified();
	}

	get lineArrowEnd() {
		return this._lineArrowEnd;
	}

	set lineArrowEnd(value) {
		this._lineArrowEnd = value;
		this._modified();
	}

	get lineDashed() {
		return this._lineDashed;
	}

	set lineDashed(value) {
		this._lineDashed = value;
		this._modified();
	}

	get colorOptions() {
		return ['#8b2323','#e7e739','#912cee','#04b804','#1d4ba0','#ee2c2c','#ff7f50','#56c6eb'];
	}

	get color() {
		return this._color;
	}

	set color(value) {
		this._color = value;
		this._modified();
	}

	get textSizeOptions() {
		return ["Extra small","Small","Normal","Large","Extra large"];
	}

	get textSize() {
		return this._textSize;
	}

	set textSize(value) {
		this._textSize = value;
		this._modified();
	}

	// default pitch overlay options
	// 28x20, exercises pitch
	// 28x15, basketball court
	// 18x9, volleyball court
	get pitchOverlayOptions(){
		return ['none','exercise','basketball','volleyball'];
	}

	get pitchOverlay() {
		return this._pitchOverlay;
	}
	set pitchOverlay(value) {
		this._pitchOverlay = value;
		this._modified();
	}
}

export default DrawMode;