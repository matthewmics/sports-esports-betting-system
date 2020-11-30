import { observer } from 'mobx-react-lite'
import React from 'react'
import { NavLink } from 'react-router-dom';
import { Menu, Input } from 'semantic-ui-react';

const AdminSideBar = () => {
    return (
        <Menu fixed='left' vertical style={{ height: '100vh', paddingTop: '5rem', overflowY: 'auto' }}>
            <Menu.Item>
                <Input placeholder='Search...' />
            </Menu.Item>
            <Menu.Item content='Dashboard' icon='dashboard' as={NavLink}
                to='/admin/dashboard' />
            <Menu.Item>
                <Menu.Header>Matches</Menu.Header>

                <Menu.Menu>
                    <Menu.Item
                        as={NavLink}
                        to='/admin/matches/upcoming'
                        name='Upcoming'
                    />
                    <Menu.Item
                        as={NavLink}
                        to='/admin/matches/live'
                        name='Live'
                    />
                </Menu.Menu>
            </Menu.Item>

            <Menu.Item>
                <Menu.Header>Outrights</Menu.Header>

                <Menu.Menu>
                    <Menu.Item
                        name='Upcoming'
                    />
                    <Menu.Item
                        name='Live'
                    />
                </Menu.Menu>
            </Menu.Item>

            <Menu.Item>
                <Menu.Header>Tables</Menu.Header>

                <Menu.Menu>
                    <Menu.Item
                        name='Teams'
                        as={NavLink}
                        to='/admin/tables/teams'
                    />
                    <Menu.Item
                        name='Users'
                    />
                </Menu.Menu>
            </Menu.Item>
        </Menu>
    )
}

export default observer(AdminSideBar);
