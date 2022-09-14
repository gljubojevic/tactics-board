import Point from "./Point";

class Player {
	constructor(id="", no="0", name="", color=0, pos=new Point(0,0), rotation=0, posDefault=new Point(0,0), noDefault="0", rotDefault=90){
		this.id = id;
		this.no = no;
		this.name = name;
		this.color = color;
		this.pos = pos;
		this.rotation = rotation;
		this.posDefault = posDefault;
		this.noDefault = noDefault;
		this.rotDefault = rotDefault;
		this.isEdit = false;
	}

	save() {
		return {
			id: this.id,
			no: this.no,
			name: this.name,
			color: this.color,
			pos: this.pos.save(),
			rotation: this.rotation,
			posDefault: this.posDefault.save(),
			noDefault: this.noDefault
		};
	}

	reset() {
		this.pos = this.posDefault.clone();
		this.rotation = this.rotDefault;
		this.name = "";
		this.no = this.noDefault;
		this.isEdit = false;
	}

	clone() {
		return new Player(
			this.id, 
			this.no, 
			this.name, 
			this.color, 
			this.pos.clone(),
			this.rotation,
			this.posDefault.clone(),
			this.noDefault
		);
	}

	equalTo(p) {
		return this.id === p.id
			&& this.no === p.no
			&& this.name === p.name
			&& this.color === p.color
			&& this.pos.equalTo(p.pos)
			&& this.rotation === p.rotation
			&& this.posDefault.equalTo(p.posDefault)
			&& this.noDefault === p.noDefault
	}

	get isPlaced() {
		return !this.pos.equalTo(this.posDefault);
	}

	rotate(posX, posY, snap) {
		let vx = posX - this.pos.x;
		let vy = posY - this.pos.y;
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

export default Player;
