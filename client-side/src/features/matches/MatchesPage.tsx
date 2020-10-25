import { observer } from 'mobx-react-lite'
import React from 'react'
import { Button, Divider, Grid, GridColumn, Header, Icon, Image, Label, Segment } from 'semantic-ui-react';

const MatchesPage = () => {
    return (
        <Grid centered>
            <GridColumn width={12}>
                <Segment.Group>
                    <Segment clearing>
                        <Label basic image>
                            <img src='/assets/dota2.png' />
                            DOTA 2
                        </Label>
                        <span style={{ float: 'right', color: 'teal', lineHeight: '27px' }}>
                            12m 06s from now
                        </span>
                    </Segment>
                    <Segment>
                        <Grid columns={2} stackable textAlign='center'>
                            <Divider vertical>VS</Divider>

                            <Grid.Row verticalAlign='middle'>
                                <Grid.Column>
                                    <Image src='/assets/noimage.png' centered
                                        size='tiny' />
                                            Team Secret
                                </Grid.Column>

                                <Grid.Column>
                                    <Image src='/assets/noimage.png' centered
                                        size='tiny' />
                                            Team Secret
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                    <Segment clearing>
                        <Button content='View' floated='right' primary />
                    </Segment>
                </Segment.Group>
            </GridColumn>

            <GridColumn width={12}>
                <Segment.Group>
                    <Segment clearing>
                        <Label basic image>
                            <img src='/assets/dota2.png' />
                            DOTA 2
                        </Label>
                        <span style={{ float: 'right', color: 'teal', lineHeight: '27px' }}>
                            12m 06s from now
                        </span>
                    </Segment>
                    <Segment>
                        <Grid columns={2} stackable textAlign='center'>
                            <Divider vertical>VS</Divider>

                            <Grid.Row verticalAlign='middle'>
                                <Grid.Column>
                                    <Image src='/assets/noimage.png' centered
                                        size='tiny' />
                                            Team Secret
                                </Grid.Column>

                                <Grid.Column>
                                    <Image src='/assets/noimage.png' centered
                                        size='tiny' />
                                            Team Secret
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                    <Segment clearing>
                        <Button content='View' floated='right' primary />
                    </Segment>
                </Segment.Group>
            </GridColumn>
        </Grid>
    )
}

export default observer(MatchesPage);