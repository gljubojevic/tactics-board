import Ball from "./Ball";
import Player from "./Player";
import Square from "./Square";
import Ellipse from "./Ellipse";
import Line from "./Line";
import Point from "./Point";
import Text from "./Text";

const ElementIDPrefix = {
	Ball: 'bl',
	Player: 'pl',
	Square: 'sq',
	Ellipse: 'el',
	Line: 'ln',
	Text: 'txt'
}

class PitchFutsal {

	constructor() {
		this.players = [];
		this.balls = [];

		this.squareID = -1;
		this.squares = [];
		this.ellipseID = -1;
		this.ellipses = [];
		this.lineID = -1;
		this.lines = [];
		this.textID = -1;
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
				ElementIDPrefix.Player + i, number, "", color,
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
				ElementIDPrefix.Ball + i, color,
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
		if (!id.startsWith(ElementIDPrefix.Player)) {
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

	lineNewID() {
		this.lineID += 1;
		return ElementIDPrefix.Line + this.lineID;
	}

	lineCreate(x,y, color, arrowStart, arrowEnd, isDashed) {
		let l = new Line(
			this.lineNewID(), color,
			new Point(x,y),
			new Point(x,y),
			new Point(x,y),
			new Point(x,y),
			arrowStart,
			arrowEnd,
			isDashed
		);
		this.lines = this.lines.map((lx) => lx);
		this.lines.push(l);
		this._modified();
		return l.id;
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
		if (!id.startsWith(ElementIDPrefix.Line)) {
			return false;
		}
		this.lines = this.lines.map(l => {
			if (id === l.id) {
				l.isEdit = true;
			}
			return l;
		});
		this._modified();
		return true;
	}

	lineEditEnd() {
		this.lines = this.lines.map(l => {
			l.isEdit = false;
			return l;
		});
		this._modified();
	}

	ellipseNewID() {
		this.ellipseID += 1;
		return ElementIDPrefix.Ellipse + this.ellipseID;
	}

	ellipseCreate(x, y, color, isDashed) {
		let el = new Ellipse(
			this.ellipseNewID(), color,
			x,y,0,0,0,
			isDashed
		);
		this.ellipses = this.ellipses.map((e) => e);
		this.ellipses.push(el);
		this._modified();
		return el.id;
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
		if (!id.startsWith(ElementIDPrefix.Ellipse)) {
			return;
		}
		this.ellipses = this.ellipses.map(el => {
			if (id === el.id) {
				el.edit(corner, deltaX, deltaY);
			}
			return el;
		});
		this._modified();
	}

	ellipseRotate(id, posX, posY, snap) {
		if (!id.startsWith(ElementIDPrefix.Ellipse)) {
			return;
		}
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
		if (!id.startsWith(ElementIDPrefix.Ellipse)) {
			return false;
		}
		this.ellipses = this.ellipses.map(el => {
			if (id === el.id) {
				el.isEdit = true;
			}
			return el;
		});
		this._modified();
		return true;
	}

	ellipsesEditEnd() {
		this.ellipses = this.ellipses.map(el => {
			el.isEdit = false;
			return el;
		});
	}

	squareNewID() {
		this.squareID += 1;
		return ElementIDPrefix.Square + this.squareID;
	}

	squareCreate(x, y, color, isDashed) {
		let sq = new Square(
			this.squareNewID(), color,
			x,y,0,0,0,
			isDashed
		);
		this.squares = this.squares.map((s) => s);
		this.squares.push(sq);
		this._modified();
		return sq.id;
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
		if (!id.startsWith(ElementIDPrefix.Square)) {
			return;
		}
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
		if (!id.startsWith(ElementIDPrefix.Square)) {
			return;
		}
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
		if (!id.startsWith(ElementIDPrefix.Square)) {
			return false;
		}
		this.squares = this.squares.map(sq => {
			if (id === sq.id) {
				sq.isEdit = true;
			}
			return sq;
		});
		this._modified();
		return true;
	}

	squareEditEnd() {
		this.squares = this.squares.map(sq => {
			sq.isEdit = false;
			return sq;
		});
	}

	textNewID() {
		this.textID += 1;
		return ElementIDPrefix.Text + this.textID;
	}

	textCreate(x, y, color, size) {
		let tx = new Text(
			this.textNewID(), color, size, "",
			x,y,0,
			false, true
		);
		this.texts = this.texts.map((t) => t);
		this.texts.push(tx);
		this._modified();
		return tx.id;
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

	textEditStart(id) {
		if (!id.startsWith(ElementIDPrefix.Text)) {
			return false;
		}
		this.texts = this.texts.map(tx => {
			if (id === tx.id) {
				tx.isEdit = true;
			}
			return tx;
		});
		this._modified();
		return true;
	}

	textMove(id, deltaX, deltaY) {
		if (!id.startsWith(ElementIDPrefix.Text)) {
			return;
		}
		this.texts = this.texts.map(tx => {
			if (id === tx.id) {
				tx.move(deltaX, deltaY);
			}
			return tx;
		});
		this._modified();
	}

	textRotate(id, posX, posY, snap) {
		if (!id.startsWith(ElementIDPrefix.Text)) {
			return;
		}
		this.texts = this.texts.map(tx => {
			if (id === tx.id) {
				tx.rotate(posX, posY, snap);
			}
			return tx;
		});
		this._modified();
	}

	editTopLeft(id, deltaX, deltaY) {
		this.squareEdit("tl",id, deltaX, deltaY);
		this.ellipseEdit("tl",id, deltaX, deltaY);
	}
	
	editTopRight(id, deltaX, deltaY) {
		this.squareEdit("tr",id, deltaX, deltaY);
		this.ellipseEdit("tr",id, deltaX, deltaY);
	}

	editBottomLeft(id, deltaX, deltaY) {
		this.squareEdit("bl",id, deltaX, deltaY);
		this.ellipseEdit("bl",id, deltaX, deltaY);
	}

	editBottomRight(id, deltaX, deltaY) {
		this.squareEdit("br",id, deltaX, deltaY);
		this.ellipseEdit("br",id, deltaX, deltaY);
	}

	editMove(id, deltaX, deltaY) {
		this.squareEdit("mv",id, deltaX, deltaY);
		this.ellipseEdit("mv",id, deltaX, deltaY);
		this.textMove(id, deltaX, deltaY);
	}

	editRotate(id, posX, posY, snap) {
		this.squareRotate(id, posX, posY, snap);
		this.ellipseRotate(id, posX, posY, snap);
		this.textRotate(id, posX, posY, snap);
	}

	endAllEdits() {
		this.lineEditEnd();
		this.squareEditEnd();
		this.ellipsesEditEnd();
		// TODO: Text end editing
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