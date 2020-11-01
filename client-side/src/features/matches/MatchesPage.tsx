import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import { Grid } from 'semantic-ui-react';
import { IMatch } from '../../app/models/match';
import { RootStoreContext } from '../../app/stores/rootStore';
import MatchDetail from './MatchDetail';

const MatchesPage = () => {

    const rootStore = useContext(RootStoreContext);
    const { loadMatches, matchList } = rootStore.matchStore;

    useEffect(() => {
        loadMatches();
    }, [loadMatches])

    return (
        <Grid centered>
            {matchList.map((match: IMatch) => {
                return <MatchDetail key={match.id} match={match}/>
            })}
        </Grid>
    )
}

export default observer(MatchesPage);