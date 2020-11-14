import React from 'react'
import { Menu, Image } from 'semantic-ui-react'

const tabImageStyle = {
    width: '35px', height: '35px', marginRight: '5px'
}

export const MatchFilters = () => {
    return (
        <Menu>
            <Menu.Item
                name='all'
                active={true}
            >
                All
            </Menu.Item>
            <Menu.Item
                name='dota2'
            >
                <Image src='/assets/images/dota2-outlined.png' style={tabImageStyle} /> Dota 2
            </Menu.Item>

            <Menu.Item
                name='csgo'
            >
                <Image src='/assets/images/csgo-outlined.png' style={tabImageStyle} /> CSGO
                    </Menu.Item>

            <Menu.Item
                name='sports'
            >
                <Image src='/assets/images/sports-outlined.png' style={tabImageStyle} /> Sports
            </Menu.Item>
        </Menu>
    )
}
