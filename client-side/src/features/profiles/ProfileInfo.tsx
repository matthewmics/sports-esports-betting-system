import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Segment, Header, Statistic, Button, Image, Reveal } from 'semantic-ui-react'
import PhotoSelectAndCrop from '../../app/common/photos/PhotoSelectAndCrop';
import { formatToLocalPH } from '../../app/common/util/util';
import { RootStoreContext } from '../../app/stores/rootStore'
import PaypalDepositForm from '../paypal/Deposit/PaypalDepositForm';
import PaypalWithdrawForm from '../paypal/Withdraw/PaypalWithdrawForm';
import { ProfileInfoPlaceholder } from './ProfileInfoPlaceholder';
import ProfileTransactionList from './ProfileTransaction/ProfileTransactionList';

const ProfileInfo = () => {

    const rootStore = useContext(RootStoreContext);
    const { predictionStats, loading, loadPredictionStats, changePhoto, loadTransactions } = rootStore.profileStore;
    const { openModal } = rootStore.modalStore;
    const { user } = rootStore.userStore;

    const [showTransaction, setShowTransaction] = useState(false);

    useEffect(() => {
        if (!predictionStats)
            loadPredictionStats();
    }, [loadPredictionStats, predictionStats])


    if (loading)
        return <ProfileInfoPlaceholder />

    return (
        <Fragment>
            <Segment.Group>
                <Segment textAlign='center'>
                    <Reveal animated='rotate' style={{ display: 'inline-block' }}>
                        <Reveal.Content visible>
                            <Image circular size='tiny' src={user && (user.photo || '/assets/user_default.png')} />
                        </Reveal.Content>
                        <Reveal.Content hidden>
                            <Button style={{ height: '80px', width: '80px', fontSize: '10px' }}
                                circular icon='upload' content='Change'
                                onClick={() => openModal(<PhotoSelectAndCrop aspectRatio={1 / 1} onImageSet={(file) => {
                                    changePhoto(file!);
                                }} />)} />
                        </Reveal.Content>
                    </Reveal>
                    <div className='text-muted text-small' style={{ textAlign: 'center', fontWeight: 'bold' }}>Hover to change photo</div>
                    <Header content={user?.displayName} style={{ marginTop: '7px' }} />
                </Segment>
                <Segment textAlign='center'>
                    <Statistic.Group widths={2} size='tiny'>
                        <Statistic color='blue'>
                            <Statistic.Value>{predictionStats?.predictionTotal}</Statistic.Value>
                            <span style={{ color: 'teal' }}>PREDICTIONS</span>
                        </Statistic>
                        <Statistic color='blue'>
                            <Statistic.Value>{predictionStats?.predictionValue}</Statistic.Value>
                            <span style={{ color: 'teal' }}>PREDICTION VALUE</span>
                        </Statistic>
                    </Statistic.Group>
                </Segment>
                <Segment textAlign='center'>
                    <Statistic color='orange' size='tiny' style={{ display: 'block' }}>
                        <Statistic.Value>{user && formatToLocalPH(user.walletBalance)}</Statistic.Value>
                        <span style={{ color: 'teal' }}>TOTAL BALANCE</span>
                    </Statistic>
                    <Button content='WITHDRAW' fluid
                        onClick={() => openModal(<PaypalWithdrawForm />)} />
                    <Button content='ADD CREDITS' fluid primary
                        onClick={() => openModal(<PaypalDepositForm />)}
                        style={{ marginTop: '1em' }} />
                </Segment>
            </Segment.Group>

            {predictionStats &&
                <Fragment>
                    <Segment.Group>
                        <Header content='Monthly earnings' icon='money bill alternate outline' attached='top' />
                        <Segment className='clearFix' attached>
                            {predictionStats.monthlyEarnings >= 0 ?

                                <div className='text-green' style={{ textAlign: 'center' }}>
                                    <h1>+{formatToLocalPH(predictionStats.monthlyEarnings)}</h1>
                                </div>
                                :
                                <div className='text-red' style={{ textAlign: 'center' }}>
                                    <h1>-{formatToLocalPH(predictionStats.monthlyEarnings)}</h1>
                                </div>
                            }
                            <div style={{ textAlign: 'right', marginTop: '8px' }}
                                className='text-muted text-italic'>
                                Last updated: {" "}{format(predictionStats.lastUpdated, 'ccc, MMM Do, p')}
                            </div>
                        </Segment>
                    </Segment.Group>
                    <Segment.Group>

                        <Header content='Total earnings' icon='money bill alternate outline' attached='top' />
                        <Segment className='clearFix' attached>
                            {predictionStats.allTimeEarnings >= 0 ?
                                <div className='text-green' style={{ textAlign: 'center' }}>
                                    <h1>+{formatToLocalPH(predictionStats.allTimeEarnings)}</h1>
                                </div>
                                :
                                <div className='text-red' style={{ textAlign: 'center' }}>
                                    <h1>-{formatToLocalPH(predictionStats.allTimeEarnings)}</h1>
                                </div>
                            }
                            <div style={{ textAlign: 'right', marginTop: '8px' }}
                                className='text-muted text-italic'>
                                Last updated: {" "}{format(predictionStats.lastUpdated, 'ccc, MMM Do, p')}
                            </div>
                        </Segment>
                    </Segment.Group>
                </Fragment>
            }
            {showTransaction ?
                <Fragment>
                    <Button content='Hide transactions' icon='eye slash' fluid onClick={() => {
                        setShowTransaction(false);
                    }} />
                    <ProfileTransactionList />
                </Fragment>
                :
                <Button content='Show transactions' icon='eye' fluid onClick={() => {
                    setShowTransaction(true);
                    loadTransactions();
                }} />
            }
        </Fragment>
    )
}

export default observer(ProfileInfo);