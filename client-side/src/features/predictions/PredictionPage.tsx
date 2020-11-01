import { observer } from 'mobx-react-lite'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Divider, Grid, Label, Image, Segment, Button, GridColumn, Reveal, Header } from 'semantic-ui-react'
import MatchComments from './MatchComments'
import PredictionDetails from './PredictionDetails'
import PredictionHeader from './PredictionHeader'
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
    return (
        <Grid>
            <Grid.Column width={16}>
                <PredictionHeader />
            </Grid.Column>
            <Grid.Column width={12} style={{ paddingTop: '0px' }}>
                <PredictionDetails />
                <MatchComments />
            </Grid.Column>
            <Grid.Column width={4} style={{ marginTop: '27px' }}>
                <RecentPredictions />
            </Grid.Column>
        </Grid>
    )
}

export default observer(PredictionPage)