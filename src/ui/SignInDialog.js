import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitleClose from './elements/DialogTitleClose';
import firebase from 'firebase/compat/app';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

class SignInDialog extends Component {
	constructor(props, context) {
		super(props, context);
		this.Show = this.Show.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.signInSuccessWithAuthResult = this.signInSuccessWithAuthResult.bind(this);
		this.uiConfig = {
			signInFlow: 'popup',
			signInOptions: [
				firebase.auth.GoogleAuthProvider.PROVIDER_ID,
				firebase.auth.EmailAuthProvider.PROVIDER_ID
			],
			callbacks: {
				signInSuccessWithAuthResult: this.signInSuccessWithAuthResult,
			},
		};
		
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

	signInSuccessWithAuthResult(authResult, redirectUrl) {
		console.log("SignIn success",authResult, redirectUrl);
		this.handleClose();
		return false;
	}	

	render() {
		return (
			<Dialog fullWidth={true} maxWidth={"sm"} open={this.state.open} onClose={this.handleClose} aria-labelledby="responsive-dialog-title">
				<DialogTitleClose id="responsive-dialog-title" onClick={this.handleClose}>Please select sign in method</DialogTitleClose>
				<DialogContent dividers>
					<StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={this.props.firebaseApp.auth()}/>
				</DialogContent>
			</Dialog>
		);
	}
}

SignInDialog.defaultProps = {
	firebaseApp: null
}

SignInDialog.propTypes = {
	firebaseApp: PropTypes.object,
}

export default SignInDialog;