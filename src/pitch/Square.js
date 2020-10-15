import Box from './Box';

class Square {
	constructor(id="", color=0, x1=0, y1=0, width=0, height=0, rotation=0, dashed=false, isEdit=false){
		this.id = id;
		this.color = color;
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x1 + width;
		this.y2 = y1 + height;
		this.rotation = rotation;
		this.dashed = dashed;
		this.isEdit = isEdit;
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
		return this.x1 < this.x2 ? this.x1 : this.x2;
	}

	get width() {
		return this.x1 < this.x2 ? this.x2 - this.x1 : this.x1 - this.x2;
	}

	get y() {
		return this.y1 < this.y2 ? this.y1 : this.y2;
	}

	get height() {
		return this.y1 < this.y2 ? this.y2 - this.y1 : this.y1 - this.y2;
	}

	get cx() {
		return this.x + this.width / 2;
	}

	get cy() {
		return this.y + this.height / 2;
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
				break;
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
