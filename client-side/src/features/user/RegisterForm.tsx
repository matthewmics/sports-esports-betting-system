import React, { useContext, useState } from 'react'
import { Field, Form as FinalForm } from 'react-final-form'
import { Button, Form, FormGroup, Header } from 'semantic-ui-react'
import { TextInput } from '../../app/common/forms/TextInput'
import { RootStoreContext } from '../../app/stores/rootStore'
import { combineValidators, composeValidators, isRequired, matchesField } from 'revalidate'
import { IUserFormValues, IUserRegisterFormValues } from '../../app/models/user'
import { FORM_ERROR } from 'final-form'
import { ErrorMessage } from '../../app/common/forms/ErrorMessage'
import { observer } from 'mobx-react-lite'
import { isValidEmail } from '../../app/common/forms/formValidations'

const validate = combineValidators({
    firstname: isRequired('firstname'),
    lastname: isRequired('lastname'),
    username: isRequired('username'),
    email: composeValidators(
        isValidEmail(),
        isRequired('email')
    )(),
    password: isRequired('password'),
    confirmPassword: matchesField('password', 'confirmPassword')({ message: 'Passwords do not match' })
})

const RegisterForm = () => {
    const rootStore = useContext(RootStoreContext);
    const { closeModal } = rootStore.modalStore;
    const { register, loading } = rootStore.userStore;

    const submitHandle = (values: IUserRegisterFormValues) => {
        const {confirmPassword, firstname, lastname, ...formValues} = values;
        formValues.displayName = values.firstname + " " + values.lastname;
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
                        <Header as='h1' content='REGISTER' color='teal' />
                        <Form.Group widths='equal'>
                            <Field component={TextInput}
                                name='firstname'
                                placeholder='Firstname' />
                            <Field component={TextInput}
                                name='lastname'
                                placeholder='Lastname' />
                        </Form.Group>
                        <Field component={TextInput}
                            name='username'
                            placeholder='Username' />
                        <Field component={TextInput}
                            name='email'
                            placeholder='Email' />
                        <Field component={TextInput}
                            name='password'
                            type='password'
                            placeholder='Password' />
                        <Field component={TextInput}
                            name='confirmPassword'
                            type='password'
                            placeholder='Confirm Password' />

                        {submitError && !dirtySinceLastSubmit &&
                            <ErrorMessage  error={submitError} />}

                        <Button content='REGISTER' type='submit' primary
                            icon='lock'
                            floated='right'
                            disabled={(!valid) && (!dirtySinceLastSubmit || pristine)}
                            loading={loading} />
                        <Button content='CANCEL'
                            floated='right'
                            onClick={closeModal} />
                    </Form>
                )
            }} />
    )
}

export default observer(RegisterForm);