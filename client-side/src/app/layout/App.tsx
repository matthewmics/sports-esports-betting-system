import React, { Fragment, useContext, useEffect } from 'react'
import 'semantic-ui-css/semantic.min.css'
import NavBar from '../../features/nav/NavBar';
import MatchesPage from '../../features/matches/MatchesPage';
import { Container } from 'semantic-ui-react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ModalContainer from '../common/modals/ModalContainer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../stores/rootStore';
import PredictionPage from '../../features/predictions/PredictionPage';
import axios from 'axios';
import ProfilePage from '../../features/profiles/ProfilePage';
import ErrorModalContainer from '../common/modals/ErrorModalContainer';
import { getJwtToken } from '../common/util/security';



const App = () => {

  axios.interceptors.request.use(
    (config) => {
      const token = getJwtToken();
      if (token) {
        config.headers.Authorization = "Bearer " + token;
      }

      return config;
    },
    (error) =>
      Promise.reject(error)
  )


  const rootStore = useContext(RootStoreContext);
  const { getUser } = rootStore.userStore;

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <Fragment>
      <ErrorModalContainer />
      <ModalContainer />
      <ToastContainer position='bottom-right' pauseOnFocusLoss={false} />
      <NavBar />
      <Container style={{ paddingTop: '7em' }}>
        <Route exact path='/'>
          <Redirect to='/matches' />
        </Route>
        <Route path={'/(.+)'} render={() => {
          return (
            <Fragment>
              <Switch>
                <Route exact path='/matches' component={MatchesPage} />
                <Route path='/matches/:id' component={PredictionPage} />
                <Route path='/profile' component={ProfilePage} />
                <Route render={() => <h1>ERROR 404</h1>} />
              </Switch>
            </Fragment>
          )
        }} />
      </Container>
    </Fragment>
  )
}

export default observer(App);

