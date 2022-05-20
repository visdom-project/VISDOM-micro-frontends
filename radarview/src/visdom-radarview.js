import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import "./set-public-path";
import "./index.css";
import App from "./App";

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App,
  /* eslint-disable no-unused-vars */
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return null;
  },
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
