import React from "react";
import "./App.css";
import { MessageProvider } from "./contexts/MessageContext";
import StudentTab from "./components/StudentTab";

function App() {
  return (
      <MessageProvider>
        <StudentTab />
      </MessageProvider>
  );
}

export default App;
