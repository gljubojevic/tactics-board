import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PitchFutsal from '../pitch/PitchFutsal';
import DrawMode from '../pitch/DrawMode';
import { withStyles } from '@material-ui/core/styles';
import PlayerEdit from './PlayerEdit'
import BallEdit from './BallEdit'
import SquareEdit from './SquareEdit'
import EllipseEdit from './EllipseEdit'
import LineEdit from './LineEdit'
import TextEdit from './TextEdit'
import PlayerDialog from './PlayerDialog'

// this is for offset from toolbar and default class
const styles = theme => ({
	offset: {
		paddingTop: theme.mixins.toolbar.minHeight,
	}
})

// define object types for mouse dragging
const DragObject = {
	None: -1,
	Player: 0,
	Ball: 1,
	Cone: 2,
	Goal: 3,
	EditTopLeft: 4,
	EditTopRight: 5,
	EditBottomLeft: 6,
	EditBottomRight: 7,
	EditMove: 8,
	EditRotate: 9,
	EditLineP1: 10,
	EditLineC1: 11,
	EditLineC2: 12,
	EditLineP2: 13
};

// defines way to check draggable object
const DragObjectCheck = [
	{prefix: "pl", removePrefix: false, typ:  DragObject.Player},
	{prefix: "bl", removePrefix: false, typ:  DragObject.Ball},
	{prefix: "edit-tl-", removePrefix: true, typ:  DragObject.EditTopLeft},
	{prefix: "edit-tr-", removePrefix: true, typ:  DragObject.EditTopRight},
	{prefix: "edit-bl-", removePrefix: true, typ:  DragObject.EditBottomLeft},
	{prefix: "edit-br-", removePrefix: true, typ:  DragObject.EditBottomRight},
	{prefix: "edit-mv-", removePrefix: true, typ:  DragObject.EditMove},
	{prefix: "edit-rt-", removePrefix: true, typ:  DragObject.EditRotate},
	{prefix: "edit-l1-", removePrefix: true, typ:  DragObject.EditLineP1},
	{prefix: "edit-l2-", removePrefix: true, typ:  DragObject.EditLineC1},
	{prefix: "edit-l3-", removePrefix: true, typ:  DragObject.EditLineC2},
	{prefix: "edit-l4-", removePrefix: true, typ:  DragObject.EditLineP2}
];


class PitchEdit extends Component {

	constructor(props) {
		super(props);
		this._editRef = React.createRef();	// reference to editor container
		this._bgRef = React.createRef();	// background reference to get client size of pitch for editing
		this._playerDialogRef = React.createRef(); // edit player dialog reference
		this._orgWidth = this.props.viewBoxRight - this.props.viewBoxLeft;
		this._orgHeight = this.props.viewBoxBottom - this.props.viewBoxTop;
		this._pitch = this.props.pitch;

		// mouse drag init
		this._dragNode = null;
		this._dragObjectType = DragObject.None;
		this._mouseX = 0;
		this._mouseY = 0;

		// add events
		this.hContextMenu = this.hContextMenu.bind(this);
		this.hMouseDown = this.hMouseDown.bind(this);
		this.hMouseUp = this.hMouseUp.bind(this);
		this.hMouseMove = this.hMouseMove.bind(this);
		this.textEditDone = this.textEditDone.bind(this);
		
		// callbacks
		this.playerEditDone = this.playerEditDone.bind(this);
	}

	getScale() {
		const box = this._bgRef.current.getBoundingClientRect();
		return {
			X: this._orgWidth / box.width,
			Y: this._orgHeight / box.height
		}
	}

	getRealPosition(e) {
		let scale = this.getScale();	// TODO: reconsider scale
		let box = this._bgRef.current.getBoundingClientRect();
 		let x = e.clientX - box.left;	//x position within the element.
  		let y = e.clientY - box.top; 	//y position within the element.
		let realPosition = {
			X: x * scale.X,
			Y: y * scale.Y
		}
		return realPosition;
	}

	resetMouseDrag(e) {
		this._mouseX = e.clientX;
		this._mouseY = e.clientY;
	}
	
