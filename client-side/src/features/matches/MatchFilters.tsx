import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import { Menu, Image, Dropdown, Icon } from 'semantic-ui-react'
import { predictionStatusSelection } from '../../app/common/options/options'
import { RootStoreContext } from '../../app/stores/rootStore'

const tabImageStyle = {
    width: '35px', height: '35px', marginRight: '12px'
}

const MatchFilters = () => {

    const rootStore = useContext(RootStoreContext);
    const { matchFilters, setFilter, matchList, selectedStatusFilter, setSelectedStatusFilter, loadingMatches } = rootStore.matchStore;

    const handleGameFilter = (game: string) => {
        setFilter("game", game);
    }
    const handleStatusFilter = (status: string) => {
        setFilter("status", status);
    }

    useEffect(() => {
        if (matchList.length < 1)
            setFilter("game", "all");
    }, [matchList.length, setFilter])

    return (
        <Menu>
            <Menu.Item
                name='all'
                active={matchFilters.get("game") === "all"}
                onClick={() => handleGameFilter("all")}
            >
                <Image src='/assets/images/puzzle.png' style={tabImageStyle} /> All
            </Menu.Item>
            <Menu.Item
                name='dota2'
                active={matchFilters.get("game") === "dota2"}
                onClick={() => handleGameFilter("dota2")}
            >
                <Image src='/assets/images/dota2-outlined.png' style={tabImageStyle} /> Dota 2
            </Menu.Item>

            <Menu.Item
                name='csgo'
                active={matchFilters.get("game") === "csgo"}
                onClick={() => handleGameFilter("csgo")}
            >
                <Image src='/assets/images/csgo-outlined.png' style={tabImageStyle} /> CSGO
                    </Menu.Item>

            <Menu.Item
                name='sports'
                active={matchFilters.get("game") === "sports"}
                onClick={() => handleGameFilter("sports")}
            >
                <Image src='/assets/images/sports-outlined.png' style={tabImageStyle} /> Sports
            </Menu.Item>

            <Menu.Menu position='right'>
                <Menu.Item>
                    <Icon name='filter' />
                    <Dropdown options={predictionStatusSelection}
                        disabled={loadingMatches}
                        value={selectedStatusFilter}
                        onChange={(e, data) => {
                            setSelectedStatusFilter(String(data.value));
                            handleStatusFilter(String(data.value));
                        }} />
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    )
}

export default observer(MatchFilters);