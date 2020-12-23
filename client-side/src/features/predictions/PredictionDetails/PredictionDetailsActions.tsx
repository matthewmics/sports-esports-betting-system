import { observer } from 'mobx-react-lite'
import React, { Fragment } from 'react'
import { Button } from 'semantic-ui-react'
import { IMatch } from '../../../app/models/match'
import { IPrediction, predictionStatus } from '../../../app/models/prediction'
import PredictionForm from '../PredictionForm'
import { btnBetStyle } from '../PredictionPage'

interface IProps {
    match: IMatch,
    prediction: IPrediction | null,
    openModal: (body: any) => void;
}

const PredictionDetailsActions: React.FC<IProps> = ({ match, openModal, prediction }) => {

    const cannotPredict = prediction?.predictionStatus.name !== predictionStatus.open.name;

    return (
        <Fragment>
            <Button style={btnBetStyle} 
                className='button-prediction'
                disabled={cannotPredict}
                onClick={() => openModal(<PredictionForm
                    initialTeam={match.teamB} />)}>
                {match.teamB.name}
            </Button>
            <Button style={btnBetStyle} 
                className='button-prediction'
                disabled={cannotPredict}
                onClick={() => openModal(<PredictionForm
                    initialTeam={match.teamA} />)}>
                {match.teamA.name}
            </Button>
        </Fragment>
    )
}

export default observer(PredictionDetailsActions);