	isDragStarted(e) {
		if (0 !== e.button) {
			return false;
		}
		if (!e.target.classList.contains('draggable')) {
			return false;
		}
		this._dragNode = e.target.getAttribute("data-ref");
		if (null === this._dragNode) {
			return false;
		}
		this.resetMouseDrag(e);

		// get drag object
		this._dragObjectType = DragObject.None;
		for (const chk of DragObjectCheck ) {
			if (!this._dragNode.startsWith(chk.prefix)) {
				continue;
			}
			this._dragObjectType = chk.typ;
			if (chk.removePrefix) {
				this._dragNode = this._dragNode.replace(chk.prefix,"");
			}
			return true;
		}
		return false;
	}
	
	playerEditStarted(editNode) {
		const editPlayer = this.props.pitch.playerEditStart(editNode);
		if (null === editPlayer) {
			return false;
		}
		this._playerDialogRef.current.openDialog(editPlayer);
		return true;
	}

	// player edit dialog callback
	playerEditDone(player) {
		this.props.pitch.playerEditDone(player);
	}

	objectDrag(posX, posY, deltaX, deltaY, snap) {
		const p = this.props.pitch;
		switch (this._dragObjectType) {
			case DragObject.Player:
				p.playerMove(this._dragNode, deltaX, deltaY);
				break;
			case DragObject.Ball:
				p.ballMove(this._dragNode, deltaX, deltaY);
				break;
			case DragObject.EditTopLeft:
				p.editTopLeft(this._dragNode, deltaX, deltaY);
				break;
			case DragObject.EditTopRight:
				p.editTopRight(this._dragNode, deltaX, deltaY);
				break;
			case DragObject.EditBottomLeft:
				p.editBottomLeft(this._dragNode, deltaX, deltaY);
				break;
			case DragObject.EditBottomRight:
				p.editBottomRight(this._dragNode, deltaX, deltaY);
				break;
			case DragObject.EditMove:
				p.editMove(this._dragNode, deltaX, deltaY);
				break;
			case DragObject.EditRotate:
				p.editRotate(this._dragNode, posX, posY, snap);
				break;
			case DragObject.EditLineP1:
				p.lineEdit('p1', this._dragNode, deltaX, deltaY);
				break;
			case DragObject.EditLineC1:
				p.lineEdit('c1', this._dragNode, deltaX, deltaY);
				break;
			case DragObject.EditLineC2:
				p.lineEdit('c2', this._dragNode, deltaX, deltaY);
				break;
			case DragObject.EditLineP2:
				p.lineEdit('p2', this._dragNode, deltaX, deltaY);
				break;
			default:
				console.log("Invalid drag object type", this._dragObjectType, this._dragNode);
				break;
		}
	}

	hContextMenu(e) {
		if (this.props.drawMode.mode !== 'select') {
			return;
		}
		let id = e.target.getAttribute("data-ref");
		if (null === id) {
			return;
		}
		const p = this.props.pitch;
		if (this.playerEditStarted(id)) {
			e.preventDefault();
			return;
		}
		if (p.squareEditStart(id)) {
			e.preventDefault();
			return;
		}
		if (p.ellipseEditStart(id)) {
			e.preventDefault();
			return;
		}
		if (p.lineEditStart(id)) {
			e.preventDefault();
			return;
		}
		if (p.textEditStart(id)) {
			e.preventDefault();
			return;
		}
	}

	hMouseDown(e) {
		let pos = this.getRealPosition(e);
		const dm = this.props.drawMode;
		const p = this.props.pitch;
		switch (dm.mode) {
			case 'line':
				e.preventDefault();
				this._dragNode = p.lineCreate(
					pos.X, pos.Y, dm.color, dm.lineArrowStart, dm.lineArrowEnd, dm.lineDashed
				);
				break;
			case 'square':
				e.preventDefault();
				this._dragNode = p.squareCreate(
					pos.X, pos.Y, dm.color, dm.lineDashed
				);
				break;
			case 'ellipse':
				e.preventDefault();
				this._dragNode = p.ellipseCreate(
					pos.X, pos.Y, dm.color, dm.lineDashed
				);
				break;
			case 'text':
				e.preventDefault();
				this._dragNode = p.textCreate(
					pos.X, pos.Y, dm.color, dm.textSize
				);
				break;
			case 'select':
			default:
				if (this.isDragStarted(e)) {
					e.preventDefault();
					return;
				}
				break;
		}
	}

