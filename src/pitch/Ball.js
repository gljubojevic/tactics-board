class Ball {
	constructor(id="", color=0, x=0, y=0, xDefault=0, yDefault=0){
		this.id = id;
		this.color = color;
		this.x = x;
		this.y = y;
		this.xDefault = xDefault;
		this.yDefault = yDefault;
	}

	reset() {
		this.x = this.xDefault;
		this.y = this.yDefault;
	}

	clone() {
		return new Ball(
			this.id, 
			this.color, 
			this.x, this.y,
			this.xDefault, this.yDefault
		);
	}

	equalTo(b) {
		return this.id === b.id
			&& this.color === b.color
			&& this.x === b.x
			&& this.y === b.y
			&& this.xDefault === b.xDefault
			&& this.yDefault === b.yDefault
	}
}

export default Ball;
