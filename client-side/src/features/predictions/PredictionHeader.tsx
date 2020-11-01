import { observer } from 'mobx-react-lite'
import React, { Fragment } from 'react'
import { Divider, Label } from 'semantic-ui-react'

const PredictionHeader = () => {
    return (
        <Fragment>
            <Label basic image>
                <img src='/assets/dota2.png' alt='Team' />DOTA 2
            </Label> { " "} Beyond The Summit 13
            <span style={{ float: 'right', color: 'teal', lineHeight: '27px' }}>
                Secret vs Nigma • B03
            </span >
            <Divider />
        </Fragment>
    )
}

export default observer(PredictionHeader)