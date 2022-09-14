import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitleClose from '../ui/elements/DialogTitleClose';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


class PlayerDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			player: {id:"", name:"", no: "0"}
		};

		// input references
		this._refName = React.createRef();
		this._refNumber = React.createRef();

		// events
		this.openDialog = this.openDialog.bind(this);
		this.close = this.close.bind(this);
		this.save = this.save.bind(this);
		this.remove = this.remove.bind(this);
	}
	
	openDialog(player) {
		this.setState({
			open: true,
			player: player
		});
	}

	close() {
		this.setState({open: false});
	}

	save() {
		this.close();
		if (null === this.props.onEditDone) {
			return;
		}
		this.props.onEditDone({
			id: this.state.player.id,
			remove: false,
			name: this._refName.current.value,
			no: this._refNumber.current.value
		})
	}

	remove() {
		this.close();
		if (null === this.props.onEditDone) {
			return;
		}
		this.props.onEditDone({
			id: this.state.player.id,
			remove: true
		})
	}


	render() {
		return (
			<Dialog open={this.state.open} onClose={this.close} aria-labelledby="form-dialog-title">
				<DialogTitleClose id="form-dialog-title" onClick={this.close}>Edit player</DialogTitleClose>
				<DialogContent dividers>
					<TextField inputRef={this._refNumber} margin="dense" id="playerNumber" defaultValue={this.state.player.no} label="Number" type="text" fullWidth autoFocus />
					<TextField inputRef={this._refName} margin="dense" id="playerName" defaultValue={this.state.player.name} label="Name" type="text" fullWidth />
				</DialogContent>
				<DialogActions>
					<Button onClick={this.remove} variant="contained" color="secondary">Remove</Button>
					<Button onClick={this.save} variant="contained" color="primary">Save</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

PlayerDialog.defaultProps = {
	onEditDone: null
}

PlayerDialog.propTypes = {
	onEditDone: PropTypes.func
}

export default PlayerDialog;