import { format, formatDistanceToNowStrict } from 'date-fns';
import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext, useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom';
import { Breadcrumb, Button, Divider, Icon, Label, Loader, Table } from 'semantic-ui-react';
import { IPrediction } from '../../../app/models/prediction';
import { RootStoreContext } from '../../../app/stores/rootStore';
import ReschedulePrediction from './ReschedulePrediction';

interface RouteParams {
    id: string;
}

interface IProps extends RouteComponentProps<RouteParams> {

}

const ManagePredictionsPage: React.FC<IProps> = ({ match }) => {

    const rootStore = useContext(RootStoreContext);
    const { selectMatch, selectedMatch, matchFilters } = rootStore.matchStore;
    const { openConfirmation, openModal } = rootStore.modalStore;
    const { setLive, loading, targetLoading } = rootStore.predictionStore;

    useEffect(() => {
        selectMatch(+match.params.id, false);
    }, [selectMatch, match.params.id]);

    const handleSetLive = (predictionId: number) => {
        openConfirmation("Are you sure you want this prediction to go live?", "Confirm prediction to go live",
            () => {
                setLive(predictionId);
            });
    }

    const handleReschedule = (prediction: IPrediction) => {
        openModal(<ReschedulePrediction prediction={prediction} />);
    }

    return (
        <Fragment>
            <Breadcrumb size='huge'>

                {matchFilters.get('status') === 'upcoming' &&
                    <Breadcrumb.Section as={Link} to='/admin/matches/upcoming' >Upcoming matches</Breadcrumb.Section>}

                {matchFilters.get('status') === 'live' &&
                    <Breadcrumb.Section as={Link} to='/admin/matches/live' >Live matches</Breadcrumb.Section>}

                {matchFilters.get('status') === 'finished' &&
                    <Breadcrumb.Section as={Link} to='/admin/matches/finished' >Finished matches</Breadcrumb.Section>}

                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section>Predictions</Breadcrumb.Section>
                {
                    selectedMatch &&
                    <Fragment>
                        <Breadcrumb.Divider icon='right arrow' />
                        <Breadcrumb.Section>
                            <b>{selectedMatch.teamA.name}</b> vs
                            <b>{" " + selectedMatch.teamB.name}</b>
                            <span style={{ color: 'teal' }}> {" "}
                                | BO{selectedMatch.series}
                            </span></Breadcrumb.Section>
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
                                    {selectedMatch.eventName}
                                </Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                                <Table.HeaderCell>Title</Table.HeaderCell>
                                <Table.HeaderCell>Description</Table.HeaderCell>
                                <Table.HeaderCell width={2}>Status</Table.HeaderCell>
                                <Table.HeaderCell width={3}>Starts At</Table.HeaderCell>
                                <Table.HeaderCell width={3}>Action</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {selectedMatch.predictions.map(x =>
                                <Table.Row key={x.id}>
                                    <Table.Cell>
                                        {x.isMain &&
                                            <Label color='yellow' ribbon>Main</Label>}
                                        {x.title}
                                    </Table.Cell>
                                    <Table.Cell>{x.description}</Table.Cell>
                                    <Table.Cell positive>
                                        {x.predictionStatus.name === 'live' &&
                                            <Icon name='warning circle' />
                                        }
                                        {x.predictionStatus.displayText}</Table.Cell>
                                    <Table.Cell>
                                        {format(x.startDate, 'EEEE, MMM dd, yyyy, p',)}
                                        <span style={{ color: 'teal', display: 'block' }}>
                                            {formatDistanceToNowStrict(x.startDate, { addSuffix: true })}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {(loading && targetLoading === x.id) ? <Loader inline active /> :
                                            <Fragment>
                                                <Button.Group vertical fluid>
                                                    {x.predictionStatus.name === 'open' &&
                                                        <Button content='Go live'
                                                            icon='rocket'
                                                            onClick={() =>
                                                                handleSetLive(x.id)}
                                                        />
                                                    }

                                                    {x.predictionStatus.name === 'live' &&
                                                        <Button content='Settle'
                                                            icon='check'
                                                        />
                                                    }

                                                    <Button content='Reschedule' icon='clock'
                                                        onClick={() => handleReschedule(x)} />

                                                    <Button content='Cancel' icon='close' />

                                                </Button.Group>
                                            </Fragment>}
                                    </Table.Cell>
                                </Table.Row>)}
                        </Table.Body>
                    </Table>
                </Fragment>
                :
                <Loader active={true} />
            }
            <div style={{ height: '20px' }} />
        </Fragment>
    )
}

export default observer(ManagePredictionsPage);