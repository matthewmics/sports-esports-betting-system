import { formatDistanceToNowStrict } from 'date-fns'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Link } from 'react-router-dom'
import { Segment, Label, Grid, Button, Image, Icon } from 'semantic-ui-react'
import { IMatch } from '../../app/models/match'

interface IProps {
    match: IMatch
}

const MatchDetail: React.FC<IProps> = ({
    match
}) => {

    return (
        <Segment.Group>
            <Segment clearing>
                <Label basic image>
                    <img src={`/assets/${match.game.name}.png`} alt='Team' /> {match.game.displayText}
                </Label>
                {" "}
                {match.eventName}
                <span style={{ float: 'right', color: 'teal', lineHeight: '27px' }}>
                    {match.matchStatus.name === 'live' &&
                        <Label color='red' content='Live'  icon='rocket'/>
                    }
                    {match.matchStatus.name === 'open' &&
                    <span>
                        <Icon name='clock outline'/>
                        {formatDistanceToNowStrict(match.startDate, { addSuffix: true })}
                    </span>
                    }
                </span>
            </Segment>
            <Segment>
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
            <Segment clearing>
                <span style={{ color: 'teal', display: 'inline-block', marginTop: '9px' }}>
                    {match.predictions.length} Prediction(s) available
                </span>
                <Button icon='life ring' content='Predictions' floated='right' basic
                    labelPosition='left'
                    as={Link} to={`/matches/${match.id}`} />
            </Segment>
        </Segment.Group>
    )
}

export default observer(MatchDetail)