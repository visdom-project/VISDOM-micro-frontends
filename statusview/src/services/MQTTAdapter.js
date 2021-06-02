import MQTT from "async-mqtt";
import { MQTTConfiguration } from "./serviceConfiguration";
import {
  updateConnectionStatus,
  receiveMessage,
} from "../contexts/MessageContext";

const MQTT_ADDR = MQTTConfiguration.createUrl("");

const MQTT_EVENTS = {
  CONNECT: "connect",
  RECONNECT: "reconnect",
  DISCONNECT: "disconnect",
  OFFLINE: "offline",
  ERROR: "error",
  MESSAGE: "message",
};
const MQTT_TOPIC = "VISDOM";

const setupMQTTClient = (client, dispatch) => {
  client.on(MQTT_EVENTS.CONNECT, () => updateConnectionStatus(dispatch, true));
  client.on(MQTT_EVENTS.DISCONNECT, () =>
    updateConnectionStatus(dispatch, false)
  );
  client.on(MQTT_EVENTS.OFFLINE, () => updateConnectionStatus(dispatch, false));
  client.on(MQTT_EVENTS.ERROR, () => updateConnectionStatus(dispatch, false));
  client.on(MQTT_EVENTS.MESSAGE, (topic, message, packet) =>
    receiveMessage(dispatch, {
      topic: topic,
      message: message,
      packet: packet,
    })
  );

  client.subscribe(MQTT_TOPIC);
};

export const MQTTConnect = (dispatch) => {
  return MQTT.connectAsync(MQTT_ADDR)
    .then((client) => {
      updateConnectionStatus(dispatch, true);
      setupMQTTClient(client, dispatch);
      return client;
    })
    .catch((error) => {
      console.log("MQTT connection error:", error);
      updateConnectionStatus(dispatch, false);
    });
};

export const publishMessage = (client, messageObj) => {
  return client.publish(MQTT_TOPIC, JSON.stringify(messageObj));
};
