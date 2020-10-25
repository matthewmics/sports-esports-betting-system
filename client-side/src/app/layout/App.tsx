import React, { useState, useEffect, Fragment } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { NavBar } from '../../features/nav/NavBar';
import MatchesPage from '../../features/matches/MatchesPage';
import { Container } from 'semantic-ui-react';

const App = () => {
  return (
    <Fragment>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <MatchesPage />
      </Container>
    </Fragment>
  )
}

export default App;

