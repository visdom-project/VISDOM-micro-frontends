import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import CalendarTab from "./components/CalendarTab";
import store from "./store";
import { MessageProvider } from "./contexts/MessageContext";

function App() {

  return (
    <MessageProvider>
      <Provider store={store}>
        <div className={'App'}>
          <CalendarTab />
        </div>
      </Provider>
    </MessageProvider>
  );
}

export default App;
