import './App.css';
import RectangleVisu from "./components/RectangleVisu";
import { MessageProvider } from "./contexts/messageContext";

function App() {
  return (
    <div className="App">
      <MessageProvider>
        <RectangleVisu />
      </MessageProvider>
    </div>
  );
}

export default App;
