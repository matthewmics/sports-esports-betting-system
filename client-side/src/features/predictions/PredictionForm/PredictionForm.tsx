import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useRef } from 'react'
import { combineValidators, composeValidators, isNumeric, isRequired } from 'revalidate'
import { Button, Divider, Header, Form, Grid } from 'semantic-ui-react'
import { IActivePrediction, IPrediction } from '../../../app/models/prediction'
import { isGreaterThan, isLessThan } from '../../../app/common/forms/formValidations'
import { ITeam } from '../../../app/models/team'
import { RootStoreContext } from '../../../app/stores/rootStore'
import { Field, Form as FinalForm } from 'react-final-form'
import { PredictionFormTeamInput } from './PredictionFormTeamInput'
import { PredictionFormAmountInput } from './PredictionFormAmountInput'
import { ErrorMessage } from '../../../app/common/forms/ErrorMessage'
import { FORM_ERROR } from 'final-form'
import { formatToLocalPH } from '../../../app/common/util/util'

interface IProps {
    initialTeam?: ITeam;
    activePrediciton?: IActivePrediction;
    prediction: IPrediction;
}

const validate = combineValidators({
    amount: composeValidators(
        isRequired('Amount'),
        isNumeric({ message: 'Invalid input' }),
        isGreaterThan(49)({ message: 'Minimum amount is 50' }),
        isLessThan(100001)({ message: 'Maximum amount is 100,000' }),
    )('amount')
})

const PredictionForm: React.FC<IProps> = ({ initialTeam, activePrediciton, prediction }) => {

    const rootStore = useContext(RootStoreContext);
    const { closeModal } = rootStore.modalStore;
    const { selectedMatch } = rootStore.matchStore;
    const { predict, updatePrediction, loading } = rootStore.predictionStore;

    const teamAOdds = prediction.predictionDetails.teamPredictionEnvelope.teamA.odds;
    const teamBOdds = prediction.predictionDetails.teamPredictionEnvelope.teamB.odds;

    const initialValue = {
        teamId: activePrediciton ? activePrediciton.team.id : initialTeam!.id,
        amount: activePrediciton ? activePrediciton.amount : undefined
    }

    const handleFormSubmit = (values: any) => {
        if (activePrediciton) {
            return updatePrediction(values.teamId, +values.amount).catch(error => ({
                [FORM_ERROR]: error
            }));
        } else {
            return predict(values.teamId, +values.amount).catch(error => ({
                [FORM_ERROR]: error
            }));
        }
    }

    var potentialRewardRef = useRef<HTMLSpanElement>(null);

    let selectedTeamId = initialValue.teamId;
    let amountPlaced = activePrediciton ? activePrediciton.amount : 0;

    const computePotential = () => {
        let odds = selectedTeamId === selectedMatch!.teamA.id ? teamAOdds : teamBOdds;
        if (potentialRewardRef.current)
            potentialRewardRef.current.innerHTML = formatToLocalPH(odds * amountPlaced);
    };

    useEffect(() => {
        computePotential();
    });

    return (
        <FinalForm
            onSubmit={(values) => handleFormSubmit(values)}
            validate={validate}
            initialValues={initialValue}
            render={({ handleSubmit, submitError, dirtySinceLastSubmit }) =>
                <Form error onSubmit={handleSubmit} className='clearFix x-hidden' autoComplete='off'>
                    <Header content={prediction.description} />
                    <Divider />
                    <Field component={PredictionFormTeamInput}
                        onValueChanged={(value: any) => {
                            selectedTeamId = value;
                            computePotential();
                        }}
                        teamAOdds={teamAOdds}
                        teamBOdds={teamBOdds}
                        match={selectedMatch}
                        name='teamId' />
                    <Divider />
                    <Field component={PredictionFormAmountInput}
                        onValueChanged={(value: any) => {
                            amountPlaced = value;
                            computePotential();
                        }}
                        name='amount' />

                    <Grid centered style={{ margin: 0 }}>
                        <Grid.Column computer={12} mobile={16} style={{ paddingLeft: '0' }}>
                            Potential reward:
                            <span style={{ color: 'black', marginLeft: '7px', fontWeight: 'bold' }} ref={potentialRewardRef}>
                                {formatToLocalPH(0.00)}
                            </span>
                        </Grid.Column>
                    </Grid>
                    {submitError && !dirtySinceLastSubmit &&
                        <ErrorMessage error={submitError} />}
                    <Divider />
                    <Button primary
                        type='submit'
                        content='Predict'
                        floated='right'
                        loading={loading} />
                    <Button content='Cancel'
                        type='button'
                        onClick={closeModal}
                        floated='right'
                        disabled={loading} />
                </Form>
            }
        />
    )
}

export default observer(PredictionForm);