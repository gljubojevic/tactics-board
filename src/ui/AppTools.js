import React, { Component } from 'react';
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
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import LinkIcon from '@material-ui/icons/Link';
import GetAppIcon from '@material-ui/icons/GetApp';

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
			fullScreen: false
		}
		this.toggleDrawer = this.toggleDrawer.bind(this);
		this.toggleFullScreen = this.toggleFullScreen.bind(this);
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

	render() {
		const fsIcon = this.fsIconGet()
		const fsLabel = this.state.fullScreen ? "Exit full screen" : "Enter full screen";

		return (
			<React.Fragment>
				<AppBar position="fixed">
					<Toolbar variant="regular">
						<IconButton edge="start" color="inherit" aria-label="menu" onClick={this.toggleDrawer} >
							<MenuIcon />
						</IconButton>
						<Typography variant="h6" color="inherit">Futsal tactics board</Typography>
						<div className={this.props.classes.grow} />
						<Tooltip title="Save picture">
							<IconButton aria-label="Save picture" color="inherit">
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
			</React.Fragment>
		);
	}
}

export default withStyles(styles, { withTheme: true })(AppTools);