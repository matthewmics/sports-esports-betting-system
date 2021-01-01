import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { IComment, IMatch, IMatchEnvelope, IMatchForm } from "../models/match";
import { IActivePrediction, IPrediction, IPredictionCreateForm, IPredictionDetails } from "../models/prediction";
import { IProfileChangePhotoResult, IProfilePredictionStats, IUserPredictionEnvelope } from "../models/profile";
import { ITeamEnvelope, ITeamFormValues } from "../models/team";
import { IUser, IUserAdmin, IUserFormValues } from "../models/user";

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.response.use(undefined, error => {

  if (error.message === "Network Error" && !error.response) {
    toast.error("Network Error occured");
    return;
  }

  const { status, config, data } = error.response;
  if (status === 404) {
    history.push("/notfound");
  }

  if (
    status === 400 &&
    config.method === "get" &&
    data.errors.hasOwnProperty("id")
  ) {
    history.push("/notfound");
    toast.error("You have sent an invalid request.");
  }
  if (status === 500) {
    toast.error("We could not process your request at the moment.");
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
  get: (url: string) => axios.get(url).then(sleep(500)).then(responseBody),
  post: (url: string, body: {}) =>
    axios.post(url, body).then(sleep(500)).then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(sleep(500)).then(responseBody),
  delete: (url: string) =>
    axios.delete(url).then(sleep(500)).then(responseBody),
};

const Matches = {
  list: (urlParams: URLSearchParams): Promise<IMatchEnvelope> =>
    axios.get(`/matches`, { params: urlParams })
      .then(sleep(500))
      .then(responseBody),
  get: (id: number): Promise<IMatch> => requests.get(`/matches/${id}`),
  create: (match: IMatchForm): Promise<IMatch> =>
    requests.post(`/matches`, match),
  recentComments: (matchId: number): Promise<IComment[]> =>
    requests.get(`/matches/${matchId}/comments/recent`)
};

const Predictions = {
  predict: (predictionId: number, teamId: number, amount: number)
    : Promise<IActivePrediction> =>
    requests.post(`/predictions/${predictionId}/predict`, {
      amount: amount,
      teamId: teamId
    }),
  updatePrediction: (predictionId: number, teamId: number, amount: number)
    : Promise<IActivePrediction> =>
    requests.put(`/predictions/${predictionId}/predict`, {
      amount: amount,
      teamId: teamId
    }),
  unpredict: (predictionId: number) =>
    requests.delete(`/predictions/${predictionId}/predict`),
  predictionDetails:
    (predictionId: number)
      : Promise<IPredictionDetails> =>
      requests.get(`/predictions/${predictionId}/details`),
  setLive: (predictionId: number): Promise<void> =>
    requests.post(`/predictions/${predictionId}/setLive`, {}),
  reschedule: (predictionId: number, schedule: string): Promise<void> =>
    requests.post(`/predictions/${predictionId}/reschedule`, { schedule: schedule }),
  settle: (predictionId: number, teamId: number): Promise<void> =>
    requests.post(`/predictions/${predictionId}/settle`, { teamId: teamId }),
  cancel: (predictionId: number): Promise<void> =>
    requests.post(`/predictions/${predictionId}/cancel`, {}),
  create: (values: IPredictionCreateForm): Promise<IPrediction> =>
    requests.post(`/predictions`, values),
}

const User = {
  login: (formValues: IUserFormValues): Promise<IUser> =>
    requests.post('/user/login', formValues),
  adminLogin: (formValues: IUserFormValues): Promise<IUserAdmin> =>
    requests.post('/user/admin/login', formValues),
  register: (values: IUserFormValues): Promise<IUser> =>
    requests.post('/user/register', values),
  current: (): Promise<IUser> => requests.get('/user'),
  currentAdmin: (): Promise<IUser> => requests.get('/user/admin'),
};

const Teams = {
  list: (urlParams: URLSearchParams): Promise<ITeamEnvelope> =>
    axios.get(`/teams`, { params: urlParams }).then(sleep(500)).then(responseBody),
  get: (id: number) =>
    requests.get(`/teams/${id}`),
  update: (id: number, values: ITeamFormValues) =>
    requests.put(`/teams/${id}`, values),
  create: (formValues: ITeamFormValues): Promise<void> => {
    const formData = new FormData();
    if (formValues.file)
      formData.append("file", formValues.file)
    formData.append("name", formValues.name)
    return axios.post(`/teams`, formData, { headers: { "Content-type": "multipart/form-data" } })
      .then(sleep(500)).then(responseBody)
  },
  delete: (id: number): Promise<void> =>
    requests.delete(`/teams/${id}`),
  changeImage: (file: Blob, id: number) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`/teams/${id}/changeimage`, formData, { headers: { "Content-type": "multipart/form-data" } })
      .then(sleep(500)).then(responseBody)
  }
}

const Profile = {
  listPredictions: (params: URLSearchParams): Promise<IUserPredictionEnvelope> =>
    axios.get(`/profile/predictions`, { params: params })
      .then(sleep(500))
      .then(responseBody),
  getPredictionStats: (): Promise<IProfilePredictionStats> =>
    requests.get(`/profile/predictionStats`),
  changePhoto: (file: Blob): Promise<IProfileChangePhotoResult> => {
    var formData = new FormData();
    formData.append('File', file);
    return axios.post(`/profile/changePhoto`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then(sleep(500))
      .then(responseBody);
  }

}

const agent = {
  Matches, User, Teams, Predictions, Profile
}

export default agent;