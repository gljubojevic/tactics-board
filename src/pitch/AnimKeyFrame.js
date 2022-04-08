import Line from "./Line";
import { ElementIDPrefix, RemoveTags } from "./Constants";
import Player from "./Player";
import Point from "./Point";
import Ball from "./Ball";

class AnimKeyFrame {
	constructor(players=null, playerPaths=null, balls=null, ballPaths=null){
		this.players = players;
		this.playerPaths = playerPaths;
		this.balls = balls;
		this.ballPaths = ballPaths;

		this.playerPathSplines = [];
		this.ballPathSplines = [];
	}

	save() {
		return {
			players: this.players.map(p => p.save()),
			playerPaths: null === this.playerPaths ? null : this.playerPaths.map(pp => pp.save()),
			balls: this.balls.map(b => b.save()),
			ballPaths: null == this.ballPaths ? null : this.ballPaths.map(bp => bp.save())
		}
	}

	load(data) {
		this.players = data.players.map(p => {
			return new Player(
				p.id, p.no,
				RemoveTags(p.name),
				p.color,
				new Point(p.pos.x, p.pos.y), p.rotation,
				new Point(p.posDefault.x, p.posDefault.y),
				p.noDefault
			);
		});

		if (null !== data.playerPaths) {
			this.playerPaths = data.playerPaths.map(l => {
				return new Line(
					l.id, l.color, 
					new Point(l.p1.x, l.p1.y),
					new Point(l.p2.x, l.p2.y),
					new Point(l.c1.x, l.c1.y),
					new Point(l.c2.x, l.c2.y),
					l.arrowStart, l.arrowEnd, l.dashed,
					true
				);
			});
		}

		this.balls = data.balls.map(b => {
			return new Ball(
				b.id, b.color,
				new Point(b.pos.x, b.pos.y),
				new Point(b.posDefault.x, b.posDefault.y)
			);
		});

		if (null !== data.ballPaths) {
			this.ballPaths = data.ballPaths.map(l => {
				return new Line(
					l.id, l.color, 
					new Point(l.p1.x, l.p1.y),
					new Point(l.p2.x, l.p2.y),
					new Point(l.c1.x, l.c1.y),
					new Point(l.c2.x, l.c2.y),
					l.arrowStart, l.arrowEnd, l.dashed,
					true
				);
			});
		}
	}

	playerPathID(index) {
		return ElementIDPrefix.PathPlayer + index;
	}

	ballPathID(index) {
		return ElementIDPrefix.PathBall + index;
	}

	// this is to pre calc bezier splines from lines instead doing it every anim frame
	animPreCalcSplines() {
		if (null !== this.playerPaths) {
			this.playerPathSplines = this.playerPaths.map(l => l.paths());
		}
		if (null != this.ballPaths) {
			this.ballPathSplines = this.ballPaths.map(l => l.paths());
		}
	}

	animGetActivePlayerPaths() {
		const active = [];
		if (null === this.playerPaths) {
			return active;
		}
		this.playerPaths.forEach(p => {
			if (p.empty()) {
				return;
			}
			const pc = p.clone();
			pc.arrowEnd = true;
			pc.isEdit = false;
			active.push(pc);
		});
		return active;
	}

	animGetActiveBallPaths() {
		const active = [];
		if (null === this.ballPaths) {
			return active;
		}
		this.ballPaths.forEach(p => {
			if (p.empty()) {
				return;
			}
			const pc = p.clone();
			pc.arrowEnd = true;
			pc.isEdit = false;
			active.push(pc);
		});
		return active;
	}

	// there are 3 cubic bezier splines forming a path
	splinePathPos(keyFramePos) {
		const scale = keyFramePos * 3;
		let idx = Math.floor(scale);
		// clip to last bezier spline
		// Note: this happens when keyFramePos is 1 = max last position 
		if (idx >= 3) {
			idx = 2;
		}
		return {
			idx: idx,		// bezier spline index
			t: scale - idx	// bezier spline position
		};
	}

	animatePlayersOnPaths(keyFramePos) {
		const splinePos = this.splinePathPos(keyFramePos);
		return this.players.map((p, index)=> {
			if (!p.isPlaced) {
				return p;
			}
			let pc = p.clone();
			let splines = this.playerPathSplines[index];
			pc.pos = splines[splinePos.idx].position(splinePos.t);
			//pc.rotation = splines[splinePos.idx].rotation(splinePos.t);
			return pc;
		});
	}

	animateBallsOnPaths(keyFramePos) {
		const splinePos = this.splinePathPos(keyFramePos);
		return this.balls.map((b, index) => {
			if (!b.isPlaced) {
				return b;
			}
			let bc = b.clone();
			let splines = this.ballPathSplines[index];
			bc.pos = splines[splinePos.idx].position(splinePos.t);
			return bc;
		});
	}

	clone() {
		return new AnimKeyFrame(
			this.players.map(p => p.clone()),
			this.players.map((p, index) => {
				// new key frame has line with all points at same position
				return new Line(
					this.playerPathID(index),
					p.color,	// using same color as player 
					p.pos.clone(), 
					p.pos.clone(),
					p.pos.clone(), 
					p.pos.clone(),
					false, false, true, true
				);
			}),
			this.balls.map(b => b.clone()),
			this.balls.map((b, index) => {
				// new key frame has line with all points at same position
				return new Line(
					this.ballPathID(index),
					b.color,	// using same color as ball
					b.pos.clone(),
					b.pos.clone(),
					b.pos.clone(), 
					b.pos.clone(),
					false, false, true, true
				);
			})
		);
	}

	equalTo(kf) {
		if (this.players.length !== kf.players.length) {
			return false;
		}
		for (let i = 0; i < this.players.length; i++) {
			if (!this.players[i].equalTo(kf.players[i])) {
				return false;
			}
		}

		if (this.balls.length !== kf.balls.length) {
			return false;
		}
		for (let i = 0; i < this.balls.length; i++) {
			if (!this.balls[i].equalTo(kf.balls[i])) {
				return false;
			}
		}

		return true;
	}
}

export default AnimKeyFrame;
