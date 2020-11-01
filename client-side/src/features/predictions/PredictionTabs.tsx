import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext, useEffect } from 'react'
import { Label } from 'semantic-ui-react'
import { IMatch } from '../../app/models/match'
import { IPrediction } from '../../app/models/prediction'
import { RootStoreContext } from '../../app/stores/rootStore'

interface IProps {
    match: IMatch | null;
    selectedPrediction: IPrediction | null;
    selectPrediction: (id: number) => void;
}

const PredictionTabs: React.FC<IProps> = ({ match, selectPrediction, selectedPrediction }) => {

    return (
        <Fragment>
            {match && match.predictions.map(prediction => {
                return (
                    <Label
                        onClick={()=>{selectPrediction(prediction.id)}}
                        color={selectedPrediction!.id === prediction.id ? 'blue' : undefined}
                        as='a'
                        style={{ marginBottom: '5px' }}>
                        {prediction.title}
                        <Label style={{marginLeft: '9px'}}
                            content={prediction.status} color='green'/>
                    </Label>
                )
            })}
        </Fragment>
    )
}

export default observer(PredictionTabs)