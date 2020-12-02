import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Text from '../pitch/Text';
import EditBox from './EditBox'

class TextEdit extends Component {
	constructor(props) {
		super(props);
		this._selectionStart = 0;
		this._selectionEnd = 0;
		this._boxPadding = 10;					// padding for text bounding box
		this._editRef = React.createRef();		// reference to editor
		this._textRef = React.createRef();		// reference to text
		this._cursorRef = React.createRef();	// reference to cursor
		this._boxRef = React.createRef();		// reference to text box
		this.editStart = this.editStart.bind(this);
		this.editChange = this.editChange.bind(this);
		this.editKeyUp = this.editKeyUp.bind(this);
		this.editEnd = this.editEnd.bind(this);
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.text.isTextEdit) {
			this._editRef.current.focus();
		}
	}

	// remove all previous text elements
	removeText() {
		while (this._textRef.current.firstChild) {
			this._textRef.current.removeChild(this._textRef.current.firstChild);
		}
	}

	// add text element
	addTextLine(ln) {
		let tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
		tspan.setAttribute('x','0');
		tspan.setAttribute('dy','1.2em'); 
		tspan.textContent = ln;
		this._textRef.current.appendChild(tspan);
	}

	// draw cursor line for text
	drawCursor(x, y, height) {
		const cln = this._cursorRef.current;
		cln.setAttribute('x1', x);
		cln.setAttribute('y1', y);
		cln.setAttribute('x2', x);
		cln.setAttribute('y2', y + height);
	}

	// draw bounding box around text
	drawTextBoundingBox(bBox) {
		const x = bBox.x - this._boxPadding;
		const y = bBox.y - this._boxPadding;
		const width = bBox.width + this._boxPadding * 2;
		const height = bBox.height + this._boxPadding * 2;

		const box = this._boxRef.current;
		box.setAttribute('x', x);
		box.setAttribute('y', y);
		box.setAttribute('width', width);
		box.setAttribute('height', height);
	}

	editStart(e) {
		this._editRef.current.value = this.props.text.text;
	}

	editChange(e) {
		this.removeText();
		let txt = this._editRef.current.value;
		let ln = '';
		for (let i = 0; i < txt.length; i++) {
			ln += txt[i];
			if ('\n' === txt[i]) {
				this.addTextLine(ln);
				ln = '';
			}
		}
		if (ln.length > 0) {
			this.addTextLine(ln);
		}
	}

	editShowCursor() {
		if (0 === this._selectionEnd) {
			return;
		}
		try {
			const cr = this._textRef.current.getExtentOfChar(this._selectionEnd-1);
			this.drawCursor(cr.x + cr.width, cr.y, cr.height);

			const bb = this._textRef.current.getBBox();
			this.drawTextBoundingBox(bb);

		} catch (error) {
			console.log(error);			
		}
	}

	editKeyUp(e) {
		this._selectionStart = this._editRef.current.selectionStart;
		this._selectionEnd = this._editRef.current.selectionEnd;
		this.editShowCursor();
	}

	editEnd(e) {
		if (null === this.props.onEditDone) {
			return;
		}
        let tx = this._editRef.current.value.trim();
		var bb = this._textRef.current.getBBox();
		console.log(bb);
        this.removeText();
		this.props.onEditDone(
			this.props.text.id, tx, 
			bb.x, bb.y,
			bb.width, bb.height
		);
	}

	editBox(isEdit, box) {
		if (!isEdit) {
			return null;
		}
		return (
			<EditBox box={box} showBox={true} showResize={false} />
		)
	}

	editor(tx) {
		if (!tx.isTextEdit) {
			return null;
		}
		return (
			<React.Fragment>
				<line ref={this._cursorRef} strokeWidth="8" />
				<rect ref={this._boxRef} className="editBox" x="0" y="0" width={tx.width} height={tx.height} />
				<foreignObject>
					<textarea ref={this._editRef} onFocus={this.editStart} onInput={this.editChange} onKeyUp={this.editKeyUp} onBlur={this.editEnd}></textarea>
				</foreignObject>
			</React.Fragment>
		)
	}

	renderLines(tx){
		// don't render lines in edit mode, created manually
		if (tx.isTextEdit) {
			return null;
		}
		let lines = tx.text.split("\n");
		return lines.map((ln, index) => {
			return (
				<tspan key={index} data-ref={tx.id} x="0" dy="1.2em">{ln}</tspan>
			);
		});
	}

	render() {
		const tx = this.props.text;
        const className = 'txt'+ tx.size + ' pc' + tx.color;
        let transform = 'translate('+ tx.x + ',' + tx.y + ')';
        if (0 !== tx.rotation) {
			let cx = tx.bx + tx.bwidth / 2;
			let cy = tx.by + tx.bheight / 2;
            transform += ' rotate('+ tx.rotation + ',' + cx + ',' + cy + ')';
        }
		return (
			<g className={className} transform={transform}>
				<text ref={this._textRef} data-ref={tx.id} xmlSpace="preserve">
					{this.renderLines(tx)}
				</text>
				{this.editor(tx)}
				{this.editBox(tx.isEdit, tx.box)}
			</g>
		);
	}
}

TextEdit.defaultProps = {
	text: null,
	onEditDone: null
}

TextEdit.propTypes = {
	text: PropTypes.instanceOf(Text),
	onEditDone: PropTypes.func
}

export default TextEdit;