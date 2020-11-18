import { observer } from 'mobx-react-lite'
import React from 'react'
import { Menu, Input } from 'semantic-ui-react';

const AdminSideBar = () => {
    return (
        <Menu fixed='left' vertical style={{ height: '100vh', paddingTop: '5rem' }}>
            <Menu.Item>
                <Input placeholder='Search...' />
            </Menu.Item>
            <Menu.Item content='Dashboard' icon='dashboard' active={true} />
            <Menu.Item>
                <Menu.Header>Matches</Menu.Header>

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
