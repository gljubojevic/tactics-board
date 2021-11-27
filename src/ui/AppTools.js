import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DrawMode from '../pitch/DrawMode';
import withStyles from '@mui/styles/withStyles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import LinkIcon from '@mui/icons-material/Link';
import DrawMenu from './DrawMenu';
import FullscreenToggle from './FullscreenToggle';
import AnimControls from './AnimControls';
import UserAccount from './UserAccount';

// this is for custom position classes
const styles = theme => ({
	grow: {
		flexGrow: 1,
	},
});

class AppTools extends Component {
	//constructor(props) {
	//	super(props);
	//}

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
		return (
			<AppBar position="fixed">
				<Toolbar variant="regular">
					<IconButton edge="start" color="inherit" aria-label="menu" onClick={this.props.toggleDrawer}>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" color="inherit">Futsal tactics board</Typography>
					{this.renderAnimControls()}
					<div className={this.props.classes.grow} />
					<DrawMenu drawMode={this.props.drawMode} extrasCreate={this.props.extrasCreate} />
					<Tooltip title="Share link">
						<IconButton aria-label="Share link" color="inherit">
							<LinkIcon />
						</IconButton>
					</Tooltip>
					<FullscreenToggle />
					<UserAccount firebaseApp={this.props.firebaseApp} isSignedIn={this.props.isSignedIn} />
				</Toolbar>
			</AppBar>
		);
	}
}

AppTools.defaultProps = {
	drawMode: null,
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
	isSignedIn: false,
	firebaseApp: null,
	toggleDrawer: null
}

AppTools.propTypes = {
	drawMode: PropTypes.instanceOf(DrawMode),
	animExists: PropTypes.bool,
	animKeyFrameCurrent: PropTypes.number,
	animKeyFrameTotal: PropTypes.number,
	animKeyFrameAdd: PropTypes.func,
	animKeyFrameDelete: PropTypes.func,
	animKeyFrameNext: PropTypes.func,
	animKeyFramePrevious: PropTypes.func,
	keyFrameDurationSet: PropTypes.func,
	animPlayerShow: PropTypes.func,
	extrasCreate: PropTypes.func,
	isSignedIn: PropTypes.bool,
	firebaseApp: PropTypes.object,
	toggleDrawer: PropTypes.func
}

export default withStyles(styles, { withTheme: true })(AppTools);