import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { Menu, Image, Button } from 'semantic-ui-react'
import { history } from '../..'
import { RootStoreContext } from '../../app/stores/rootStore'
import CreateMatchForm from '../admin/matches/CreateMatchForm'

const AdminNavBar = () => {
    const rootStore = useContext(RootStoreContext);
    const { logout, adminUser } = rootStore.adminUserStore;
    const { openModal } = rootStore.modalStore;
    return (
        <Menu fixed='top'>
            <Menu.Item header onClick={() => history.push('/admin')} as='div'
                style={{ cursor: 'pointer', width: '15rem' }}>
                <Image style={{ marginRight: '10px' }} height='37' src='/assets/logo.png' />
                    WagerzLounge
            </Menu.Item>

            <Menu.Item>
                <Button content='Create match' basic icon='plus' labelPosition='left'
                    onClick={() => openModal(<CreateMatchForm />)}
                />
            </Menu.Item>
            <Menu.Menu position='right'>
                <Menu.Item>
                    <Image bordered spaced avatar
                        size='mini'
                        src='/assets/user_default.png' />
                    {adminUser?.displayName}
                </Menu.Item>
                <Menu.Item>
                    <div onClick={logout} style={{ fontWeight: 'bold', color: 'DarkGray', cursor: 'pointer' }}>LOGOUT</div>
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    )
}

export default observer(AdminNavBar);