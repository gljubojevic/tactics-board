class Player {
	constructor(id="", no="0", name="", color=0, x=0, y=0, rotation=0, xDefault=0, yDefault=0, noDefault="0"){
		this.id = id;
		this.no = no;
		this.name = name;
		this.color = color;
		this.x = x;
		this.y = y;
		this.rotation = rotation;
		this.xDefault = xDefault;
		this.yDefault = yDefault;
		this.noDefault = noDefault;
	}	

	reset() {
		this.x = this.xDefault;
		this.y = this.yDefault;
		this.rotation = 0;
		this.name = "";
		this.no = this.noDefault;
	}

	clone() {
		return new Player(
			this.id, 
			this.no, 
			this.name, 
			this.color, 
			this.x, this.y, this.rotation,
			this.xDefault, this.yDefault, this.noDefault
		);
	}

	equalTo(p) {
		return this.id === p.id
			&& this.no === p.no
			&& this.name === p.name
			&& this.color === p.color
			&& this.x === p.x
			&& this.y === p.y
			&& this.rotation === p.rotation
			&& this.xDefault === p.xDefault
			&& this.yDefault === p.yDefault
			&& this.noDefault === p.noDefault
	}

	get isPlaced() {
		return this.x !== this.xDefault || this.y !== this.yDefault;
	}
}

export default Player;
