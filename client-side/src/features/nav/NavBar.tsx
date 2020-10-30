import React, { useContext } from 'react'
import { Container, Menu, Button, Image, Dropdown } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'
import { RootStoreContext } from '../../app/stores/rootStore'
import { observer } from 'mobx-react-lite'
import LoginForm from '../user/LoginForm'

const NavBar = () => {

    const rootStore = useContext(RootStoreContext);
    const { openModal } = rootStore.modalStore;
    const { isLoggedIn, user, userLoading, logout } = rootStore.userStore;

    return (
        <Menu fixed='top'>
            <Container>
                <Menu.Item header>
                    <Image style={{ marginRight: '10px' }} height='37' src='/assets/logo.png' />
                    WagerzLounge
                </Menu.Item>
                <Menu.Item
                    as={NavLink}
                    to='/matches'
                    name='matches'
                >
                    Matches
                </Menu.Item>

                <Menu.Item
                    as={NavLink}
                    to='/outrights'
                    name='outrights'
                >
                    Outrights
                </Menu.Item>
                <Menu.Item
                    as={NavLink}
                    to='/admin'
                    name='admin'
                >
                    Admin
                </Menu.Item>

                <Menu.Menu position='right'>
                    {!userLoading &&
                        (
                            isLoggedIn ? (
                                <Menu.Item >
                                    <Image style={{ backgroundColor: '#afafaf' }} bordered spaced avatar
                                        src='/assets/user_default.png' />
                                    <Dropdown text={user!.displayName}>
                                        <Dropdown.Menu>
                                            <Dropdown.Item icon='power' text='Logout' onClick={logout} />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Menu.Item>
                            ) : (
                                    <Menu.Item>
                                        <Button.Group>
                                            <Button primary onClick={() => { openModal(<LoginForm />) }}>Login</Button>
                                            <Button.Or />
                                            <Button positive>Register</Button>
                                        </Button.Group>
                                    </Menu.Item>
                                )
                        )
                    }
                </Menu.Menu>
            </Container>
        </Menu >
    )
}


export default observer(NavBar);