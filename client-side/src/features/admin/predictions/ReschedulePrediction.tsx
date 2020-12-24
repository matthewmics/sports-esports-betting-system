import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Button, Form, Header } from 'semantic-ui-react'
import { RootStoreContext } from '../../../app/stores/rootStore';
import { Field, Form as FinalForm } from 'react-final-form'
import TextInput from '../../../app/common/forms/TextInput';
import { IPrediction } from '../../../app/models/prediction';
import { combineValidators, composeValidators, isRequired } from 'revalidate';
import { isFutureDate } from '../../../app/common/forms/formValidations';
import { ErrorMessage } from '../../../app/common/forms/ErrorMessage';
import { FORM_ERROR } from 'final-form';
import { formatDateInput } from '../../../app/common/util/util';

interface IProps {
    prediction: IPrediction;
}

const validate = combineValidators({
    schedule: composeValidators(
        isRequired('Schedule'),
        isFutureDate('Schedule')
    )(),
})

const ReschedulePrediction: React.FC<IProps> = ({ prediction }) => {

    const rootStore = useContext(RootStoreContext);
    const { closeModal } = rootStore.modalStore;
    const { reschedule, loading } = rootStore.predictionStore;

    const initialValues = {
        schedule: formatDateInput(prediction.startDate)
    }

    return (
        <div>
            <Header content='Reschedule prediction' />
            <p>
                Rescheduling a prediction will set its status to Open again
            </p>
            <FinalForm onSubmit={(values) =>
                reschedule(prediction.id, values.schedule)
                    .then(closeModal)
                    .catch(error => ({
                        [FORM_ERROR]: error
                    }))}
                validate={validate}
                initialValues={initialValues}
                render={({ handleSubmit, submitError, dirtySinceLastSubmit }) =>
                    <Form error className='clearFix' onSubmit={handleSubmit}>
                        <Field component={TextInput}
                            name='schedule'
                            type='datetime-local' />

                        {submitError && !dirtySinceLastSubmit &&
                            <ErrorMessage error={submitError} />}

                        <Button primary content='Save' floated='right' type='submit'
                            loading={loading} />
                        <Button content='Cancel' floated='right' onClick={closeModal} type='button'
                            disabled={loading} />
                    </Form>}
            />
        </div>
    )
}

export default observer(ReschedulePrediction);
