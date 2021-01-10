import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext, useEffect } from 'react'
import { Breadcrumb, Divider, Grid, Header, Icon, Image, Loader, Segment, Table } from 'semantic-ui-react'
import { formatToLocalPH } from '../../app/common/util/util'
import { RootStoreContext } from '../../app/stores/rootStore'

const AdminDashboard = () => {

    const rootStore = useContext(RootStoreContext)
    const { loadDashboard, loading, dashboard } = rootStore.adminStore;
    const { onlineUsers } = rootStore.wagererStore;

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
                    <Grid.Row>
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
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column computer={6} tablet={16} mobile={16}>
                            <Header attached='top' style={{ borderBottom: '0px' }}>
                                <Icon name='users' />
                                Online users
                            </Header>
                            {onlineUsers.length === 0 ?
                                <Segment placeholder attached>
                                    <Header icon>
                                        No online users
                                    </Header>
                                </Segment>
                                :
                                <div style={{backgroundColor:'#e0f2f1', height: '300px', maxHeight: '300px', overflowY: 'auto' }}>

                                    <Table celled size='large' style={{ borderRadius: '0px' }}>

                                        <Table.Body>
                                            {onlineUsers.map((x,i) =>
                                                <Table.Row key={i}>
                                                    <Table.Cell>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <Image src={x.photo || '/assets/user_default.png'} size='mini' style={{
                                                                marginRight: '7px'
                                                            }} />
                                                            {x.displayName}
                                                        </div>
                                                    </Table.Cell>
                                                </Table.Row>
                                            )}
                                        </Table.Body>
                                    </Table>
                                </div>
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            }
        </Fragment>

    )
}

export default observer(AdminDashboard)
