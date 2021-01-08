import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext } from 'react'
import { Segment, Grid, Image, Label } from 'semantic-ui-react'
import { StatusDetails } from '../../../app/common/StatusDetails'
import { predictionStatus } from '../../../app/models/prediction'
import { RootStoreContext } from '../../../app/stores/rootStore'
import PredictionDetailsActions from './PredictionDetailsActions'
import { PredictionDetailsActivePrediction } from './PredictionDetailsActivePrediction'


const PredictionDetails = () => {

    const rootStore = useContext(RootStoreContext);
    const { isLoggedIn } = rootStore.userStore;
    const { openModal } = rootStore.modalStore;
    const { loading, selectedMatch: match } = rootStore.matchStore;
    const { selectedPrediction: prediction, unpredict } = rootStore.predictionStore;

    const teamAPredictionDetails = prediction?.predictionDetails?.teamPredictionEnvelope.teamA;
    const teamBPredictionDetails = prediction?.predictionDetails?.teamPredictionEnvelope.teamB;

    return (
        <Segment.Group>
            <Segment clearing>
                {prediction &&
                    <Fragment>
                        {prediction.description}
                        <span style={{ float: 'right', color: 'teal' }}>
                            <StatusDetails status={prediction.predictionStatus}
                                startDate={prediction.startDate} />
                        </span>
                    </Fragment>
                }
            </Segment>
            <Segment>
                {(prediction && match) && prediction.predictionStatus.name === predictionStatus.settled.name
                    && prediction.winner &&
                    <Label as='a' color='green' ribbon={prediction.winner.id === match.teamA.id ? true : 'right'}>
                        Winner
                    </Label>
                }
                <Grid columns={3} stackable textAlign='center'>
                    <Grid.Row verticalAlign='middle'>
                        <Grid.Column>
                            <Image src={match?.teamA.image || '/assets/noimage.png'} centered
                                size='tiny' style={{ marginBottom: '7px' }} />
                            {match?.teamA.name}<br />
                            {prediction && prediction.predictionDetails &&
                                <b>(x{teamAPredictionDetails!.odds})</b>
                            }
                        </Grid.Column>
                        <Grid.Column width={2}>
                            VS
                                </Grid.Column>
                        <Grid.Column>
                            <Image src={match?.teamB.image || '/assets/noimage.png'} centered
                                size='tiny' style={{ marginBottom: '7px' }} />
                            {match?.teamB.name} <br />
                            {prediction && prediction.predictionDetails &&
                                <b>(x{teamBPredictionDetails!.odds})</b>
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
            <Segment clearing loading={loading} style={{ minHeight: '60px' }}>
                {match && (isLoggedIn ? (
                    prediction && prediction.predictionDetails && prediction.predictionDetails.activePrediction ?
                        <PredictionDetailsActivePrediction activePrediction={prediction.predictionDetails.activePrediction}
                            prediction={prediction}
                            unpredict={unpredict}
                            openModal={openModal} />
                        :
                        <PredictionDetailsActions
                            prediction={prediction}
                            match={match!} openModal={openModal} />
                ) : (
                        <Label style={{ float: 'right' }}>You have to be logged in to make a prediction</Label>
                    ))
                }
            </Segment>
        </Segment.Group >
    )
}

export default observer(PredictionDetails)