import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

class AppTools extends Component {

	render() {
		return (
			<AppBar position="fixed">
				<Toolbar variant="regular">
					<IconButton edge="start" color="inherit" aria-label="menu">
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" color="inherit">Futsal tactics board</Typography>
				</Toolbar>
			</AppBar>
		);
	}
}

export default AppTools;