import { formatDistanceToNowStrict } from 'date-fns'
import React, { Fragment } from 'react'
import { Icon, Label } from 'semantic-ui-react'
import { IPredictionStatus } from '../models/prediction'

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
                <span>
                    <Icon name='clock outline' />
                    {formatDistanceToNowStrict(startDate, { addSuffix: true })}
                </span>
            }
        </Fragment>
    )
}
