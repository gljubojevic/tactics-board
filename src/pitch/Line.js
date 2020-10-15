import Point from "./Point";
import Path from "./Path";

class Line {
	// For line spline with control points see https://www.particleincell.com/2012/bezier-splines/
	// Line iz created as straight line with 2 spline segments
	constructor(id="", color=0, p1=new Point(0,0), p2=new Point(0,0), c1=new Point(0,0), c2=new Point(0,0), arrowStart=false, arrowEnd=false, dashed=false, isEdit=false){
		this.id = id;
		this.color = color;
		this.p1 = p1;
		this.p2 = p2;
		this.c1 = c1;
		this.c2 = c2;
		this.arrowStart = arrowStart;
		this.arrowEnd = arrowEnd;
		this.dashed = dashed;
		this.isEdit = isEdit;
	}

	empty() {
		return this.p1.equalTo(this.p2) 
			&& this.p1.equalTo(this.c1)
			&& this.p1.equalTo(this.c2);
	}

	resize(x2,y2) {
		this.p2= new Point(x2,y2);
		let lx = this.p2.x - this.p1.x;
		let ly = this.p2.y - this.p1.y;
		this.c1 = new Point(
			this.p1.x + lx / 3,
			this.p1.y + ly / 3,
		); 
		this.c2 = new Point(
			this.p1.x + lx / 3 * 2,
			this.p1.y + ly / 3 * 2,
		); 
	}

	edit(pid, deltaX, deltaY) {
		switch (pid) {
			case "p1":
				this.p1.move(deltaX, deltaY);
				break;
			case "c1":
				this.c1.move(deltaX, deltaY);
				break;
			case "c2":
				this.c2.move(deltaX, deltaY);
				break;
			case "p2":
				this.p2.move(deltaX, deltaY);
				break;
			default:
				break;
		}
	}

	paths() {
		let cx = this.computeControlPoints([this.p1.x, this.c1.x, this.c2.x, this.p2.x]);
		let cy = this.computeControlPoints([this.p1.y, this.c1.y, this.c2.y, this.p2.y]);
		let paths = [];
		paths[0] = new Path(
			this.id, this.p1, this.c1,
			new Point(cx.p1[0], cy.p1[0]),
			new Point(cx.p2[0], cy.p2[0]),
			this.arrowStart, false
		);
		paths[1] = new Path(
			this.id, this.c1, this.c2,
			new Point(cx.p1[1], cy.p1[1]),
			new Point(cx.p2[1], cy.p2[1]),
			false, false
		);
		paths[2] = new Path(
			this.id, this.c2, this.p2,
			new Point(cx.p1[2], cy.p1[2]),
			new Point(cx.p2[2], cy.p2[2]),
			false, this.arrowEnd
		);
		return paths;
	}

	// computes control points given knots K, this is the brain of the operation
	computeControlPoints(K) {
		let p1 = [];
		let p2 = [];
		let n = K.length-1;
		
		// rhs vector
		let a = [];
		let b = [];
		let c = [];
		let r = [];
		
		// left most segment
		a[0]=0;
		b[0]=2;
		c[0]=1;
		r[0] = K[0] + 2*K[1];
		
		// internal segments
		for (let i = 1; i < n - 1; i++) {
			a[i]=1;
			b[i]=4;
			c[i]=1;
			r[i] = 4 * K[i] + 2 * K[i+1];
		}

		// right segment
		a[n-1]=2;
		b[n-1]=7;
		c[n-1]=0;
		r[n-1] = 8*K[n-1] + K[n];
		
		// solves Ax=b with the Thomas algorithm (from Wikipedia)
		for (let i = 1; i < n; i++) {
			let m = a[i] / b[i - 1];
			b[i] = b[i] - m * c[i - 1];
			r[i] = r[i] - m * r[i - 1];
		}
	
		p1[n-1] = r[n-1] / b[n-1];
		for (let i = n - 2; i >= 0; --i) {
			p1[i] = (r[i] - c[i] * p1[i+1]) / b[i];
		}
			
		// we have p1, now compute p2
		for (let i = 0; i < n-1; i++) {
			p2[i] = 2 * K[i+1] - p1[i+1];
		}
		p2[n-1] = 0.5 * (K[n]+p1[n-1]);
		
		return { p1:p1, p2:p2 };
	}
}

export default Line;
