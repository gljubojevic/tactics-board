import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DrawMode from '../pitch/DrawMode';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { CursorDefault, VectorLine, ShapeSquarePlus, ShapeOvalPlus, ArrowLeft, ArrowRight, ArrowLeftRight, Minus, DotsHorizontal } from 'mdi-material-ui'

class DrawMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			lineArrows: false,
			linePattern: false,
			lineDashed: this.props.drawMode.lineDashed,
			lineArrowStart: this.props.drawMode.lineArrowStart,
			lineArrowEnd: this.props.drawMode.lineArrowEnd,
			pitchOverlays: false,
			pitchOverlay: this.props.drawMode.pitchOverlay
		}
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);

		this.lineArrowsToggle = this.lineArrowsToggle.bind(this);
		this.lineArrowEndToggle = this.lineArrowEndToggle.bind(this);
		this.lineArrowStartToggle = this.lineArrowStartToggle.bind(this);

		this.linePatternToggle = this.linePatternToggle.bind(this);
		this.lineDashedOn = this.lineDashedOn.bind(this);
		this.lineDashedOff = this.lineDashedOff.bind(this);

		this.pitchOverlaysToggle = this.pitchOverlaysToggle.bind(this); 
		this.pitchOverlayOnChange = this.pitchOverlayOnChange.bind(this);
	}

	open() {
		this.setState({open:true});
	}

	close(e) {
		// read from "data-value" attribute
		let mode = e.currentTarget.dataset.value;
		if (mode) {
			this.props.drawMode.mode = mode;
			// trigger callback
			if (null !== this.props.onClose) {
				this.props.onClose();
			}
		}
		// close sub menus
		this.setState({
			open:false,
			lineArrows: false,
			linePattern: false,
			pitchOverlays: false
		});
	}

	lineArrowsToggle() {
		this.setState({
			lineArrows: !this.state.lineArrows
		});
	}

	lineArrowStartToggle() {
		this.props.drawMode.lineArrowStart = !this.props.drawMode.lineArrowStart
		this.setState({
			lineArrowStart: this.props.drawMode.lineArrowStart
		});
	}

	lineArrowEndToggle() {
		this.props.drawMode.lineArrowEnd = !this.props.drawMode.lineArrowEnd
		this.setState({
			lineArrowEnd: this.props.drawMode.lineArrowEnd
		});
	}

	lineArrowsIcon() {
		if (this.state.lineArrowStart && this.state.lineArrowEnd) {
			return (<ArrowLeftRight />);
		}
		if (!this.state.lineArrowStart && this.state.lineArrowEnd) {
			return (<ArrowRight />);
		}
		if (this.state.lineArrowStart && !this.state.lineArrowEnd) {
			return (<ArrowLeft />);
		}
		return (<Minus />);
	}

	linePatternToggle() {
		this.setState({
			linePattern: !this.state.linePattern
		});
	}

	lineDashedOn() {
		this.props.drawMode.lineDashed = true;
		this.setState({
			lineDashed: this.props.drawMode.lineDashed,
			linePattern: false
		});
	}

	lineDashedOff() {
		this.props.drawMode.lineDashed = false;
		this.setState({
			lineDashed: this.props.drawMode.lineDashed,
			linePattern: false
		});
	}

	linePatternIcon() {
		if (this.state.lineDashed) {
			return (<DotsHorizontal />);
		}
		return (<Minus />);
	}

	pitchOverlaysRender() {
		return this.props.drawMode.pitchOverlayOptions.map((txt, index) => {
			return (
				<FormControlLabel key={index} control={<Radio />} label={txt} value={txt} />
			);
		});
	}

	pitchOverlaysToggle() {
		this.setState({
			pitchOverlays: !this.state.pitchOverlays
		});
	}

	pitchOverlayOnChange(event) {
		this.props.drawMode.pitchOverlay = event.target.value;
		this.setState({
			pitchOverlay: event.target.value,
			pitchOverlays: false,
			open: false
		});
	}

	render() {
		const arrowsIcon = this.lineArrowsIcon();
		const patternIcon = this.linePatternIcon();
		const overlaySelect = this.pitchOverlaysRender();
		return (
		<Menu id="drawingMenu" anchorEl={this.props.anchorEl} keepMounted open={this.state.open} onClose={this.close}>
			<MenuItem data-value="select" onClick={this.close}>
				<ListItemIcon>
					<CursorDefault />
				</ListItemIcon>
				<ListItemText primary="Select / Move" />
			</MenuItem>
			<Divider />
			<MenuItem onClick={this.pitchOverlaysToggle}>
				<ListItemText primary="Pitch overlay" />
				{this.state.pitchOverlays ? <ExpandLess /> : <ExpandMore />}
			</MenuItem>
			<Collapse in={this.state.pitchOverlays} timeout="auto" unmountOnExit>
				<RadioGroup name="radio-pitch-overlays" value={this.state.pitchOverlay} onChange={this.pitchOverlayOnChange}>
					{overlaySelect}
				</RadioGroup>
			</Collapse>
			<Divider />
			<MenuItem data-value="line" onClick={this.close}>
				<ListItemIcon>
					<VectorLine />
				</ListItemIcon>
				<ListItemText primary="Draw line" />
			</MenuItem>
			<MenuItem onClick={this.lineArrowsToggle}>
				<ListItemIcon>
					{arrowsIcon}
				</ListItemIcon>
				<ListItemText primary="Line arrows" />
				{this.state.lineArrows ? <ExpandLess /> : <ExpandMore />}
			</MenuItem>
			<Collapse in={this.state.lineArrows} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					<MenuItem onClick={this.lineArrowEndToggle}>
						<ListItemIcon>
							<ArrowRight />
						</ListItemIcon>
						<ListItemText primary="End" />
						<ListItemSecondaryAction>
							<Switch edge="end" onChange={this.lineArrowEndToggle} checked={this.state.lineArrowEnd} />
						</ListItemSecondaryAction>
					</MenuItem>
					<MenuItem onClick={this.lineArrowStartToggle}>
						<ListItemIcon>
							<ArrowLeft />
						</ListItemIcon>
						<ListItemText primary="Start" />
						<ListItemSecondaryAction>
							<Switch edge="end" onChange={this.lineArrowStartToggle} checked={this.state.lineArrowStart} />
						</ListItemSecondaryAction>
					</MenuItem>
				</List>
			</Collapse>
			<MenuItem onClick={this.linePatternToggle}>
				<ListItemIcon>
					{patternIcon}
				</ListItemIcon>
				<ListItemText primary="Line pattern" />
				{this.state.linePattern ? <ExpandLess /> : <ExpandMore />}
			</MenuItem>
			<Collapse in={this.state.linePattern} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					<MenuItem onClick={this.lineDashedOff}>
						<ListItemIcon>
							<Minus />
						</ListItemIcon>
						<ListItemText primary="Solid" />
					</MenuItem>
					<MenuItem onClick={this.lineDashedOn}>
						<ListItemIcon>
							<DotsHorizontal />
						</ListItemIcon>
						<ListItemText primary="Dashed" />
					</MenuItem>
				</List>
			</Collapse>
			<Divider />
			<MenuItem data-value="square" onClick={this.close}>
				<ListItemIcon>
					<ShapeSquarePlus />
				</ListItemIcon>
				<ListItemText primary="Draw square" />
			</MenuItem>
			<Divider />
			<MenuItem data-value="ellipse" onClick={this.close}>
				<ListItemIcon>
					<ShapeOvalPlus />
				</ListItemIcon>
				<ListItemText primary="Draw ellipse" />
			</MenuItem>
			<Divider />
			<MenuItem data-value="text" onClick={this.close}>
				<ListItemIcon>
					<TextFieldsIcon />
				</ListItemIcon>
				<ListItemText primary="Write text" />
			</MenuItem>
		</Menu>
		);
	}
}

DrawMenu.defaultProps = {
	anchorEl: null,
	onClose: null,
	drawMode: null
}

DrawMenu.propTypes = {
	anchorEl: PropTypes.func,
	onClose: PropTypes.func,
	drawMode: PropTypes.instanceOf(DrawMode)
};

export default DrawMenu;