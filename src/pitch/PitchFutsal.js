import Ball from "./Ball";
import Player from "./Player";
import Square from "./Square";
import Ellipse from "./Ellipse";
import Line from "./Line";
import Point from "./Point";
import Text from "./Text";
import Extras from "./Extras";
import AnimKeyFrame from "./AnimKeyFrame";
import { ElementIDPrefix, RemoveTags, ExtrasType, ExtrasDefaults } from "./Constants";

class PitchFutsal {

	constructor(uuid="") {
		this.id = uuid;
		this.name = "";
		this.description = "";
		this.created = new Date();
		this.updated = new Date();

		this.width = 4500;			// editor total width in cm
		this.height = 2500;			// editor total height in cm
		this.widthPitch = 4000; 	// pitch width in cm
		this.heightPitch = 2000;	// pitch height in cm

		this.AnimExists = false;
		this.AnimKeyFrameCurrent = 0;
		this.AnimKeyFrameDuration = 5;	// duration of each key frame in seconds
		this.AnimKeyFrames = [];
		this.AnimPlaying = false;
		this.AnimShowPaths = false;
		this.AnimPlayers = null;
		this.AnimBalls = null;
		this.AnimPlayerPaths = null;
		this.AnimBallPaths = null;

		this.squareID = -1;
		this.squares = [];
		this.ellipseID = -1;
		this.ellipses = [];
		this.lineID = -1;
		this.lines = [];
		this.textID = -1;
		this.texts = [];
		this.extrasID = -1;
		this.extras = [];

		this._overlay = "none";

		this.isModified = false;
		this.onModified = null;
	}

	// Pitch top left corner position within editor
	pitchPos() {
		return {
			top: (this.height - this.heightPitch) / 2,
			left: (this.width - this.widthPitch) / 2
		}
	}

	// Players top left corner within editor
	playersPos() {
		const pPos = this.pitchPos();
		return {
			top: pPos.top + this.heightPitch + 50 + 25,
			left: pPos.left + 50
		}
	}

	// Balls top left corner within editor
	ballsPos() {
		const pPos = this.pitchPos();
		return {
			top: pPos.top + this.heightPitch + 90,
			left: pPos.left + 1050
		}
	}
	
	initDefault(noPlayers, noPlayerColors, playerSize, noBalls, noBallColors, ballSize) {
		let kf = new AnimKeyFrame(
			this._initPlayers(noPlayers, noPlayerColors, playerSize),
			null,
			this._initBalls(noBalls, noBallColors, ballSize),
			null
		);
		this.AnimKeyFrames.push(kf);

		// add default extras
		const goalExtras = ExtrasDefaults[ExtrasType.Goal];
		const pPos = this.pitchPos();
		// Left goal
		this.extras.push(new Extras(
			ElementIDPrefix.Extras + "goal-left", 0, ExtrasType.Goal,
			pPos.left - (goalExtras.width / 2),
			pPos.top + (this.heightPitch / 2),
			goalExtras.width, goalExtras.height,
			0, false
		));
		// Right Goal
		this.extras.push(new Extras(
			ElementIDPrefix.Extras + "goal-right", 0, ExtrasType.Goal,
			pPos.left + this.widthPitch + (goalExtras.width / 2),
			pPos.top + (this.heightPitch / 2),
			goalExtras.width, goalExtras.height,
			180, false
		));
	}

	_initPlayers(noPlayers, noPlayerColors, playerSize) {
		const pPos = this.playersPos();
		let players = [];
		let groupSize = Math.floor(noPlayers / noPlayerColors);
		for (var i = 0; i < noPlayers; i++) {
			let color = Math.floor(i / groupSize);
			let number = groupSize - (i % groupSize);
			let posX = color * playerSize;
			let player = new Player(
				ElementIDPrefix.Player + i, number, "", color,
				new Point(pPos.left + posX, pPos.top),
				90,
				new Point(pPos.left + posX, pPos.top),
				number,
				90
			);
			players.push(player);
		}
		return players;
	}

	_initBalls(noBalls, noBallColors, ballSize) {
		const bPos = this.ballsPos()
		let balls = [];
		let groupSize = Math.floor(noBalls / noBallColors);
		for (var i = 0; i < noBalls; i++) {
			let color = Math.floor(i / groupSize);
			let posX = color * ballSize;
			let ball = new Ball(
				ElementIDPrefix.Ball + i, color,
				new Point(bPos.left + posX, bPos.top),
				new Point(bPos.left + posX, bPos.top)
			);
			balls.push(ball);
		}
		return balls;
	}