	hMouseUp(e) {
		e.preventDefault();
		const p = this.props.pitch;
		let pos = this.getRealPosition(e);
		let isShift = e.getModifierState("Shift");
		switch (this.props.drawMode.mode) {
			case 'line':
				p.lineCleanup();
				break;
			case 'square':
				p.squareCleanup();
				break;
			case 'ellipse':
				p.ellipseCleanup();
				break;
			case 'text':
				break;
			case 'select':
			default:
				let scale = this.getScale();
				let deltaX = (e.clientX - this._mouseX) * scale.X;
				let deltaY = (e.clientY - this._mouseY) * scale.Y;
				this.resetMouseDrag(e);
				this.objectDrag(pos.X, pos.Y, deltaX, deltaY, isShift);
				break;
		}
		// Reset editing
		if (0 === e.button && this._dragObjectType === DragObject.None) {
			p.endAllEdits();
		}
		this._dragNode = null;
		this._dragObjectType = DragObject.None;
	}

	hMouseMove(e) {
		if (null == this._dragNode) {
			return;
		}
		const p = this.props.pitch;
		e.preventDefault();
		let pos = this.getRealPosition(e);
		let isShift = e.getModifierState("Shift");
		switch (this.props.drawMode.mode) {
			case 'line':
				p.lineResize(this._dragNode, pos.X, pos.Y);
				break;
			case 'square':
				p.squareResize(this._dragNode, pos.X, pos.Y, isShift);
				break;
			case 'ellipse':
				p.ellipseResize(this._dragNode, pos.X, pos.Y, isShift);
				break;
			case 'text':
				break;
			case 'select':
			default:
				let scale = this.getScale();
				let deltaX = (e.clientX - this._mouseX) * scale.X;
				let deltaY = (e.clientY - this._mouseY) * scale.Y;
				this.resetMouseDrag(e);
				this.objectDrag(pos.X, pos.Y, deltaX, deltaY, isShift);
				break;
		}
	}

	textEditDone(id, text, bx, by, bwidth, bheight) {
		this.props.pitch.textEditDone(id, text, bx, by, bwidth, bheight);
	}

	// return current SVG in editor
	// TODO: Cleanup unused players and balls
	getSVG() {
		return {
			width: this._orgWidth,
			height: this._orgHeight,
			svgText: this._editRef.current.children[0].outerHTML
		}
	}

	renderPlayers(players) {
		return players.map((pl, index) => {
			return (
				<PlayerEdit key={index.toString()} player={pl} />
			);
		});
	}

	renderBalls(balls){
		return balls.map((b, index) => {
			return (
				<BallEdit key={index.toString()} ball={b} />
			);
		});
	}

	renderSquares(squares){
		return squares.map((s, index) => {
			return (
				<SquareEdit key={index.toString()} square={s} />
			);
		});
	}

	renderEllipses(ellipses){
		return ellipses.map((el, index) => {
			return (
				<EllipseEdit key={index.toString()} ellipse={el} />
			);
		});
	}

	renderLines(lines){
		return lines.map((l, index) => {
			return (
				<LineEdit key={index.toString()} line={l} />
			);
		});
	}

	renderTexts(texts){
		return texts.map((tx, index) => {
			return (
				<TextEdit key={index.toString()} text={tx} onEditDone={this.textEditDone} />
			);
		});
	}

	renderPitchOverlay(){
		const o = this.props.pitch.overlaySize();
		if (null === o) {
			return null;
		}
		const posX = (this._orgWidth - o.width) / 2;
		const posY = (this._orgHeight - o.height) / 2;
		const transform = 'translate(' + posX + ' ' + posY + ')';
		return (<rect width={o.width} height={o.height} transform={transform} fill="none" />);
	}

