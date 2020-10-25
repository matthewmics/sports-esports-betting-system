import axios, { AxiosResponse } from "axios";
import { IMatch } from "../models/match";

axios.defaults.baseURL = "http://localhost:5000/api";

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => resolve(response), ms)
  );

const requests = {
  get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
  post: (url: string, body: {}) =>
    axios.post(url, body).then(sleep(1000)).then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(sleep(1000)).then(responseBody),
  delete: (url: string) =>
    axios.delete(url).then(sleep(1000)).then(responseBody),
};

// const Teams = {
//     list: (): Promise<ITeam[]> => requests.get(`/teams`)
// };

export const Matches = {
    list: (): Promise<IMatch[]> => requests.get(`/matches`)
};

const agent = {
  Matches
}

export default agent;