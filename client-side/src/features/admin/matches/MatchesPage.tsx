import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { RouteComponentProps } from 'react-router-dom'
import { Breadcrumb, Divider, Grid, Loader } from 'semantic-ui-react'
import { IMatch } from '../../../app/models/match'
import { RootStoreContext } from '../../../app/stores/rootStore'
import { MatchDetails } from './MatchDetails'

interface RouteParams {
    status: string;
}

const UpcomingMatchesPage: React.FC<RouteComponentProps<RouteParams>> = ({ match }) => {

    const rootStore = useContext(RootStoreContext);
    const { loadingMatches, matchList, setFilter, setPage, page, loadMatches, totalPages, matchFilters } =
        rootStore.matchStore;

    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if ((matchFilters.get("status") !== match.params.status)) {
            setFilter("game", "all", false);
            setFilter("status", match.params.status);
        }

        setTimeout(() => {
            setShouldRender(true);
        }, 50);

    }, [setFilter, match.params.status, matchFilters])

    const handleLoadNext = () => {
        if (!loadingMatches) {
            setPage(page + 1);
            loadMatches();
        }
    }

    return (
        <Fragment>
            <Breadcrumb size='huge'>
                <Breadcrumb.Section>
                    {match.params.status === 'upcoming' && 'Upcoming'}
                    {match.params.status === 'live' && 'Live'}
                    {match.params.status === 'finished' && 'Finished'}
                    {" matches"}
                </Breadcrumb.Section>
            </Breadcrumb>
            <Divider />

            {!loadingMatches && matchList.length === 0 && <p>No matches found</p>}
            {shouldRender &&
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
                </InfiniteScroll>}
        </Fragment>
    )
}


export default observer(UpcomingMatchesPage);