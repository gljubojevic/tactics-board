class Ball {
	constructor(id="", color=0, x=0, y=0, xDefault=0, yDefault=0){
		this._id = id;
		this._color = color;
		this._x = x;
		this._y = y;
		this._xDefault = xDefault;
		this._yDefault = yDefault;
	}

	reset() {
		this._x = this._xDefault;
		this._y = this._yDefault;
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

	get x() {
		return this._x;
	}
	set x(value) {
		this._x = value;
	}

	get y() {
		return this._y;
	}
	set y(value) {
		this._y = value;
	}

	get xDefault() {
		return this._xDefault;
	}
	set xDefault(value) {
		this._xDefault = value;
	}

	get yDefault() {
		return this._yDefault;
	}
	set yDefault(value) {
		this._yDefault = value;
	}
}

export default Ball;
