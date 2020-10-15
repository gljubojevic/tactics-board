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

	get isPlaced() {
		return this.x !== this.xDefault || this.y !== this.yDefault;
	}
}

export default Player;
