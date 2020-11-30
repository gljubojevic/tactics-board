import Ball from "./Ball";
import Player from "./Player";
import Square from "./Square";
import Ellipse from "./Ellipse";
import Line from "./Line";
import Point from "./Point";
import Text from "./Text";

class PitchFutsal {

	constructor() {
		this.players = [];
		this.balls = [];

		this.squareID = 0;
		this.squares = [];
		this.ellipseID = 0;
		this.ellipses = [];
		this.lineID = 0;
		this.lines = [];
		this.textID = 0;
		this.texts = [];

		this._overlay = "none";

		this.isModified = false;
		this.onModified = null;
	}

	initDefault(noPlayers, noPlayerColors, playerSize, noBalls, noBallColors, ballSize) {
		this._initPlayers(noPlayers, noPlayerColors, playerSize);
		this._initBalls(noBalls, noBallColors, ballSize);
	}

	_initPlayers(noPlayers, noPlayerColors, playerSize) {
		let groupSize = Math.floor(noPlayers / noPlayerColors);
		for (var i = 0; i < noPlayers; i++) {
			let color = Math.floor(i / groupSize);
			let number = groupSize - (i % groupSize);
			let player = new Player(
				"pl"+i.toString(), number, "", color,
				color * playerSize, 0,
				0,
				color * playerSize, 0,
				number
			);
			this.players.push(player);
		}
	}

	_initBalls(noBalls, noBallColors, ballSize) {
		let groupSize = Math.floor(noBalls / noBallColors);
		for (var i = 0; i < noBalls; i++) {
			let color = Math.floor(i / groupSize);
			let ball = new Ball(
				"bl"+i.toString(), color,
				color * ballSize,0,
				color * ballSize,0
			);
			this.balls.push(ball);
		}
	}

	_modified() {
		let cp = new PitchFutsal();
		cp.isModified = true;
		cp.players = this.players;
		cp.balls = this.balls;
		cp.squareID = this.squareID;
		cp.squares = this.squares;
		cp.ellipseID = this.ellipseID;
		cp.ellipses = this.ellipses;
		cp.lineID = this.lineID;
		cp.lines = this.lines;
		cp.textID = this.textID;
		cp.texts = this.texts;
		cp._overlay = this.overlay;
		// trigger event modified
		if (null !== this.onModified) {
			this.onModified(cp);
		}
	}

	playerMove(id, deltaX, deltaY) {
		this.players = this.players.map(p => {
			if (id === p.id) {
				p.x += deltaX;
				p.y += deltaY;
			}
			return p;
		});
		this._modified();
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
		this._modified();
	}


	ballMove(id, deltaX, deltaY) {
		this.balls = this.balls.map(b => {
			if (id === b.id) {
				b.x += deltaX;
				b.y += deltaY;
			}
			return b;
		});
		this._modified();
	}


	lineCreate(x,y, color, arrowStart, arrowEnd, isDashed) {
		let id = 'ln'+this.lineID.toString();
		this.lineID += 1;
		return new Line(
			id, color,
			new Point(x,y),
			new Point(x,y),
			new Point(x,y),
			new Point(x,y),
			arrowStart,
			arrowEnd,
			isDashed
		);
	}

	lineAdd(l) {
		this.lines = this.lines.map((lx) => lx);
		this.lines.push(l);
		this._modified();
	}

	lineResize(id, x2, y2) {
		this.lines = this.lines.map(l => {
			if (id === l.id) {
				l.resize(x2,y2);
			}
			return l;
		});
		this._modified();
	}

	lineEdit(pid, id, deltaX, deltaY) {
		this.lines = this.lines.map(l => {
			if (id === l.id) {
				l.edit(pid, deltaX, deltaY);
			}
			return l;
		});
		this._modified();
	}

	// remove empty lines
	lineCleanup() {
		this.lines = this.lines.filter(l => !l.empty());
		this._modified();
	}

	lineEditStart(id) {
		this.lines = this.lines.map(l => {
			if (id === l.id) {
				l.isEdit = true;
			}
			return l;
		});
		this._modified();
	}

	lineEditEnd() {
		this.lines = this.lines.map(l => {
			l.isEdit = false;
			return l;
		});
		this._modified();
	}


