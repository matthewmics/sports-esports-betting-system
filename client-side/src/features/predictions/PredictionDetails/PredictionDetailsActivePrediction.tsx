import React, { Fragment } from 'react'
import { Grid, Header, Divider, Button } from 'semantic-ui-react'
import { IActivePrediction } from '../../../app/models/prediction'
import PredictionForm from '../PredictionForm'

interface IProps {
    activePrediction: IActivePrediction;
    unpredict: () => Promise<void>;
    openModal: (body: any) => void;
}

export const PredictionDetailsActivePrediction: React.FC<IProps> = ({ activePrediction, unpredict, openModal }) => {
    return (
        <Fragment>
            <Grid centered columns='equal'>
                <Grid.Column>
                    <Header content='Your Prediction' color='teal' />
                    {activePrediction.team.name}
                </Grid.Column>
                <Grid.Column>
                    <Header content='Amount' color='teal' />
                    ₱{activePrediction.amount.toFixed(2)}
                </Grid.Column>
                <Grid.Column>
                    <Header content='Potential Reward' color='teal' />
                    ₱{activePrediction.potentialReward.toFixed(2)}
                </Grid.Column>
            </Grid>
            <Divider />
            <Button.Group widths={2}>
                <Button content='Cancel' onClick={unpredict} />
                <Button content='Update' primary
                    onClick={() => openModal(<PredictionForm activePrediciton={activePrediction} />)} />
            </Button.Group>
        </Fragment>
    )
}
