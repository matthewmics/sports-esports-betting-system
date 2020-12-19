import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { Breadcrumb, Divider, Grid, Loader } from 'semantic-ui-react'
import { IMatch } from '../../../app/models/match'
import { RootStoreContext } from '../../../app/stores/rootStore'
import { MatchDetails } from './MatchDetails'

const UpcomingMatchesPage = () => {

    const rootStore = useContext(RootStoreContext);
    const { loadingMatches, matchList, setFilter, setPage, page, loadMatches, totalPages, hasLoaded } = rootStore.matchStore;

    useEffect(() => {
        if (!hasLoaded) {
            setFilter("game", "all", false);
            setFilter("status", "upcoming");
        }
    }, [setFilter, hasLoaded])

    const handleLoadNext = () => {
        if (!loadingMatches) {
            setPage(page + 1);
            loadMatches();
        }
    }

    return (
        <Fragment>
            <Breadcrumb size='huge'>
                <Breadcrumb.Section>Upcoming Matches</Breadcrumb.Section>
            </Breadcrumb>
            <Divider />

            <InfiniteScroll hasMore={page + 1 < totalPages}
                className="grid ui"
                loadMore={handleLoadNext}
                initialLoad={false}
                pageStart={0}>
                {matchList.map((match: IMatch) =>
                    <Grid.Column computer={8} tablet={16} mobile={16} key={match.id}>
                        <MatchDetails match={match} />
                    </Grid.Column>
                )}

                {loadingMatches &&
                    <Grid.Column width={16}>
                        <Loader active inline='centered' />
                    </Grid.Column>
                }
            </InfiniteScroll>
        </Fragment>
    )
}


export default observer(UpcomingMatchesPage);