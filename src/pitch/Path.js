import Point from "./Point";

class Path {
	constructor(id="", p1=new Point(0,0), p2=new Point(0,0), c1=new Point(0,0), c2=new Point(0,0), arrowStart=false, arrowEnd=false){
		this.id = id;
		this.p1 = p1;
		this.p2 = p2;
		this.c1 = c1;
		this.c2 = c2;
		this.arrowStart = arrowStart;
		this.arrowEnd = arrowEnd;
	}
}

export default Path;
