import { format, formatDistanceToNowStrict } from 'date-fns';
import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext, useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom';
import { Breadcrumb, Button, Divider, Icon, Label, Loader, Table } from 'semantic-ui-react';
import { IPrediction } from '../../../app/models/prediction';
import { RootStoreContext } from '../../../app/stores/rootStore';
import PredictionForm from './PredictionForm';
import ReschedulePrediction from './ReschedulePrediction';
import SettlePrediction from './SettlePrediction';

interface RouteParams {
    id: string;
}

interface IProps extends RouteComponentProps<RouteParams> {

}

const ManagePredictionsPage: React.FC<IProps> = ({ match }) => {

    const rootStore = useContext(RootStoreContext);
    const { selectMatch, selectedMatch, matchFilters } = rootStore.matchStore;
    const { openConfirmation, openModal, openErrorModal } = rootStore.modalStore;
    const { setLive, loading, targetLoading, cancel } = rootStore.predictionStore;

    useEffect(() => {
        selectMatch(+match.params.id, false);
    }, [selectMatch, match.params.id]);

    const handleSetLive = (predictionId: number) => {
        openConfirmation("Are you sure you want the prediction to go live?", "Confirm prediction to go live",
            () => {
                setLive(predictionId).catch(error => {
                    openErrorModal(error, "Prediction can't go live");
                });
            });
    }

    const handleCancel = (predictionId: number) => {
        openConfirmation("Are you sure you want to cancel the prediction?", "Confirm cancel prediction",
            () => {
                cancel(predictionId);
            });
    }

    const handleReschedule = (prediction: IPrediction) => {
        openModal(<ReschedulePrediction prediction={prediction} />);
    }

    return (
        <Fragment>
            <Breadcrumb size='huge'>

                {(matchFilters.get('status') !== 'live' && matchFilters.get('status') !== 'finished') &&
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
                    <Button primary content='Add prediction'
                        onClick={() => openModal(<PredictionForm />)} />
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
                                    <Table.Cell
                                        positive={x.predictionStatus.name === 'open' ||
                                            x.predictionStatus.name === 'settled'}
                                        warning={x.predictionStatus.name === 'live'}
                                        negative={x.predictionStatus.name === 'cancelled'}>
                                        {x.predictionStatus.name === 'live' &&
                                            <Icon name='warning circle' />
                                        }{x.predictionStatus.name === 'settled' &&
                                            <Icon name='check' />
                                        }{x.predictionStatus.name === 'cancelled' &&
                                            <Icon name='close' />
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
                                                            onClick={() => openModal(<SettlePrediction prediction={x} />)}
                                                        />
                                                    }

                                                    {x.predictionStatus.name === 'settled' &&
                                                        <Label color='green' icon='trophy' content={x.winner.name} />
                                                    }

                                                    {x.predictionStatus.name === 'cancelled' &&
                                                        <Label color='red' icon='cancel' content='Cancelled' />
                                                    }

                                                    {(x.predictionStatus.name !== 'settled' &&
                                                        x.predictionStatus.name !== 'cancelled') &&

                                                        <Fragment>
                                                            <Button content='Reschedule' icon='clock'
                                                                onClick={() => handleReschedule(x)} />

                                                            <Button content='Cancel' icon='close'
                                                                onClick={() => handleCancel(x.id)} />
                                                        </Fragment>
                                                    }

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