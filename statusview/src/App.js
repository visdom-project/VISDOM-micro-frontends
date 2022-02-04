import React from "react";
import "./App.css";
import MultiStatusChartContainer from "./components/MultiStatusChartContainer"
import { MessageProvider } from "./contexts/MessageContext";

function App() {
  return (
    <div className="App">
      <MessageProvider>
        <MultiStatusChartContainer />
      </MessageProvider>
    </div>
  );
}

export default App;
