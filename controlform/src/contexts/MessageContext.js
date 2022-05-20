import * as React from "react";
import {
  CONNECTION_CHANGE,
  ACTION_SELECT_INSTANCE,
  ACTION_CHANGE_TIMESCALE,
  MESSAGE_RECEIVED,
  UPDATE_LOCAL_STATE,
} from "./types";

const MessageContext = React.createContext();
const MessageDispatchContext = React.createContext();

const MessageReducer = (state, action) => {
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
      const instances = message.instances ? message.instances : state.instances;
      const timescale = message.timescale ? message.timescale : state.timescale;
      const mode = message.mode ? message.mode : state.mode;

      return {
        ...state,
        instances: instances,
        timescale: timescale,
        mode: mode,
      };
    }
    case UPDATE_LOCAL_STATE: {
      const instances = action.payload.instances ? action.payload.instances : state.instances;
      const timescale = action.payload.timescale ? action.payload.timescale : state.timescale;
      const mode = action.payload.mode ? action.payload.mode : state.mode;
      return {
        ...state,
        instances: instances,
        timescale: timescale,
        mode: mode,
      };
    }
    default: {
      throw new Error(`Unhandled action type:${action.type}`);
    }
  }
};

// eslint-disable-next-line react/prop-types
const MessageProvider = ({ children }) => {
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
};

const useMessageState = () => {
  const context = React.useContext(MessageContext);

  if (context === undefined) {
    throw new Error("useMessageState must be used within a MessageProvider");
  }
  return context;
};

const useMessageDispatch = () => {
  const context = React.useContext(MessageDispatchContext);
  if (!context) {
    throw new Error(
      "useMessageDispatch must be used within a MessageDispatchContext"
    );
  }
  return context;
};

const updateConnectionStatus = async (dispatch, status) => {
  dispatch({ type: CONNECTION_CHANGE, payload: status });
};


async function receiveMessage(dispatch, messageObj) {
  dispatch({ type: MESSAGE_RECEIVED, payload: messageObj });
}

async function updateLocalState(dispatch, stateObj) {
  dispatch({ type: UPDATE_LOCAL_STATE, payload: stateObj });
}

export {
  MessageProvider,
  useMessageState,
  useMessageDispatch,
  updateConnectionStatus,
  receiveMessage,
  updateLocalState,
};
