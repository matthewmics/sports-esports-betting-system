import React, { useState, useEffect, Fragment } from 'react'
import { ITeam } from '../models/team';
import axios, { AxiosResponse } from 'axios';
import 'semantic-ui-css/semantic.min.css'
import { List, Image, Container } from 'semantic-ui-react'
import { NavBar } from '../../features/nav/NavBar';

const App = () => {

  const [teams, setTeams] = useState<ITeam[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/teams').then((response: AxiosResponse<ITeam[]>) => {
      setTeams(response.data);
    })
  }, []);

  return (
    <Fragment>
      <NavBar />
      <Container />
    </Fragment>
  )
}


export default App;

