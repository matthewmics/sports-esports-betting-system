import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Field, Form as FinalForm } from 'react-final-form'
import { combineValidators, composeValidators, isRequired } from 'revalidate'
import { Button, Form, Header } from 'semantic-ui-react'
import SelectInput from '../../app/common/forms/SelectInput'
import TextInput from '../../app/common/forms/TextInput'
import { IPredictionForm } from '../../app/models/prediction'
import { isGreaterThan } from '../../app/common/forms/formValidations'

interface IProps {
    closeModal: () => void;
    options: any[] | null;
    initialTeamIndex: number;
}

const validate = combineValidators({
    amount: composeValidators(
        isRequired('amount'),
        isGreaterThan(49)({message: 'minimum amount is 50'})
    )('amount')
});

const PredictionForm: React.FC<IProps> = ({ closeModal, options, initialTeamIndex }) => {

    const [prediction, SetPrediction] = useState<IPredictionForm>({ amount: '', team: options![initialTeamIndex].value });

    return (
        <FinalForm onSubmit={() => { }} initialValues={prediction}
            validate={validate}
            render={({ handleSubmit, valid }) => {
                return (
                    <Form onSubmit={handleSubmit} style={{ overflow: 'auto', overflowX: 'hidden' }}>
                        <Header content="Prediction" color='teal' as='h1' />

                        <Field component={SelectInput}
                            name='team'
                            label='Team'
                            options={options}
                            value={prediction.team} />

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
                            disabled={!valid} />
                    </Form>
                )
            }}>

        </FinalForm>
    )
}

export default observer(PredictionForm);