import { observer } from 'mobx-react-lite'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Divider, Grid, Header, Image } from 'semantic-ui-react'
import { IMatch } from '../../../app/models/match'
import { IPrediction } from '../../../app/models/prediction'
import { ITeam } from '../../../app/models/team'
import { RootStoreContext } from '../../../app/stores/rootStore'

const selectionStyle = {
    cursor: 'pointer',
    backgroundColor: '#fafafa'
}
const activeSelectionStyle = {
    border: '1px dashed orange',
    backgroundColor: '#f1f8e9',
    opacity: '1'
}

interface IProps {
    prediction: IPrediction
}

const SettlePrediction: React.FC<IProps> = ({ prediction }) => {

    const rootStore = useContext(RootStoreContext);
    const { closeModal } = rootStore.modalStore;
    const { selectedMatch } = rootStore.matchStore;
    const { settle, loading } = rootStore.predictionStore;

    const { teamA, teamB } = selectedMatch as IMatch;

    const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null);

    const handleSelectTeam = (team: ITeam) => {
        setSelectedTeam(team);
    }

    const handleSettle = () => {
        settle(prediction.id, selectedTeam!.id)
            .then(() => {
                toast.success("Prediction settled");
                closeModal();
            }).catch(() => {
                toast.error("Something went wrong while processing your request");
                closeModal();
            });
    }

    return (
        <div className='clearFix x-hidden'>
            <Header content='Settle prediction' />
            <p>Select the winner for prediction : </p>
            {`[${prediction.title}] ${prediction.description}`}
            <Divider />
            <Grid centered>
                <Grid.Column width={6} textAlign='center'>
                    <div style={selectedTeam?.id === teamA?.id ? activeSelectionStyle : selectionStyle}
                        className='selection'
                        onClick={() => handleSelectTeam(selectedMatch!.teamA)}>
                        <Image src={teamA.image || '/assets/noimage.png'} size='tiny' centered />
                        {selectedMatch?.teamA.name}
                    </div>
                </Grid.Column>
                <Grid.Column width={6} textAlign='center'>
                    <div style={selectedTeam?.id === teamB?.id ? activeSelectionStyle : selectionStyle}
                        className='selection'
                        onClick={() => handleSelectTeam(selectedMatch!.teamB)}>
                        <Image src={teamB.image || '/assets/noimage.png'} size='tiny' centered />
                        {selectedMatch?.teamB.name}
                    </div>
                </Grid.Column>
            </Grid>
            <Divider />
            <Button primary
                content='Settle'
                onClick={handleSettle}
                disabled={!selectedTeam}
                floated='right'
                loading={loading} />
            <Button content='Cancel'
                onClick={closeModal}
                floated='right'
                disabled={loading} />
        </div>
    )
}

export default observer(SettlePrediction);
