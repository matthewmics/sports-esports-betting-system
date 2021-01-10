import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react'
import { RootStoreContext } from '../stores/rootStore';

const CommonConnection = () => {

    const rootStore = useContext(RootStoreContext);
    const { createHubConnection } = rootStore.commonStore;

    useEffect(() => {
        createHubConnection();
    }, [createHubConnection]);

    return null;
}

export default observer(CommonConnection);