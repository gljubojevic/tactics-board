import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DrawMode from '../pitch/DrawMode';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Switch from '@mui/material/Switch';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextFields from '@mui/icons-material/TextFields';
import Palette from '@mui/icons-material/Palette';
import SportsSoccer from '@mui/icons-material/SportsSoccer';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CursorDefault from 'mdi-material-ui/CursorDefault';
import VectorLine from 'mdi-material-ui/VectorLine';
import ShapeSquarePlus from 'mdi-material-ui/ShapeSquarePlus';
import ShapeOvalPlus from 'mdi-material-ui/ShapeOvalPlus';
import ArrowLeft from 'mdi-material-ui/ArrowLeft';
import ArrowRight from 'mdi-material-ui/ArrowRight';
import ArrowLeftRight from 'mdi-material-ui/ArrowLeftRight';
import Minus from 'mdi-material-ui/Minus';
import DotsHorizontal from 'mdi-material-ui/DotsHorizontal';

class DrawMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			lineArrows: false,
			linePattern: false,
			pitchOverlays: false,
			textSizes: false
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

		this.colorSelect = this.colorSelect.bind(this);
		this.extrasSelect = this.extrasSelect.bind(this);

		this.textSizesToggle = this.textSizesToggle.bind(this);
		this.textSizeSelected = this.textSizeSelected.bind(this);
	}

	open() {
		this.setState({open:true});
	}

	close(e) {
		// read from "data-value" attribute
		let mode = e.currentTarget.dataset.value;
		console.log(mode);
		if (mode) {
			this.props.drawMode.mode = mode;
		}
		// close sub menus
		this.setState({
			open:false,
			lineArrows: false,
			linePattern: false,
			pitchOverlays: false,
			textSizes: false
		});
	}

	lineArrowsToggle() {
		this.setState({
			lineArrows: !this.state.lineArrows
		});
	}

	lineArrowStartToggle() {
		this.props.drawMode.lineArrowStart = !this.props.drawMode.lineArrowStart
	}

	lineArrowEndToggle() {
		this.props.drawMode.lineArrowEnd = !this.props.drawMode.lineArrowEnd
	}

	lineArrowsIcon() {
		const dm = this.props.drawMode;
		if (dm.lineArrowStart && dm.lineArrowEnd) {
			return (<ArrowLeftRight />);
		}
		if (!dm.lineArrowStart && dm.lineArrowEnd) {
			return (<ArrowRight />);
		}
		if (dm.lineArrowStart && !dm.lineArrowEnd) {
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
			linePattern: false
		});
	}

	lineDashedOff() {
		this.props.drawMode.lineDashed = false;
		this.setState({
			linePattern: false
		});
	}

	linePatternIcon() {
		if (this.props.drawMode.lineDashed) {
			return (<DotsHorizontal />);
		}
		return (<Minus />);
	}

	pitchOverlaysRender() {
		return this.props.drawMode.pitchOverlayOptions.map((txt, index) => {
			return (
				<FormControlLabel key={index} control={<Radio />} label={txt} value={txt} style={{marginLeft:0}} />
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
			pitchOverlays: false,
			open: false
		});
	}

	colorSelect(e) {
		this.close(e);
		this.props.paletteDialogRef().Show();
	}

	extrasSelect(e) {
		this.close(e);
		this.props.extrasDialogRef().Show();
	}

	textSizesToggle() {
		this.setState({
			textSizes: !this.state.textSizes
		});
	}

	textSizeSelected(e) {
		let sz = e.target.value;
		if (sz) {
			this.props.drawMode.textSize = parseInt(sz);
		}
		this.textSizesToggle();
	}

	textSizeItemsRender() {
		return this.props.drawMode.textSizeOptions.map((txt, index) => {
			return (
				<FormControlLabel key={index} control={<Radio />} label={txt} value={index} style={{marginLeft:0}} />
			);
		});
	}

	render() {
		const arrowsIcon = this.lineArrowsIcon();
		const patternIcon = this.linePatternIcon();

		const allColors = this.props.drawMode.colorOptions;
		const colorSelected = allColors[this.props.drawMode.color];
		const colorNameSelected = "Color " + this.props.drawMode.color;

		return (
		<Menu id="drawingMenu" anchorEl={this.props.anchorEl} keepMounted open={this.state.open} onClose={this.close}>
			<MenuItem data-value="select" onClick={this.close}>
				<ListItemIcon><CursorDefault /></ListItemIcon>
				<ListItemText primary="Select / Move" />
			</MenuItem>
			<Divider />
			<MenuItem onClick={this.pitchOverlaysToggle}>
				<ListItemText primary="Pitch overlay" />
				{this.state.pitchOverlays ? <ExpandLess /> : <ExpandMore />}
			</MenuItem>
			<Collapse in={this.state.pitchOverlays} timeout="auto" unmountOnExit>
				<RadioGroup name="radio-pitch-overlays" value={this.props.drawMode.pitchOverlay} onChange={this.pitchOverlayOnChange}>
					{this.pitchOverlaysRender()}
				</RadioGroup>
			</Collapse>
			<Divider />
			<MenuItem onClick={this.colorSelect}>
				<ListItemIcon><Palette style={{ color: colorSelected }} /></ListItemIcon>
				<ListItemText primary={colorNameSelected} />
			</MenuItem>
			<Divider />
			<MenuItem data-value="select" onClick={this.extrasSelect}>
				<ListItemIcon><SportsSoccer /></ListItemIcon>
				<ListItemText primary="Extras" />
			</MenuItem>
			<Divider />
			<MenuItem data-value="line" onClick={this.close}>
				<ListItemIcon><VectorLine /></ListItemIcon>
				<ListItemText primary="Draw line" />
			</MenuItem>
			<MenuItem onClick={this.lineArrowsToggle}>
				<ListItemIcon>{arrowsIcon}</ListItemIcon>
				<ListItemText primary="Line arrows" />
				{this.state.lineArrows ? <ExpandLess /> : <ExpandMore />}
			</MenuItem>
			<Collapse in={this.state.lineArrows} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					<MenuItem onClick={this.lineArrowEndToggle}>
						<ListItemIcon><ArrowRight /></ListItemIcon>
						<ListItemText primary="End" />
						<ListItemSecondaryAction>
							<Switch edge="end" onChange={this.lineArrowEndToggle} checked={this.props.drawMode.lineArrowEnd} />
						</ListItemSecondaryAction>
					</MenuItem>
					<MenuItem onClick={this.lineArrowStartToggle}>
						<ListItemIcon><ArrowLeft /></ListItemIcon>
						<ListItemText primary="Start" />
						<ListItemSecondaryAction>
							<Switch edge="end" onChange={this.lineArrowStartToggle} checked={this.props.drawMode.lineArrowStart} />
						</ListItemSecondaryAction>
					</MenuItem>
				</List>
			</Collapse>
			<MenuItem onClick={this.linePatternToggle}>
				<ListItemIcon>{patternIcon}</ListItemIcon>
				<ListItemText primary="Line pattern" />
				{this.state.linePattern ? <ExpandLess /> : <ExpandMore />}
			</MenuItem>
			<Collapse in={this.state.linePattern} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					<MenuItem onClick={this.lineDashedOff}>
						<ListItemIcon><Minus /></ListItemIcon>
						<ListItemText primary="Solid" />
					</MenuItem>
					<MenuItem onClick={this.lineDashedOn}>
						<ListItemIcon><DotsHorizontal /></ListItemIcon>
						<ListItemText primary="Dashed" />
					</MenuItem>
				</List>
			</Collapse>
			<Divider />
			<MenuItem data-value="square" onClick={this.close}>
				<ListItemIcon><ShapeSquarePlus /></ListItemIcon>
				<ListItemText primary="Draw square" />
			</MenuItem>
			<Divider />
			<MenuItem data-value="ellipse" onClick={this.close}>
				<ListItemIcon><ShapeOvalPlus /></ListItemIcon>
				<ListItemText primary="Draw ellipse" />
			</MenuItem>
			<Divider />
			<MenuItem data-value="text" onClick={this.close}>
				<ListItemIcon><TextFields /></ListItemIcon>
				<ListItemText primary="Write text" />
			</MenuItem>
			<MenuItem onClick={this.textSizesToggle}>
				<ListItemText primary="Text size" />
				{this.state.textSizes ? <ExpandLess /> : <ExpandMore />}
			</MenuItem>
			<Collapse in={this.state.textSizes} timeout="auto" unmountOnExit>
				<RadioGroup name="radio-pitch-textSize" value={this.props.drawMode.textSize} onChange={this.textSizeSelected}>
					{this.textSizeItemsRender()}
				</RadioGroup>
			</Collapse>
		</Menu>
		);
	}
}

DrawMenu.defaultProps = {
	anchorEl: null,
	drawMode: null,
	paletteDialogRef: null
}

DrawMenu.propTypes = {
	anchorEl: PropTypes.func,
	drawMode: PropTypes.instanceOf(DrawMode),
	paletteDialogRef: PropTypes.func
};

export default DrawMenu;