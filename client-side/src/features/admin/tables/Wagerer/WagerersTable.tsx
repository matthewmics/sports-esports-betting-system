import { observer } from 'mobx-react-lite';
import React, { useState } from 'react'
import { Button, Pagination, Table } from 'semantic-ui-react';
import { IWagererData } from '../../../../app/models/wagerer'

interface IProps {
    wagerers: IWagererData[] | null;
    totalPage: number;
    page: number;
    setPage: (page: number) => void;
    handleSort: (column: string, direction: string) => void;
}

export const WagerersTable: React.FC<IProps> = ({
    wagerers, totalPage, page, setPage, handleSort
}) => {

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
                        width={5}>Email</Table.HeaderCell>
                    <Table.HeaderCell width={2}>Status</Table.HeaderCell>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {wagerers && wagerers.map((x: IWagererData) =>
                    <Table.Row key={x.id}>
                        <Table.Cell>{x.displayName}</Table.Cell>
                        <Table.Cell>{x.email}</Table.Cell>
                        <Table.Cell>Active</Table.Cell>
                        <Table.Cell><Button content='Ban' color='red' /></Table.Cell>
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
