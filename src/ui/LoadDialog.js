import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitleClose from './elements/DialogTitleClose';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

class LoadDialog extends Component {
	constructor(props, context) {
		super(props, context);
		this.Show = this.Show.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.loadTactics = this.loadTactics.bind(this);
		this.state = {
			open: false
		}
	}

	Show() {
		this.setState({open: true});
	}
	
	handleClose() {
		this.setState({open: false});
	}

	loadTactics() {
		this.handleClose();
		this.props.onLoad("aaaa--aa");
	}

	render() {
		return (
			<Dialog fullWidth={true} maxWidth={"sm"} open={this.state.open} onClose={this.handleClose} aria-labelledby="responsive-dialog-title">
				<DialogTitleClose id="responsive-dialog-title" onClick={this.handleClose}>Load tactics board</DialogTitleClose>
				<DialogContent dividers>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleClose} variant="contained" color="primary" autoFocus>Cancel</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

LoadDialog.defaultProps = {
	onLoad: null,
	firebaseApp: null,
	firestoreDB: null
}

LoadDialog.propTypes = {
	onLoad: PropTypes.func,
	firebaseApp: PropTypes.object,
	firestoreDB: PropTypes.object
}

export default LoadDialog;