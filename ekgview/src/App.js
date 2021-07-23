import React from "react";
import "./App.css";
import EKGTab from "./components/EKGTab";
import { MessageProvider } from "./contexts/MessageContext";



function App() {
  return (
    <div className="App">
      <MessageProvider>
        <EKGTab />
      </MessageProvider>
    </div>
  );
}

export default App;
