import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import { Grid, GridColumn, Image, Menu } from 'semantic-ui-react';
import { IMatch } from '../../app/models/match';
import { RootStoreContext } from '../../app/stores/rootStore';
import MatchDetail from './MatchDetails';
import { MatchFilters } from './MatchFilters';

const MatchesPage = () => {

    const rootStore = useContext(RootStoreContext);
    const { loadMatches, matchList } = rootStore.matchStore;

    useEffect(() => {
        loadMatches();
    }, [loadMatches])

    return (
        <Grid centered>
            <GridColumn width={12}>
                <MatchFilters />
                {matchList.map((match: IMatch) => {
                    return <MatchDetail key={match.id} match={match} />
                })}
            </GridColumn>
        </Grid>
    )
}

export default observer(MatchesPage);