	_modified() {
		let cp = new PitchFutsal();
		cp.isModified = true;

		cp.id = this.id;
		cp.name = this.name;
		cp.description = this.description;
		cp.created = this.created;
		cp.updated = new Date();

		cp.width = this.width;
		cp.height = this.height;
		cp.widthPitch = this.widthPitch;
		cp.heightPitch = this.heightPitch;

		cp.AnimExists = this.AnimExists;
		cp.AnimKeyFrameCurrent = this.AnimKeyFrameCurrent;
		cp.AnimKeyFrameDuration = this.AnimKeyFrameDuration;
		cp.AnimKeyFrames = this.AnimKeyFrames;
		cp.AnimShowPaths = this.AnimShowPaths;
		cp.AnimPlaying = this.AnimPlaying;
		cp.AnimPlayers = this.AnimPlayers;
		cp.AnimBalls = this.AnimBalls;
		cp.AnimPlayerPaths = this.AnimPlayerPaths;
		cp.AnimBallPaths = this.AnimBallPaths;

		cp.squareID = this.squareID;
		cp.squares = this.squares;
		cp.ellipseID = this.ellipseID;
		cp.ellipses = this.ellipses;
		cp.lineID = this.lineID;
		cp.lines = this.lines;
		cp.textID = this.textID;
		cp.texts = this.texts;
		cp.extrasID = this.extrasID;
		cp.extras = this.extras;
		cp._overlay = this.overlay;
		// trigger event modified
		if (null !== this.onModified) {
			this.onModified(cp);
		}
	}

