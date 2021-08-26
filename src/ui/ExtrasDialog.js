import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DrawMode from '../pitch/DrawMode';
import GoalIcon from '../pitch/GoalIcon'
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Radio from '@material-ui/core/Radio';

// this is for offset from toolbar and default class
const styles = theme => ({
	radio: {
		padding: 0,
	},
	radioIcon: {
		width: 100,
		height: 100,
	},
	radioIconSelected: {
		width: 100,
		height: 100,
		border: '1px solid lightgrey',
		color: theme.palette.common.white,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	}
})

class ExtrasDialog extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			open: false
		}
		this.Show = this.Show.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.extrasChange = this.extrasChange.bind(this);
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

	extrasChange(e) {
		this.handleClose();
	}

	radioIcon(isChecked) {
		if (!isChecked) {
			return (
				<GoalIcon className={this.props.classes.radioIcon}/>
			);
		}
		return (
			<GoalIcon className={this.props.classes.radioIconSelected}/>
		);
	}

	renderRadios() {
		return [1,2,3,4,5].map((value, index) => {
			const ico = this.radioIcon(false);
			const icoChk = this.radioIcon(true);
			return (
				<Radio name="extras-select" key={index} value={index} className={this.props.classes.radio}  icon={ico} checkedIcon={icoChk} onChange={this.extrasChange} />
			);
		});
	}

	render() {
		return (
			<Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="responsive-dialog-title">
				<DialogTitle id="responsive-dialog-title">Extras Dialog</DialogTitle>
				<DialogContent>
					{this.renderRadios()}
				</DialogContent>
			</Dialog>
		);
	}
}

ExtrasDialog.defaultProps = {
	drawMode: null
}

ExtrasDialog.propTypes = {
	classes: PropTypes.object.isRequired,
	drawMode: PropTypes.instanceOf(DrawMode)
};

export default withStyles(styles, { withTheme: true })(ExtrasDialog);