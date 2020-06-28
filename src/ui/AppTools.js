import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PitchFutsal from '../pitch/PitchFutsal';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import MovieCreationIcon from '@material-ui/icons/MovieCreation';
import LinkIcon from '@material-ui/icons/Link';
import GetAppIcon from '@material-ui/icons/GetApp';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import { CursorDefault, VectorLine, ShapeSquarePlus, ShapeOvalPlus } from 'mdi-material-ui'
import DrawMenu from './DrawMenu';
import FullscreenToggle from './FullscreenToggle'

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
			drawerOpen: false,
			drawingMode: this.props.pitchFutsal.drawMode.mode,
		}
		this.toggleDrawer = this.toggleDrawer.bind(this);
		this.saveImage = this.saveImage.bind(this);

		// Drawing menu
		this._refDrawMenu = React.createRef();
		this._refOpenDrawMenu = React.createRef();
		this.drawingModeIcon = this.drawingModeIcon.bind(this);
		this.drawMenuAnchorEl = this.drawMenuAnchorEl.bind(this);
		this.drawMenuOpen = this.drawMenuOpen.bind(this);
		this.drawMenuClose = this.drawMenuClose.bind(this);
	}

	toggleDrawer(e) {
		if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
			return;
		}
		const isOpen = !this.state.drawerOpen;
		this.setState({
			drawerOpen:isOpen
		});
	}

	saveImage() {
		this.props.pitchEditSaveImage();
	}

	drawMenuAnchorEl() {
		return this._refOpenDrawMenu.current;
	}

	drawMenuOpen() {
		this._refDrawMenu.current.open();
	}

	drawMenuClose() {
		this.setState({
			drawingMode: this.props.pitchFutsal.drawMode.mode
		});
	}

	drawingModeIcon() {
		switch (this.state.drawingMode) {
			case 'line':
				return (<VectorLine />);
			case 'square':
				return (<ShapeSquarePlus />);
			case 'ellipse':
				return (<ShapeOvalPlus />);
			case 'text':
				return (<TextFieldsIcon />);
			case 'select':
			default:
				return (<CursorDefault />);
		}
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
						<div className={this.props.classes.grow} />
						<Tooltip title="Selected draw mode">
							<IconButton  ref={this._refOpenDrawMenu} aria-label="Selected draw mode" color="inherit" onClick={this.drawMenuOpen}>
								{drawingModeIcon}
							</IconButton>
						</Tooltip>
						<Tooltip title="Save picture">
							<IconButton aria-label="Save picture" color="inherit" onClick={this.saveImage}>
								<GetAppIcon />
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
							<ListItem button>
								<ListItemIcon>
									<OpenInNewIcon />
								</ListItemIcon>
								<ListItemText primary="Create new scheme" />
							</ListItem>
							<ListItem button>
								<ListItemIcon>
									<MovieCreationIcon />
								</ListItemIcon>
								<ListItemText primary="Create new animation" />
							</ListItem>
						</List>
					</Box>
				</Drawer>
				<DrawMenu ref={this._refDrawMenu} anchorEl={this.drawMenuAnchorEl} onClose={this.drawMenuClose} drawMode={this.props.pitchFutsal.drawMode} />
			</React.Fragment>
		);
	}
}

AppTools.defaultProps = {
	pitchFutsal: null,
	pitchEditSaveImage: null
}

AppTools.propTypes = {
	pitchFutsal: PropTypes.instanceOf(PitchFutsal),
	pitchEditSaveImage: PropTypes.func,
}

export default withStyles(styles, { withTheme: true })(AppTools);