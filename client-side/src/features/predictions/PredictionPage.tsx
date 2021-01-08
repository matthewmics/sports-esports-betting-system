import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import { RouteComponentProps, useLocation } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'
import MatchComments from './MatchComments/MatchComments'
import PredictionDetails from './PredictionDetails/PredictionDetails'
import PredictionHeader from './PredictionHeader'
import PredictionTabs from './PredictionTabs'
import RecentPredictions from './RecentPrediction/RecentPredictions'

export const btnBetStyle = {
    float: 'right',
    minWidth: '180px',
    color: 'white'
}

interface RouteParams {
    id: string
}

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

const PredictionPage: React.FC<RouteComponentProps<RouteParams>> = ({ match }) => {

    let query = useQuery();

    const rootStore = useContext(RootStoreContext);
    const { selectMatch, createHubConnection, stopHubConnection } = rootStore.matchStore;
    const { selectPrediction } = rootStore.predictionStore;

    useEffect(() => {

        const pid = query.get('pid');
        if (pid) {
            selectMatch(+match.params.id, false, false).then(() => {
                selectPrediction(+pid);
            });
        }else{
            selectMatch(+match.params.id);
        }
        createHubConnection(+match.params.id);

        return () => { stopHubConnection(); };

    }, [selectMatch, match.params.id, stopHubConnection, createHubConnection, query, selectPrediction])

    return (
        <Grid stackable>
            <Grid.Column width={16}>
                <PredictionHeader />
            </Grid.Column>
            <Grid.Column width={12} style={{ paddingTop: '0px' }}>
                <PredictionTabs />
            </Grid.Column>
            <Grid.Column width={12} style={{ paddingTop: '0px' }}>
                <PredictionDetails />
                <MatchComments />
            </Grid.Column>
            <Grid.Column width={4} style={{ paddingTop: '0px' }}>
                <RecentPredictions />
            </Grid.Column>
        </Grid>
    )
}

export default observer(PredictionPage)