import React from 'react';
import PitchEdit from './editors/PitchEdit'
import './App.css';

function App() {
	return (
		<PitchEdit noPlayers={200} noBalls={100} viewBoxLeft={0} viewBoxTop={0} viewBoxRight={4300} viewBoxBottom={2300} />
	);
}

export default App;
