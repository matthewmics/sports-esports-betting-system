import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Divider, Grid, Label, Image, Segment, Button, GridColumn, Reveal, Header } from 'semantic-ui-react'

export const btnBetStyle = {
    float: 'right',
    minWidth: '180px',
    color: 'white'
}

interface RouteParams {
    id: string
}

interface IProps extends RouteComponentProps<RouteParams> {

}

const PredictionPage: React.FC<IProps> = ({ match }) => {
    return (
        <Grid>
            <Grid.Column width={16}>
                <Label basic image>
                    <img src='/assets/dota2.png' alt='Team' /> DOTA 2
                </Label>
                {" "} Beyond The Summit 13
                <span style={{ float: 'right', color: 'teal', lineHeight: '27px' }}>
                    Secret vs Nigma • B03
                </span>
                <Divider />
            </Grid.Column>
            <Grid.Column width={12} style={{ paddingTop: '0px' }}>
                <Label content='Series Winner' color='blue' as='a' />
                <Label content='Game 1 First 10 Kills' />
                <Label content='Game 1 First Blood' />
            </Grid.Column>
            <GridColumn width={12}>
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

                <Segment>
                    Comments will go here
                </Segment>
            </GridColumn>
            <Grid.Column width={4} style={{marginTop: '2px'}}>
                <Header as='h3' attached='top'>
                    Recent Predictions
                </Header>
                <Segment attached style={{minHeight: '500px', textAlign: 'center'}}>
                    No user has predicted yet on this match.
                </Segment>
            </Grid.Column>
        </Grid>
    )
}

export default PredictionPage