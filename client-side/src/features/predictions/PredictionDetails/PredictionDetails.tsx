import { observer } from 'mobx-react-lite'
import React, { Fragment } from 'react'
import { Segment, Grid, Image, Label } from 'semantic-ui-react'
import { StatusDetails } from '../../../app/common/StatusDetails'
import { IMatch } from '../../../app/models/match'
import { IPrediction, predictionStatus } from '../../../app/models/prediction'
import PredictionDetailsActions from './PredictionDetailsActions'
import { PredictionDetailsActivePrediction } from './PredictionDetailsActivePrediction'

interface IProps {
    prediction: IPrediction | null;
    match: IMatch | null;
    openModal: (body: any) => void;
    unpredict: () => Promise<void>;
    isLoggedIn: boolean;
    loading: boolean;
}

const PredictionDetails: React.FC<IProps> = ({ prediction, match, openModal, isLoggedIn, loading, unpredict }) => {

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
                {(prediction && match) && prediction.predictionStatus.name === predictionStatus.settled.name &&
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
                            <b>(x1.00)</b>
                        </Grid.Column>
                        <Grid.Column width={2}>
                            VS
                                </Grid.Column>
                        <Grid.Column>
                            <Image src={match?.teamB.image || '/assets/noimage.png'} centered
                                size='tiny' style={{ marginBottom: '7px' }} />
                            {match?.teamB.name} <br />
                            <b>(x1.00)</b>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
            <Segment secondary clearing loading={loading} style={{ minHeight: '60px' }}>
                {match && (isLoggedIn ? (
                    prediction && prediction.predictionDetails && prediction.predictionDetails.activePrediction ?
                        <PredictionDetailsActivePrediction activePrediction={prediction.predictionDetails.activePrediction}
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