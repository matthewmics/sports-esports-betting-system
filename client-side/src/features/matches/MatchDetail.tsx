import React from 'react'
import { Link } from 'react-router-dom'
import { GridColumn, Segment, Label, Grid, Button, Image } from 'semantic-ui-react'
import { IMatch } from '../../app/models/match'

interface IProps {
    match: IMatch
}

const MatchDetail: React.FC<IProps> = ({
    match
}) => {
    return (
        <GridColumn width={12}>
            <Segment.Group>
                <Segment clearing>
                    <Label basic image>
                        <img src='/assets/dota2.png' alt='Team' />
                                    DOTA 2
                                </Label>
                                {" "}
                                Beyond The Summit 13
                                <span style={{ float: 'right', color: 'teal', lineHeight: '27px' }}>
                        12m 06s from now
                                </span>
                </Segment>
                <Segment>
                    <Grid columns={3} stackable textAlign='center'>
                        <Grid.Row verticalAlign='middle'>
                            <Grid.Column>
                                <Image src='/assets/noimage.png' centered
                                    size='tiny' />
                                {match.teamA.name}
                            </Grid.Column>
                            <Grid.Column width={2}>
                                VS <br />
                                <Label content='BO3' />
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
                    <Button icon='sitemap' content='Predictions' floated='right' basic 
                        labelPosition='left'    
                        as={Link} to={`/matches/${match.id}`}/>
                </Segment>
            </Segment.Group>
        </GridColumn>
    )
}

export default MatchDetail