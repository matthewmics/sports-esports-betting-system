import { observer } from 'mobx-react-lite'
import React, { Fragment } from 'react'
import { Segment, Grid, Image, Button, Label } from 'semantic-ui-react'
import { IMatch } from '../../app/models/match'
import { IPrediction } from '../../app/models/prediction'
import PredictionForm from './PredictionForm'
import { btnBetStyle } from './PredictionPage'

interface IProps {
    prediction: IPrediction | null;
    match: IMatch | null;
    openModal: (body: any) => void;
    closeModal: () => void;
    isLoggedIn: boolean;
}

const PredictionDetails: React.FC<IProps> = ({ prediction, match, closeModal, openModal, isLoggedIn }) => {


    const getOptions = () => {
        if (match) {
            return [
                {
                    key: match.teamA.id,
                    text: match.teamA.name,
                    value: match.teamA.id,
                }, {
                    key: match.teamB.id,
                    text: match.teamB.name,
                    value: match.teamB.id,
                }
            ];
        }

        return null;
    }

    return (
        <Segment.Group>
            <Segment clearing>
                {prediction && prediction.description}
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
                            {match?.teamA.name}<br />
                            <b>(x1.00)</b>
                        </Grid.Column>
                        <Grid.Column width={2}>
                            VS
                                </Grid.Column>
                        <Grid.Column>
                            <Image src='/assets/noimage.png' centered
                                size='tiny' />
                            {match?.teamB.name} <br />
                            <b>(x1.00)</b>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
            <Segment secondary clearing>
                {isLoggedIn ? (
                    <Fragment>
                        <Button style={btnBetStyle} primary
                            onClick={() => openModal(<PredictionForm
                                initialTeamIndex={1}
                                options={getOptions()}
                                closeModal={closeModal} />)}>
                            {match?.teamB.name}
                        </Button>
                        <Button style={btnBetStyle} primary
                            onClick={() => openModal(<PredictionForm
                                initialTeamIndex={0}
                                options={getOptions()}
                                closeModal={closeModal} />)}>
                            {match?.teamA.name}
                        </Button>
                    </Fragment>
                ) : (
                    <Label basic style={{float: 'right'}} content='You must be logged in to make a prediction.' />
                )}

            </Segment>
        </Segment.Group>
    )
}

export default observer(PredictionDetails)