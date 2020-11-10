import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { Field, Form as FinalForm } from 'react-final-form'
import { combineValidators, composeValidators, isRequired } from 'revalidate'
import { Button, Form, Header } from 'semantic-ui-react'
import SelectInput from '../../app/common/forms/SelectInput'
import TextInput from '../../app/common/forms/TextInput'
import { IActivePrediction, IPredictionForm } from '../../app/models/prediction'
import { isGreaterThan } from '../../app/common/forms/formValidations'
import { toast } from 'react-toastify'
import { ITeam } from '../../app/models/team'
import { RootStoreContext } from '../../app/stores/rootStore'

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
    const { predict, matchSelections, updatePrediction } = rootStore.matchStore;

    const [loading, setLoading] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    const [prediction, SetPrediction] = useState<IPredictionForm>({
        amount: '',
        teamId: ''
    });

    useEffect(() => {

        if (activePrediciton) {
            setIsUpdate(true);
            SetPrediction({
                amount: activePrediciton.amount.toString(),
                teamId: activePrediciton.team.id.toString(),
            })
        }else{
            SetPrediction({
                amount: '',
                teamId: matchSelections.filter(x => x.value === initialTeam!.id.toString())[0].value
            })
        }
    }, [activePrediciton, matchSelections, initialTeam]);

    const handlePredictionSubmit = (values: IPredictionForm) => {
        setLoading(true);
        if (!isUpdate) {
            predict(+values.teamId, +values.amount).finally(() => {
                setLoading(false);
                closeModal();
            });
        } else {
            updatePrediction(+values.teamId, +values.amount).finally(() => {
                setLoading(false);
                closeModal();
            });
        }
    }

    return (
        <FinalForm onSubmit={(values: IPredictionForm) => { handlePredictionSubmit(values) }}
            initialValues={prediction}
            validate={validate}
            render={({ handleSubmit, valid }) => {
                return (
                    <Form onSubmit={handleSubmit} style={{ overflow: 'auto', overflowX: 'hidden' }}>
                        <Header content="Prediction" color='teal' as='h1' />

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

                        <Button content='CANCEL' onClick={closeModal} />
                        <Button content='CONFIRM PREDICTION' primary
                            disabled={!valid} loading={loading} />
                    </Form>
                )
            }}>

        </FinalForm>
    )
}

export default observer(PredictionForm);