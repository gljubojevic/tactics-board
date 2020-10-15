import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PitchFutsal from '../pitch/PitchFutsal';
import { withStyles } from '@material-ui/core/styles';
import PlayerEdit from './PlayerEdit'
import BallEdit from './BallEdit'
import SquareEdit from './SquareEdit'
import EllipseEdit from './EllipseEdit'
import LineEdit from './LineEdit'
import PlayerDialog from './PlayerDialog'
// import './PitchEdit.css';	// embedded to svg for now

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
}

class PitchEdit extends Component {

	constructor(props) {
		super(props);
		this._editRef = React.createRef();	// reference to editor container
		this._bgRef = React.createRef();	// background reference to get client size of pitch for editing
		this._playerDialogRef = React.createRef(); // edit player dialog reference
		this._orgWidth = this.props.viewBoxRight - this.props.viewBoxLeft;
		this._orgHeight = this.props.viewBoxBottom - this.props.viewBoxTop;
		this._pitch = this.props.pitch;
		this.state = {
			players: this._pitch.players,
			balls: this._pitch.balls,
			squares: this._pitch.squares,
			ellipses: this._pitch.ellipses,
			texts: this._pitch.texts,
			lines: this._pitch.lines,
			overlay: this._pitch.overlay
		};

		// overlay changes
		this.overlayChanged = this.overlayChanged.bind(this);
		this._pitch.drawMode.pitchOverlayCallback = this.overlayChanged;
	
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
		
		// callbacks
		this.playerEditDone = this.playerEditDone.bind(this);
	}

