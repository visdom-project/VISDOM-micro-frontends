import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import CalendarTab from "./components/CalendarTab";
import store from "./store";

function App() {

  return (
    <Provider store={store}>
      <div className={'App'}>
        <CalendarTab />
      </div>
    </Provider>
  );
}

export default App;
