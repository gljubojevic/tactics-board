class Line {
	constructor(id="", color=0, x1=0, y1=0, x2=0, y2=0, arrowStart=false, arrowEnd=false, dashed=false){
		this._id = id;
		this._color = color;
		this._x1 = x1;
		this._y1 = y1;
		this._x2 = x2;
		this._y2 = y2;
		this._arrowStart = arrowStart;
		this._arrowEnd = arrowEnd;
		this._dashed = dashed;
	}

	get id() {
		return this._id;
	}
	set id(value) {
		this._id = value;
	}

	get color() {
		return this._color;
	}
	set color(value) {
		this._color = value;
	}

	get x1() {
		return this._x1;
	}
	set x1(value) {
		this._x1 = value;
	}

	get y1() {
		return this._y1;
	}
	set y1(value) {
		this._y1 = value;
	}

	get x2() {
		return this._x2;
	}
	set x2(value) {
		this._x2 = value;
	}

	get y2() {
		return this._y2;
	}
	set y2(value) {
		this._y2 = value;
	}

	get arrowStart() {
		return this._arrowStart;
	}
	set arrowStart(value) {
		this._arrowStart = value;
	}

	get arrowEnd() {
		return this._arrowEnd;
	}
	set arrowEnd(value) {
		this._arrowEnd = value;
	}

	get dashed() {
		return this._dashed;
	}
	set dashed(value) {
		this._dashed = value;
	}

}

export default Line;
