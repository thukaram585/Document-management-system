// client/src/App.js

import React from 'react';
import './App.css';
import UploadFile from './components/UploadFile';
import ListFiles from './components/ListFiles';

function App() {
  return (
    <div className="App">
      <UploadFile />
      <ListFiles />
    </div>
  );
}

export default App;
