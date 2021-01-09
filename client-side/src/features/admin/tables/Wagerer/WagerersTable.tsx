import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react'
import { Button, Icon, Label, Pagination, Table } from 'semantic-ui-react';
import { IWagererData } from '../../../../app/models/wagerer'
import { RootStoreContext } from '../../../../app/stores/rootStore';

interface IProps {
    wagerers: IWagererData[] | null;
    totalPage: number;
    page: number;
    setPage: (page: number) => void;
    handleSort: (column: string, direction: string) => void;
}

export const WagerersTable: React.FC<IProps> = ({
    wagerers, totalPage, page, setPage, handleSort,
}) => {

    const rootStore = useContext(RootStoreContext);
    const { ban, unban } = rootStore.wagererStore;
    const { openConfirmation } = rootStore.modalStore;

    const [state, setState] = useState({
        column: null,
        direction: undefined
    } as {
        column: string | null;
        direction: 'ascending' | 'descending' | undefined;
    });

    const { column, direction } = state;

    const handleSorting = (column: string) => {
        let nextDirection: any;

        if (state.column === column) {
            nextDirection = direction === 'ascending' ? 'descending' : 'ascending';
        } else {
            nextDirection = 'ascending';
        }

        setState({
            column: column,
            direction: nextDirection
        })

        handleSort(column, nextDirection === 'ascending' ? 'asc' : 'desc')
    }

    return (
        <Table sortable celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell sorted={column === 'name' ? direction : undefined}
                        onClick={() => handleSorting('name')}
                        width={6}>Name</Table.HeaderCell>
                    <Table.HeaderCell sorted={column === 'email' ? direction : undefined}
                        onClick={() => handleSorting('email')}
                        width={4}>Email</Table.HeaderCell>
                    <Table.HeaderCell width={3} sorted={column === 'status' ? direction : undefined}
                        onClick={() => handleSorting('status')}>Status</Table.HeaderCell>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {wagerers && wagerers.map((x: IWagererData) =>
                    <Table.Row key={x.id}>
                        <Table.Cell>{x.displayName}</Table.Cell>
                        <Table.Cell>{x.email}</Table.Cell>
                        <Table.Cell>
                            {x.banned ?
                                <Label basic color='red'>
                                    <Icon name='warning' />
                                    banned
                                </Label>
                                :
                                <Label basic content='active' color='green' />
                            }
                        </Table.Cell>
                        <Table.Cell>
                            {x.banned ?
                                <Button content='Unban' color='orange' size='mini' onClick={() => {
                                    openConfirmation(`Are you sure you want to Unban ${x.displayName} ?`, 'Ban user',
                                        () => { unban(x.id) })
                                }} />
                                :
                                <Button content='Ban' size='mini' color='red' onClick={() => {
                                    openConfirmation(`Are you sure you want to ban ${x.displayName} ?`, 'Unban user',
                                        () => { ban(x.id) })
                                }} />
                            }
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
            <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell colSpan='4'>
                        <Pagination activePage={page + 1} totalPages={totalPage}
                            style={{ float: 'right' }}
                            onPageChange={(e, data) => setPage(+data.activePage! - 1)} />
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Footer>
        </Table>
    )
}

export default observer(WagerersTable);
