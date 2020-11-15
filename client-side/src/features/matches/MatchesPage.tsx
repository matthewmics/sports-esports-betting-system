import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Grid, GridColumn } from 'semantic-ui-react';
import { IMatch } from '../../app/models/match';
import { RootStoreContext } from '../../app/stores/rootStore';
import MatchDetail from './MatchDetails';
import MatchFilters from './MatchFilters';
import MatchPlaceholder from './MatchPlaceholder';
import InfiniteScroll from 'react-infinite-scroller';

const LIMIT = 5;

const MatchesPage = () => {

    const rootStore = useContext(RootStoreContext);
    const { loadMatches, matchList, page, setPage, totalPages } = rootStore.matchStore;
    const [loadingNext, setLoadingNext] = useState(false);

    useEffect(() => {
        if (matchList.length < 1) {
            setLoadingNext(true);
            loadMatches().then(() => { setLoadingNext(false) });
        }
    }, [loadMatches, matchList.length])

    const handleLoadNext = () => {
        setLoadingNext(true);
        setPage(page + 1);
        loadMatches().then(() => setLoadingNext(false));
    }

    return (
        <Grid centered>
            <GridColumn width={12}>
                <MatchFilters />

                <InfiniteScroll
                    hasMore={!loadingNext && (page + 1 < totalPages)}
                    initialLoad={false}
                    loadMore={handleLoadNext}
                    pageStart={0}>

                    {matchList.map((match: IMatch) => {
                        return <MatchDetail key={match.id} match={match} />
                    })}
                </InfiniteScroll>

                {loadingNext &&
                    <MatchPlaceholder total={(LIMIT)} />}

            </GridColumn>
        </Grid>
    )
}

export default observer(MatchesPage);