import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext, useEffect } from 'react'
import { Divider, Grid, Header } from 'semantic-ui-react'
import { history } from '../..'
import { RootStoreContext } from '../../app/stores/rootStore'
import ProfileInfo from './ProfileInfo'
import ProfilePredictionList from './ProfilePredictionList'


const ProfilePage = () => {

    const rootStore = useContext(RootStoreContext);
    const { isLoggedIn, userLoading } = rootStore.userStore;

    useEffect(() => {
        if (!isLoggedIn && !userLoading)
            history.push('/matches')
    }, [isLoggedIn, userLoading])

    return (
        <Fragment>
            <Header icon='user outline' content='Profile' />
            <Divider />
            <Grid stackable>
                <Grid.Column width={5}>
                    <ProfileInfo />
                </Grid.Column>
                <Grid.Column width={11}>
                    <ProfilePredictionList />
                </Grid.Column>
            </Grid>
        </Fragment>
    )
}

export default observer(ProfilePage)