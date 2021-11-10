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

	linear(p1,p2,keyFramePos) {
		return p1 + (p2-p1) * keyFramePos;
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
			pc.x = this.linear(path.p1.x, path.p2.x, keyFramePos);
			pc.y = this.linear(path.p1.y, path.p2.y, keyFramePos);
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
				let p1 = new Point(p.x, p.y);
				let p2 = new Point(p.x, p.y);
				let c1 = new Point(p.x, p.y);
				let c2 = new Point(p.x, p.y);
				let path = new Line(
					this.playerPathID(index), 99,	// using 99 as edit color 
					p1, p2, c1, c2,
					false, false, true, true
				);
				return path;
			}),
			this.balls.map(b => b.clone()),
			this.balls.map((b, index) => {
				let p1 = b.pos.clone();
				let p2 = b.pos.clone();
				let c1 = b.pos.clone();
				let c2 = b.pos.clone();
				let path = new Line(
					this.ballPathID(index), 99,	// using 99 as edit color 
					p1, p2, c1, c2,
					false, false, true, true
				);
				return path;
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
