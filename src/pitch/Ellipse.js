import Box from './Box';

class Ellipse {
	constructor(id="", color=0, x1=0, y1=0, rx=0, ry=0, rotation=0, dashed=false, isEdit=false){
		this.id = id;
		this.color = color;
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x1 + rx * 2;
		this.y2 = y1 + ry * 2;
		this.rotation = rotation;
		this.dashed = dashed;
		this.isEdit = isEdit;
	}

	get cx() {
		return (this.x1 < this.x2 ? this.x1 : this.x2) + this.rx;
	}

	get cy() {
		return (this.y1 < this.y2 ? this.y1 : this.y2) + this.ry;
	}

	get rx() {
		return (this.x1 < this.x2 ? this.x2 - this.x1 : this.x1 - this.x2) / 2;
	}

	get ry() {
		return (this.y1 < this.y2 ? this.y2 - this.y1 : this.y1 - this.y2) / 2;
	}

	get box() {
		return new Box(
			this.id,
			this.cx - this.rx,
			this.cy - this.ry,
			this.rx * 2,
			this.ry * 2
		);
	}

	resize(x2, y2, proportional) {
		this.x2 = x2;
		if (!proportional) {
			this.y2 = y2;
		} else {
			let szy = this.rx * (this.y1 < y2 ? 2 : -2);
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

export default Ellipse;
