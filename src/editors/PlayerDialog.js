import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class PlayerDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			player: {id:"", name:"", no: 0}
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
		this.setState({
			open: false
		});
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
			no: Number.parseInt(this._refNumber.current.value)
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
			<React.Fragment>
				<Dialog open={this.state.open} onClose={this.close} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Edit player</DialogTitle>
					<DialogContent>
						<TextField inputRef={this._refNumber} margin="dense" id="playerNumber" defaultValue={this.state.player.no} label="Number" type="number" fullWidth autoFocus />
						<TextField inputRef={this._refName} margin="dense" id="playerName" defaultValue={this.state.player.name} label="Name" type="text" fullWidth />
					</DialogContent>
					<DialogActions>
						<Button onClick={this.remove} color="primary">Remove</Button>
						<Button onClick={this.close} color="primary">Cancel</Button>
						<Button onClick={this.save} color="primary">Save</Button>
					</DialogActions>
				</Dialog>
			</React.Fragment>
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