	generatePicthStyles() {
		const colors = this.props.drawMode.colorOptions.map((col, index) => {
			return '.pc'+ index +' { fill: '+col+'; stroke: '+ col +'; }';
		});

		return colors.concat([
			'.bc0 { fill: #ffa500; }',
			'.bc1 { fill: #cc3333; }',
			'.bc2 { fill: #222333; }',
			'.bc3 { fill: #0000ff; }',
			'.bc4 { fill: #ffffff; }',
			'.bc4 svg { fill: #000000; }',
			'#texts { font-family: sans-serif; font-size: 10em; cursor: default; user-select: none; }',
			'.txt0 text { font-size: 0.5em; }',
			'.txt1 text { font-size: 0.8em; }',
			'.txt2 text { font-size: 1em; }',
			'.txt3 text { font-size: 1.5em; }',
			'.txt4 text { font-size: 2em; }',
			'.player { pointer-events: none; }',
			'.player text { font-family: sans-serif; fill: black; }',
			'.player text.number { fill: white; }',
			'.dashed { stroke-dasharray: 20; }',
			'.square { stroke-width: 8; stroke-opacity: 1; fill-opacity: 0.6; }',
			'.ellipse { stroke-width: 8; stroke-opacity: 1; fill-opacity: 0.6; }',
			'.line { stroke-width: 12; }',
			'.line path { fill: none; stroke-width: 12; }',
			'.draggable { cursor: move; pointer-events: all;}',
			'.editBox { fill: none; stroke-width: 8; stroke-opacity: 1; }',
			'.editTransparent { fill: none; stroke-width: 0; }',
			'.editCorner { fill: red; stroke-width: 0; stroke-opacity: 1; }'
		]);
	}

