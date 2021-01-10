import React, { Fragment } from 'react'
import { Label } from 'semantic-ui-react'
import { IPredictionStatus } from '../../models/prediction'
import { ScheduleTimer } from '../dates/ScheduleTimer'

export const StatusDetails: React.FC<{ status: IPredictionStatus, startDate: Date }> = ({ status, startDate }) => {
    return (
        <Fragment>
            {status.name === 'live' &&
                <Label color='red' content='Live' icon='rocket' />
            }
            {status.name === 'cancelled' &&
                <Label content='Cancelled' />
            }
            {status.name === 'settled' &&
                <Label content='Settled' />
            }
            {status.name === 'open' &&
                <ScheduleTimer date={startDate} />
            }
        </Fragment>
    )
}
