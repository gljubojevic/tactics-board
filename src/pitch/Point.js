class Point {
	constructor(x=0, y=0){
		this.x = x;
		this.y = y;
	}

	equalTo(p) {
		return p.x === this.x && p.y === this.y
	}

	move(deltaX, deltaY) {
		this.x += deltaX;
		this.y += deltaY;
	}
}

export default Point;
