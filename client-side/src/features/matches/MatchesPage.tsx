import { observer } from 'mobx-react-lite'
import React from 'react'
import { Grid, GridColumn, Segment } from 'semantic-ui-react';

const MatchesPage = () => {
    return (
        <Grid centered>
            <GridColumn width={12}>
                <Segment.Group>
                    <Segment>[ICON] ESL ONE <span style={{float: "right", color:'teal'}}>60s from now</span></Segment>
                    <Segment>Middle</Segment>
                    <Segment>Bottom</Segment>
                </Segment.Group>
            </GridColumn>
            <GridColumn width={12}>
                <Segment.Group>
                    <Segment>[ICON] ESL ONE <span style={{float: "right", color:'teal'}}>60s from now</span></Segment>
                    <Segment>Middle</Segment>
                    <Segment>Bottom</Segment>
                </Segment.Group>
            </GridColumn>
        </Grid>
    )
}

export default observer(MatchesPage);