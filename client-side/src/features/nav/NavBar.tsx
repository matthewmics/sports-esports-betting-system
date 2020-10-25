import React from 'react'
import { Container, Menu, Button, Image } from 'semantic-ui-react'

export const NavBar = () => {
    return (
        <Menu fixed='top'>
            <Container>
                <Menu.Item header>
                    <Image style={{marginRight: '10px'}} height='37' src='/assets/logo.png'/>
                    WagerzLounge
                </Menu.Item>
                <Menu.Item
                    name='matches'
                >
                    Matches
                </Menu.Item>

                <Menu.Item
                    name='profile'
                >
                    Profile
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
