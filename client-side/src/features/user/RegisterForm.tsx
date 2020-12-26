import React, { useContext } from 'react'
import { Field, Form as FinalForm } from 'react-final-form'
import { Button, Divider, Form, Header } from 'semantic-ui-react'
import TextInput from '../../app/common/forms/TextInput'
import { RootStoreContext } from '../../app/stores/rootStore'
import { combineValidators, composeValidators, hasLengthGreaterThan, isRequired, matchesField } from 'revalidate'
import { IUserRegisterFormValues } from '../../app/models/user'
import { FORM_ERROR } from 'final-form'
import { ErrorMessage } from '../../app/common/forms/ErrorMessage'
import { observer } from 'mobx-react-lite'
import { hasUppercase, isValidEmail } from '../../app/common/forms/formValidations'

const validate = combineValidators({
    firstname: isRequired('firstname'),
    lastname: isRequired('lastname'),
    email: composeValidators(
        isValidEmail(),
        isRequired('email')
    )(),
    password: composeValidators(
        isRequired('password'),
        hasLengthGreaterThan(5)({message: 'must be 6 characters or more'}),
        hasUppercase('password')
    )(),
    confirmPassword: matchesField('password', 'confirmPassword')({ message: 'Passwords do not match' })
})

const RegisterForm = () => {
    const rootStore = useContext(RootStoreContext);
    const { closeModal } = rootStore.modalStore;
    const { register, loading } = rootStore.userStore;

    const submitHandle = (values: IUserRegisterFormValues) => {
        const { confirmPassword, ...formValues } = values;
        return register(formValues).catch(error => (
            { [FORM_ERROR]: error }
        ))
    }

    return (
        <FinalForm onSubmit={(values: IUserRegisterFormValues) => submitHandle(values)}
            validate={validate}
            render={({ handleSubmit, pristine, dirtySinceLastSubmit, submitError, valid }) => {
                return (
                    <Form onSubmit={handleSubmit} error style={{ overflow: 'auto', overflowX: 'hidden' }}>
                        <Header content='Register' textAlign='center' />
                        <Divider />
                        <Form.Group widths='equal'>
                            <Field component={TextInput}
                                label='Firstname'
                                name='firstname'
                                placeholder='Firstname' />
                            <Field component={TextInput}
                                label='Lastname'
                                name='lastname'
                                placeholder='Lastname' />
                        </Form.Group>
                        <Field component={TextInput}
                            label='Email'
                            name='email'
                            placeholder='Email' />
                        <Field component={TextInput}
                            label='Password'
                            name='password'
                            type='password'
                            placeholder='Password' />
                        <Field component={TextInput}
                            label='Confirm password'
                            name='confirmPassword'
                            type='password'
                            placeholder='Confirm Password' />

                        {submitError && !dirtySinceLastSubmit &&
                            <ErrorMessage error={submitError} />}

                        <Button content='REGISTER' type='submit' primary
                            floated='right'
                            disabled={(!valid) && (!dirtySinceLastSubmit || pristine)}
                            loading={loading} />
                        <Button content='CANCEL'
                            floated='right'
                            type='button'
                            onClick={closeModal} />
                    </Form>
                )
            }} />
    )
}

export default observer(RegisterForm);