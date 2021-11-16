import Line from "./Line";
import { ElementIDPrefix } from "./Constants";

class AnimKeyFrame {
	constructor(players=null, playerPaths=null, balls=null, ballPaths=null){
		this.players = players;
		this.playerPaths = playerPaths;
		this.playerPathSplines = [];
		this.balls = balls;
		this.ballPaths = ballPaths;
		this.ballPathSplines = [];
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
					this.playerPathID(index), 99,	// using 99 as edit color 
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
					this.ballPathID(index), 99,	// using 99 as edit color 
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
