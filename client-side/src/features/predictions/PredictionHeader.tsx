import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext } from 'react'
import { Divider, Label, Loader } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'



const PredictionHeader = () => {
    const rootStore = useContext(RootStoreContext);
    const { selectedMatch: match } = rootStore.matchStore;

    return (
        match ? (
            <Fragment>
                <Label basic image>
                    <img src={`/assets/${match.game.name}.png`} alt='Team' />{match.game.displayText}
                </Label> { " "} {match.eventName}
                <span style={{ float: 'right', color: 'teal', lineHeight: '27px' }}>
                    {match.teamA.name}{" "} <span style={{ color: 'green', fontWeight: 'bold' }}>vs</span> {" "}{match.teamB.name} ∙ B0{match.series}
                </span >
                <Divider />
            </Fragment>
        ) : (
                <Fragment>
                    <Loader active inline />
                    <Divider />
                </Fragment>
            )
    )
}

export default observer(PredictionHeader)