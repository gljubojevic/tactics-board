class Ellipse {
	constructor(id="", color=0, x1=0, y1=0, rx=0, ry=0, rotation=0, dashed=false){
		this._id = id;
		this._color = color;
		this._x1 = x1;
		this._y1 = y1;
		this._x2 = x1 + rx * 2;
		this._y2 = y1 + ry * 2;
		this._rotation = rotation;
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

	get cx() {
		return (this._x1 < this._x2 ? this._x1 : this._x2) + this.rx;
	}

	get cy() {
		return (this._y1 < this._y2 ? this._y1 : this._y2) + this.ry;
	}

	get rx() {
		return (this._x1 < this._x2 ? this._x2 - this._x1 : this._x1 - this._x2) / 2;
	}

	get ry() {
		return (this._y1 < this._y2 ? this._y2 - this._y1 : this._y1 - this._y2) / 2;
	}

	get rotation() {
		return this._rotation;
	}
	set rotation(value) {
		this._rotation = value;
	}

	get dashed() {
		return this._dashed;
	}
	set dashed(value) {
		this._dashed = value;
	}

}

export default Ellipse;
