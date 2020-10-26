import React from 'react'
import { Container, Menu, Button, Image } from 'semantic-ui-react'
import { Link, NavLink } from 'react-router-dom'

export const NavBar = () => {
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
                    <Menu.Item>
                        <Button.Group>
                            <Button primary>Login</Button>
                            <Button.Or />
                            <Button positive>Register</Button>
                        </Button.Group>
                    </Menu.Item>
                </Menu.Menu>
            </Container>
        </Menu>
    )
}
