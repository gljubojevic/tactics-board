import Point from "./Point";
import Line from "./Line";
import { ElementIDPrefix } from "./Constants";

class AnimKeyFrame {
	constructor(players=null, playerPaths=null, balls=null, ballPaths=null){
		this.players = players;
		this.playerPaths = playerPaths;
		this.balls = balls;
		this.ballPaths = ballPaths;
	}

	playerPathID(index) {
		return ElementIDPrefix.PathPlayer + index;
	}

	ballPathID(index) {
		return ElementIDPrefix.PathBall + index;
	}

	linearPos(p1, p2, keyFramePos) {
		return new Point(
			p1.x + (p2.x-p1.x) * keyFramePos,
			p1.y + (p2.y-p1.y) * keyFramePos
		)
	}

	animatePlayersOnPaths(keyFramePos) {
		return this.players.map((p, index)=> {
			if (!p.isPlaced) {
				return p;
			}
			let pc = p.clone();
			let path = this.playerPaths[index];
			pc.pos = this.linearPos(path.p1, path.p2, keyFramePos);
			return pc;
		});
	}

	animateBallsOnPaths(keyFramePos) {
		return this.balls.map((b, index) => {
			if (!b.isPlaced) {
				return b;
			}
			let bc = b.clone();
			let path = this.ballPaths[index];
			bc.pos = this.linearPos(path.p1, path.p2, keyFramePos);
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
