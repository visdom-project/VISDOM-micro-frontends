import axios from "axios";
import { configConfiguration } from "./serviceConfiguration";

// eslint-disable-next-line no-undef
const baseUrl = configConfiguration.createUrl(`v1/confiurations/${MICROFRONTEND_KEY}`);

export const getConfigurationsList = () => {
    // eslint-disable-next-line no-undef
    // const baseUrl = configConfiguration.createUrl(`v1/confiurations/${MICROFRONTEND_KEY}`);
    return axios.get(baseUrl).then(response => response.data);
};

export const getConfiguration = (configName) => {
    // eslint-disable-next-line no-undef
    // const baseUrl = configConfiguration.createUrl(`v1/confiurations/${MICROFRONTEND_KEY}`);
    const requestConfig = {
        headers:{
            "config-name": configName,
        }
    };
    return axios.get(baseUrl, requestConfig).then(response => response.data);
};

export const createConfig = (configName, config) => {
    const data = {
        name: configName,
        config: config,
    };
    return axios.post(baseUrl, data).then(response => response.data);
};