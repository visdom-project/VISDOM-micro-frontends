import React from "react";
import "./App.css";
import CumulativeTab from "./components/CumulativeTab";
import { MessageProvider } from "./contexts/MessageContext";

function App() {
  return (
    <div className="App">
      <MessageProvider>
        <CumulativeTab />
      </MessageProvider>
    </div>
  );
}

export default App;
