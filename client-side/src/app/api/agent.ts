import axios, { AxiosResponse } from "axios";
import { ITeam } from "../models/team";

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

const Teams = {
    list: (url: string): Promise<ITeam[]> => requests.get(`/teams`)
};

const Matches = {
    list: (url: string): Promise<ITeam[]> => requests.get(`/matches`)
};

export default {
    Teams,
    Matches
}