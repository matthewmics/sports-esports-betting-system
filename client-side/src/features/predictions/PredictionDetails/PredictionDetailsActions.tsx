import { observer } from 'mobx-react-lite'
import React, { Fragment } from 'react'
import { Button } from 'semantic-ui-react'
import { IMatch } from '../../../app/models/match'
import PredictionForm from '../PredictionForm'
import { btnBetStyle } from '../PredictionPage'

interface IProps {
    match: IMatch,
    openModal: (body: any) => void;
}

const PredictionDetailsActions: React.FC<IProps> = ({ match, openModal }) => {
 

    return (
        <Fragment>
            <Button style={btnBetStyle} primary
                onClick={() => openModal(<PredictionForm
                    initialTeam={match.teamB}  />)}>
                {match.teamB.name}
            </Button>
            <Button style={btnBetStyle} primary
                onClick={() => openModal(<PredictionForm 
                    initialTeam={match.teamA}  />)}>
                {match.teamA.name}
            </Button>
        </Fragment>
    )
}

export default observer(PredictionDetailsActions);