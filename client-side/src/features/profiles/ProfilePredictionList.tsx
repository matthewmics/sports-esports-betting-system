import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroller';
import { Dropdown, Header, Icon, Loader, Segment } from 'semantic-ui-react';
import { IUserPrediction } from '../../app/models/profile';
import { RootStoreContext } from '../../app/stores/rootStore';
import { ProfilePredictionDetails } from './ProfilePredictionDetails';

const outcomeOptions = [
    { key: 3, text: 'Ongoing', value: 'ongoing' },
    { key: 1, text: 'Won', value: 'won' },
    { key: 2, text: 'Lost', value: 'lost' },
    { key: 4, text: 'Cancelled', value: 'cancelled' },
]

const gameOptions = [
    { key: 3, text: 'Dota 2', value: 'dota2' },
    { key: 1, text: 'CSGO', value: 'csgo' },
    { key: 2, text: 'Sports', value: 'sports' },
]

const ProfilePredictionList = () => {
    const rootStore = useContext(RootStoreContext);

    const { loadingPrediction, loadPredictions,
        predictionList, setPage, predictionFilters, hasLoaded,
        page, totalPages, setFilter } = rootStore.profileStore;        

    const handleLoadNext = () => {
        if (!loadingPrediction && totalPages > 0) {
            setPage(page + 1);
            loadPredictions();
        }
    }

    useEffect(() => {
        if (!hasLoaded) {
            loadPredictions();
        }
    }, [hasLoaded, loadPredictions])


    return (
        <Fragment>
            <Segment>
                <Icon name='filter' color='teal' inverted bordered style={{ marginRight: '10px' }} />
                <Dropdown clearable options={outcomeOptions} selection placeholder='Outcome'
                    style={{ marginRight: '10px' }} disabled={loadingPrediction}
                    onChange={(e, data) => setFilter('outcome', String(data.value))}
                    defaultValue={predictionFilters.get('outcome')} />
                <Dropdown clearable options={gameOptions} selection placeholder='Game'
                    disabled={loadingPrediction}
                    onChange={(e, data) => setFilter('game', String(data.value))}
                    defaultValue={predictionFilters.get('game')} />
            </Segment>

            {!loadingPrediction && predictionList.length === 0 &&
                <Segment placeholder>
                    <Header icon>
                        <Icon name='search' />
                            No predictions found.
                    </Header>
                </Segment>
            }

            <InfiniteScroll pageStart={0}
                loadMore={handleLoadNext}
                hasMore={page + 1 < totalPages}
                initialLoad={false}>
                {predictionList.map((up: IUserPrediction) => {
                    return <ProfilePredictionDetails key={up.predictionId}
                        userPrediction={up} />
                })}
            </InfiniteScroll>
            {loadingPrediction &&
                <Segment basic>
                    <Loader active inline='centered' /></Segment>
            }
        </Fragment>
    )
}

export default observer(ProfilePredictionList)

