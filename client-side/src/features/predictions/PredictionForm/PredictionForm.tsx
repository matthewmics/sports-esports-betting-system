import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
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

    return (
        <FinalForm
            onSubmit={(values) => handleFormSubmit(values)}
            validate={validate}
            initialValues={initialValue}
            render={({ handleSubmit, submitError, dirtySinceLastSubmit }) =>
                <Form error onSubmit={handleSubmit} className='clearFix x-hidden'>
                    <Header content={prediction.description} />
                    <Divider />
                    <Field component={PredictionFormTeamInput}
                        match={selectedMatch}
                        name='teamId' />
                    <Divider />
                    <Field component={PredictionFormAmountInput}
                        name='amount' />

                    <Grid centered style={{margin: 0}}>
                        <Grid.Column computer={12} mobile={16} style={{paddingLeft: '0'}}>
                            Potential reward :
                            <span style={{ color: 'green' }}>
                                {` ₱239.25`}
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