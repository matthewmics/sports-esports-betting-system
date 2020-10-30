import React, { Fragment, useContext, useEffect } from 'react'
import 'semantic-ui-css/semantic.min.css'
import NavBar from '../../features/nav/NavBar';
import MatchesPage from '../../features/matches/MatchesPage';
import { Container } from 'semantic-ui-react';
import { Redirect, Route } from 'react-router-dom';
import ModalContainer from '../common/modals/ModalContainer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../stores/rootStore';

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
        <Route path='/'>
          <Redirect to='/matches' />
        </Route>
        <Route path='/matches' component={MatchesPage} />
      </Container>
    </Fragment>
  )
}

export default observer(App);

