import React, { Fragment, useContext, useEffect } from 'react'
import 'semantic-ui-css/semantic.min.css'
import NavBar from '../../features/nav/NavBar';
import MatchesPage from '../../features/matches/MatchesPage';
import { Container } from 'semantic-ui-react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import ModalContainer from '../common/modals/ModalContainer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../stores/rootStore';
import PredictionPage from '../../features/predictions/PredictionPage';


const App = () => {

  const rootStore = useContext(RootStoreContext);
  const { getUser } = rootStore.userStore;

  useEffect(() => {
    if (window.localStorage.getItem('jwt')) {
      getUser();
    }
  }, [getUser]);

  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position='bottom-right' />
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <Route exact path='/'>
          <Redirect to='/matches' />
        </Route>
        <Route path={'/(.+)'} render={() => {
          return (
            <Fragment>
              <Switch>
                <Route exact path='/matches' component={MatchesPage} />
                <Route path='/matches/:id' component={PredictionPage} />
                <Route render={()=><h1>ERROR 404</h1>}/>
              </Switch>
            </Fragment>
          )
        }} />
      </Container>
    </Fragment>
  )
}

export default observer(App);

