import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { IMatch } from "../models/match";
import { IActivePrediction, IPredictionDetails } from "../models/prediction";
import { IUser, IUserFormValues } from "../models/user";

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }

    return config;
  },
  (error) =>
    Promise.reject(error)
)

axios.interceptors.response.use(undefined, error => {

  if (error.message === "Network Error" && !error.response) {
    toast.error("Network Error occured");
    return;
  }

  throw error.response;

})

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

export const Matches = {
  list: (): Promise<IMatch[]> => requests.get(`/matches`),
  get: (id: number): Promise<IMatch> => requests.get(`/matches/${id}`),
  predict: (matchId: number, predictionId: number, teamId: number, amount: number)
    : Promise<IActivePrediction> =>
    requests.post(`/matches/${matchId}/predictions/${predictionId}/predict`, {
      amount: amount,
      teamId: teamId
    }),
  updatePrediction: (matchId: number, predictionId: number, teamId: number, amount: number)
    : Promise<IActivePrediction> =>
    requests.put(`/matches/${matchId}/predictions/${predictionId}/predict`, {
      amount: amount,
      teamId: teamId
    }),
  unpredict: (matchId: number, predictionId: number) =>
    requests.delete(`/matches/${matchId}/predictions/${predictionId}/predict`),
  predictionDetails:
    (matchId: number, predictionId: number)
      : Promise<IPredictionDetails> =>
      requests.get(`/matches/${matchId}/predictions/${predictionId}/details`),
};

export const User = {
  login: (formValues: IUserFormValues): Promise<IUser> =>
    requests.post('/user/login', formValues),
  register: (values: IUserFormValues): Promise<IUser> =>
    requests.post('/user/register', values),
  current: (): Promise<IUser> => requests.get('/user')
};

const agent = {
  Matches, User
}

export default agent;