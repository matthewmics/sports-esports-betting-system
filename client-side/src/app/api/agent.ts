import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { IDashboardDto } from "../models/admin";
import { IPaypalDepositResult } from "../models/fund";
import { IComment, IMatch, IMatchEnvelope, IMatchForm, IMatchPredictionRecent, IMatchRecent } from "../models/match";
import { IActivePrediction, IPredictionCreateForm, IPredictionDetails } from "../models/prediction";
import { IProfileChangePhotoResult, IProfilePredictionStats, IUserPredictionEnvelope, IWagererTransaction, IWagererTransactionEnvelope } from "../models/profile";
import { ITeamEnvelope, ITeamFormValues } from "../models/team";
import { IUser, IUserAdmin, IUserFormValues } from "../models/user";
import { IWagererDataEnvelope } from "../models/wagerer";

export const apiUrl = 'https://localhost:5000';
//export const ApiUrl = 'https://898b9eef9af8.ngrok.io';

axios.defaults.baseURL = apiUrl + '/api';
const sleepDuration = 500;

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
  get: (url: string) => axios.get(url).then(sleep(sleepDuration)).then(responseBody),
  post: (url: string, body: {}) =>
    axios.post(url, body).then(sleep(sleepDuration)).then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(sleep(sleepDuration)).then(responseBody),
  delete: (url: string) =>
    axios.delete(url).then(sleep(sleepDuration)).then(responseBody),
};

const Matches = {
  list: (urlParams: URLSearchParams): Promise<IMatchEnvelope> =>
    axios.get(`/matches`, { params: urlParams })
      .then(sleep(sleepDuration))
      .then(responseBody),
  get: (id: number): Promise<IMatch> => requests.get(`/matches/${id}`),
  create: (match: IMatchForm): Promise<IMatch> =>
    requests.post(`/matches`, match),
  recentComments: (matchId: number): Promise<IComment[]> =>
    requests.get(`/matches/${matchId}/comments/recent`),
  recentMatches: (): Promise<IMatchRecent[]> =>
    requests.get(`/matches/recent`),
  recentMatchPredictions: (id: number): Promise<IMatchPredictionRecent[]> =>
    requests.get(`/matches/${id}/recentPrediction`)
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
  readNotification: (id: number): Promise<void> =>
    requests.post(`/predictions/notifications/${id}/read`, {}),
  setLive: (predictionId: number): Promise<void> =>
    requests.post(`/predictions/${predictionId}/setLive`, {}),
  reschedule: (predictionId: number, schedule: string): Promise<void> =>
    requests.post(`/predictions/${predictionId}/reschedule`, { schedule: schedule }),
  settle: (predictionId: number, teamId: number): Promise<void> =>
    requests.post(`/predictions/${predictionId}/settle`, { teamId: teamId }),
  cancel: (predictionId: number): Promise<void> =>
    requests.post(`/predictions/${predictionId}/cancel`, {}),
  create: (values: IPredictionCreateForm): Promise<void> =>
    requests.post(`/predictions`, values),
}

const User = {
  login: (formValues: IUserFormValues): Promise<IUser> =>
    requests.post('/user/login', formValues),
  register: (values: IUserFormValues): Promise<IUser> =>
    requests.post('/user/register', values),
  current: (): Promise<IUser> => requests.get('/user'),
};

const Admin = {
  login: (formValues: IUserFormValues): Promise<IUserAdmin> =>
    requests.post('/admin/login', formValues),
  current: (): Promise<IUser> => requests.get('/admin'),
  dashboard: (): Promise<IDashboardDto> =>
    requests.get(`/admin/dashboard`)
}

const Teams = {
  list: (urlParams: URLSearchParams): Promise<ITeamEnvelope> =>
    axios.get(`/teams`, { params: urlParams }).then(sleep(sleepDuration)).then(responseBody),
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
      .then(sleep(sleepDuration)).then(responseBody)
  },
  delete: (id: number): Promise<void> =>
    requests.delete(`/teams/${id}`),
  changeImage: (file: Blob, id: number) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`/teams/${id}/changeimage`, formData, { headers: { "Content-type": "multipart/form-data" } })
      .then(sleep(sleepDuration)).then(responseBody)
  }
}

const Profile = {
  listPredictions: (params: URLSearchParams): Promise<IUserPredictionEnvelope> =>
    axios.get(`/profile/predictions`, { params: params })
      .then(sleep(sleepDuration))
      .then(responseBody),
  getPredictionStats: (): Promise<IProfilePredictionStats> =>
    requests.get(`/profile/predictionStats`),
  changePhoto: (file: Blob): Promise<IProfileChangePhotoResult> => {
    var formData = new FormData();
    formData.append('File', file);
    return axios.post(`/profile/changePhoto`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then(sleep(sleepDuration))
      .then(responseBody);
  },
  listTransactions: (params: URLSearchParams): Promise<IWagererTransactionEnvelope> =>
    axios.get(`/profile/transactions`, { params: params })
      .then(sleep(sleepDuration))
      .then(responseBody)
}

const Funds = {
  paypalDeposit: (amount: number): Promise<IPaypalDepositResult> =>
    requests.post(`/funds/paypal/deposit`, { amount: amount }),
  // paypalCapture: (orderId: string): Promise<void> =>
  //   requests.post(`/funds/paypal/captureDeposit`, { orderId: orderId }),
  paypalWithdraw: (amount: number, email: string): Promise<IWagererTransaction> =>
    requests.post(`/funds/paypal/withdraw`, { amount: amount, email: email }),
};

const Wagerers = {
  list: (params: URLSearchParams): Promise<IWagererDataEnvelope> =>
    axios.get(`/wagerers`, { params: params })
      .then(sleep(sleepDuration))
      .then(responseBody),
  ban: (id: string): Promise<void> =>
    requests.post(`/wagerers/${id}/ban`, {}),
  unban: (id: string): Promise<void> =>
    requests.post(`/wagerers/${id}/unban`, {})
}

const agent = {
  Matches,
  User,
  Teams,
  Predictions,
  Profile,
  Funds,
  Wagerers,
  Admin
}

export default agent;