import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext, useEffect } from 'react'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AdminLoginPage from '../../features/admin/AdminLoginPage';
import AdminNavBar from '../../features/nav/AdminNavBar';
import AdminSideBar from '../../features/nav/AdminSideBar';
import { LoadingComponent } from '../common/components/LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import { RootStoreContext } from '../stores/rootStore';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import AdminDashboard from '../../features/admin/AdminDashboard';
import UpcomingMatchesPage from '../../features/admin/matches/MatchesPage';
import TeamsPage from '../../features/admin/tables/Team/TeamsPage';
import TeamCreate from '../../features/admin/tables/Team/TeamCreate';
import TeamDetails from '../../features/admin/tables/Team/TeamDetails';
import TeamEdit from '../../features/admin/tables/Team/TeamEdit';
import ManagePredictionsPage from '../../features/admin/predictions/ManagePredictionsPage';
import ErrorModalContainer from '../common/modals/ErrorModalContainer';
import { NotFound } from '../common/components/NotFound';
import WagerersPage from '../../features/admin/tables/Wagerer/WagerersPage';


const AdminApp: React.FC<RouteComponentProps> = ({ location }) => {
    document.title = 'Wagerzlounge - Admin';
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
    const { loadingUser, getCurrentAdmin } = rootStore.adminStore;

    useEffect(() => {
        getCurrentAdmin();
    }, [getCurrentAdmin])

    if (loadingUser)
        return <LoadingComponent content='Loading...' />

    return (
        <Fragment>
            <ErrorModalContainer />
            <ModalContainer />
            <ToastContainer position='bottom-right' pauseOnFocusLoss={false} />

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
                                    <Route path='/admin/matches/:id/predictions' component={ManagePredictionsPage} />
                                    <Route key={location.pathname} path='/admin/matches/:status' component={UpcomingMatchesPage} />
                                   
                                    <Route key={new Date().getTime()} path='/admin/tables/teams/create' component={TeamCreate} />
                                    <Route path='/admin/tables/teams/:id/edit' component={TeamEdit} />
                                    <Route path='/admin/tables/teams/:id' component={TeamDetails} />
                                    <Route path='/admin/tables/teams' component={TeamsPage} />

                                    
                                    <Route path='/admin/tables/wagerers' component={WagerersPage} />


                                    <Route render={() => <NotFound />} />
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