import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext, useEffect } from 'react'
import { Header, Segment, Image, Placeholder } from 'semantic-ui-react'
import { formatToLocalPH } from '../../../app/common/util/util'
import { RootStoreContext } from '../../../app/stores/rootStore'

const RecentPredictions = () => {

    const rootStore = useContext(RootStoreContext);
    const { loadingMatchRecentPrediction, recentMatchePredictionsList,
        selectedMatch, loadRecentMatchPredictions } = rootStore.matchStore;

    useEffect(() => {
        setTimeout(() => {
            if (selectedMatch) {
                loadRecentMatchPredictions();
            }
        }, 20);
    }, [loadRecentMatchPredictions, selectedMatch])

    return (
        <Fragment>
            <Header as='h3' attached='top'>
                Recent Predictions
            </Header>
            { !loadingMatchRecentPrediction && recentMatchePredictionsList.length === 0 &&
                <Segment attached style={{ minHeight: 'initial', height: 'auto', textAlign: 'center' }}>
                    No user has predicted yet on this match.
                </Segment>
            }
            <Segment.Group style={{ marginTop: '0', borderTop: '0' }}>
                {loadingMatchRecentPrediction ?
                    <Fragment>
                        <Segment style={{ display: 'flex', alignItems: 'center', height: '85px' }}>
                            <Placeholder style={{ height: '38px', width: '100%' }}>
                                <Placeholder.Image />
                            </Placeholder>
                        </Segment>
                        <Segment style={{ display: 'flex', alignItems: 'center', height: '85px' }}>
                            <Placeholder style={{ height: '38px', width: '100%' }}>
                                <Placeholder.Image />
                            </Placeholder>
                        </Segment>
                    </Fragment>
                    :
                    recentMatchePredictionsList.map((x, i) =>
                        <Segment key={i} style={{ display: 'flex', alignItems: 'center', height: '85px' }}>
                            <Image src={x.userPhoto || '/assets/noimage.png'} size='tiny' />
                            <div>
                                <label className='text-muted'>
                                    {x.predictionName}
                                </label>
                                <div>
                                    {formatToLocalPH(x.amount)}
                                </div>
                            </div>
                        </Segment>
                    )
                }
            </Segment.Group>
        </Fragment>
    )
}

export default observer(RecentPredictions)