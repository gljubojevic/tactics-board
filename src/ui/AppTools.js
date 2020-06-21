import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import MovieCreationIcon from '@material-ui/icons/MovieCreation';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import LinkIcon from '@material-ui/icons/Link';
import GetAppIcon from '@material-ui/icons/GetApp';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import { CursorDefault, VectorLine, ShapeSquarePlus, ShapeOvalPlus, ArrowLeft, ArrowRight, ArrowLeftRight, Minus } from 'mdi-material-ui'

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
			drawingMode: 'select',
			drawingMenuOpen: false,
			lineArrowsOpen: false,
			lineArrowStart: false,
			lineArrowEnd: false,
			fullScreen: false
		}
		this.toggleDrawer = this.toggleDrawer.bind(this);
		this.toggleFullScreen = this.toggleFullScreen.bind(this);
		this.saveImage = this.saveImage.bind(this);

		// Drawing menu
		this._refOpenDrawingMenu = React.createRef();
		this.drawingModeIcon = this.drawingModeIcon.bind(this);
		this.drawingMenuAnchor = this.drawingMenuAnchor.bind(this);
		this.drawingMenuOpen = this.drawingMenuOpen.bind(this);
		this.drawingMenuClose = this.drawingMenuClose.bind(this);
		this.lineArrowsToggle = this.lineArrowsToggle.bind(this);
		this.lineArrowEndToggle = this.lineArrowEndToggle.bind(this);
		this.lineArrowStartToggle = this.lineArrowStartToggle.bind(this);
		this.lineArrowsIcon = this.lineArrowsIcon.bind(this);
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

	domFullScreenToggle(toFullScreen) {
		if (toFullScreen) {
			var elem = document.documentElement;
			if (elem.requestFullscreen) {
				elem.requestFullscreen();
				} else if (elem.mozRequestFullScreen) { /* Firefox */
				elem.mozRequestFullScreen();
				} else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
				elem.webkitRequestFullscreen();
				} else if (elem.msRequestFullscreen) { /* IE/Edge */
				elem.msRequestFullscreen();
			}
			return;
		}

		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
	}

	toggleFullScreen() {
		const isFullScreen = !this.state.fullScreen;
		// dom toogle
		this.domFullScreenToggle(isFullScreen);
		// change state to update buttons
		this.setState({
			fullScreen:isFullScreen
		});
	}

	fsIconGet (){
		if (this.state.fullScreen) {
			return(<FullscreenExitIcon />);
		} else {
			return(<FullscreenIcon />);
		};
	}

	drawingMenuAnchor() {
		return this._refOpenDrawingMenu.current;
	}

	drawingMenuOpen() {
		this.setState({
			drawingMenuOpen:true
		});
	}

	drawingMenuClose(drawingMode) {
		if (null === drawingMode) {
			this.setState({
				drawingMenuOpen:false
			});
		}
		this.setState({
			drawingMode:drawingMode,
			drawingMenuOpen:false
		});
	}

	drawingModeIcon() {
		switch (this.state.drawingMode) {
			case 'line':
				return (<VectorLine />);
			case 'square':
				return (<ShapeSquarePlus />);
			case 'oval':
				return (<ShapeOvalPlus />);
			case 'text':
				return (<TextFieldsIcon />);
			case 'select':
			default:
				return (<CursorDefault />);
		}
	}

	lineArrowsToggle() {
		this.setState({
			lineArrowsOpen: !this.state.lineArrowsOpen
		});
	}

	lineArrowStartToggle() {
		this.setState({
			lineArrowStart: !this.state.lineArrowStart
		});
	}

	lineArrowEndToggle() {
		this.setState({
			lineArrowEnd: !this.state.lineArrowEnd
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

	render() {
		const fsIcon = this.fsIconGet();
		const fsLabel = this.state.fullScreen ? "Exit full screen" : "Enter full screen";
		const drawingModeIcon = this.drawingModeIcon();
		const arrowsIcon = this.lineArrowsIcon();

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
							<IconButton  ref={this._refOpenDrawingMenu} aria-label="Selected draw mode" color="inherit" onClick={this.drawingMenuOpen}>
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
						<Tooltip title={fsLabel}>
							<IconButton aria-label={fsLabel} color="inherit" onClick={this.toggleFullScreen}>
								{fsIcon}
							</IconButton>
						</Tooltip>
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
				<Menu id="drawingMenu" anchorEl={this.drawingMenuAnchor} keepMounted open={this.state.drawingMenuOpen} onClose={this.drawingMenuClose}>
					<MenuItem onClick={()=>{this.drawingMenuClose('select')}}>
						<ListItemIcon>
							<CursorDefault />
						</ListItemIcon>
						<ListItemText primary="Select / Move" />
					</MenuItem>
					<Divider />
					<MenuItem onClick={()=>{this.drawingMenuClose('line')}}>
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
						{this.state.lineArrowsOpen ? <ExpandLess /> : <ExpandMore />}
					</MenuItem>
					<Collapse in={this.state.lineArrowsOpen} timeout="auto" unmountOnExit>
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
					<Divider />
					<MenuItem onClick={()=>{this.drawingMenuClose('square')}}>
						<ListItemIcon>
							<ShapeSquarePlus />
						</ListItemIcon>
						<ListItemText primary="Draw square" />
					</MenuItem>
					<Divider />
					<MenuItem onClick={()=>{this.drawingMenuClose('oval')}}>
						<ListItemIcon>
							<ShapeOvalPlus />
						</ListItemIcon>
						<ListItemText primary="Draw elipse" />
					</MenuItem>
					<Divider />
					<MenuItem onClick={()=>{this.drawingMenuClose('text')}}>
						<ListItemIcon>
							<TextFieldsIcon />
						</ListItemIcon>
						<ListItemText primary="Write text" />
					</MenuItem>
				</Menu>
			</React.Fragment>
		);
	}
}

AppTools.defaultProps = {
	pitchEditSaveImage: null,
}

AppTools.propTypes = {
	pitchEditSaveImage: PropTypes.func,
}

export default withStyles(styles, { withTheme: true })(AppTools);