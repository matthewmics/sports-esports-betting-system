import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import { Grid, GridColumn, Image, Menu } from 'semantic-ui-react';
import { IMatch } from '../../app/models/match';
import { RootStoreContext } from '../../app/stores/rootStore';
import MatchDetail from './MatchDetails';

const tabImageStyle = {
    width: '35px', height: '35px', marginRight: '5px'
}

const MatchesPage = () => {

    const rootStore = useContext(RootStoreContext);
    const { loadMatches, matchList } = rootStore.matchStore;

    useEffect(() => {
        loadMatches();
    }, [loadMatches])

    return (
        <Grid centered>
            <GridColumn width={12}>
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
                {matchList.map((match: IMatch) => {
                    return <MatchDetail key={match.id} match={match} />
                })}
            </GridColumn>
        </Grid>
    )
}

export default observer(MatchesPage);