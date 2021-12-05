import React, { Component } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitleClose from './elements/DialogTitleClose';

class ConfirmDialog extends Component {
	constructor(props, context) {
		super(props, context);
		this.okCallback = null;
		this.state = {
			open: false,
			title: "",
			text: ""
		}
		this.Show = this.Show.bind(this);
		this.handleOk = this.handleOk.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	Show(title, text, fnCallback) {
		this.okCallback = fnCallback;
		this.setState({
			open: true,
			title: title,
			text: text
		});
	}
	
	handleClose() {
		this.okCallback = null;
		this.setState({
			open: false
		});
	}

	handleOk() {
		if (null !== this.okCallback) {
			this.okCallback();
		}
		this.handleClose();
	}

	render() {
		return (
			<Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="responsive-dialog-title">
				<DialogTitleClose id="responsive-dialog-title" onClick={this.handleClose}>{this.state.title}</DialogTitleClose>
				<DialogContent dividers>
					<DialogContentText>{this.state.text}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleClose} variant="contained" color="primary" autoFocus>Cancel</Button>
					<Button onClick={this.handleOk} variant="contained" color="secondary">Ok</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

export default ConfirmDialog;