import React, { Component } from 'react';
import FileSaver from 'browser-filesaver';
import { Buffer } from 'buffer';

class SvgToImg extends Component {
	
	async toBlob(svgText, orgWidth, orgHeight, imgWidth, imgHeight) {
		return new Promise( (resolve, reject) => {
			// Create image
			const img = document.createElement('img');
			// when loaded draw and save
			img.addEventListener('load', e=> {
				try {
					const canvas = document.createElement('canvas');
					canvas.width = imgWidth;
					canvas.height = imgHeight;
	
					// draw image
					const ctx = canvas.getContext("2d");
					ctx.drawImage(
						img,	//e.target,
						0, 0, orgWidth, orgHeight,
						0, 0, orgWidth, orgHeight
					);
					// resolve save image
					canvas.toBlob((blob) => {
						resolve(blob)
					});
				} catch (error) {
					reject(error);
				}
			});

			// prepare svg to load image
			const encodedString = 'data:image/svg+xml;base64,' + Buffer.from(svgText).toString('base64');
			img.onerror = reject;		// setup rejection
			img.src = encodedString;	// start loading image
		});
	}

	// save image from svg text to file
	async toImg(svgText, orgWidth, orgHeight, imgWidth, imgHeight) {
		try {
			const blob = await this.toBlob(svgText, orgWidth, orgHeight, imgWidth, imgHeight);
			FileSaver.saveAs(blob, "tactics-board.png");
		} catch (error) {
			console.error("Error saving image",error);			
		}
	}

	render() {
		return (<div style={{display:"block"}}></div>);
	}
}

export default SvgToImg;