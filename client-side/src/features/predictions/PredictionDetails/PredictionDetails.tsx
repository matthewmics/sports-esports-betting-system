import { observer } from 'mobx-react-lite'
import React, { Fragment } from 'react'
import { Segment, Grid, Image, Button, Label, Header, Divider } from 'semantic-ui-react'
import { IMatch } from '../../../app/models/match'
import { IPrediction } from '../../../app/models/prediction'
import { PredictionDetailsActions } from './PredictionDetailsActions'
import { PredictionDetailsActivePrediction } from './PredictionDetailsActivePrediction'

interface IProps {
    prediction: IPrediction | null;
    match: IMatch | null;
    openModal: (body: any) => void;
    closeModal: () => void;
    isLoggedIn: boolean;
}

const PredictionDetails: React.FC<IProps> = ({ prediction, match, closeModal, openModal, isLoggedIn }) => {

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
                            <Image src='/assets/noimage.png' centered
                                size='tiny' />
                            {match?.teamA.name}<br />
                            <b>(x1.00)</b>
                        </Grid.Column>
                        <Grid.Column width={2}>
                            VS
                                </Grid.Column>
                        <Grid.Column>
                            <Image src='/assets/noimage.png' centered
                                size='tiny' />
                            {match?.teamB.name} <br />
                            <b>(x1.00)</b>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
            <Segment secondary clearing>
                {isLoggedIn ? (
                    prediction && prediction.predictionDetails && prediction.predictionDetails.activePrediction ?
                        <PredictionDetailsActivePrediction />
                        :
                        <PredictionDetailsActions match={match!} openModal={openModal} closeModal={closeModal} />
                ) : (
                        <Label basic style={{ float: 'right' }} content='You must be logged in to make a prediction.' />
                    )}
            </Segment>
        </Segment.Group>
    )
}

export default observer(PredictionDetails)