import './App.css';
import RectangleVisu from "./components/RectangleVisu";
import { MessageProvider } from "./contexts/messageContext";
import 'bootstrap/dist/css/bootstrap.min.css';

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
