import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Table, Popup, Button, Icon, Pagination } from 'semantic-ui-react'
import { IColumnHeader } from '../../../../app/models/tableColumn'
import { ITeam } from '../../../../app/models/team'

interface IProps {
    teams: ITeam[] | null;
    totalPage: number;
    page: number;
    setPage: (page: number) => void;
    handleSort: (column: string, direction: string) => void;
}


const TeamsTable: React.FC<IProps> = ({ teams, totalPage, page, setPage, handleSort }) => {

    const [state, setState] = useState<IColumnHeader>({
        column: null,
        direction: undefined
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
                        width={8}>Team</Table.HeaderCell>
                    <Table.HeaderCell sorted={column === 'createdAt' ? direction : undefined}
                        onClick={() => handleSorting('createdAt')}
                        width={4}>Created</Table.HeaderCell>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {teams &&
                    teams.map(team =>
                        <Table.Row key={team.id}>
                            <Table.Cell><Link to={`teams/${team.id}`} >{team.name}</Link></Table.Cell>
                            <Table.Cell>{team.createdAt}</Table.Cell>
                            <Table.Cell>
                                <Popup content='Delete' trigger={<Button icon size='tiny' color='red'>
                                    <Icon name='trash' />
                                </Button>} />
                            </Table.Cell>
                        </Table.Row>
                    )}
            </Table.Body>

            <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell colSpan='3'>
                        <Pagination activePage={page + 1} totalPages={totalPage}
                            style={{ float: 'right' }}
                            onPageChange={(e, data) => setPage(+data.activePage! - 1)} />
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Footer>
        </Table>
    )
}

export default observer(TeamsTable);