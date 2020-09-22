class Point {
	constructor(x=0, y=0){
		this._x = x;
		this._y = y;
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

	equalTo(p) {
		return p.x === this.x && p.y === this.y
	}

	move(deltaX, deltaY) {
		this._x += deltaX;
		this._y += deltaY;
	}
}

export default Point;
