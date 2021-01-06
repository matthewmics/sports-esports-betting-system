import React, { Fragment } from 'react'
import { Grid, Divider, Button, Label } from 'semantic-ui-react'
import { formatToLocalPH } from '../../../app/common/util/util'
import { IActivePrediction, IPrediction, predictionStatus } from '../../../app/models/prediction'
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
                    {" "}{formatToLocalPH(activePrediction.amount)}
                </Grid.Column>
                <Grid.Column>
                    <Label content='Potential Reward' basic />
                    {" "}{formatToLocalPH(activePrediction.potentialReward)}
                </Grid.Column>
            </Grid>
            {prediction.predictionStatus.name === predictionStatus.open.name &&
                <Fragment>
                    <Divider />
                    <Button.Group widths={2}>
                        <Button content='Cancel' onClick={unpredict} icon='cancel' />
                        <Button content='Change' primary icon='retweet'
                            onClick={() => openModal(<PredictionForm activePrediciton={activePrediction} prediction={prediction} />)} />
                    </Button.Group>
                </Fragment>
            }
        </Fragment>
    )
}
