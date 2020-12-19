import { observer } from 'mobx-react-lite'
import React, { useContext, useState } from 'react'
import { Field, Form as FinalForm } from 'react-final-form'
import { combineValidators, composeValidators, isRequired } from 'revalidate'
import { Button, Divider, Form, Header } from 'semantic-ui-react'
import SelectInput from '../../app/common/forms/SelectInput'
import TextInput from '../../app/common/forms/TextInput'
import { IActivePrediction, IPredictionForm } from '../../app/models/prediction'
import { isGreaterThan } from '../../app/common/forms/formValidations'
import { ITeam } from '../../app/models/team'
import { RootStoreContext } from '../../app/stores/rootStore'
import { ErrorMessage } from '../../app/common/forms/ErrorMessage'
import { FORM_ERROR } from 'final-form'

interface IProps {
    initialTeam?: ITeam;
    activePrediciton?: IActivePrediction;
}

const validate = combineValidators({
    amount: composeValidators(
        isRequired('amount'),
        isGreaterThan(49)({ message: 'minimum amount is 50' })
    )('amount')
});

const PredictionForm: React.FC<IProps> = ({ initialTeam, activePrediciton }) => {

    const rootStore = useContext(RootStoreContext);
    const { closeModal } = rootStore.modalStore;
    const { matchSelections } = rootStore.matchStore;
    const {predict, updatePrediction} = rootStore.predictionStore;

    const [loading, setLoading] = useState(false);

    const initialFormValues = () => {
        if (activePrediciton) {
            return {
                amount: activePrediciton.amount.toString(),
                teamId: activePrediciton.team.id.toString(),
            }
        } else {
            return {
                amount: '',
                teamId: matchSelections.filter(x => x.value === initialTeam!.id.toString())[0].value
            }
        }
    }

    const [prediction] = useState<IPredictionForm>(initialFormValues);

    const handlePredictionSubmit = (values: IPredictionForm) => {
        setLoading(true);
        if (activePrediciton) {
            return updatePrediction(+values.teamId, +values.amount);
        } else {
            return predict(+values.teamId, +values.amount);
        }
    }

    return (
        <FinalForm onSubmit={(values: IPredictionForm) => handlePredictionSubmit(values).catch((error) => {
            setLoading(false);
            return ({ [FORM_ERROR]: error })
        })
        }
            initialValues={prediction}
            validate={validate}
            render={({ handleSubmit, submitError, pristine }) => {
                return (
                    <Form error onSubmit={handleSubmit} style={{ overflow: 'auto', overflowX: 'hidden' }} >
                        <Header content="Prediction" textAlign='center' />
                        <Divider />

                        <Field component={SelectInput}
                            name='teamId'
                            label='Team'
                            options={matchSelections}
                            value={prediction.teamId} />

                        <Field
                            component={TextInput}
                            label='Amount'
                            name='amount'
                            placeholder='Amount'
                            value={prediction.amount} />

                        <Form.Group>
                            <Form.Field inline>
                                <label>Odds</label>
                                <span>x1.15</span>
                            </Form.Field>
                            <Form.Field inline>
                                <label>Potential Reward</label>
                                <span>₱500.00</span>
                            </Form.Field>
                        </Form.Group>

                        {submitError &&
                            <ErrorMessage error={submitError} />
                        }

                        <Button content='CONFIRM PREDICTION' primary
                            loading={loading} disabled={pristine} />
                        <Button content='CANCEL' onClick={closeModal} />
                    </Form>
                )
            }}>

        </FinalForm>
    )
}

export default observer(PredictionForm);