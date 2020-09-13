class Box {
	constructor(x=0, y=0, width=0, height=0){
		this._x = x;
		this._y = y;
		this._width = width;
		this._height = height;
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

	get width() {
		return this._width;
	}
	set width(value) {
		this._width = value;
	}

	get height() {
		return this._height;
	}
	set height(value) {
		this._height = value;
	}
}

export default Box;
