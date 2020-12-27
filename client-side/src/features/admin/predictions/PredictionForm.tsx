import { FORM_ERROR } from 'final-form'
import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { Field, Form as FinalForm } from 'react-final-form'
import { combineValidators, composeValidators, hasLengthLessThan, isRequired } from 'revalidate'
import { Button, Divider, Form, Header } from 'semantic-ui-react'
import { ErrorMessage } from '../../../app/common/forms/ErrorMessage'
import { isFutureDate } from '../../../app/common/forms/formValidations'
import TextInput from '../../../app/common/forms/TextInput'
import { formatDateInput } from '../../../app/common/util/util'
import { IPredictionCreateForm } from '../../../app/models/prediction'
import { RootStoreContext } from '../../../app/stores/rootStore'

const validate = combineValidators({
    title: composeValidators(
        isRequired('Title'),
        hasLengthLessThan(51)({ message: 'Title must be 50 characters or less' })
    )(),
    description: composeValidators(
        isRequired('Description'),
        hasLengthLessThan(76)({ message: 'Description must be 75 characters or less' })
    )(),
    startsAt: composeValidators(
        isRequired('Schedule'),
        isFutureDate('Schedule')
    )(),
})

const PredictionForm = () => {

    const rootStore = useContext(RootStoreContext);
    const { closeModal } = rootStore.modalStore;
    const { create, loading } = rootStore.predictionStore;
    const { selectedMatch } = rootStore.matchStore;

    const initialValues = {
        startsAt: formatDateInput(selectedMatch!.startDate),
        matchId: selectedMatch!.id
    }

    const handleCreate = (values: IPredictionCreateForm) =>
        create(values).then(closeModal).catch(error =>
            ({ [FORM_ERROR]: error })
        );

    return (
        <FinalForm onSubmit={(values: IPredictionCreateForm) => handleCreate(values)}
            validate={validate}
            initialValues={initialValues}
            render={({ handleSubmit, submitError, dirtySinceLastSubmit }) =>
                <Form error onSubmit={handleSubmit} className='clearFix'>
                    <Header textAlign='center' content='New prediction' />
                    <Divider />

                    <Field name='title'
                        label='Title'
                        placeholder='Title'
                        component={TextInput} />

                    <Field name='description'
                        label='Description'
                        placeholder='Description'
                        component={TextInput} />

                    <Field name='startsAt'
                        label='Schedule'
                        placeholder='Schedule'
                        type='datetime-local'
                        component={TextInput} />

                    {submitError && !dirtySinceLastSubmit &&
                        <ErrorMessage error={submitError} />}

                    <Button primary
                        loading={loading}
                        content='Create' type='submit' floated='right' />
                    <Button content='Cancel'
                        disabled={loading}
                        onClick={closeModal}
                        type='button'
                        floated='right' />

                </Form>
            }
        />
    )
}

export default observer(PredictionForm);