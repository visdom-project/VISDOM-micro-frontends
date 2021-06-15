import * as React from "react";
import {
  CONNECTION_CHANGE,
  ACTION_SELECT_INSTANCE,
  ACTION_CHANGE_TIMESCALE,
  MESSAGE_RECEIVED,
} from "./types";

const MessageContext = React.createContext();
const MessageDispatchContext = React.createContext();

function MessageReducer(state, action) {
  switch (action.type) {
    case CONNECTION_CHANGE: {
      return { ...state, connected: action.payload };
    }
    case ACTION_SELECT_INSTANCE: {
      return { ...state };
    }
    case ACTION_CHANGE_TIMESCALE: {
      return { ...state };
    }
    case MESSAGE_RECEIVED: {
      const message = JSON.parse(action.payload.message.toString());
      let instances = message.instances ? message.instances : state.instances;
      let mode = message.mode ? message.mode : state.mode;
      let timescale = message.timescale ? message.timescale : state.timescale;

      return {
          ...state,
          instances: instances,
          mode: mode,
          timescale: timescale,
      };
    }
    default: {
      throw new Error("Unhandled action type:" + action.type);
    }
  }
}

// eslint-disable-next-line react/prop-types
function MessageProvider({ children }) {
  const [state, dispatch] = React.useReducer(MessageReducer, {
    connected: false,
    instances: [],
    timescale: null,
    mode: null,
  });

  return (
    <MessageContext.Provider value={state}>
      <MessageDispatchContext.Provider value={dispatch}>
        {children}
      </MessageDispatchContext.Provider>
    </MessageContext.Provider>
  );
}

function useMessageState() {
  const context = React.useContext(MessageContext);

  if (context === undefined) {
    throw new Error("useMessageState must be used within a MessageProvider");
  }

  return context;
}

function useMessageDispatch() {
  const context = React.useContext(MessageDispatchContext);

  if (context === undefined) {
    throw new Error(
      "useMessageDispatch must be used within a MessageDispatchContext"
    );
  }

  return context;
}

async function updateConnectionStatus(dispatch, status) {
  dispatch({ type: CONNECTION_CHANGE, payload: status });
}

async function receiveMessage(dispatch, messageObj) {
  dispatch({ type: MESSAGE_RECEIVED, payload: messageObj });
}

export {
  MessageProvider,
  useMessageState,
  useMessageDispatch,
  updateConnectionStatus,
  receiveMessage,
};
