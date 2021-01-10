import React from 'react'
import { Segment, Label, Grid, Button, Image } from 'semantic-ui-react'
import { history } from '../../..'
import { StatusDetails } from '../../../app/common/options/StatusDetails'
import { IMatch } from '../../../app/models/match'
import { predictionStatus } from '../../../app/models/prediction'


interface IProps {
    match: IMatch
}


export const MatchDetails: React.FC<IProps> = ({ match }) => {
    return (
        <Segment.Group className={(match.matchStatus.name === 'cancelled' || match.matchStatus.name === 'settled') ? 'match-finished' : undefined}>
            <Segment clearing>
                <Label basic image>
                    <img src={`/assets/${match.game.name}.png`} alt='Team' /> {match.game.displayText}
                </Label>
                {" "}
                {match.eventName}
                <span style={{ float: 'right', color: 'teal', lineHeight: '27px' }}>
                    <StatusDetails status={match.matchStatus}
                        startDate={match.startDate} />
                </span>
            </Segment>
            <Segment>

                {match.matchStatus.name === predictionStatus.settled.name &&
                    <Label icon='trophy'  as='a' color='green' corner={match.winner.id === match.teamA.id ? 'left' : 'right'}>
                        
                    </Label>
                }
                <Grid columns={3} stackable textAlign='center'>
                    <Grid.Row verticalAlign='middle'>
                        <Grid.Column>
                            <Image src={match.teamA.image || '/assets/noimage.png'} centered
                                size='tiny' style={{ marginBottom: '7px' }} />
                            {match.teamA.name}
                        </Grid.Column>
                        <Grid.Column width={2}>
                            VS <br />
                            <Label content={`BO${match.series}`} />
                        </Grid.Column>
                        <Grid.Column>
                            <Image src={match.teamB.image || '/assets/noimage.png'} centered
                                size='tiny' style={{ marginBottom: '7px' }} />
                            {match.teamB.name}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
            <Segment>
                    <Button content='Predictions' color='teal'
                        className='button-prediction'
                        onClick={() => history.push(`/admin/matches/${match.id}/predictions`)} />
            </Segment>
        </Segment.Group>
    )
}
