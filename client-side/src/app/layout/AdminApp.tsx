import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AdminLoginPage from '../../features/admin/AdminLoginPage';
import AdminNavBar from '../../features/nav/AdminNavBar';
import AdminSideBar from '../../features/nav/AdminSideBar';
import { LoadingComponent } from '../common/LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import { RootStoreContext } from '../stores/rootStore';
import axios from 'axios';



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
                <Route exact path='/admin/login' component={AdminLoginPage} />

                <Route render={() => {
                    return (
                        <Fragment>
                            <AdminSideBar />
                            <AdminNavBar />
                        </Fragment>
                    )
                }} />
            </Switch>
        </Fragment>
    )
}

export default observer(AdminApp);