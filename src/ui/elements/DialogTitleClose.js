import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function DialogTitleClose(props) {
	return (
		<DialogTitle id={props.id}>
			{props.children}
			<IconButton aria-label="close" onClick={props.onClick} sx={{ position: 'absolute', right: 8, top: 8 }}>
				<CloseIcon />
			</IconButton>
		</DialogTitle>
	);
}

DialogTitleClose.defaultProps = {
	id: null,
	onClick: null
}

DialogTitleClose.propTypes = {
	id: PropTypes.string,
	onClick: PropTypes.func
};

export default DialogTitleClose;