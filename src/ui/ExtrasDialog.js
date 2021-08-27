import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DrawMode from '../pitch/DrawMode';
import LeftGoalIcon from '../pitch/LeftGoalIcon'
import SmallLeftGoalIcon from '../pitch/SmallLeftGoalIcon '
import RightGoalIcon from '../pitch/RightGoalIcon'
import SmallRightGoalIcon from '../pitch/SmallRightGoalIcon'
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Radio from '@material-ui/core/Radio';
import SvgIcon from '@material-ui/core/SvgIcon';
import { Tooltip } from '@material-ui/core';

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
			[{icon:<LeftGoalIcon />,name:"Left Goal",dimX:100,dimY:350,posX:0,posY:-25},
			{icon:<RightGoalIcon />,name:"Right Goal",dimX:100,dimY:350,posX:0,posY:-25},
			{icon:<SmallLeftGoalIcon />,name:"Left Goal Small",dimX:100,dimY:350,posX:-25,posY:-50},
			{icon:<SmallRightGoalIcon />,name:"Right Goal Small",dimX:100,dimY:350,posX:-25,posY:-50}]);
	}

	radioIcon(extras,isChecked) {
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
			const ico = this.radioIcon(extras,false);
			const icoChk = this.radioIcon(extras,true);
			return (
				<Tooltip title={extras.name}>
					<Radio name="extras-select" key={index} value={index} className={this.props.classes.radio} icon={ico} checkedIcon={icoChk} onChange={this.extrasChange} />
				</Tooltip>
				
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