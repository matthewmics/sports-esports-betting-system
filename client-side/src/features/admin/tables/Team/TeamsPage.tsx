import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Dropdown, Grid, Segment } from 'semantic-ui-react'
import { entrySelection } from '../../../../app/common/options/options'
import { SearchAsYouType } from '../../../../app/common/components/SearchAsYouType'
import { RootStoreContext } from '../../../../app/stores/rootStore'
import TeamsTable from './TeamsTable'

const TeamsPage = () => {

    const rootStore = useContext(RootStoreContext);
    const { teams, loadTeams, loading, totalPage, page, setPage, setFilter, limit, setLimit, filters } = rootStore.teamStore;

    const handleSetPage = (page: number) => {
        setPage(page);
        loadTeams();
    }

    const handleSearch = (term: string) => {
        setFilter("q", term);
    }
    
    const handleSort = (column: string, direction: string) => {
        setFilter("orderBy", direction, false);
        setFilter("sortBy", column);
    }

    useEffect(() => {
        if (!teams) {
            loadTeams();
        }
    }, [loadTeams, teams])

    return (
        <Fragment>
            <Breadcrumb size='huge'>
                <Breadcrumb.Section>Teams</Breadcrumb.Section>
            </Breadcrumb>
            <Divider />
            <Grid>
                <Grid.Column computer={10} tablet={16} mobile={16}>
                    <Button content='Add team' primary style={{ marginBottom: '10px' }}
                        as={Link} to='/admin/tables/teams/create' />
                    <Segment basic style={{ padding: 0 }} loading={loading}>

                        Show
                        <Dropdown style={{ minWidth: 'auto', margin: '0px 10px' }}
                            value={String(limit)}
                            onChange={(e, data) => setLimit(+data.value!)}
                            selection options={entrySelection} />
                        entries

                        <div className="float right">
                            Search:
                            <SearchAsYouType handleSearch={handleSearch} 
                                initialValue={filters.get('q')}/>
                        </div>

                        <TeamsTable totalPage={totalPage}
                            handleSort={handleSort}
                            page={page}
                            setPage={handleSetPage}
                            teams={teams} />
                    </Segment>
                </Grid.Column>
            </Grid>
        </Fragment>
    )
}

export default observer(TeamsPage);