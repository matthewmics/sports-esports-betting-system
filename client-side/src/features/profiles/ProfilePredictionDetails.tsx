import { format } from 'date-fns'
import React, { Fragment } from 'react'
import { Segment, Grid, Label, Image, Button } from 'semantic-ui-react'
import { history } from '../..'
import { formatToLocalPH } from '../../app/common/util/util'
import { predictionStatus } from '../../app/models/prediction'
import { IUserPrediction } from '../../app/models/profile'


export const ProfilePredictionDetails: React.FC<{
    userPrediction: IUserPrediction,
}> = ({
    userPrediction: up,
}) => {
        return (
            <Segment>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={3} style={{ borderRight: '0.5px solid #b2dfdb' }} textAlign='center'>
                        <Image centered src={`/assets/${up.game.name}.png`} size='mini' />
                        <Label content={up.predictionTitle} basic />
                        <div className='text-muted text-small' style={{ marginTop: '5px' }}>
                            {format(up.predictedAt, 'MMM dd, p')}
                        </div>
                    </Grid.Column>
                    <Grid.Column width={4} textAlign='center'>
                        <Image centered src={up.teamA.image || '/assets/noimage.png'} size='tiny' />
                        {up.teamA.name}
                        {up.teamA.isSelected &&
                            <div className='text-muted text-small'>
                                stake: <b style={{ color: '#2185d0' }}>{formatToLocalPH(up.amount)}</b>
                            </div>
                        }
                    </Grid.Column>
                    <Grid.Column width={2} textAlign='center'>
                        Vs
            </Grid.Column>
                    <Grid.Column width={4} textAlign='center'>
                        <Image centered src={up.teamB.image || '/assets/noimage.png'} size='tiny' />
                        {up.teamB.name}
                        {up.teamB.isSelected &&
                            <div className='text-muted text-small'>
                                stake: <b style={{ color: '#2185d0' }}>{formatToLocalPH(up.amount)}</b>
                            </div>
                        }
                    </Grid.Column>
                    <Grid.Column width={3} textAlign='center'>
                        {up.predictionStatus.name === predictionStatus.settled.name &&
                            <Fragment>
                                {up.outcome < 0 ?
                                    <div className='text-red'>-{formatToLocalPH(up.outcome)}</div>
                                    :
                                    <div className='text-green'>+{formatToLocalPH(up.outcome)}</div>
                                }
                            </Fragment>
                        }
                        {up.predictionStatus.name === predictionStatus.cancelled.name &&
                            <div className='text-muted'>Cancelled</div>
                        }
                        {up.predictionStatus.name === predictionStatus.live.name &&
                            <div className='text-red'>Live</div>
                        }
                        {up.predictionStatus.name === predictionStatus.open.name &&
                            <div>Open</div>
                        }

                        <Button basic content='Preview' style={{ marginTop: '8px' }}
                            onClick={() => {
                                history.push(`/matches/${up.matchId}?pid=${up.predictionId}`);
                            }} />
                    </Grid.Column>
                </Grid>
            </Segment>
        )
    }
