import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import PauseIcon from '@material-ui/icons/Pause';
import LoopIcon from '@material-ui/icons/Loop';
import SkipNext from '@material-ui/icons/SkipNext';
import SkipPrevious from '@material-ui/icons/SkipPrevious';
import LinearProgress from '@material-ui/core/LinearProgress';

const BorderLinearProgress = withStyles((theme) => ({
	root: {
		height: 10,
		borderRadius: 5,
		width: 250
	},
	bar: {
		borderRadius: 5,
	}
}))(LinearProgress);
  

class AnimPlayer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
			isPlaying: false,
		}
		this.show = this.show.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.playPause = this.playPause.bind(this);
		this.stop = this.stop.bind(this);
	}

	playPause() {
		let isPlaying = this.state.isPlaying;
		this.setState({ isPlaying: !isPlaying });
	}

	stop() {
		this.setState({ isPlaying: false });
	}

	show() {
		this.setState({ isOpen: true });
	}

	handleClose() {
		this.stop();
		this.setState({ isOpen: false });
	}

	renderPlayPause() {
		if (!this.state.isPlaying) {
			return (
				<PlayArrowIcon />
			);
		}
		return (
			<PauseIcon />
		);
	}

	render() {
		return (
			<Popover open={this.state.isOpen}
				onClose={this.handleClose}
				anchorEl={this.props.anchorEl}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					horizontal: 'center'
				}}
			>
				<Grid container alignItems="center">
					<Grid item>
						<Tooltip title="Loop Animation">
							<IconButton  aria-label="Loop Animation" color="inherit" >
								<LoopIcon />
							</IconButton>
						</Tooltip>
						<Tooltip title="Previous key frame">
							<IconButton  aria-label="Previous key frame" color="inherit" >
								<SkipPrevious />
							</IconButton>
						</Tooltip>
						<Tooltip title="Play/Pause Animation">
							<IconButton aria-label="Play/Pause Animation" color="inherit" onClick={this.playPause}>
								{this.renderPlayPause()}
							</IconButton>
						</Tooltip>
						<Tooltip title="Next key frame">
							<IconButton  aria-label="Previous key frame" color="inherit" >
								<SkipNext />
							</IconButton>
						</Tooltip>
						<Tooltip title="Stop Animation">
							<IconButton aria-label="Stop Animation" color="inherit" onClick={this.stop} disabled={!this.state.isPlaying}>
								<StopIcon />
							</IconButton>
						</Tooltip>
					</Grid>
					<Grid item>
						<Box display="flex" alignItems="center">
							<Box mr={1}>
								<Typography variant="body2" color="textSecondary">00:000</Typography>
							</Box>
							<Box mr={1}>
								<BorderLinearProgress variant="determinate" value={35} />
							</Box>
						</Box>
					</Grid>
				</Grid>
			</Popover>
		);
	}
}

AnimPlayer.defaultProps = {
	anchorEl: null
}

AnimPlayer.propTypes = {
	anchorEl: PropTypes.func,
}

export default AnimPlayer;