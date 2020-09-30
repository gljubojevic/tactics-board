import Box from './Box';

class Square {
	constructor(id="", color=0, x1=0, y1=0, width=0, height=0, rotation=0, dashed=false, isEdit=false){
		this._id = id;
		this._color = color;
		this._x1 = x1;
		this._y1 = y1;
		this._x2 = x1 + width;
		this._y2 = y1 + height;
		this._rotation = rotation;
		this._dashed = dashed;
		this._isEdit = isEdit;
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

	get box() {
		return new Box(
			this.id,
			this.x,
			this.y,
			this.width,
			this.height
		);
	}

	get x() {
		return this._x1 < this._x2 ? this._x1 : this._x2;
	}

	get width() {
		return this._x1 < this._x2 ? this._x2 - this._x1 : this._x1 - this._x2;
	}

	get y() {
		return this._y1 < this._y2 ? this._y1 : this._y2;
	}

	get height() {
		return this._y1 < this._y2 ? this._y2 - this._y1 : this._y1 - this._y2;
	}

	get cx() {
		return this.x + this.width / 2;
	}

	get cy() {
		return this.y + this.height / 2;
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

	get isEdit() {
		return this._isEdit;
	}
	set isEdit(value) {
		this._isEdit = value;
	}

	resize(x2, y2, proportional) {
		this.x2 = x2;
		if (!proportional) {
			this.y2 = y2;
		} else {
			let szy = this.width * (this.y1 < y2 ? 1 : -1);
			this.y2 = this.y1 + szy;
		}
	}

	edit(corner, deltaX, deltaY) {
		switch (corner) {
			case "tl":
				this.x1 += deltaX;
				this.y1 += deltaY;
				break;
			case "tr":
				this.x2 += deltaX;
				this.y1 += deltaY;
				break;
			case "bl":
				this.x1 += deltaX;
				this.y2 += deltaY;
				break;
			case "br":
				this.x2 += deltaX;
				this.y2 += deltaY;
				break;
			case "mv":
				this.x1 += deltaX;
				this.y1 += deltaY;
				this.x2 += deltaX;
				this.y2 += deltaY;
			default:
				break;
		}
	}

	rotate(posX, posY, snap) {
		let vx = posX - this.cx;
		let vy = posY - this.cy;
		let angle = Math.atan2(vy, vx) * 180 / Math.PI;
		angle += 90;
		if (angle < 0) {
			angle += 360;
		}
		if (snap) {
			angle = Math.floor(angle / 45) * 45;
		}
		this.rotation = angle;
	}
}

export default Square;
