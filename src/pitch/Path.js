import Point from "./Point";

class Path {
	constructor(id="", p1=new Point(0,0), p2=new Point(0,0), c1=new Point(0,0), c2=new Point(0,0), arrowStart=false, arrowEnd=false){
		this._id = id;
		this._p1 = p1;
		this._p2 = p2;
		this._c1 = c1;
		this._c2 = c2;
		this._arrowStart = arrowStart;
		this._arrowEnd = arrowEnd;
	}

	get id() {
		return this._id;
	}
	set id(value) {
		this._id = value;
	}

	get p1() {
		return this._p1;
	}
	set p1(value) {
		this._p1 = value;
	}

	get p2() {
		return this._p2;
	}
	set p2(value) {
		this._p2 = value;
	}

	get c1() {
		return this._c1;
	}
	set c1(value) {
		this._c1 = value;
	}

	get c2() {
		return this._c2;
	}
	set c2(value) {
		this._c2 = value;
	}

	get arrowStart() {
		return this._arrowStart;
	}
	set arrowStart(value) {
		this._arrowStart = value;
	}

	get arrowEnd() {
		return this._arrowEnd;
	}
	set arrowEnd(value) {
		this._arrowEnd = value;
	}
}

export default Path;
