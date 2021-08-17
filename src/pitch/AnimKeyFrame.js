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
				let p1 = new Point(b.x, b.y);
				let p2 = new Point(b.x, b.y);
				let c1 = new Point(b.x, b.y);
				let c2 = new Point(b.x, b.y);
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
