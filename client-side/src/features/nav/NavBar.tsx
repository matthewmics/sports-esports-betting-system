import React, { Fragment, useContext } from 'react'
import { Container, Menu, Button, Image, Dropdown, Placeholder, Label, Popup } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'
import { RootStoreContext } from '../../app/stores/rootStore'
import { observer } from 'mobx-react-lite'
import LoginForm from '../user/LoginForm'
import RegisterForm from '../user/RegisterForm'
import { history } from '../..'


const notificationBadgeStyle = {
    backgroundColor: 'red',
    height: '15px',
    width: '15px',
    position: 'absolute' as 'absolute',
    right: 15, top: 15,
    borderRadius: '7px',
    color: 'white',
    fontSize: '8px',
    textAlign: 'center' as 'center',
    lineHeight: '15px'
};

const NavBar = () => {
    const rootStore = useContext(RootStoreContext);
    const { openModal } = rootStore.modalStore;
    const { isLoggedIn, user, userLoading, logout } = rootStore.userStore;

    return (
        <Menu fixed='top'>

            <Container>
                <Menu.Item header onClick={() => history.push('/matches')} as='div'
                        style={{cursor: 'pointer'}}>
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
                    to='/profile'
                    name='profile'
                >
                    Profile
                </Menu.Item>

                <Menu.Menu position='right'>
                    {userLoading &&
                        <Menu.Item>
                            <Placeholder style={{ height: '25px', width: '200px' }}>
                                <Placeholder.Header>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Header>
                            </Placeholder>
                        </Menu.Item>
                    }
                    {!userLoading &&
                        (
                            isLoggedIn ? (
                                <Fragment>
                                    <Menu.Item>
                                        <Dropdown icon='bell outline' pointing='top right' >
                                            <Dropdown.Menu>
                                                <Dropdown.Item text='Notifications will be displayed here.' />
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        <div style={notificationBadgeStyle}>
                                            22
                                        </div>
                                    </Menu.Item>
                                    <Popup
                                        position='bottom right'
                                        on='click'
                                        pinned
                                        trigger={
                                            <Menu.Item>
                                                <Image style={{ backgroundColor: '#afafaf' }} bordered spaced avatar
                                                    size='mini'
                                                    src='/assets/user_default.png' />
                                                <div>
                                                    <span style={{ fontSize: '13px', display: 'block', marginBottom: '2px' }}>{user!.displayName}</span>
                                                    <Label size='mini' color='green' content={"₱ " + user!.walletBalance.toFixed(2)} />
                                                </div>
                                            </Menu.Item>
                                        }
                                    >

                                        <div style={{ display: 'flex' }}>
                                            <Image style={{
                                                backgroundColor: '#afafaf',
                                                height: '50px', width: '50px',
                                                marginRight: '10px'
                                            }} bordered spaced avatar
                                                src='/assets/user_default.png' />

                                            <div style={{ display: 'block', minWidth: '150px' }}>
                                                <span style={{ fontWeight: 'bold', display: 'block', overflow: 'hidden', maxWidth: '150px', textOverflow: 'ellipsis' }}>
                                                    {user!.username}
                                                </span>
                                                <span>
                                                    {user!.email}
                                                </span>
                                            </div>

                                        </div>
                                        <br />
                                        <Button fluid labelPosition='left' content='Logout' icon='power' onClick={logout}
                                            basic />

                                    </Popup>

                                </Fragment>
                            ) : (
                                    <Menu.Item>
                                        <Button.Group>
                                            <Button primary onClick={() => { openModal(<LoginForm />) }}>Login</Button>
                                            <Button.Or />
                                            <Button positive
                                                onClick={() => { openModal(<RegisterForm />) }}>
                                                Register
                                            </Button>
                                        </Button.Group>
                                    </Menu.Item>
                                )
                        )
                    }
                </Menu.Menu>
            </Container >
        </Menu>
    )
}


export default observer(NavBar);