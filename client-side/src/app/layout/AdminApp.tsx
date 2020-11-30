import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext, useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AdminLoginPage from '../../features/admin/AdminLoginPage';
import AdminNavBar from '../../features/nav/AdminNavBar';
import AdminSideBar from '../../features/nav/AdminSideBar';
import { LoadingComponent } from '../common/LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import { RootStoreContext } from '../stores/rootStore';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { AdminDashboard } from '../../features/admin/AdminDashboard';
import UpcomingMatchesPage from '../../features/admin/matches/UpcomingMatchesPage';
import { LiveMatchesPage } from '../../features/admin/matches/LiveMatchesPage';
import TeamsPage from '../../features/admin/tables/Team/TeamsPage';
import TeamForm from '../../features/admin/tables/Team/TeamForm';


const AdminApp = () => {

    axios.interceptors.request.use(
        (config) => {
            const token = window.localStorage.getItem("jwt_admin");
            if (token) {
                config.headers.Authorization = "Bearer " + token;
            }

            return config;
        },
        (error) =>
            Promise.reject(error)
    )

    const rootStore = useContext(RootStoreContext);
    const { loadingUser, getCurrentAdmin } = rootStore.adminUserStore;

    useEffect(() => {
        getCurrentAdmin();
    }, [getCurrentAdmin])

    if (loadingUser)
        return <LoadingComponent content='Loading...' />

    return (
        <Fragment>
            <ModalContainer />
            <ToastContainer position='bottom-right' />

            <Switch>
                <Route exact path='/admin'>
                    <Redirect to='/admin/dashboard' />
                </Route>
                <Route exact path='/admin/login' component={AdminLoginPage} />

                <Route render={() => {
                    return (
                        <Fragment>
                            <AdminSideBar />
                            <AdminNavBar />

                            <Container fluid style={{ paddingTop: '6em', paddingLeft: '17em', paddingRight: '2em    ' }}>
                                <Switch>
                                    <Route path='/admin/dashboard' component={AdminDashboard} />
                                    <Route path='/admin/matches/upcoming' component={UpcomingMatchesPage} />
                                    <Route path='/admin/matches/live' component={LiveMatchesPage} />

                                    <Route path='/admin/tables/teams/create' component={TeamForm} />
                                    <Route path='/admin/tables/teams' component={TeamsPage} />

                                    <Route render={() => <p>ERROR 404</p>} />
                                </Switch>
                            </Container>
                        </Fragment>
                    )
                }} />
            </Switch>
        </Fragment>
    )
}

export default observer(AdminApp);