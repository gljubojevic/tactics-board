import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DrawMode from '../pitch/DrawMode';
import withStyles from '@mui/styles/withStyles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import {Menu as MenuIcon, Link as LinkIcon, PhotoCamera, TextFields, SportsSoccer, OpenInNew, MovieCreation, Delete} from '@mui/icons-material';
import { CursorDefault, VectorLine, ShapeSquarePlus, ShapeOvalPlus } from 'mdi-material-ui';
import DrawMenu from './DrawMenu';
import PaletteDialog from './PaletteDialog';
import FullscreenToggle from './FullscreenToggle';
import AnimControls from './AnimControls';
import ExtrasDialog from './ExtrasDialog';

// this is for custom position classes
const styles = theme => ({
	grow: {
		flexGrow: 1,
	},
});

class AppTools extends Component {
	constructor(props) {
		super(props);
		this.state = {
			drawerOpen: false
		}
		this.toggleDrawer = this.toggleDrawer.bind(this);

		// Drawing menu
		this._refDrawMenu = React.createRef();
		this._refOpenDrawMenu = React.createRef();
		this.drawingModeIcon = this.drawingModeIcon.bind(this);
		this.drawMenuAnchorEl = this.drawMenuAnchorEl.bind(this);
		this.drawMenuOpen = this.drawMenuOpen.bind(this);
		this.createNewScheme = this.createNewScheme.bind(this);
		this.createNewAnimation = this.createNewAnimation.bind(this);
		this.deleteAnimation = this.deleteAnimation.bind(this);

		// palette dialog
		this._refPaletteDialog = React.createRef();
		this.paletteDialogRef = this.paletteDialogRef.bind(this);
		this.extrasDialogRef = this.extrasDialogRef.bind(this);
		this._refExtrasDialog = React.createRef();
	}

	setDrawer(isOpen) {
		this.setState({
			drawerOpen:isOpen
		});
	}

	toggleDrawer(e) {
		if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
			return;
		}
		this.setDrawer(!this.state.drawerOpen);
	}

	createNewScheme() {
		this.setDrawer(false);
		this.props.createNewScheme();
	}

	createNewAnimation() {
		this.setDrawer(false);
		this.props.createNewAnimation();
	}

	deleteAnimation() {
		this.setDrawer(false);
		this.props.deleteAnimation();
	}

	drawMenuAnchorEl() {
		return this._refOpenDrawMenu.current;
	}

	drawMenuOpen() {
		this._refDrawMenu.current.open();
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
			case 'select':
			default:
				return (<CursorDefault />);
		}
	}

	paletteDialogRef() {
		return this._refPaletteDialog.current;
	}

	extrasDialogRef() {
		return this._refExtrasDialog.current;
	}

	renderAnimControls() {
		if (!this.props.animExists) {
			return null;
		}
		return (
			<React.Fragment>
				<div className={this.props.classes.grow} />
				<AnimControls 
					keyFrameCurrent={this.props.animKeyFrameCurrent}
					keyFrameTotal={this.props.animKeyFrameTotal}
					keyFrameAdd={this.props.animKeyFrameAdd}
					keyFrameDelete={this.props.animKeyFrameDelete}
					keyFrameNext={this.props.animKeyFrameNext}
					keyFramePrevious={this.props.animKeyFramePrevious}
					keyFrameDurationSet={this.props.animKeyFrameDurationSet}
					animPlayerShow={this.props.animPlayerShow}
				/>
			</React.Fragment>
		);
	}

	render() {
		const drawingModeIcon = this.drawingModeIcon();

		return (
			<React.Fragment>
				<AppBar position="fixed">
					<Toolbar variant="regular">
						<IconButton edge="start" color="inherit" aria-label="menu" onClick={this.toggleDrawer}>
							<MenuIcon />
						</IconButton>
						<Typography variant="h6" color="inherit">Futsal tactics board</Typography>
						{this.renderAnimControls()}
						<div className={this.props.classes.grow} />
						<Tooltip title="Selected draw mode">
							<IconButton ref={this._refOpenDrawMenu} aria-label="Selected draw mode" color="inherit" onClick={this.drawMenuOpen}>
								{drawingModeIcon}
							</IconButton>
						</Tooltip>
						<Tooltip title="Save picture">
							<IconButton aria-label="Save picture" color="inherit" onClick={this.props.saveImage}>
								<PhotoCamera />
							</IconButton>
						</Tooltip>
						<Tooltip title="Share link">
							<IconButton aria-label="Share link" color="inherit">
								<LinkIcon />
							</IconButton>
						</Tooltip>
						<FullscreenToggle />
					</Toolbar>
				</AppBar>
				<Drawer anchor="left" open={this.state.drawerOpen} onClose={this.toggleDrawer}>
					<Box p={2}>
						<Typography variant="h4" component="h2">Tactics board</Typography>
						<Divider />
						<List component="nav" aria-label="main mailbox folders">
							<ListItem>
								<ListItemButton onClick={this.createNewScheme}>
									<ListItemIcon>
										<OpenInNew />
									</ListItemIcon>
									<ListItemText primary="Create new scheme" />
								</ListItemButton>
							</ListItem>
							<Divider />
							<ListItem>
								<ListItemButton onClick={this.createNewAnimation} disabled={this.props.animExists}>
									<ListItemIcon>
										<MovieCreation />
									</ListItemIcon>
									<ListItemText primary="Create new animation" />
								</ListItemButton>
							</ListItem>
							<ListItem>
								<ListItemButton onClick={this.deleteAnimation} disabled={!this.props.animExists}>
									<ListItemIcon>
										<Delete />
									</ListItemIcon>
									<ListItemText primary="Delete animation" />
								</ListItemButton>
							</ListItem>
						</List>
					</Box>
				</Drawer>
				
				<DrawMenu ref={this._refDrawMenu} anchorEl={this.drawMenuAnchorEl} drawMode={this.props.drawMode} paletteDialogRef={this.paletteDialogRef} extrasDialogRef={this.extrasDialogRef} />
				<PaletteDialog ref={this._refPaletteDialog} drawMode={this.props.drawMode} />
				<ExtrasDialog ref={this._refExtrasDialog} extrasCreate={this.props.extrasCreate} />
			</React.Fragment>
		);
	}
}

AppTools.defaultProps = {
	drawMode: null,
	saveImage: null,
	createNewScheme: null,
	createNewAnimation: null,
	deleteAnimation: null,
	snackbarOpen: null,
	animExists: false,
	animKeyFrameCurrent: 0,
	animKeyFrameTotal: 0,
	animKeyFrameAdd: null,
	animKeyFrameDelete: null,
	animKeyFrameNext: null,
	animKeyFramePrevious: null,
	keyFrameDurationSet: null,
	animPlayerShow: null,
	extrasCreate: null,
}

AppTools.propTypes = {
	drawMode: PropTypes.instanceOf(DrawMode),
	saveImage: PropTypes.func,
	createNewScheme: PropTypes.func,
	createNewAnimation: PropTypes.func,
	deleteAnimation: PropTypes.func,
	snackbarOpen: PropTypes.func,
	animExists: PropTypes.bool,
	animKeyFrameCurrent: PropTypes.number,
	animKeyFrameTotal: PropTypes.number,
	animKeyFrameAdd: PropTypes.func,
	animKeyFrameDelete: PropTypes.func,
	animKeyFrameNext: PropTypes.func,
	animKeyFramePrevious: PropTypes.func,
	keyFrameDurationSet: PropTypes.func,
	animPlayerShow: PropTypes.func,
	extrasCreate: PropTypes.func
}

export default withStyles(styles, { withTheme: true })(AppTools);