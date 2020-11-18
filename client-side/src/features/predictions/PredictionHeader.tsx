import { observer } from 'mobx-react-lite'
import React, { Fragment } from 'react'
import { Divider, Label } from 'semantic-ui-react'
import { IMatch } from '../../app/models/match'

interface IProps {
    match: IMatch | null;
}


const PredictionHeader: React.FC<IProps> = ({ match }) => {

    return (
        match ? (
            <Fragment>
                <Label basic image>
                    <img src={`/assets/${match.game.name}.png`} alt='Team' />{match.game.displayText}
                </Label> { " "} {match.eventName}
                <span style={{ float: 'right', color: 'teal', lineHeight: '27px' }}>
                    <b>{match.teamA.name}</b>{" "} vs {" "}<b>{match.teamB.name}</b> • B0{match.series}
                </span >
                <Divider />
            </Fragment>
        ) : (
                <Fragment>
                    {/* loading placeholder here */}
                </Fragment>
            )
    )
}

export default observer(PredictionHeader)