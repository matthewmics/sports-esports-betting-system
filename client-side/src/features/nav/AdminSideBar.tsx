import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';

const AdminSideBar = () => {

    const rootStore = useContext(RootStoreContext);
    const { loadingMatches } = rootStore.matchStore;

    return (
        <Menu fixed='left' id='sideBar' vertical style={{ overflowY: 'auto' }}>
            {/* <Menu.Item>
                <Input placeholder='Search...' />
            </Menu.Item> */}
            <Menu.Item content='Dashboard' icon='dashboard' as={NavLink}
                to='/admin/dashboard' />
            <Menu.Item>
                <Menu.Header>Matches</Menu.Header>

                <Menu.Menu>
                    <Menu.Item
                        as={NavLink}
                        to='/admin/matches/upcoming'
                        name='Upcoming'
                        disabled={loadingMatches}
                    />
                    <Menu.Item
                        as={NavLink}
                        to='/admin/matches/live'
                        name='Live'
                        disabled={loadingMatches}
                    />
                    <Menu.Item
                        as={NavLink}
                        to='/admin/matches/finished'
                        name='Finished'
                        disabled={loadingMatches}
                    />
                </Menu.Menu>
            </Menu.Item>

            {/* <Menu.Item>
                <Menu.Header>Outrights</Menu.Header>

                <Menu.Menu>
                    <Menu.Item
                        name='Upcoming'
                    />
                    <Menu.Item
                        name='Live'
                    />
                </Menu.Menu>
            </Menu.Item> */}

            <Menu.Item>
                <Menu.Header>Tables</Menu.Header>

                <Menu.Menu>
                    <Menu.Item
                        name='Teams'
                        as={NavLink}
                        to='/admin/tables/teams'
                    />
                    <Menu.Item
                        name='Wagerers'
                        as={NavLink}
                        to='/admin/tables/wagerers'
                    />
                </Menu.Menu>
            </Menu.Item>
        </Menu>
    )
}

export default observer(AdminSideBar);
