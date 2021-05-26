import React from 'react';
import './App.css';
import StatusTab from './components/StatusTab';
import { MessageProvider } from "./contexts/MessageContext";

function App() {
  return (
    <div className="App">
      <MessageProvider>
        <StatusTab /> 
      </MessageProvider>
    </div>
  );
}

export default App;
