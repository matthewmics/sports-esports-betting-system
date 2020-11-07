import React, { Fragment } from 'react'
import { match } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import { IMatch } from '../../../app/models/match'
import PredictionForm from '../PredictionForm'
import { btnBetStyle } from '../PredictionPage'

interface IProps {
    match: IMatch,
    openModal: (body: any) => void;
    closeModal: () => void;

}

export const PredictionDetailsActions: React.FC<IProps> = ({match, openModal, closeModal}) => {

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
    )
}
