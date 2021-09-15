import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DrawMode from '../pitch/DrawMode';
import GoalIcon from '../editors/GoalIcon';
import Ladder from '../editors/Ladder';
import Cone from '../editors/Cone';
import Flag from '../editors/Flag';
import SmallGoalIcon from '../editors/SmallGoalIcon'
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Radio from '@material-ui/core/Radio';
import SvgIcon from '@material-ui/core/SvgIcon';

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
		this.getIcons = this.getIcons.bind(this);
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

	getIcons() {
		return (
			[{ icon: <GoalIcon />, name: "Goal", dimX: 100, dimY: 350, posX: 0, posY: -25 },
			{ icon: <SmallGoalIcon />, name: "Goal Small", dimX: 80, dimY: 380, posX: 0, posY: -50 },
			{ icon: <Ladder />, name: "Ladder", dimX: 100, dimY: 350, posX: 85, posY: -25 },
			{ icon: <Cone />, name: "Cone", dimX: 100, dimY: 150, posX: 0, posY: -25 },
			{ icon: <Flag />, name: "Flag", dimX: 100, dimY: 350, posX: 0, posY: -40 }]);
	}

	radioIcon(extras, isChecked) {
		if (!isChecked) {
			return (
					<SvgIcon viewBox={`${extras.posX} ${extras.posY} ${extras.dimX} ${extras.dimY}`} className={this.props.classes.radioIcon}>
						{extras.icon}
					</SvgIcon>
			);
		}
		return (
				<SvgIcon viewBox={`${extras.posX} ${extras.posY} ${extras.dimX} ${extras.dimY}`} className={this.props.classes.radioIconSelected}>
					{extras.icon}
				</SvgIcon>
		);
	}

	renderRadios() {
		return this.getIcons().map((extras, index) => {
			const ico = this.radioIcon(extras, false);
			const icoChk = this.radioIcon(extras, true);
			return (
				<div style={{display: 'inline-block'}}>
					<label style={{display: 'block',  textAlign: "center"}}>{extras.name}</label>
						<Radio name="extras-select" key={index} value={index} className={this.props.classes.radio} icon={ico} checkedIcon={icoChk} onChange={this.extrasChange} />
				</div>


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