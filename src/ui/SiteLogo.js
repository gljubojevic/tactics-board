import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';

class SiteLogo extends Component {

	render() {
		if (null === this.props.logoURL) {
			return null;
		}
		return (
			<Paper elevation={3} sx={{ position: 'absolute', bottom:0, right:0, m:2, p:0.5 }}>
				<a href={this.props.logoLink}><img alt="site logo" src={this.props.logoURL} /></a>
			</Paper>
		);
	}
}

SiteLogo.defaultProps = {
	logoURL: null,
	logoLink: null,
}

SiteLogo.propTypes = {
	logoURL: PropTypes.string,
	logoLink: PropTypes.string,
}

export default SiteLogo;