	// saving only parameters
	save() {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
			created: this.created,
			updated: this.updated,
			width: this.width,
			height: this.height,
			widthPitch: this.widthPitch,
			heightPitch: this.heightPitch,
			AnimExists: this.AnimExists,
			AnimKeyFrameCurrent: this.AnimKeyFrameCurrent,
			AnimKeyFrameDuration:this.AnimKeyFrameDuration,
			AnimKeyFrames: this.AnimKeyFrames.map(kf => kf.save()),
			squareID: this.squareID,
			squares: this.squares.map(sq => sq.save()),
			ellipseID: this.ellipseID,
			ellipses: this.ellipses.map(el => el.save()),
			lineID: this.lineID,
			lines: this.lines.map(l => l.save()),
			textID: this.textID,
			texts: this.texts.map(t => t.save()),
			extrasID: this.extrasID,
			extras: this.extras.map(ex => ex.save()),
			overlay: this.overlay
		};
	}

	load(data) {
		this.id = data.id;
		this.name = RemoveTags(data.name);
		this.description = RemoveTags(data.description);
		this.created = new Date(data.created);
		this.updated = new Date(data.updated);

		this.width = data.width;
		this.height = data.height;
		this.widthPitch = data.widthPitch;
		this.heightPitch = data.heightPitch;

		this.AnimExists = data.AnimExists;
		this.AnimKeyFrameCurrent = data.AnimKeyFrameCurrent;
		this.AnimKeyFrameDuration = data.AnimKeyFrameDuration;
		this.AnimKeyFrames = data.AnimKeyFrames.map(kf => {
			let k = new AnimKeyFrame(null, null, null, null);
			k.load(kf);
			return k;
		});
		
		this.squareID = data.squareID;
		this.squares = data.squares.map(sq => {
			return new Square(
				sq.id, sq.color, 
				sq.x1, sq.y1, 
				sq.width, sq.height, 
				sq.rotation, sq.dashed, 
				false
			);
		});
		
		this.ellipseID = data.ellipseID;
		this.ellipses = data.ellipses.map(el => {
			return new Ellipse(
				el.id, el.color, 
				el.x1, el.y1, 
				el.rx, el.ry, 
				el.rotation, el.dashed, 
				false
			);
		});

		this.lineID = data.lineID;
		this.lines = data.lines.map(l => {
			return new Line(
				l.id, l.color, 
				new Point(l.p1.x, l.p1.y),
				new Point(l.p2.x, l.p2.y),
				new Point(l.c1.x, l.c1.y),
				new Point(l.c2.x, l.c2.y),
				l.arrowStart, l.arrowEnd, l.dashed,
				false
			);
		});

		this.textID = data.textID;
		this.texts = data.texts.map(t => {
			let tx = new Text(
				t.id, t.color, 
				t.size, t.text, 
				t.x, t.y, t.rotation, 
				false, false
			);
			tx.bx = t.bx;
			tx.by = t.by;
			tx.bwidth = t.bwidth;
			tx.bheight = t.bheight;
			return tx;
		});

		this.extrasID = data.extrasID;
		this.extras = data.extras.map(ex => {
			return new Extras(
				ex.id, ex.color, ex.t, 
				ex.x, ex.y, 
				ex.width, ex.height, ex.rotation, 
				false
			);
		});

		this.overlay = data.overlay;

		// trigger event modified
		this._modified();
	}

	shareEnabled() {
		return (this.name.trim().length + this.description.trim().length) > 0;
	}

	setNameAndDescription(name, description) {
		this.name = name;
		this.description = description;
		this._modified();
	}

	playersCurrentKeyFrame() {
		if (this.AnimPlaying) {
			return null;
		}
		return this.AnimKeyFrames[this.AnimKeyFrameCurrent].players;
	}

	playerPathsCurrentKeyFrame() {
		if (this.AnimPlaying) {
			return null;
		}
		return this.AnimKeyFrames[this.AnimKeyFrameCurrent].playerPaths;
	}

	playersPreviousKeyFrame() {
		if (this.AnimPlaying) {
			return null;
		}
		if (0 === this.AnimKeyFrameCurrent) {
			return null;
		}
		return this.AnimKeyFrames[this.AnimKeyFrameCurrent-1].players;
	}

	animCreate() {
		this.AnimExists = true;
		this.AnimShowPaths = true;
		this._modified();
	}

	animDelete() {
		this.AnimExists = false;
		this.AnimKeyFrameCurrent = 0;
		this.AnimKeyFrameDuration = 5;
		// keep only 1 key frame
		this.AnimKeyFrames = [
			this.AnimKeyFrames[0]
		]
		this._modified();
	}

	animKeyFrameDurationSet(duration) {
		let newDuration = parseInt(duration);
		this.AnimKeyFrameDuration = isNaN(newDuration) ? 1 : newDuration;
		if (0 >= this.AnimKeyFrameDuration) {
			this.AnimKeyFrameDuration = 1;
		}
		this._modified();
	}

	animKeyFrameAdd() {
		let last = this.AnimKeyFrames.length - 1;
		let beforeLast = last-1;
		if (beforeLast >= 0) {
			// Add check if there is diff between previous and last key frame, 
			// forbid adding if no changes between last two frames
			if (this.AnimKeyFrames[last].equalTo(this.AnimKeyFrames[beforeLast])) {
				console.log("No change in data new add frame forbidden");
				return false;
			}
		}
		// clone last
		let newKeyFrame = this.AnimKeyFrames[last].clone();
		// copy and add new
		this.AnimKeyFrames = this.AnimKeyFrames.map(kf => kf);
		this.AnimKeyFrames.push(newKeyFrame);
		// position to last key frame
		this.AnimKeyFrameCurrent = this.AnimKeyFrames.length - 1;
		this._modified();
		return true;
	}

	animKeyFrameDelete() {
		let last = this.AnimKeyFrames.length - 1;
		if (0 === last) {
			return false;
		}
		if (last !== this.AnimKeyFrameCurrent) {
			return false;
		}
		// remove last key frame
		let kf = [];
		for (let i = 0; i < last; i++) {
			kf.push(this.AnimKeyFrames[i])
		}
		this.AnimKeyFrames = kf;
		// position to last key frame
		this.AnimKeyFrameCurrent = this.AnimKeyFrames.length - 1;
		this._modified();
		return true;
	}

	animKeyFrameNext() {
		let next = this.AnimKeyFrameCurrent + 1;
		if (next >= this.AnimKeyFrames.length) {
			return false;
		}
		this.AnimKeyFrameCurrent = next;
		this._modified();
		return true;
	}

	animKeyFramePrevious() {
		if (0 === this.AnimKeyFrameCurrent) {
			return false;
		}
		this.AnimKeyFrameCurrent--;
		this._modified();
		return true;
	}

	animStart() {
		this.AnimPlaying = true;
		this.AnimPlayerPaths = [];
		this.AnimBallPaths = [];
		this.AnimKeyFrames.forEach(kf => {
			kf.animPreCalcSplines();
			// prepare paths to show
			this.AnimPlayerPaths = this.AnimPlayerPaths.concat(kf.animGetActivePlayerPaths());
			this.AnimBallPaths = this.AnimBallPaths.concat(kf.animGetActiveBallPaths());
		});
		this.animFrame(0);	// prepare first frame
		this._modified();
	}

	animStop() {
		this.AnimPlaying = false;
		this.AnimPlayers = null;
		this.AnimBalls = null;
		this.AnimPlayerPaths = null;
		this.AnimBallPaths = null;
		this._modified();
	}

	AnimAllPlayerPaths() {
		if (this.AnimPlaying && this.AnimShowPaths) {
			return this.AnimPlayerPaths;
		}
		return null;
	}

	AnimAllBallPaths() {
		if (this.AnimPlaying && this.AnimShowPaths) {
			return this.AnimBallPaths;
		}
		return null;
	}

	animShowPaths(show) {
		this.AnimShowPaths = show;
		this._modified();
	}

	animFrame(time) {
		const kfDuration = this.AnimKeyFrameDuration * 1000;
		const keyFrame = Math.floor(time / kfDuration);
		const kfTime = time - (keyFrame * kfDuration);
		let kfPos = kfTime / kfDuration;
		// keyFrame+1 is because paths are stored on next key frame
		let keyFrameShow = keyFrame + 1;
		// clip to last key frame end
		if (keyFrameShow >= this.AnimKeyFrames.length) {
			keyFrameShow = this.AnimKeyFrames.length - 1;
			kfPos = 1.0;
		}
		this.AnimPlayers = this.AnimKeyFrames[keyFrameShow].animatePlayersOnPaths(kfPos);
		this.AnimBalls = this.AnimKeyFrames[keyFrameShow].animateBallsOnPaths(kfPos);
		this._modified();
	}

	// note: only move current key frame player
	playerMove(id, deltaX, deltaY) {
		let players = this.playersCurrentKeyFrame().map(p => {
			if (id === p.id) {
				p.isEdit = true;
				p.pos.move(deltaX, deltaY);
			}
			return p;
		});
		this.AnimKeyFrames[this.AnimKeyFrameCurrent].players = players;
		// Adjust player anim paths when player is moved
		this.playerAdjustAnimPaths(
			id.replace(ElementIDPrefix.Player, ElementIDPrefix.PathPlayer), 
			deltaX, deltaY
		);
		this._modified();
	}

	playerRotate(id, posX, posY, snap) {
		if (!id.startsWith(ElementIDPrefix.Player)) {
			return;
		}
		let players = this.playersCurrentKeyFrame().map(p => {
			if (id === p.id) {
				p.rotate(posX, posY, snap);
			}
			return p;
		});
		this.AnimKeyFrames[this.AnimKeyFrameCurrent].players = players;
		this._modified();
	}

	// NOTE: adjustment always makes path straight line
	// this same on original tactics-board
	playerAdjustAnimPaths(playerPathID, deltaX, deltaY) {
		// Adjust path end position
		if (this.AnimKeyFrameCurrent > 0) {
			this.AnimKeyFrames[this.AnimKeyFrameCurrent].playerPaths = this.lineResizeP2(
				this.playerPathsCurrentKeyFrame(),
				playerPathID, deltaX, deltaY
			);
		}
		// Adjust path start position on next frame
		if (this.AnimKeyFrameCurrent < (this.AnimKeyFrames.length - 1)) {
			this.AnimKeyFrames[this.AnimKeyFrameCurrent+1].playerPaths = this.lineResizeP1(
				this.AnimKeyFrames[this.AnimKeyFrameCurrent+1].playerPaths,
				playerPathID, deltaX, deltaY
			);
		}
	}

	playerEditStart(id) {
		if (!id.startsWith(ElementIDPrefix.Player)) {
			return null;
		}
		// Edit player data
		const p = this.playersCurrentKeyFrame().find(p => id === p.id);
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

	// note: edit player attributes changes player on all key frames
	playerEditDone(player) {
		this.AnimKeyFrames = this.AnimKeyFrames.map(kf => {
			let playerRemoved = null;
			kf.players = kf.players.map(p => {
				if (player.id !== p.id) {
					return p;
				}
				if (player.remove) {
					p.reset();
					playerRemoved = p;
				} else {
					p.name = player.name;
					p.no = player.no;
				}
				return p;
			});
			// reset path for player that is reset
			if (null === playerRemoved || null == kf.playerPaths) {
				return kf;
			}
			const pathID = playerRemoved.id.replace(ElementIDPrefix.Player, ElementIDPrefix.PathPlayer);
			kf.playerPaths = kf.playerPaths.map(p => {
				if (pathID !== p.id) {
					return p;
				}
				return new Line(
					p.id, p.color,
					playerRemoved.pos.clone(), 
					playerRemoved.pos.clone(),
					playerRemoved.pos.clone(), 
					playerRemoved.pos.clone(),
					false, false, true, true
				);
			});
			return kf;
		});
		this._modified();
	}

	playerEditEnd() {
		this.AnimKeyFrames = this.AnimKeyFrames.map(kf => {
			kf.players = kf.players.map(p => {
				p.isEdit = false;
				return p;
			});
			return kf;
		});
	}

	playerDelete(id) {
		if (!id.startsWith(ElementIDPrefix.Player)) {
			return false;
		}
		this.playerEditDone({id:id, remove: true});
		return true;
	}

	ballsCurrentKeyFrame() {
		if (this.AnimPlaying) {
			return null;
		}
		return this.AnimKeyFrames[this.AnimKeyFrameCurrent].balls;
	}

	ballPathsCurrentKeyFrame() {
		if (this.AnimPlaying) {
			return null;
		}
		return this.AnimKeyFrames[this.AnimKeyFrameCurrent].ballPaths;
	}

	ballsPreviousKeyFrame() {
		if (this.AnimPlaying) {
			return null;
		}
		if (0 === this.AnimKeyFrameCurrent) {
			return null;
		}
		return this.AnimKeyFrames[this.AnimKeyFrameCurrent-1].balls;
	}

	// note: only move current key frame ball
	ballMove(id, deltaX, deltaY) {
		let balls = this.ballsCurrentKeyFrame().map(b => {
			if (id === b.id) {
				b.pos.move(deltaX, deltaY);
			}
			return b;
		});
		this.AnimKeyFrames[this.AnimKeyFrameCurrent].balls = balls;
		// Adjust ball paths when ball is moved
		this.ballAdjustAnimPaths(
			id.replace(ElementIDPrefix.Ball, ElementIDPrefix.PathBall), 
			deltaX, deltaY
		);
		this._modified();
	}

	// NOTE: adjustment always makes path straight line
	// this same on original tactics-board
	ballAdjustAnimPaths(ballPathID, deltaX, deltaY) {
		// Adjust path end position
		if (this.AnimKeyFrameCurrent > 0) {
			this.AnimKeyFrames[this.AnimKeyFrameCurrent].ballPaths = this.lineResizeP2(
				this.ballPathsCurrentKeyFrame(),
				ballPathID, deltaX, deltaY
			);
		}
		// Adjust path start position on next frame
		if (this.AnimKeyFrameCurrent < (this.AnimKeyFrames.length - 1)) {
			this.AnimKeyFrames[this.AnimKeyFrameCurrent+1].ballPaths = this.lineResizeP1(
				this.AnimKeyFrames[this.AnimKeyFrameCurrent+1].ballPaths,
				ballPathID, deltaX, deltaY
			);
		}
	}

	ballDelete(id) {
		if (!id.startsWith(ElementIDPrefix.Ball)) {
			return false;
		}
		this.AnimKeyFrames = this.AnimKeyFrames.map(kf => {
			let ballRemoved = null;
			kf.balls = kf.balls.map(b => {
				if (id !== b.id) {
					return b;
				}
				b.reset();
				ballRemoved = b;
				return b;
			});
			// reset path for player that is reset
			if (null === ballRemoved || null == kf.ballPaths) {
				return kf;
			}
			const pathID = ballRemoved.id.replace(ElementIDPrefix.Ball, ElementIDPrefix.PathBall);
			kf.ballPaths = kf.ballPaths.map(p => {
				if (pathID !== p.id) {
					return p;
				}
				return new Line(
					p.id, p.color,
					ballRemoved.pos.clone(), 
					ballRemoved.pos.clone(),
					ballRemoved.pos.clone(), 
					ballRemoved.pos.clone(),
					false, false, true, true
				);
			});
			return kf;
		});
		this._modified();
		return true;
	}

	elementDelete(id) {
		if (this.lineDelete(id)) {
			return true;
		}
		if (this.ellipseDelete(id)) {
			return true;
		}
		if (this.squareDelete(id)) {
			return true;
		}
		if (this.textDelete(id)) {
			return true;
		}
		if (this.extrasDelete(id)) {
			return true;
		}
		if (this.playerDelete(id)) {
			return true;
		}
		if (this.ballDelete(id)) {
			return true;
		}
		return false;
	}

	elementIsEditable(id) {
		if (id.startsWith(ElementIDPrefix.Square)) {
			const e = this.squares.find(e => id === e.id);
			return !e.isEdit;
		}
		if (id.startsWith(ElementIDPrefix.Ellipse)) {
			const e = this.ellipses.find(e => id === e.id);
			return !e.isEdit;
		}
		if (id.startsWith(ElementIDPrefix.Line)) {
			const e = this.lines.find(e => id === e.id);
			return !e.isEdit;
		}
		if (id.startsWith(ElementIDPrefix.Text)) {
			const e = this.texts.find(e => id === e.id);
			return !e.isEdit;
		}
		if (id.startsWith(ElementIDPrefix.Extras)) {
			const e = this.extras.find(ex => id === ex.id);
			// not all extras is editable
			return (e.isResizable || e.isRotatable) && !e.isEdit;
		}
		return false;
	}

	elementHasContextMenu(id) {
		if (id.startsWith(ElementIDPrefix.Ball)) { return true;}
		if (id.startsWith(ElementIDPrefix.Square)) { return true;}
		if (id.startsWith(ElementIDPrefix.Ellipse)) { return true;}
		if (id.startsWith(ElementIDPrefix.Line)) { return true;}
		if (id.startsWith(ElementIDPrefix.Text)) { return true;}
		if (id.startsWith(ElementIDPrefix.Extras)) { return true;}
		return false;
	}

	elementEditStart(id) {
		if (this.squareEditStart(id)) {
			return true;
		}
		if (this.ellipseEditStart(id)) {
			return true;
		}
		if (this.lineEditStart(id)) {
			return true;
		}
		if (this.textEditStart(id)) {
			return true;
		}
		if (this.extrasEditStart(id)) {
			return true;
		}
		return false;
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

	lineResizeP1(lines, id, deltaX, deltaY) {
		return lines.map(l => {
			if (id === l.id) {
				l.resizeP1(deltaX,deltaY);
			}
			return l;
		});
	}

	lineResizeP2(lines, id, deltaX, deltaY) {
		return lines.map(l => {
			if (id === l.id) {
				l.resizeP2(deltaX, deltaY);
			}
			return l;
		});
	}

	lineResize(id, deltaX, deltaY) {
		this.lines = this.lineResizeP2(this.lines, id, deltaX, deltaY);
		this._modified();
	}

	lineOrPathEdit(lines, pid, id, deltaX, deltaY) {
		return lines.map(l => {
			if (id === l.id) {
				l.edit(pid, deltaX, deltaY);
			}
			return l;
		});
	}

	lineEdit(pid, id, deltaX, deltaY) {
		if (id.startsWith(ElementIDPrefix.Line)) {
			this.lines = this.lineOrPathEdit(
				this.lines,
				pid, id, deltaX, deltaY
			);
		}
		if (id.startsWith(ElementIDPrefix.PathPlayer)) {
			this.AnimKeyFrames[this.AnimKeyFrameCurrent].playerPaths = this.lineOrPathEdit(
				this.playerPathsCurrentKeyFrame(),
				pid, id, deltaX, deltaY
			);
		}
		if (id.startsWith(ElementIDPrefix.PathBall)) {
			this.AnimKeyFrames[this.AnimKeyFrameCurrent].ballPaths = this.lineOrPathEdit(
				this.ballPathsCurrentKeyFrame(),
				pid, id, deltaX, deltaY
			);
		}
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

	lineDelete(id) {
		if (!id.startsWith(ElementIDPrefix.Line)) {
			return false;
		}
		this.lines = this.lines.filter(l => id !== l.id);
		this._modified();
		return true;
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

	ellipseDelete(id) {
		if (!id.startsWith(ElementIDPrefix.Ellipse)) {
			return false;
		}
		this.ellipses = this.ellipses.filter(el => id !== el.id);
		this._modified();
		return true;
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

	squareDelete(id) {
		if (!id.startsWith(ElementIDPrefix.Square)) {
			return false;
		}
		this.squares = this.squares.filter(sq => id !== sq.id);
		this._modified();
		return true;
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
		// cleanup empty texts
		this.texts = this.texts.filter(tx => tx.text.length > 0);
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

	textEditEnd() {
		this.texts = this.texts.map(tx => {
			tx.isEdit = false;
			return tx;
		});
	}

	textDelete(id) {
		if (!id.startsWith(ElementIDPrefix.Text)) {
			return false;
		}
		this.texts = this.texts.filter(tx => id !== tx.id);
		this._modified();
		return true;
	}

	extrasNewID() {
		this.extrasID += 1;
		return ElementIDPrefix.Extras + this.extrasID;
	}

	extrasCreate(t, color, width, height) {
		// note: extras is always added to center of pitch with edit mode selected
		let ex = new Extras(
			this.extrasNewID(),color,t,
			this.width / 2,
			this.height / 2,
			width,height,0,
			true
		);
		this.extras = this.extras.map((e) => e);
		this.extras.push(ex);
		this._modified();
		return ex.id;
	}

	extrasEditStart(id) {
		if (!id.startsWith(ElementIDPrefix.Extras)) {
			return false;
		}
		this.extras = this.extras.map(ex => {
			if (id === ex.id) {
				ex.isEdit = true;
			}
			return ex;
		});
		this._modified();
		return true;
	}

	extrasMove(id, deltaX, deltaY) {
		if (!id.startsWith(ElementIDPrefix.Extras)) {
			return false;
		}
		this.extras = this.extras.map(ex => {
			if (id === ex.id) {
				ex.move(deltaX, deltaY);
			}
			return ex;
		});
		this._modified();
	}

	extrasRotate(id, posX, posY, snap) {
		if (!id.startsWith(ElementIDPrefix.Extras)) {
			return;
		}
		this.extras = this.extras.map(ex => {
			if (id === ex.id && ex.isRotatable) {
				ex.rotate(posX, posY, snap);
			}
			return ex;
		});
		this._modified();
	}

	extrasEdit(corner, id, deltaX, deltaY) {
		if (!id.startsWith(ElementIDPrefix.Extras)) {
			return;
		}
		this.extras = this.extras.map(ex => {
			if (id === ex.id) {
				ex.edit(corner, deltaX, deltaY);
			}
			return ex;
		});
		this._modified();
		return this.extras;
	}

	extrasEditEnd() {
		this.extras = this.extras.map(ex => {
			ex.isEdit = false;
			return ex;
		});
	}

	extrasDelete(id) {
		if (!id.startsWith(ElementIDPrefix.Extras)) {
			return false;
		}
		this.extras = this.extras.filter(ex => id !== ex.id);
		this._modified();
		return true;
	}

	editTopLeft(id, deltaX, deltaY) {
		this.squareEdit("tl",id, deltaX, deltaY);
		this.ellipseEdit("tl",id, deltaX, deltaY);
		this.extrasEdit("tl",id, deltaX, deltaY);
	}
	
	editTopRight(id, deltaX, deltaY) {
		this.squareEdit("tr",id, deltaX, deltaY);
		this.ellipseEdit("tr",id, deltaX, deltaY);
		this.extrasEdit("tr",id, deltaX, deltaY);
	}

	editBottomLeft(id, deltaX, deltaY) {
		this.squareEdit("bl",id, deltaX, deltaY);
		this.ellipseEdit("bl",id, deltaX, deltaY);
		this.extrasEdit("bl",id, deltaX, deltaY);
	}

	editBottomRight(id, deltaX, deltaY) {
		this.squareEdit("br",id, deltaX, deltaY);
		this.ellipseEdit("br",id, deltaX, deltaY);
		this.extrasEdit("br",id, deltaX, deltaY);
	}

	editMove(id, deltaX, deltaY) {
		this.squareEdit("mv",id, deltaX, deltaY);
		this.ellipseEdit("mv",id, deltaX, deltaY);
		this.extrasEdit("mv",id, deltaX, deltaY);
		this.textMove(id, deltaX, deltaY);
	}

	editRotate(id, posX, posY, snap) {
		this.playerRotate(id, posX, posY, snap);
		this.squareRotate(id, posX, posY, snap);
		this.ellipseRotate(id, posX, posY, snap);
		this.extrasRotate(id, posX, posY, snap);
		this.textRotate(id, posX, posY, snap);
	}

	endAllEdits() {
		this.lineEditEnd();
		this.squareEditEnd();
		this.ellipsesEditEnd();
		this.extrasEditEnd();
		this.textEditEnd();
		this.playerEditEnd();
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