	overlayChanged(value) {
		console.log("Overlay change", value, this.state.overlay);
		this._pitch.overlay = value;
		this.setState({
			overlay: value
		});
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

	playerDrag(id, deltaX, deltaY) {
		this.setState({
			players: this._pitch.playerMove(id, deltaX, deltaY)
		});
	}

	ballDrag(id, deltaX, deltaY) {
		this.setState({
			balls: this._pitch.ballMove(id, deltaX, deltaY)
		});
	}

	editTopLeft(id, deltaX, deltaY) {
		if (id.startsWith("sq")) {
			this.setState({
				squares: this._pitch.squareEdit("tl",id, deltaX, deltaY)
			});
		}
		if (id.startsWith("el")) {
			this.setState({
				ellipses: this._pitch.ellipseEdit("tl",id, deltaX, deltaY)
			});
		}
	}
	
	editTopRight(id, deltaX, deltaY) {
		if (id.startsWith("sq")) {
			this.setState({
				squares: this._pitch.squareEdit("tr",id, deltaX, deltaY)
			});
		}
		if (id.startsWith("el")) {
			this.setState({
				ellipses: this._pitch.ellipseEdit("tr",id, deltaX, deltaY)
			});
		}
	}

	editBottomLeft(id, deltaX, deltaY) {
		if (id.startsWith("sq")) {
			this.setState({
				squares: this._pitch.squareEdit("bl",id, deltaX, deltaY)
			});
		}
		if (id.startsWith("el")) {
			this.setState({
				ellipses: this._pitch.ellipseEdit("bl",id, deltaX, deltaY)
			});
		}
	}

	editBottomRight(id, deltaX, deltaY) {
		if (id.startsWith("sq")) {
			this.setState({
				squares: this._pitch.squareEdit("br",id, deltaX, deltaY)
			});
		}
		if (id.startsWith("el")) {
			this.setState({
				ellipses: this._pitch.ellipseEdit("br",id, deltaX, deltaY)
			});
		}
	}

	editMove(id, deltaX, deltaY) {
		if (id.startsWith("sq")) {
			this.setState({
				squares: this._pitch.squareEdit("mv",id, deltaX, deltaY)
			});
		}
		if (id.startsWith("el")) {
			this.setState({
				ellipses: this._pitch.ellipseEdit("mv",id, deltaX, deltaY)
			});
		}
	}

	editRotate(id, posX, posY, snap) {
		if (id.startsWith("sq")) {
			this.setState({
				squares: this._pitch.squareRotate(id, posX, posY, snap)
			});
		}
		if (id.startsWith("el")) {
			this.setState({
				ellipses: this._pitch.ellipseRotate(id, posX, posY, snap)
			});
		}
	}

	editLinePoint(pid, id, deltaX, deltaY) {
		this.setState({
			lines: this._pitch.lineEdit(pid, id, deltaX, deltaY)
		});
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
		this._dragObjectType = DragObject.None;
		if (this._dragNode.startsWith("pl")) {
			this._dragObjectType = DragObject.Player;
		}
		if (this._dragNode.startsWith("bl")) {
			this._dragObjectType = DragObject.Ball;
		}
		if (this._dragNode.startsWith("edit-tl-")) {
			this._dragObjectType = DragObject.EditTopLeft;
			this._dragNode = this._dragNode.replace("edit-tl-","");
		}
		if (this._dragNode.startsWith("edit-tr-")) {
			this._dragObjectType = DragObject.EditTopRight;
			this._dragNode = this._dragNode.replace("edit-tr-","");
		}
		if (this._dragNode.startsWith("edit-bl-")) {
			this._dragObjectType = DragObject.EditBottomLeft;
			this._dragNode = this._dragNode.replace("edit-bl-","");
		}
		if (this._dragNode.startsWith("edit-br-")) {
			this._dragObjectType = DragObject.EditBottomRight;
			this._dragNode = this._dragNode.replace("edit-br-","");
		}
		if (this._dragNode.startsWith("edit-mv-")) {
			this._dragObjectType = DragObject.EditMove;
			this._dragNode = this._dragNode.replace("edit-mv-","");
		}
		if (this._dragNode.startsWith("edit-rt-")) {
			this._dragObjectType = DragObject.EditRotate;
			this._dragNode = this._dragNode.replace("edit-rt-","");
		}
		if (this._dragNode.startsWith("edit-l1-")) {
			this._dragObjectType = DragObject.EditLineP1;
			this._dragNode = this._dragNode.replace("edit-l1-","");
		}
		if (this._dragNode.startsWith("edit-l2-")) {
			this._dragObjectType = DragObject.EditLineC1;
			this._dragNode = this._dragNode.replace("edit-l2-","");
		}
		if (this._dragNode.startsWith("edit-l3-")) {
			this._dragObjectType = DragObject.EditLineC2;
			this._dragNode = this._dragNode.replace("edit-l3-","");
		}
		if (this._dragNode.startsWith("edit-l4-")) {
			this._dragObjectType = DragObject.EditLineP2;
			this._dragNode = this._dragNode.replace("edit-l4-","");
		}
		this.resetMouseDrag(e);
		return true;
	}
	
	playerEditStarted(editNode) {
		if (!editNode.startsWith("pl")) {
			return false;
		}
		const editPlayer = this._pitch.playerEditStart(editNode);
		if (null === editPlayer) {
			return false;
		}
		this._playerDialogRef.current.openDialog(editPlayer);
		return true;
	}

	squareEditStarted(editNode) {
		if (!editNode.startsWith("sq")) {
			return false;
		}
		console.log("Square edit start", editNode);
		return true;
	}

	ellipseEditStarted(editNode) {
		if (!editNode.startsWith("el")) {
			return false;
		}
		console.log("Ellipse edit start", editNode);
		return true;
	}

	lineEditStarted(editNode) {
		if (!editNode.startsWith("ln")) {
			return false;
		}
		console.log("Line edit start", editNode);
		return true;
	}

	// player edit dialog callback
	playerEditDone(player) {
		this.setState({
			players: this._pitch.playerEditDone(player)
		});
	}

	objectDrag(posX, posY, deltaX, deltaY, snap) {
		switch (this._dragObjectType) {
			case DragObject.Player:
				this.playerDrag(this._dragNode, deltaX, deltaY);
				break;
			case DragObject.Ball:
				this.ballDrag(this._dragNode, deltaX, deltaY);
				break;
			case DragObject.EditTopLeft:
				this.editTopLeft(this._dragNode, deltaX, deltaY);
				break;
			case DragObject.EditTopRight:
				this.editTopRight(this._dragNode, deltaX, deltaY);
				break;
			case DragObject.EditBottomLeft:
				this.editBottomLeft(this._dragNode, deltaX, deltaY);
				break;
			case DragObject.EditBottomRight:
				this.editBottomRight(this._dragNode, deltaX, deltaY);
				break;
			case DragObject.EditMove:
				this.editMove(this._dragNode, deltaX, deltaY);
				break;
			case DragObject.EditRotate:
				this.editRotate(this._dragNode, posX, posY, snap);
				break;
			case DragObject.EditLineP1:
				this.editLinePoint("p1", this._dragNode, deltaX, deltaY);
				break;
			case DragObject.EditLineC1:
				this.editLinePoint("c1", this._dragNode, deltaX, deltaY);
				break;
			case DragObject.EditLineC2:
				this.editLinePoint("c2", this._dragNode, deltaX, deltaY);
				break;
			case DragObject.EditLineP2:
				this.editLinePoint("p2", this._dragNode, deltaX, deltaY);
				break;
			default:
				console.log("Invalid drag object type", this._dragObjectType, this._dragNode);
				break;
		}
	}

	hContextMenu(e) {
		if (this.props.pitch.drawMode.mode !== 'select') {
			return;
		}
		let editNode = e.target.getAttribute("data-ref");
		if (null === editNode) {
			return;
		}
		if (this.playerEditStarted(editNode)) {
			e.preventDefault();
			return;
		}
		if (this.squareEditStarted(editNode)) {
			e.preventDefault();
			this.setState({
				squares: this.props.pitch.squareEditStart(editNode)
			});
			return;
		}
		if (this.ellipseEditStarted(editNode)) {
			e.preventDefault();
			this.setState({
				ellipses: this.props.pitch.ellipseEditStart(editNode)
			});
			return;
		}
		if (this.lineEditStarted(editNode)) {
			e.preventDefault();
			this.setState({
				lines: this.props.pitch.lineEditStart(editNode)
			});
			return;
		}
	}

	hMouseDown(e) {
		let pos = this.getRealPosition(e);
		switch (this.props.pitch.drawMode.mode) {
			case 'line':
				e.preventDefault();
				let l = this.props.pitch.lineCreate(pos.X, pos.Y);
				this._dragNode = l.id;
				this.setState({
					lines: this.props.pitch.lineAdd(l)
				});
				break;
			case 'square':
				e.preventDefault();
				let sq = this.props.pitch.squareCreate(pos.X, pos.Y);
				this._dragNode = sq.id;
				this.setState({
					squares: this.props.pitch.squareAdd(sq)
				});
				break;
			case 'ellipse':
				e.preventDefault();
				let el = this.props.pitch.ellipseCreate(pos.X, pos.Y);
				this._dragNode = el.id;
				this.setState({
					ellipses: this.props.pitch.ellipseAdd(el)
				});
				break;
			case 'text':
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
		let pos = this.getRealPosition(e);
		let isShift = e.getModifierState("Shift");
		switch (this.props.pitch.drawMode.mode) {
			case 'line':
				this.setState({
					lines: this.props.pitch.lineCleanup()
				});
				break;
			case 'square':
				this.setState({
					squares: this.props.pitch.squareCleanup()
				});
				break;
			case 'ellipse':
				this.setState({
					ellipses: this.props.pitch.ellipseCleanup()
				});
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
		// TODO: Make better handling
		if (0 === e.button && this._dragObjectType === DragObject.None) {
			this.setState({
				lines: this.props.pitch.lineEditEnd(),
				squares: this.props.pitch.squareEditEnd(),
				ellipses: this.props.pitch.ellipsesEditEnd()
			});
		}
		this._dragNode = null;
		this._dragObjectType = DragObject.None;
	}

	hMouseMove(e) {
		if (null == this._dragNode) {
			return;
		}
		e.preventDefault();

		let pos = this.getRealPosition(e);
		let isShift = e.getModifierState("Shift");
		switch (this.props.pitch.drawMode.mode) {
			case 'line':
				this.setState({
					lines: this.props.pitch.lineResize(
						this._dragNode, pos.X, pos.Y
					)
				});
				break;
			case 'square':
				this.setState({
					squares: this.props.pitch.squareResize(
						this._dragNode, pos.X, pos.Y, isShift
					)
				});
				break;
			case 'ellipse':
				this.setState({
					ellipses: this.props.pitch.ellipseResize(
						this._dragNode, pos.X, pos.Y, isShift
					)
				});
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

	// return current SVG in editor
	// TODO: Cleanup unused players and balls
	getSVG() {
		return {
			width: this._orgWidth,
			height: this._orgHeight,
			svgText: this._editRef.current.children[0].outerHTML
		}
	}

	renderPlayers() {
		return this.state.players.map((pl, index) => {
			return (
				<PlayerEdit key={index.toString()} id={pl.id} x={pl.x} y={pl.y} no={pl.no} name={pl.name} color={pl.color} />
			);
		});
	}

	renderBalls(){
		return this.state.balls.map((b, index) => {
			return (
				<BallEdit key={index.toString()} id={b.id} x={b.x} y={b.y} color={b.color} />
			);
		});
	}

	renderSquares(){
		return this.state.squares.map((s, index) => {
			return (
				<SquareEdit key={index.toString()} square={s} />
			);
		});
	}

	renderEllipses(){
		return this.state.ellipses.map((el, index) => {
			return (
				<EllipseEdit key={index.toString()} ellipse={el} />
			);
		});
	}

	renderLines(){
		return this.state.lines.map((l, index) => {
			return (
				<LineEdit key={index.toString()} line={l} />
			);
		});
	}

	renderPitchOverlay(){
		const o = this._pitch.overlaySize();
		if (null === o) {
			return null;
		}
		const posX = (this._orgWidth - o.width) / 2;
		const posY = (this._orgHeight - o.height) / 2;
		const transform = 'translate(' + posX + ' ' + posY + ')';
		return (<rect width={o.width} height={o.height} transform={transform} fill="none" />);
	}

	render() {
		const viewBox = this.props.viewBoxLeft.toString() + ' ' + this.props.viewBoxTop.toString() + ' ' + this.props.viewBoxRight.toString() + ' ' + this.props.viewBoxBottom.toString()

		const playersShow = this.renderPlayers();
		const ballsShow = this.renderBalls();
		const squaresShow = this.renderSquares();
		const ellipsesShow = this.renderEllipses();
		const linesShow = this.renderLines();
		const pitchOverlayShow = this.renderPitchOverlay();

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
						{[
							'.pc0 {	fill: #8b2323; stroke: #8b2323; }',
							'.pc1 {	fill: #e7e739; stroke: #e7e739; }',
							'.pc2 {	fill: #912cee; stroke: #912cee; }',
							'.pc3 {	fill: #04b804; stroke: #04b804; }',
							'.pc4 {	fill: #1d4ba0; stroke: #1d4ba0; }',
							'.pc5 {	fill: #ee2c2c; stroke: #ee2c2c; }',
							'.pc6 {	fill: #ff7f50; stroke: #ff7f50; }',
							'.pc7 {	fill: #56c6eb; stroke: #56c6eb; }',
							'.bc0 { fill: #ffa500; }',
							'.bc1 { fill: #cc3333; }',
							'.bc2 { fill: #222333; }',
							'.bc3 { fill: #0000ff; }',
							'.bc4 { fill: #ffffff; }',
							'.bc4 svg { fill: #000000; }',
							'.player { pointer-events: none; }',
							'.player text { fill: black;	}',
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
						]}
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
						{pitchOverlayShow}
					</g>
					<g id="ellipses">{ellipsesShow}</g>
					<g id="squares">{squaresShow}</g>
					<g id="players" transform={playersTransform} fontSize="50">
						{playersShow}
					</g>
					<g id="balls" transform={ballsTransform}>
						{ballsShow}
					</g>
					<g id="lines">{linesShow}</g>
					<g id="texts"></g>
				</svg>
			</div>
			<PlayerDialog ref={this._playerDialogRef} onEditDone={this.playerEditDone} />
			</React.Fragment>
		);
	}
}

PitchEdit.defaultProps = {
	pitch: null,
	viewBoxLeft: 0,
	viewBoxTop: 0,
	viewBoxRight: 4500,
	viewBoxBottom: 2500
}

PitchEdit.propTypes = {
	pitch: PropTypes.instanceOf(PitchFutsal),
	viewBoxLeft: PropTypes.number,
	viewBoxTop: PropTypes.number,
	viewBoxRight: PropTypes.number,
	viewBoxBottom: PropTypes.number
}

export default withStyles(styles, { withTheme: true })(PitchEdit);