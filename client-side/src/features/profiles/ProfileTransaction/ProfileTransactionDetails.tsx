import { format } from 'date-fns'
import React from 'react'
import { Segment } from 'semantic-ui-react'
import { formatToLocalPH } from '../../../app/common/util/util'
import { IWagererTransaction } from '../../../app/models/profile'

export const ProfileTransactionDetails: React.FC<{
    wagererTransaction: IWagererTransaction
}> = ({
    wagererTransaction: transaction
}) => {
        return (
            transaction.type === 'deposit' ?

                <Segment>
                    <span style={{ display: 'flex' }}>
                        <div style={{ width: '220px' }}>
                            <div className='text-bold'>
                                Deposit {formatToLocalPH(transaction.amount)}
                            </div>
                            <div className='text-muted'>
                                Fee: {formatToLocalPH(transaction.fees)}
                            </div>
                        </div>
                        <div className='text-align-right width-100p'>
                            <div className='text-green text-bold'>
                                +{formatToLocalPH(transaction.amount)}
                            </div>
                            <div className='text-small text-muted text-italic'>
                                {format(transaction.when, 'ccc, MMM Do, p')}
                            </div>
                        </div>
                    </span>
                </Segment>

                :

                <Segment>
                    <span style={{ display: 'flex' }}>
                        <div className='width-100p'>
                            <div className='text-bold'>
                                Withdraw {formatToLocalPH(transaction.amount)}
                            </div>
                            <div className='text-muted'>
                                Fee: {formatToLocalPH(transaction.fees)}
                            </div>
                        </div>
                        <div className='text-align-right width-100p'>
                            <div className='text-red text-bold'>
                                -{formatToLocalPH(transaction.amount + transaction.fees)}
                            </div>
                            <div className='text-small text-muted text-italic'>
                                {format(transaction.when, 'ccc, MMM Do, p')}
                            </div>
                        </div>
                    </span>
                </Segment>
        )
    }
