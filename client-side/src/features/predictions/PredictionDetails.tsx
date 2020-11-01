import { observer } from 'mobx-react-lite'
import React, { Fragment } from 'react'
import { Label, Segment, Grid, Button, Image } from 'semantic-ui-react'
import { btnBetStyle } from './PredictionPage'

const PredictionDetails = () => {
    return (
        <Fragment>
            <Label content='Series Winner' color='blue' as='a' />
            <Label content='Game 1 First 10 Kills' />
            <Label content='Game 1 First Blood' />
            <Segment.Group>
                <Segment clearing>
                    Which team will win the series?
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
                                    Secret<br />
                                <b>(x3.12)</b>
                            </Grid.Column>
                            <Grid.Column width={2}>
                                VS
                                </Grid.Column>
                            <Grid.Column>
                                <Image src='/assets/noimage.png' centered
                                    size='tiny' />
                                    Nigma <br />
                                <b>(x1.12)</b>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <Segment secondary clearing>
                    <Button style={btnBetStyle} color='green'>
                        Secret
                        </Button>
                    <Button style={btnBetStyle} color='green'>
                        Nigma
                        </Button>
                </Segment>
            </Segment.Group>
        </Fragment>
    )
}

export default observer(PredictionDetails)