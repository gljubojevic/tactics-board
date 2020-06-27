class Text {
	constructor(id="", text="", x=0, y=0, rotation=0){
		this._id = id;
		this._text = text;
		this._x = x;
		this._y = y;
		this._rotation = rotation;
	}

	get id() {
		return this._id;
	}
	set id(value) {
		this._id = value;
	}

	get text() {
		return this._text;
	}
	set text(value) {
		this._text = value;
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

}

export default Text;
