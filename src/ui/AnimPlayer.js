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
		transition: 'none'	// disable animation to have immediate feedback
	}
}))(LinearProgress);
  

class AnimPlayer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
			isPlaying: false,
			isPaused: false,
			animTime: 0
		}
		this.currentTime = 0;
		this.show = this.show.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.playPause = this.playPause.bind(this);
		this.stop = this.stop.bind(this);
		this.animStep = this.animStep.bind(this);
		this.animPlaybackStart = this.animPlaybackStart.bind(this);
	}

	playPause() {
		let isPlaying = this.state.isPlaying;
		let isPaused = this.state.isPaused;
		if (!isPlaying) {
			isPlaying = true;
			isPaused = false;
			this.animPlaybackStart();
		} else {
			isPaused = !isPaused;
		}
		this.setState({
			isPlaying: isPlaying,
			isPaused: isPaused
		});
	}

	animPlaybackStart() {
		// Prepare animation for playback
		if (null != this.props.animStart) {
			this.props.animStart();
		}
		// start animation steps
		window.requestAnimationFrame(this.animStep);
	}

	stop() {
		this.currentTime = 0;
		this.setState({
			isPlaying: false,
			isPaused: false,
			animTime: 0
		});
		// stop / cancel anim playback
		if (null != this.props.animStop) {
			this.props.animStop();
		}
	}

	animTotalTime() {
		// note: first keyframe is only initial position so it is skipped
		// total time is in milliseconds
		return (this.props.keyFramesNo-1) * this.props.keyFrameDuration * 1000;
	}

	animProgress() {
		let animTime = this.state.animTime;
		let pct = 100 * animTime / this.animTotalTime();
		return Math.round(pct);
	}

	animTime() {
		let timeSec = this.state.animTime / 1000;
		let sec = Math.floor(timeSec).toString();
		let msec = Math.floor((timeSec - sec) * 1000).toString();
		// correct formatting '000:000'
		sec = '000'.substring(0, 3 - sec.length) + sec;
		msec = '000'.substring(0, 3 - msec.length) + msec;
		return sec + ':' + msec;
	}

	animStep(time) {
		// anim is started time
		if (0 === this.currentTime) {
			this.currentTime = time;
		}
		const elapsedTime = time - this.currentTime;
		this.currentTime = time;

		let animTime = this.state.animTime;

		//console.log(time);
		if (!this.state.isPaused) {
			animTime += elapsedTime;
			if (animTime > this.animTotalTime() ) {
				animTime = 0;
			}
			this.setState({
				animTime: animTime
			})
		}

		// show current frame
		if (null != this.props.animFrame) {
			this.props.animFrame(animTime);
		}

		if (this.state.isPlaying) {
			window.requestAnimationFrame(this.animStep);
		}
	}

	show() {
		this.setState({ isOpen: true });
	}

	handleClose() {
		this.stop();
		this.setState({ isOpen: false });
	}

	renderPlayPause() {
		if (!this.state.isPlaying || this.state.isPaused) {
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
				anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
				transformOrigin={{horizontal: 'center', vertical: 'top'}}
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
							<span>
								<IconButton aria-label="Stop Animation" color="inherit" onClick={this.stop} disabled={!this.state.isPlaying}>
									<StopIcon />
								</IconButton>
							</span>
						</Tooltip>
					</Grid>
					<Grid item>
						<Box display="flex" alignItems="center">
							<Box mr={1} minWidth={55}>
								<Typography variant="body2" color="textSecondary">{this.animTime()}</Typography>
							</Box>
							<Box mr={1}>
								<BorderLinearProgress variant="determinate" value={this.animProgress()} />
							</Box>
						</Box>
					</Grid>
				</Grid>
			</Popover>
		);
	}
}

AnimPlayer.defaultProps = {
	anchorEl: null,
	keyFramesNo: 0,
	keyFrameDuration: 0,
	animStart: null,
	animStop: null,
	animFrame: null,
}

AnimPlayer.propTypes = {
	anchorEl: PropTypes.func,
	keyFramesNo: PropTypes.number,
	keyFrameDuration: PropTypes.number,
	animStart: PropTypes.func,
	animStop: PropTypes.func,
	animFrame: PropTypes.func
}

export default AnimPlayer;