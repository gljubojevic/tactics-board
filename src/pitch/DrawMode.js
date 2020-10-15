class DrawMode {
	constructor(mode='select', lineArrowStart=false, lineArrowEnd=false, lineDashed=false) {
		this.mode=mode;
		this.lineArrowStart = lineArrowStart;
		this.lineArrowEnd = lineArrowEnd;
		this.lineDashed = lineDashed;
		this.color = 0;
		this._pitchOverlay = 'none';
		this.pitchOverlayCallback = null;
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
		if (null !== this.pitchOverlayCallback) {
			this.pitchOverlayCallback(this._pitchOverlay);
		}
	}
}

export default DrawMode;