	ellipseCreate(x, y, color, isDashed) {
		let id = 'el'+this.ellipseID.toString();
		this.ellipseID += 1;
		return new Ellipse(
			id, color,
			x,y,0,0,0,
			isDashed
		);
	}

	ellipseAdd(el) {
		this.ellipses = this.ellipses.map((e) => e);
		this.ellipses.push(el);
		this._modified();
	}

	ellipseResize(id, x2, y2, proportional) {
		this.ellipses = this.ellipses.map(el => {
			if (id === el.id) {
				el.resize(x2, y2, proportional);
			}
			return el;
		});
		this._modified();
	}

	ellipseEdit(corner, id, deltaX, deltaY) {
		this.ellipses = this.ellipses.map(el => {
			if (id === el.id) {
				el.edit(corner, deltaX, deltaY);
			}
			return el;
		});
		this._modified();
	}

	ellipseRotate(id, posX, posY, snap) {
		this.ellipses = this.ellipses.map(el => {
			if (id === el.id) {
				el.rotate(posX, posY, snap);
			}
			return el;
		});
		this._modified();
	}

	// remove empty ellipses
	ellipseCleanup() {
		this.ellipses = this.ellipses.filter(el => el.rx > 0 && el.ry > 0);
		this._modified();
	}

	ellipseEditStart(id) {
		this.ellipses = this.ellipses.map(el => {
			if (id === el.id) {
				el.isEdit = true;
			}
			return el;
		});
		this._modified();
	}

	ellipsesEditEnd() {
		this.ellipses = this.ellipses.map(el => {
			el.isEdit = false;
			return el;
		});
	}


	squareCreate(x, y, color, isDashed) {
		let id = 'sq'+this.squareID.toString();
		this.squareID += 1;
		return new Square(
			id, color,
			x,y,0,0,0,
			isDashed
		);
	}

	squareAdd(sq) {
		this.squares = this.squares.map((s) => s);
		this.squares.push(sq);
		this._modified();
	}

	squareResize(id, x2, y2, proportional) {
		this.squares = this.squares.map(sq => {
			if (id === sq.id) {
				sq.resize(x2, y2, proportional);
			}
			return sq;
		});
		this._modified();
	}

	squareEdit(corner, id, deltaX, deltaY) {
		this.squares = this.squares.map(sq => {
			if (id === sq.id) {
				sq.edit(corner, deltaX, deltaY);
			}
			return sq;
		});
		this._modified();
		return this.squares;
	}

	squareRotate(id, posX, posY, snap) {
		this.squares = this.squares.map(sq => {
			if (id === sq.id) {
				sq.rotate(posX, posY, snap);
			}
			return sq;
		});
		this._modified();
	}

	// remove empty squares
	squareCleanup() {
		this.squares = this.squares.filter(sq => sq.width > 0 && sq.height > 0);
		this._modified();
	}

	squareEditStart(id) {
		this.squares = this.squares.map(sq => {
			if (id === sq.id) {
				sq.isEdit = true;
			}
			return sq;
		});
		this._modified();
	}

	squareEditEnd() {
		this.squares = this.squares.map(sq => {
			sq.isEdit = false;
			return sq;
		});
	}

	textCreate(x, y, color, size) {
		let id = 'txt'+this.textID.toString();
		this.textID += 1;
		return new Text(
			id, color, size, "",
			x,y,0,
			false, true
		);
	}

	textAdd(tx) {
		this.texts = this.texts.map((t) => t);
		this.texts.push(tx);
		this._modified();
	}

	textEditDone(id, text, bx, by, bwidth, bheight) {
		this.texts = this.texts.map(t => {
			if (id === t.id) {
				t.isEdit = false;
				t.isTextEdit = false;
				t.text = text;
				t.bx = bx;
				t.by = by;
				t.bwidth = bwidth;
				t.bheight = bheight;
			}
			return t;
		});
		this._modified();
	}

	endAllEdits() {
		this.lineEditEnd();
		this.squareEditEnd();
		this.ellipsesEditEnd();
		this._modified();
	}

	get overlay() {
		return this._overlay;
	}

	set overlay(value) {
		if (this._overlay === value) {
			return;
		}
		this._overlay = value;
		this._modified();
	}

	overlaySize() {
		switch (this.overlay) {
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