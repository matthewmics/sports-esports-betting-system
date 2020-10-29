import React, { Fragment } from 'react'
import 'semantic-ui-css/semantic.min.css'
import NavBar from '../../features/nav/NavBar';
import MatchesPage from '../../features/matches/MatchesPage';
import { Container } from 'semantic-ui-react';
import { Redirect, Route } from 'react-router-dom';
import ModalContainer from '../common/modals/ModalContainer';

const App = () => {
  return (
    <Fragment>
      <ModalContainer />
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

export default App;

