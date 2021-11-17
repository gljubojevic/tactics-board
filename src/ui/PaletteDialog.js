import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DrawMode from '../pitch/DrawMode';
import withStyles from '@mui/styles/withStyles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Radio from '@mui/material/Radio';
import CheckIcon from '@mui/icons-material/Check';

// this is for offset from toolbar and default class
const styles = theme => ({
	radio: {
		padding: 0,
	},
	radioIcon: {
		width: 48,
		height: 48,
	},
	radioIconSelected: {
		width: 48,
		height: 48,
		border: '1px solid white',
		color: theme.palette.common.white,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	}
})

class PaletteDialog extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			open: false
		}
		this.Show = this.Show.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.colorChange = this.colorChange.bind(this);
	}

	Show() {
		this.setState({
			open: true
		});
	}

	handleClose() {
		this.setState({
			open: false
		});
	}

	colorChange(e) {
		this.props.drawMode.color = parseInt(e.target.value);
		this.handleClose();
	}

	radioIcon(isChecked, color) {
		if (!isChecked) {
			return (
				<div className={this.props.classes.radioIcon} style={{ backgroundColor: color }} />
			);
		}
		return (
			<div className={this.props.classes.radioIconSelected} style={{ backgroundColor: color }}>
				<CheckIcon style={{ fontSize: 30 }} />
			</div>
		);
	}

	renderRadios() {
		const dm = this.props.drawMode;
		return dm.colorOptions.map((col, index) => {
			const ico = this.radioIcon(false, col);
			const icoChk = this.radioIcon(true, col);
			return (
				<Radio name="color-select" key={index} value={index} className={this.props.classes.radio} checked={index === dm.color} icon={ico} checkedIcon={icoChk} onChange={this.colorChange} />
			);
		});
	}

	render() {
		return (
			<Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="responsive-dialog-title">
				<DialogTitle id="responsive-dialog-title">Color palette</DialogTitle>
				<DialogContent>
					{this.renderRadios()}
				</DialogContent>
			</Dialog>
		);
	}
}

PaletteDialog.defaultProps = {
	drawMode: null
}

PaletteDialog.propTypes = {
	classes: PropTypes.object.isRequired,
	drawMode: PropTypes.instanceOf(DrawMode)
};

export default withStyles(styles, { withTheme: true })(PaletteDialog);