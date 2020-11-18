import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { Menu, Image } from 'semantic-ui-react'
import { history } from '../..'
import { RootStoreContext } from '../../app/stores/rootStore'

const AdminNavBar = () => {
    const rootStore = useContext(RootStoreContext);
    const { logout } = rootStore.adminUserStore;
    return (
        <Menu fixed='top'>
            <Menu.Item header onClick={() => history.push('/admin')} as='div'
                style={{ cursor: 'pointer', width: '15rem' }}>
                <Image style={{ marginRight: '10px' }} height='37' src='/assets/logo.png' />
                    WagerzLounge
            </Menu.Item>

            <Menu.Menu position='right'>
                <Menu.Item>
                    <div  onClick={logout} style={{fontWeight: 'bold', color: 'black', cursor: 'pointer'}}>LOGOUT</div>
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    )
}

export default observer(AdminNavBar);