	render() {
		const viewBox = this.props.viewBoxLeft.toString() + ' ' + this.props.viewBoxTop.toString() + ' ' + this.props.viewBoxRight.toString() + ' ' + this.props.viewBoxBottom.toString()

		// default class is full screen width and height with padding for menu height
		const pitchClasses = "pitch " + this.props.classes.offset;

		// Calculate pitch position in viewBox
		const pitchLeft = (this._orgWidth - 4000) / 2; // Goals are relative to pitch no need to take them in calc
		const pitchTop = (this._orgHeight - 2000) / 2;
		const pitchTransform = 'translate(' + pitchLeft + ' ' + pitchTop + ')';

		// calculate players position in viewbox
		const playersLeft = pitchLeft;
		const playersTop = pitchTop + 2000 + 50;
		const playersTransform = 'translate(' + playersLeft + ' ' + playersTop + ')';

		// calculate balls position in viewBox
		const ballsLeft = pitchLeft + 1050
		const ballsTop = pitchTop + 2000 + 100;
		const ballsTransform = 'translate(' + ballsLeft + ' ' + ballsTop + ')'; // "translate(1200 2210)"

		return (
			<React.Fragment>
			<div ref={this._editRef} className={pitchClasses}>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox={viewBox} onContextMenu={this.hContextMenu} onMouseDown={this.hMouseDown} onMouseUp={this.hMouseUp} onMouseMove={this.hMouseMove}>
					<style>
						{this.generatePicthStyles()}
					</style>
					<pattern id="goal-net" x="0" y="0" width="20" height="20" stroke="black" patternUnits="userSpaceOnUse">
						<line x1="0" x2="20" y1="0" y2="20" />
						<line x1="20" x2="00" y1="0" y2="20" />
					</pattern>
					<marker id="arrowEnd" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
						<path d="M0,0 L0,6 L9,3 z" fill="#f00" />
					</marker>
					<marker id="arrowStart" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
						<path d="M9,0 L9,6 L0,3 z" fill="#f00" />
					</marker>
					<g id="background" ref={this._bgRef}>
						<rect width={this._orgWidth} height={this._orgHeight} fill="#b7b7b7" fillOpacity="0.5" />
					</g>
					<g id="pitch" transform={pitchTransform} fill="#0280c6" stroke="white" strokeWidth="8">
						<rect width="4000" height="2000" />
						<line x1="2000" x2="2000" y1="0" y2="2000" />
						<circle r="300" cx="2000" cy="1000" fill="none" />
						<circle r="12" cx="2000" cy="1000" fill="white" strokeWidth="0" />
						<g id="corner_marks">
							<path fill="none" d="M25,0 a25,25 0 0,1 -25,25" />
							<path fill="none" d="M4000,25 a25,25 0 0,1 -25,-25" />
							<path fill="none" d="M0,1975 a25,25 0 0,1 25,25" />
							<path fill="none" d="M3975,2000 a25,25 0 0,1 25,-25" />
						</g>
						<g id="substitition-zones">
							<line x1="1000" x2="1000" y1="-48" y2="32" />
							<line x1="1500" x2="1500" y1="-48" y2="32" />
							<line x1="2500" x2="2500" y1="-48" y2="32" />
							<line x1="3000" x2="3000" y1="-48" y2="32" />
						</g>
						<g id="left">
							<line x1="500" x2="500" y1="980" y2="1020" />
							<line x1="600" x2="600" y1="842" y2="1158" />
							<circle r="12" cx="600" cy="1000" fill="white" strokeWidth="0" />
							<path fill="none" d="M0,242 a600,600 0 0,1 600,600" />
							<path fill="none" d="M600,1158 a600,600 0 0,1 -600,600" />
							<line x1="-20" x2="-60" y1="500" y2="500" />
							<line x1="-20" x2="-60" y1="1500" y2="1500" />
							<g id="goal-left">
								<rect width="100" height="300" x="-100" y="850" fill="url(#goal-net)" stroke="#777777" strokeWidth="4" />
								<line x1="0" x2="0" y1="850" y2="1150" />
								<line x1="0" x2="0" y1="850" y2="1150" stroke="red" strokeDasharray="20" />
							</g>
						</g>
						<g id="left-penalty" fill="white" strokeWidth="0">
							<rect width="16" height="16" x="992" y="492" />
							<circle r="12" cx="1000" cy="1000"/>
							<rect width="16" height="16" x="992" y="1492" />
						</g>
						<g id="right">
							<line x1="3500" x2="3500" y1="980" y2="1020" />
							<line x1="3400" x2="3400" y1="842" y2="1158" />
							<circle r="12" cx="3400" cy="1000" fill="white" strokeWidth="0" />
							<path fill="none" d="M3400,842 a600,600 0 0,1 600,-600" />
							<path fill="none" d="M3400,1158 a600,600 0 0,0 600,600" />
							<line x1="4020" x2="4060" y1="500" y2="500" />
							<line x1="4020" x2="4060" y1="1500" y2="1500" />
							<g id="goal-right">
								<rect width="100" height="300" x="4000" y="850" fill="url(#goal-net)" stroke="#777777" strokeWidth="4" />
								<line x1="4000" x2="4000" y1="850" y2="1150" />
								<line x1="4000" x2="4000" y1="850" y2="1150" stroke="red" strokeDasharray="20" />
							</g>
						</g>
						<g id="right-penalty" fill="white" strokeWidth="0">
							<rect width="16" height="16" x="2992" y="492" />
							<circle r="12" cx="3000" cy="1000" />
							<rect width="16" height="16" x="2992" y="1492" />
						</g>
					</g>
					<g id="pitchOverlay" stroke="white" strokeWidth="8">
						{this.renderPitchOverlay()}
					</g>
					<g id="ellipses">{this.renderEllipses(this.props.pitch.ellipses)}</g>
					<g id="squares">{this.renderSquares(this.props.pitch.squares)}</g>
					<g id="players" transform={playersTransform} fontSize="50">
						{this.renderPlayers(this.props.pitch.players)}
					</g>
					<g id="balls" transform={ballsTransform}>
						{this.renderBalls(this.props.pitch.balls)}
					</g>
					<g id="lines">{this.renderLines(this.props.pitch.lines)}</g>
					<g id="texts">{this.renderTexts(this.props.pitch.texts)}</g>
				</svg>
			</div>
			<PlayerDialog ref={this._playerDialogRef} onEditDone={this.playerEditDone} />
			</React.Fragment>
		);
	}
}

PitchEdit.defaultProps = {
	pitch: null,
	drawMode: null,
	viewBoxLeft: 0,
	viewBoxTop: 0,
	viewBoxRight: 4500,
	viewBoxBottom: 2500
}

PitchEdit.propTypes = {
	pitch: PropTypes.instanceOf(PitchFutsal),
	drawMode: PropTypes.instanceOf(DrawMode),
	viewBoxLeft: PropTypes.number,
	viewBoxTop: PropTypes.number,
	viewBoxRight: PropTypes.number,
	viewBoxBottom: PropTypes.number
}

export default withStyles(styles, { withTheme: true })(PitchEdit);