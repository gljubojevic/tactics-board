import Ball from "./Ball";
import Player from "./Player";
import DrawMode from "./DrawMode";
import Square from "./Square";
import Ellipse from "./Ellipse";
import Line from "./Line";

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

		this._squareID = 0;
		this._squares = [];

		this._ellipseID = 0;
		this._ellipses = [];
		
		this._lineID = 0;
		this._lines = [];

		this._textID = 0;
		this._texts = [];

		this._overlay = "none";

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

	get balls() {
		return this._balls;
	}
	set balls(value) {
		this._balls = value;
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

	get lines() {
		return this._lines;
	}
	set lines(value) {
		this._lines = value;
	}

	lineCreate(x,y) {
		let id = 'ln'+this._lineID.toString();
		this._lineID += 1;
		return new Line(
			id, this._drawMode.color,
			x,y,x,y,
			this._drawMode.lineArrowStart,
			this._drawMode.lineArrowEnd,
			this._drawMode.lineDashed
		);
	}

	lineAdd(l) {
		this.lines = this.lines.map((lx) => lx);
		this.lines.push(l);
		return this.lines;
	}

	lineResize(id, x2, y2) {
		this.lines = this.lines.map(l => {
			if (id === l.id) {
				l.x2 = x2;
				l.y2 = y2;
			}
			return l;
		});
		return this.lines;
	}

	// remove empty lines
	lineCleanup() {
		this.lines = this.lines.filter(l => l.x1 !== l.x2 && l.y1 !== l.y2);
		return this.lines;
	}

	lineEditStart(id) {
		this.lines = this.lines.map(l => {
			if (id === l.id) {
				l.isEdit = true;
			}
			return l;
		});
		return this.lines;
	}


	get ellipses() {
		return this._ellipses;
	}
	set ellipses(value) {
		this._ellipses = value;
	}

	ellipseCreate(x,y) {
		let id = 'el'+this._ellipseID.toString();
		this._ellipseID += 1;
		return new Ellipse(
			id, this._drawMode.color,
			x,y,0,0,0,
			this._drawMode.lineDashed
		);
	}

	ellipseAdd(el) {
		this.ellipses = this.ellipses.map((e) => e);
		this.ellipses.push(el);
		return this.ellipses;
	}

	ellipseResize(id, x2, y2, proportional) {
		this.ellipses = this.ellipses.map(el => {
			if (id === el.id) {
				el.resize(x2, y2, proportional);
			}
			return el;
		});
		return this.ellipses;
	}

	ellipseEdit(corner, id, deltaX, deltaY) {
		this.ellipses = this.ellipses.map(el => {
			if (id === el.id) {
				el.edit(corner, deltaX, deltaY);
			}
			return el;
		});
		return this.ellipses;
	}

	// remove empty ellipses
	ellipseCleanup() {
		this.ellipses = this.ellipses.filter(el => el.rx > 0 && el.ry > 0);
		return this.ellipses;
	}

	ellipseEditStart(id) {
		this.ellipses = this.ellipses.map(el => {
			if (id === el.id) {
				el.isEdit = true;
			}
			return el;
		});
		return this.ellipses;
	}

	ellipsesEditEnd() {
		this.ellipses = this.ellipses.map(el => {
			el.isEdit = false;
			return el;
		});
		return this.ellipses;
	}

	get squares() {
		return this._squares;
	}
	set squares(value) {
		this._squares = value;
	}

	squareCreate(x,y) {
		let id = 'sq'+this._squareID.toString();
		this._squareID += 1;
		return new Square(
			id, this._drawMode.color,
			x,y,0,0,0,
			this._drawMode.lineDashed
		);
	}

	squareAdd(sq) {
		this.squares = this.squares.map((s) => s);
		this.squares.push(sq);
		return this.squares;
	}

	squareResize(id, x2, y2, proportional) {
		this.squares = this.squares.map(sq => {
			if (id === sq.id) {
				sq.resize(x2, y2, proportional);
			}
			return sq;
		});
		return this.squares;
	}

	squareEdit(corner, id, deltaX, deltaY) {
		this.squares = this.squares.map(sq => {
			if (id === sq.id) {
				sq.edit(corner, deltaX, deltaY);
			}
			return sq;
		});
		return this.squares;
	}

	// remove empty squares
	squareCleanup() {
		this.squares = this.squares.filter(sq => sq.width > 0 && sq.height > 0);
		return this.squares;
	}

	squareEditStart(id) {
		this.squares = this.squares.map(sq => {
			if (id === sq.id) {
				sq.isEdit = true;
			}
			return sq;
		});
		return this.squares;
	}

	squareEditEnd() {
		this.squares = this.squares.map(sq => {
			sq.isEdit = false;
			return sq;
		});
		return this.squares;
	}

	get texts() {
		return this._texts;
	}
	set texts(value) {
		this._texts = value;
	}

	get overlay() {
		return this._overlay;
	}
	set overlay(value) {
		this._overlay = value;
	}

	overlaySize() {
		switch (this._overlay) {
			case "exercise":
				return {width:2800, height:2000};
			case "basketball":
				return {width:2800, height:1500}
			case "volleyball":
				return {width:1800, height:900}
			default:
				return null;
		}
	}
}

export default PitchFutsal;