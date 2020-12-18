import { format, formatDistanceToNowStrict } from 'date-fns';
import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext, useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom';
import { Breadcrumb, Button, Divider, Header, Label, Loader, Table } from 'semantic-ui-react';
import { RootStoreContext } from '../../../app/stores/rootStore';

interface RouteParams {
    id: string;
}

interface IProps extends RouteComponentProps<RouteParams> {

}

const ManagePredictionsPage: React.FC<IProps> = ({ match }) => {

    const rootStore = useContext(RootStoreContext);
    const { selectMatch, selectedMatch } = rootStore.matchStore;

    useEffect(() => {
        selectMatch(+match.params.id);
    }, [selectMatch, match.params.id]);

    return (
        <Fragment>
            <Breadcrumb size='huge'>
                <Breadcrumb.Section as={Link} to='/admin/matches/upcoming' >Upcoming matches</Breadcrumb.Section>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section>Predictions</Breadcrumb.Section>
                {
                    selectedMatch &&
                    <Fragment>
                        <Breadcrumb.Divider icon='right arrow' />
                        <Breadcrumb.Section><b>{selectedMatch.teamA.name}</b> vs
                                              <b>{" " + selectedMatch.teamB.name}</b> </Breadcrumb.Section>
                    </Fragment>
                }
            </Breadcrumb>
            <Divider />

            {selectedMatch ?
                <Fragment>
                    <Button primary content='Add prediction' />
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell style={{ backgroundColor: 'white' }} colSpan='5'>
                                    <Label basic image>
                                        <img src={`/assets/${selectedMatch.game.name}.png`} alt='Team' /> {selectedMatch.game.displayText}
                                    </Label> {" "}
                                    {selectedMatch.eventName} {" "}
                                    <span style={{ color: 'teal' }}>
                                        | BO{selectedMatch.series}
                                    </span>
                                </Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                                <Table.HeaderCell>Title</Table.HeaderCell>
                                <Table.HeaderCell width={3}>Description</Table.HeaderCell>
                                <Table.HeaderCell width={2}>Status</Table.HeaderCell>
                                <Table.HeaderCell width={3}>Starts At</Table.HeaderCell>
                                <Table.HeaderCell width={4}>Action</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {selectedMatch.predictions.map(x =>
                                <Table.Row>
                                    <Table.Cell>
                                        {x.isMain &&
                                            <Label color='yellow' ribbon>Main</Label>}
                                        {x.title}
                                    </Table.Cell>
                                    <Table.Cell>{x.description}</Table.Cell>
                                    <Table.Cell positive>{x.predictionStatus.displayText}</Table.Cell>
                                    <Table.Cell>{format(x.startDate, 'PPpp')}
                                        <span style={{ color: 'teal', display: 'block' }}>
                                            {formatDistanceToNowStrict(x.startDate, {addSuffix: true})}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button primary content='Start' />
                                        <Button content='Cancel' />
                                    </Table.Cell>
                                </Table.Row>)}
                        </Table.Body>
                    </Table>
                </Fragment>
                :
                <Loader active={true} />
            }
        </Fragment>
    )
}

export default observer(ManagePredictionsPage);