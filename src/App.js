import React from 'react';
import PitchEdit from './editors/PitchEdit'
import './App.css';

function App() {
	return (
		<div className="pitch">
			<PitchEdit noPlayers={4} />
		</div>
	);
}

export default App;
