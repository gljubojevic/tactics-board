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
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PaletteDialog from './PaletteDialog';
import ExtrasDialog from './ExtrasDialog';
import TextFields from '@mui/icons-material/TextFields';
import Palette from '@mui/icons-material/Palette';
import SportsSoccer from '@mui/icons-material/SportsSoccer';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CursorDefault from 'mdi-material-ui/CursorDefault';
import DeleteIcon from '@mui/icons-material/Delete';
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
			anchorEl: null,
			lineArrows: false,
			linePattern: false,
			pitchOverlays: false,
			textSizes: false
		}

		// dialog references
		this.refPaletteDialog = React.createRef();
		this.refExtrasDialog = React.createRef();

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

	open(e) {
		this.setState({ open:true, anchorEl: e.currentTarget });
	}

	close(e) {
		// read from "data-value" attribute
		const mode = e.currentTarget.dataset.value;
		if (mode) {
			this.props.drawMode.mode = mode;
		}
		// close sub menus
		this.setState({
			open:false,
			anchorEl: null,
			lineArrows: false,
			linePattern: false,
			pitchOverlays: false,
			textSizes: false
		});
	}

	lineArrowsToggle() {
		this.setState({ lineArrows: !this.state.lineArrows });
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
		this.setState({ linePattern: !this.state.linePattern });
	}

	lineDashedOn() {
		this.props.drawMode.lineDashed = true;
		this.setState({ linePattern: false });
	}

	lineDashedOff() {
		this.props.drawMode.lineDashed = false;
		this.setState({ linePattern: false });
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

	pitchOverlayOnChange(e) {
		this.props.drawMode.pitchOverlay = e.target.value;
		this.setState({
			open: false,
			anchorEl: null,
			pitchOverlays: false
		});
	}

	colorSelect(e) {
		this.close(e);
		this.refPaletteDialog.current.Show();
	}

	extrasSelect(e) {
		this.close(e);
		this.refExtrasDialog.current.Show();
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

	drawingModeIcon() {
		switch (this.props.drawMode.mode) {
			case 'line':
				return (<VectorLine />);
			case 'square':
				return (<ShapeSquarePlus />);
			case 'ellipse':
				return (<ShapeOvalPlus />);
			case 'text':
				return (<TextFields />);
			case 'extras':
				return (<SportsSoccer />);
			case 'delete':
				return (<DeleteIcon />);
			case 'select':
			default:
				return (<CursorDefault />);
		}
	}

	render() {
		const dm = this.props.drawMode;

		return (
			<React.Fragment>
				<Tooltip title="Selected draw mode">
					<IconButton aria-label="Selected draw mode" color="inherit" onClick={this.open}>
						{this.drawingModeIcon()}
					</IconButton>
				</Tooltip>
				<Menu id="drawingMenu" anchorEl={this.state.anchorEl} keepMounted open={this.state.open} onClose={this.close}>
					<MenuItem data-value="select" onClick={this.close}>
						<ListItemIcon><CursorDefault /></ListItemIcon>
						<ListItemText primary="Select / Move" />
					</MenuItem>
					<Divider />
					<MenuItem data-value="delete" onClick={this.close}>
						<ListItemIcon><DeleteIcon /></ListItemIcon>
						<ListItemText primary="Remove" />
					</MenuItem>
					<Divider />
					<MenuItem onClick={this.pitchOverlaysToggle}>
						<ListItemText primary="Pitch overlay" secondary={dm.pitchOverlay} />
						{this.state.pitchOverlays ? <ExpandLess /> : <ExpandMore />}
					</MenuItem>
					<Collapse in={this.state.pitchOverlays} timeout="auto" unmountOnExit>
						<RadioGroup name="radio-pitch-overlays" value={dm.pitchOverlay} onChange={this.pitchOverlayOnChange}>
							{this.pitchOverlaysRender()}
						</RadioGroup>
					</Collapse>
					<Divider />
					<MenuItem onClick={this.colorSelect}>
						<ListItemIcon><Palette style={{ color: dm.colorSelected }} /></ListItemIcon>
						<ListItemText primary="Drawing color" secondary={dm.colorSelectedName} />
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
						<ListItemIcon>{this.lineArrowsIcon()}</ListItemIcon>
						<ListItemText primary="Line arrows" />
						{this.state.lineArrows ? <ExpandLess /> : <ExpandMore />}
					</MenuItem>
					<Collapse in={this.state.lineArrows} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							<MenuItem onClick={this.lineArrowEndToggle}>
								<ListItemIcon><ArrowRight /></ListItemIcon>
								<ListItemText primary="End" />
								<ListItemSecondaryAction>
									<Switch edge="end" onChange={this.lineArrowEndToggle} checked={dm.lineArrowEnd} />
								</ListItemSecondaryAction>
							</MenuItem>
							<MenuItem onClick={this.lineArrowStartToggle}>
								<ListItemIcon><ArrowLeft /></ListItemIcon>
								<ListItemText primary="Start" />
								<ListItemSecondaryAction>
									<Switch edge="end" onChange={this.lineArrowStartToggle} checked={dm.lineArrowStart} />
								</ListItemSecondaryAction>
							</MenuItem>
						</List>
					</Collapse>
					<MenuItem onClick={this.linePatternToggle}>
						<ListItemIcon>{this.linePatternIcon()}</ListItemIcon>
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
						<ListItemText primary="Write text" secondary={dm.textSizeName} />
					</MenuItem>
					<MenuItem onClick={this.textSizesToggle}>
						<ListItemText primary="Text sizes" />
						{this.state.textSizes ? <ExpandLess /> : <ExpandMore />}
					</MenuItem>
					<Collapse in={this.state.textSizes} timeout="auto" unmountOnExit>
						<RadioGroup name="radio-pitch-textSize" value={dm.textSize} onChange={this.textSizeSelected}>
							{this.textSizeItemsRender()}
						</RadioGroup>
					</Collapse>
				</Menu>
				<PaletteDialog ref={this.refPaletteDialog} drawMode={dm} />
				<ExtrasDialog ref={this.refExtrasDialog} extrasCreate={this.props.extrasCreate} />
			</React.Fragment>
		);
	}
}

DrawMenu.defaultProps = {
	drawMode: null,
	extrasCreate: null
}

DrawMenu.propTypes = {
	drawMode: PropTypes.instanceOf(DrawMode),
	extrasCreate: PropTypes.func
};

export default DrawMenu;