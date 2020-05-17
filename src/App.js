import React from 'react';
import Pitch from './Pitch'
import './App.css';

function App() {
	return (
		<div className="pitch">
			<Pitch noPlayers={4} />
		</div>
	);
}

export default App;
