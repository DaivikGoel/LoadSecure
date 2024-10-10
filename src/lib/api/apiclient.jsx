import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import JSONBig from 'json-bigint';
import secrets from 'secrets';

const baseURL = secrets.API_URL;

axios.defaults.withCredentials = true;

const defaultOptions = {
  baseURL,
};

JSON.parse = JSONBig.parse;
JSON.stringify = JSONBig.stringify;

const ApiClient = axios.create(defaultOptions);

export default ApiClient;
