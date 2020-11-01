import { observer } from 'mobx-react-lite'
import React, { Fragment } from 'react'
import { Label } from 'semantic-ui-react'

const PredictionTabs = () => {
    return (
        <Fragment>
            <Label content='Series Winner' color={true ? 'blue' : undefined} as='a' style={{ marginBottom: '5px' }} />
            <Label content='Series Winner' color={false ? 'blue' : undefined} as='a' style={{ marginBottom: '5px' }} />
            <Label content='Series Winner' color={false ? 'blue' : undefined} as='a' style={{ marginBottom: '5px' }} />
            <Label content='Series Winner' color={false ? 'blue' : undefined} as='a' style={{ marginBottom: '5px' }} />
            <Label content='Series Winner' color={false ? 'blue' : undefined} as='a' style={{ marginBottom: '5px' }} />
            <Label content='Series Winner' color={false ? 'blue' : undefined} as='a' style={{ marginBottom: '5px' }} />
        </Fragment>
    )
}

export default observer(PredictionTabs)