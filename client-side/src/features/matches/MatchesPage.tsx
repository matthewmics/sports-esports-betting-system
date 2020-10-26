import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import { Button, Divider, Grid, GridColumn, Image, Label, Segment } from 'semantic-ui-react';
import { IMatch } from '../../app/models/match';
import { RootStoreContext } from '../../app/stores/rootStore';

const MatchesPage = () => {

    const rootStore = useContext(RootStoreContext);
    const { loadMatches, matchList } = rootStore.matchStore;

    useEffect(() => {
        loadMatches();
    }, [loadMatches])

    return (
        <Grid centered>
            {matchList.map((match: IMatch) => {
                return (
                    <GridColumn width={12} key={match.id}>
                        <Segment.Group>
                            <Segment clearing>
                                <Label basic image>
                                    <img src='/assets/dota2.png' alt='Team' />
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
                                            {match.teamA.name}
                                        </Grid.Column>

                                        <Grid.Column>
                                            <Image src='/assets/noimage.png' centered
                                                size='tiny' />
                                            {match.teamB.name}
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                            <Segment clearing>
                                <Button content='View' floated='right' primary />
                            </Segment>
                        </Segment.Group>
                    </GridColumn>
                )
            })}
        </Grid>
    )
}

export default observer(MatchesPage);