import Box from './Box';
import { ExtrasType } from './Constants';

class Extras {
	constructor(id="", color=0, t=ExtrasType.Goal, x=0, y=0, width=0, height=0, rotation=0, isEdit=false){
		this.id = id;
		this.color = color;
		this.t = t;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.rotation = rotation;
		this.isEdit = isEdit;
	}

	save() {
		return {
			id: this.id,
			color: this.color,
			t: this.t,
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
			rotation: this.rotation
		};
	}

	get isBoxVisible() {
		switch (this.t) {
			case ExtrasType.Cone:
			case ExtrasType.Flag:
				return true;
			case ExtrasType.Goal:
			case ExtrasType.GoalSmall:
			case ExtrasType.Ladder:
			default:
				return false;
		}
	}

	get isResizable() {
		switch (this.t) {
			case ExtrasType.Ladder:
				return true;
			case ExtrasType.Goal:
			case ExtrasType.GoalSmall:
			case ExtrasType.Cone:
			case ExtrasType.Flag:
			default:
				return false;
		}
	}

	get isRotatable() {
		switch (this.t) {
			case ExtrasType.Goal:
			case ExtrasType.GoalSmall:
			case ExtrasType.Ladder:
				return true;
			case ExtrasType.Cone:
			case ExtrasType.Flag:
			default:
				return false;
		}
	}

	get box() {
		return new Box(
			this.id,
			this.x - this.width / 2,
			this.y - this.height / 2,
			this.width,
			this.height
		);
	}

	edit(corner, deltaX, deltaY) {
		switch (corner) {
			case "tl":
				this.x += deltaX;
				this.y += deltaY;
				this.width += deltaX;
				this.height += deltaY;
				break;
			case "tr":
				this.x += deltaX;
				this.y += deltaY;
				this.width += deltaX;
				this.height += deltaY;
				break;
			case "bl":
				this.x += deltaX;
				this.y += deltaY;
				this.width += deltaX;
				this.height += deltaY;
				break;
			case "br":
				this.x += deltaX;
				this.y += deltaY;
				this.width += deltaX;
				this.height += deltaY;
				break;
			case "mv":
				this.x += deltaX;
				this.y += deltaY;
				break;
			default:
				break;
		}
	}

	rotate(posX, posY, snap) {
		let vx = posX - this.x;
		let vy = posY - this.y;
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

export default Extras;