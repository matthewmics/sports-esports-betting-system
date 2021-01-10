import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext, useEffect } from 'react'
import { Breadcrumb, Divider, Dropdown, Grid, Segment } from 'semantic-ui-react'
import { entrySelection } from '../../../../app/common/options/options';
import { SearchAsYouType } from '../../../../app/common/components/SearchAsYouType';
import { RootStoreContext } from '../../../../app/stores/rootStore'
import { WagerersTable } from './WagerersTable';

const WagerersPage = () => {

    const rootStore = useContext(RootStoreContext);
    const { loading, setLimit, limit, filters, setFilter, wagererList, loadWagerers, hasLoaded,
        totalPage, setPage, page } = rootStore.wagererStore;

    const handleSearch = (term: string) => {
        setFilter("q", term);
    }

    const handleSort = (column: string, direction: string) => {
        setFilter("orderBy", direction, false);
        setFilter("sortBy", column);
    }

    const handleSetPage = (page: number) => {
        setPage(page);
        loadWagerers();
    }

    useEffect(() => {
        if (!hasLoaded) {
            loadWagerers();
        }
    }, [loadWagerers, hasLoaded])

    return (
        <Fragment>
            <Breadcrumb size='huge'>
                <Breadcrumb.Section>Wagerers</Breadcrumb.Section>
            </Breadcrumb>
            <Divider />
            <Grid>
                <Grid.Column computer={10} tablet={16} mobile={16}>
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
                                initialValue={filters.get('q')} />
                        </div>

                        <WagerersTable wagerers={wagererList}
                            totalPage={totalPage}
                            setPage={handleSetPage}
                            page={page}
                            handleSort={handleSort} />
                    </Segment>
                </Grid.Column>
            </Grid>
        </Fragment>
    )
}

export default observer(WagerersPage)