class DrawMode {
	constructor(mode='select', lineArrowStart=false, lineArrowEnd=false, lineDashed=false) {
		this._mode=mode;
		this._lineArrowStart = lineArrowStart;
		this._lineArrowEnd = lineArrowEnd;
		this._lineDashed = lineDashed;
		this._color = 0;
		this._pitchOverlay = 'none';
		this._pitchOverlayCallback = null;
	}

	get mode() {
		return this._mode;
	}
	set mode(value) {
		this._mode = value;
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

	get color() {
		return this._color;
	}
	set color(value) {
		console.log("Color", value);
		this._color = value;
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
		console.log("PitchOverlay", value);
		if (value === this._pitchOverlay) {
			return;
		}
		this._pitchOverlay = value;
		if (null !== this._pitchOverlayCallback) {
			this._pitchOverlayCallback(this._pitchOverlay);
		}
	}

	get pitchOverlayCallback() {
		return this._pitchOverlayCallback;
	}
	set pitchOverlayCallback(value) {
		this._pitchOverlayCallback = value;
	}
}

export default DrawMode;