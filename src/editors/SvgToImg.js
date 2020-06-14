import React, { Component } from 'react';
import FileSaver from 'browser-filesaver';

class SvgToImg extends Component {
	constructor(props) {
		super(props);
		this._refRenderer = React.createRef();
	}
	
	// create image from svg text
	toImg(svgText, orgWidth, orgHeight, imgWidth, imgHeight) {
		// Create Canvas
		let canvas = document.createElement('canvas');
		canvas.width = imgWidth;
		canvas.height = imgHeight;
		let ctx = canvas.getContext("2d");

		// show canvas
		//this._refRenderer.current.appendChild(canvas);

		// Create image
		let img = document.createElement('img');
		// when loaded draw and save
		img.addEventListener('load', e=> {
			// draw image
			ctx.drawImage(img,
				0, 0, orgWidth, orgHeight,
				//0, 0, imgWidth, imgHeight
				0, 0, orgWidth, orgHeight
			);
			// save image
			canvas.toBlob(function(blob) {
				FileSaver.saveAs(blob, "tactics-board.png");
			});
			// clear everything
			this._refRenderer.current.innerHTML = '';
		});

		// prepare svg to load image
		const encodedString = 'data:image/svg+xml;base64,' + new Buffer(svgText).toString('base64');
		img.src = encodedString;	// start loading image
	}

	render() {
		return (
			<div ref={this._refRenderer} style={{display:"none"}}></div>
		);
	}
}

export default SvgToImg;