import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext, useEffect } from 'react'
import { Breadcrumb, Divider, Grid, Icon, Loader, Segment } from 'semantic-ui-react'
import { formatToLocalPH } from '../../app/common/util/util'
import { RootStoreContext } from '../../app/stores/rootStore'

const AdminDashboard = () => {

    const rootStore = useContext(RootStoreContext)
    const { loadDashboard, loading, dashboard } = rootStore.adminStore;

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard])

    if (loading && !dashboard) return <Loader active content='Loading...' />

    return (
        <Fragment>
            <Breadcrumb size='huge'>
                <Breadcrumb.Section>Dashboard</Breadcrumb.Section>
            </Breadcrumb>
            <Divider />
            {dashboard &&
                <Grid>
                    <Grid.Column computer={5}>
                        <Segment className='gradient-background-1' style={{ color: '#e3f2fd', border: '0' }}>
                            <Icon name='money' size='big' />
                            <div>Total profit</div>
                            <h2 style={{ marginTop: '0' }}>{formatToLocalPH(dashboard.totalProfit)}</h2>

                            <div style={{ paddingTop: '25px' }}>Increased by 0%</div>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column computer={5}>
                        <Segment className='gradient-background-1' style={{ color: '#e3f2fd', border: '0' }}>
                            <Icon name='users' size='big' />
                            <div>Total users</div>
                            <h2 style={{ marginTop: '0' }}>{dashboard.totalUsers}</h2>

                            <div style={{ paddingTop: '25px' }}>Increased by 0%</div>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column computer={5}>
                        <Segment className='gradient-background-2' style={{ color: '#e3f2fd', border: '0' }}>
                            <Icon name='gamepad' size='big' />
                            <div>Open matches</div>
                            <h2 style={{ marginTop: '0' }}>{dashboard.totalUsers}</h2>

                            <div style={{ paddingTop: '25px' }}>Increased by 0%</div>
                        </Segment>
                    </Grid.Column>
                </Grid>
            }
        </Fragment>

    )
}

export default observer(AdminDashboard)
