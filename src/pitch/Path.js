import Point from "./Point";

// path is cubic bezier spline with 2 control points
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

	// ref: https://github.com/mrdoob/three.js/blob/master/src/extras/core/Interpolations.js
	CubicBezierP0(k, p) {
		return k * k * k * p;
	}
	
	CubicBezierP1(t, k, p) {
		return 3 * k * k * t * p;
	}
	
	CubicBezierP2(t, k, p) {
		return 3 * k * t * t * p;
	}
	
	CubicBezierP3(t, p) {
		return t * t * t * p;
	}
	
	CubicBezier(t, p0, p1, p2, p3) {
		const k = 1 - t;
		return this.CubicBezierP0(k, p0)
			+ this.CubicBezierP1(t, k, p1)
			+ this.CubicBezierP2(t, k, p2)
			+ this.CubicBezierP3(t, p3);
	}

	// rotation aligned to bezier spline
	// TODO: Not working fix it
	rotation(t) {
		const k = 1 - t;
		// all lengths of enclosing lines
		const l1x = this.c1.x - this.p1.x;
		const l1y = this.c1.y - this.p1.y;

		const l2x = this.c2.x - this.c1.x;
		const l2y = this.c2.y - this.c1.y;

		const l3x = this.p2.x - this.c2.x;
		const l3y = this.p2.y - this.c2.y;

		// spline tangent points at t
		const t1 = new Point(
			l1x * k,
			l1y * k
		);

		const t2 = new Point(
			l2x * k,
			l2y * k
		);
		
		const t3 = new Point(
			l3x * k,
			l3y * k
		);

		const t4 = new Point(
			(t2.x - t1.x) * k,
			(t2.y - t1.y) * k
		)

		const t5 = new Point(
			(t3.x - t2.x) * k,
			(t3.y - t2.y) * k,
		)

		const vx = t5.x - t4.x;
		const vy = t5.y - t4.y;
		let angle = Math.atan2(vy, vx) * 180 / Math.PI;
		angle += 90;
		if (angle < 0) {
			angle += 360;
		}
		//console.log(angle);
		return angle;
	}

	// point position on cubic bezier spline for distance 0-1 from start to end
	position(t) {
		return new Point(
			this.CubicBezier(t, this.p1.x, this.c1.x, this.c2.x, this.p2.x),
			this.CubicBezier(t, this.p1.y, this.c1.y, this.c2.y, this.p2.y)
		)
	}
}

export default Path;
