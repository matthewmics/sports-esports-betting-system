import React, { Fragment } from 'react'
import { Breadcrumb, Button, Divider, Dropdown, Grid, Icon, Input, Label, Menu, Popup, Table } from 'semantic-ui-react'

const entrySelection = [
    {
        key: '0', text: '10', value: '10',
    }, {
        key: '1', text: '20', value: '20',
    }, {
        key: '2', text: '50', value: '50',
    }, {
        key: '3', text: '100', value: '100',
    }
]

export const TeamsPage = () => {
    return (
        <Fragment>
            <Breadcrumb size='huge'>
                <Breadcrumb.Section>Teams</Breadcrumb.Section>
            </Breadcrumb>
            <Divider />
            <Button icon='add' content='Create Team' primary style={{ marginBottom: '10px' }} />
            <Grid>
                <Grid.Column computer={10} tablet={16} mobile={16}>
                    Show
                        <Dropdown style={{ minWidth: 'auto', margin: '0px 10px' }} placeholder='State'
                        value="10"
                        selection options={entrySelection} />
                        entries

                    <div className="float right">
                        Search:
                        <Input style={{ marginLeft: '10px' }} placeholder='Search...' />
                    </div>

                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width={12}>Team</Table.HeaderCell>
                                <Table.HeaderCell>Action</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>Team Secret</Table.Cell>
                                <Table.Cell>
                                    <Popup content='Modify' trigger={<Button icon size='tiny' primary>
                                        <Icon name='edit' />
                                    </Button>} />
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>

                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell colSpan='3'>
                                    <Menu floated='right' pagination>
                                        <Menu.Item as='a' icon>
                                            <Icon name='chevron left' />
                                        </Menu.Item>
                                        <Menu.Item as='a'>1</Menu.Item>
                                        <Menu.Item as='a'>2</Menu.Item>
                                        <Menu.Item as='a' icon>
                                            <Icon name='chevron right' />
                                        </Menu.Item>
                                    </Menu>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                </Grid.Column>
            </Grid>
        </Fragment>
    )
}
