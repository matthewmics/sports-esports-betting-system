import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext } from 'react'
import { Label } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'


const inactiveStyle = {
    opacity: '50%',
    marginBottom: '9px'
}
const activeStyle = {
    marginBottom: '9px'
}

const PredictionTabs = () => {

    const rootStore = useContext(RootStoreContext);
    const { loading, selectPrediction, selectedPrediction } = rootStore.predictionStore;
    const { selectedMatch: match } = rootStore.matchStore;


    return (
        <Fragment>
            {match && match.predictions.map(prediction => {
                const predictionStatusName = prediction.predictionStatus.name;
                var statusColor = 'green' as any;
                if (predictionStatusName === 'live')
                    statusColor = 'red';
                else if (predictionStatusName === 'cancelled' || predictionStatusName === 'settled')
                    statusColor = 'teal';
                return (
                    <Label key={prediction.id}
                        onClick={() => {
                            if (!loading) {
                                selectPrediction(prediction.id)
                            }
                        }}
                        color={selectedPrediction && (selectedPrediction.id === prediction.id) ? 'blue' : undefined}
                        as='a'
                        style={loading ? inactiveStyle : activeStyle}>
                        {prediction.title}
                        <Label style={{ marginLeft: '9px' }}
                            content={prediction.predictionStatus.displayText} color={statusColor} />
                    </Label>
                )
            })}
        </Fragment>
    )
}

export default observer(PredictionTabs)