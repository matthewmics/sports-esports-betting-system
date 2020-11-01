import { observer } from 'mobx-react-lite'
import React, { Fragment } from 'react'
import { Header, Segment } from 'semantic-ui-react'

const RecentPredictions = () => {
    return (
        <Fragment>
            <Header as='h3' attached='top'>
                Recent Predictions
            </Header>
            <Segment attached style={{ minHeight: '400px', textAlign: 'center' }}>
                No user has predicted yet on this match.
            </Segment>
        </Fragment>
    )
}

export default observer(RecentPredictions)