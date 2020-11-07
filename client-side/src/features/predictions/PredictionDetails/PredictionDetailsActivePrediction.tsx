import React, { Fragment } from 'react'
import { Grid, Header, Divider, Button } from 'semantic-ui-react'

export const PredictionDetailsActivePrediction = () => {
    return (
        <Fragment>
            <Grid centered columns='equal'>
                <Grid.Column>
                    <Header content='Your Prediction' color='teal' />
                                Team Secret
                </Grid.Column>
                <Grid.Column>
                    <Header content='Amount' color='teal' />
                                ₱200.00
                </Grid.Column>
                <Grid.Column>
                    <Header content='Potential Reward' color='teal' />
                                ₱235.25
                </Grid.Column>
            </Grid>
            <Divider />
            <Button.Group widths={2}>
                <Button content='Cancel' />
                <Button content='Update' primary />
            </Button.Group>
        </Fragment>
    )
}
