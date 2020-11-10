import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'
import MatchComments from './MatchComments'
import PredictionDetails from './PredictionDetails/PredictionDetails'
import PredictionHeader from './PredictionHeader'
import PredictionTabs from './PredictionTabs'
import RecentPredictions from './RecentPredictions'

export const btnBetStyle = {
    float: 'right',
    minWidth: '180px',
    color: 'white'
}

interface RouteParams {
    id: string
}

interface IProps extends RouteComponentProps<RouteParams> {

}

const PredictionPage: React.FC<IProps> = ({ match }) => {

    const rootStore = useContext(RootStoreContext);
    const { selectMatch, selectedMatch, selectedPrediction, selectPrediction,
        loading, predict, unpredict
    } = rootStore.matchStore;
    const { openModal, closeModal } = rootStore.modalStore;
    const { isLoggedIn } = rootStore.userStore;

    useEffect(() => {
        selectMatch(+match.params.id)
    }, [selectMatch, match.params.id, isLoggedIn])

    return (
        <Grid>
            <Grid.Column width={16}>
                <PredictionHeader />
            </Grid.Column>
            <Grid.Column width={12} style={{ paddingTop: '0px' }}>
                <PredictionTabs match={selectedMatch} loading={loading}
                    selectPrediction={selectPrediction}
                    selectedPrediction={selectedPrediction}
                />
            </Grid.Column>
            <Grid.Column width={12} style={{ paddingTop: '0px' }}>
                <PredictionDetails match={selectedMatch} prediction={selectedPrediction}
                    unpredict={unpredict}
                    loading={loading}
                    openModal={openModal}
                    isLoggedIn={isLoggedIn} />
                <MatchComments />
            </Grid.Column>
            <Grid.Column width={4} style={{ paddingTop: '0px' }}>
                <RecentPredictions />
            </Grid.Column>
        </Grid>
    )
}

export default observer(PredictionPage)