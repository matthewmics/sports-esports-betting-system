import { observer } from 'mobx-react-lite'
import React from 'react'
import { Segment, Grid, Image } from 'semantic-ui-react'
import { IMatch } from '../../../app/models/match'
import { IPrediction } from '../../../app/models/prediction'
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
                {prediction && prediction.description}
                <span style={{ float: 'right', color: 'teal' }}>
                    12m 06s from now
                </span>
            </Segment>
            <Segment>
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
                            match={match!} openModal={openModal} />
                ) : (
                        <span style={{ float: 'right' }}>You have to be logged in to make a prediction</span>
                    ))
                }
            </Segment>
        </Segment.Group>
    )
}

export default observer(PredictionDetails)