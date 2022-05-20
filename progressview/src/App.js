import React from "react";
import "./App.css";
import ProgressTab from "./components/ProgressTab";
import { MessageProvider } from "./contexts/MessageContext";

function App() {
  return (
    <div className="App">
      <MessageProvider>
        <ProgressTab />
      </MessageProvider>
    </div>
  );
}

export default App;
