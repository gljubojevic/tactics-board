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
}

export default Text;
