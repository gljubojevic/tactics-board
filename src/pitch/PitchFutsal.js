import Ball from "./Ball";
import Player from "./Player";
import DrawMode from "./DrawMode";

class PitchFutsal {
	constructor(noPlayers = 0, noPlayerColors=0, playerSize=1, noBalls=0, noBallColors=0, ballSize=1) {
		this._playersIdPrefix = "pl";
		this._noPlayers = noPlayers;
		this._noPlayerColors = noPlayerColors;
		this._playerSize = playerSize;
		this._players = [];

		this._ballsIdPrefix = "bl";
		this._noBalls = noBalls;
		this._noBallColors = noBallColors;
		this._ballSize = ballSize;
		this._balls = [];

		// init objects
		this._initPlayers();
		this._initBalls();
		this._drawMode = new DrawMode();
	}

	_initPlayers() {
		//console.log("Create players noPlayers:", this._noPlayers);
		let groupSize = Math.floor(this._noPlayers / this._noPlayerColors);
		for (var i = 0; i < this._noPlayers; i++) {
			let color = Math.floor(i / groupSize);
			let number = groupSize - (i % groupSize);
			let player = new Player(
				this._playersIdPrefix+i.toString(), number, "", color,
				color * this._playerSize, 0,
				0,
				color * this._playerSize, 0,
				number
			);
			this._players.push(player);
		}
	}

	_initBalls() {
		//console.log("Create balls noBalls:", this._noBalls);
		let groupSize = Math.floor(this._noBalls / this._noBallColors);
		for (var i = 0; i < this._noBalls; i++) {
			let color = Math.floor(i / groupSize);
			let ball = new Ball(
				this._ballsIdPrefix+i.toString(), color,
				color * this._ballSize,0,
				color * this._ballSize,0
			);
			this._balls.push(ball);
		}
	}

	get drawMode() {
		return this._drawMode;
	}
	set drawMode(value) {
		this._drawMode = value;
	}

	get players() {
		return this._players;
	}
	set players(value) {
		this._players = value;
	}

	get balls() {
		return this._balls;
	}
	set balls(value) {
		this._balls = value;
	}

	playerMove(id, deltaX, deltaY) {
		this.players = this.players.map(p => {
			if (id === p.id) {
				p.x += deltaX;
				p.y += deltaY;
			}
			return p;
		});
		return this.players;
	}

	playerEditStart(id) {
		if (!id.startsWith("pl")) {
			return null;
		}
		// Edit player data
		const p = this.players.find(p => id === p.id);
		// disable editing non placed players
		if (!p.isPlaced) {
			return null;
		}
		const editPlayer = {
			id: p.id,
			name: p.name,
			no: p.no
		}
		return editPlayer;
	}

	playerEditDone(player) {
		this.players = this.players.map(p => {
			if (player.id !== p.id) {
				return p;
			}
			if (player.remove) {
				p.reset();
			} else {
				p.name = player.name;
				p.no = player.no;
			}
			return p;
		});
		return this.players;
	}

	ballMove(id, deltaX, deltaY) {
		this.balls = this.balls.map(b => {
			if (id === b.id) {
				b.x += deltaX;
				b.y += deltaY;
			}
			return b;
		});
		return this.balls;
	}
}

export default PitchFutsal;