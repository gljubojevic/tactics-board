import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
				<DialogTitle id="responsive-dialog-title">{this.state.title}</DialogTitle>
				<DialogContent>
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