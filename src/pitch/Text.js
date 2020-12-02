import Box from './Box';

class Text {
	constructor(id="", color=0, size=0, text="", x=0, y=0, rotation=0, isEdit=false, isTextEdit=false){
		this.id = id;
		this.color = color;
		this.size = size;
		this.text = text;
		this.x = x;
		this.y = y;
		this.rotation = rotation;
		this.bx = x;		// bounding box X
		this.by = y;		// bounding box Y
		this.bwidth = 0;	// bounding box Width
		this.bheight = 0;	// bounding box Height
		this.isEdit = isEdit;
		this.isTextEdit = isTextEdit;
	}

	get box() {
		return new Box(
			this.id,
			this.bx,
			this.by,
			this.bwidth,
			this.bheight
		);
	}

	move(deltaX, deltaY) {
		this.x += deltaX;
		this.y += deltaY;
	}

	rotate(posX, posY, snap) {
		let vx = posX - (this.x + this.bwidth / 2);
		let vy = posY - (this.y + this.bheight / 2);
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

export default Text;
