import React from "react";
import "./App.css";
import { MessageProvider } from "./contexts/MessageContext";
import ControlForm from "./components/ControlForm";

function App() {
  return (
      <MessageProvider>
        <ControlForm />
      </MessageProvider>
  );
}

export default App;
