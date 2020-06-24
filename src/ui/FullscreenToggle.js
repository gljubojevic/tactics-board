import React, { Component } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

// TODO: Fix fullscreen exit on esc key
class FullscreenToggle extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fullScreen: false
		}

		this.toggleFullScreen = this.toggleFullScreen.bind(this);
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

	fsIconGet(){
		if (this.state.fullScreen) {
			return(<FullscreenExitIcon />);
		} else {
			return(<FullscreenIcon />);
		};
	}

	render() {
		const fsIcon = this.fsIconGet();
		const fsLabel = this.state.fullScreen ? "Exit full screen" : "Enter full screen";

		return (
			<Tooltip title={fsLabel}>
				<IconButton aria-label={fsLabel} color="inherit" onClick={this.toggleFullScreen}>
					{fsIcon}
				</IconButton>
			</Tooltip>
		);
	}
}

export default FullscreenToggle;