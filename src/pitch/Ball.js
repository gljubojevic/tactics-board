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
}

export default Ball;
