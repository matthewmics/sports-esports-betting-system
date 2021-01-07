import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroller';
import { Header, Loader, Segment } from 'semantic-ui-react';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { ProfileTransactionDetails } from './ProfileTransactionDetails';

const ProfileTransactionList = () => {

    const rootStore = useContext(RootStoreContext);
    const { transactionList, loadingTransaction, hasLoadedTransaction,
        loadTransactions, totalPagesTransaction,
        setPageTransaction, pageTransaction } = rootStore.profileStore;

    useEffect(() => {
        if (hasLoadedTransaction)
            loadTransactions();
    }, [hasLoadedTransaction, loadTransactions]);

    const handleLoadNext = () => {
        if (!loadingTransaction && totalPagesTransaction > 0) {
            setPageTransaction(pageTransaction + 1);
            loadTransactions();
        }
    }

    return (
        <div>
            <Header content='Transactions' icon='credit card outline' attached='top' />
            {!loadingTransaction && transactionList.length === 0 &&
                <Segment attached textAlign='center'>
                    No transactions yet.
                </Segment>
            }
            <InfiniteScroll
                className='ui segments'
                style={{ borderTop: '0', margin: '0' }}
                loadMore={handleLoadNext}
                hasMore={pageTransaction + 1 < totalPagesTransaction}
                initialLoad={false}>
                {transactionList.map(x => <ProfileTransactionDetails key={x.id} wagererTransaction={x} />)}
            </InfiniteScroll>
            <Loader inline='centered' active={loadingTransaction} />
        </div>
    )
}

export default observer(ProfileTransactionList);
