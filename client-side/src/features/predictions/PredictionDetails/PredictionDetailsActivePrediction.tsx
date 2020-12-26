import React, { Fragment } from 'react'
import { Grid, Divider, Button, Label } from 'semantic-ui-react'
import { IActivePrediction, IPrediction } from '../../../app/models/prediction'
import PredictionForm from '../PredictionForm/PredictionForm'

interface IProps {
    activePrediction: IActivePrediction;
    unpredict: () => Promise<void>;
    openModal: (body: any) => void;
    prediction: IPrediction;
}

export const PredictionDetailsActivePrediction: React.FC<IProps> = ({ activePrediction, unpredict, openModal, prediction }) => {
    return (
        <Fragment>
            <Grid centered columns='equal' verticalAlign='middle'>
                <Grid.Column>
                    <Label content='Prediction' basic />
                    {" "}{activePrediction.team.name}
                </Grid.Column>
                <Grid.Column>
                    <Label content='Amount' basic />
                    {" "}₱{activePrediction.amount.toFixed(2)}
                </Grid.Column>
                <Grid.Column>
                    <Label content='Potential Reward' basic />
                    {" "}₱{activePrediction.potentialReward.toFixed(2)}
                </Grid.Column>
            </Grid>
            <Divider />
            <Button.Group widths={2}>   
                <Button content='Cancel' onClick={unpredict} icon='cancel'/>
                <Button content='Change' primary icon='retweet'
                    onClick={() => openModal(<PredictionForm activePrediciton={activePrediction} prediction={prediction} />)} />
            </Button.Group>
        </Fragment>
    )
}
