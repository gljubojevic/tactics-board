import Point from "./Point";

class Ball {
	constructor(id="", color=0, pos=new Point(0,0), posDefault=new Point(0,0)){
		this.id = id;
		this.color = color;
		this.pos = pos;
		this.posDefault = posDefault;
	}

	save() {
		return {
			id: this.id,
			color: this.color,
			pos: this.pos.save(),
			posDefault: this.posDefault.save()
		};
	}

	reset() {
		this.pos = this.posDefault.clone();
	}

	clone() {
		return new Ball(
			this.id, 
			this.color, 
			this.pos.clone(),
			this.posDefault.clone()
		);
	}

	equalTo(b) {
		return this.id === b.id
			&& this.color === b.color
			&& this.pos.equalTo(b.pos)
			&& this.posDefault.equalTo(b.posDefault)
	}

	get isPlaced() {
		return !this.pos.equalTo(this.posDefault);
	}
}

export default Ball;
