class Player {
	constructor(id="", no="0", name="", color=0, x=0, y=0, rotation=0, xDefault=0, yDefault=0, noDefault="0"){
		this._id = id;
		this._no = no;
		this._name = name;
		this._color = color;
		this._x = x;
		this._y = y;
		this._rotation = rotation;
		this._xDefault = xDefault;
		this._yDefault = yDefault;
		this._noDefault = noDefault;
	}	

	reset() {
		this._x = this._xDefault;
		this._y = this._yDefault;
		this._rotation = 0;
		this._name = "";
		this._no = this._noDefault;
	}

	get isPlaced() {
		return this._x !== this._xDefault || this._y !== this._yDefault;
	}

	get id() {
		return this._id;
	}
	set id(value) {
		this._id = value;
	}

	get no() {
		return this._no;
	}
	set no(value) {
		this._no = value;
	}

	get name() {
		return this._name;
	}
	set name(value) {
		this._name = value;
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

	get rotation() {
		return this._rotation;
	}
	set rotation(value) {
		this._rotation = value;
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

	get noDefault() {
		return this._noDefault;
	}
	set noDefault(value) {
		this._noDefault = value;
	}
}

export default Player;
