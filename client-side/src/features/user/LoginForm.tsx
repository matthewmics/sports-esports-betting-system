import React, { useContext } from 'react'
import { Field, Form as FinalForm } from 'react-final-form'
import { Button, Form, Header } from 'semantic-ui-react'
import { TextInput } from '../../app/common/forms/TextInput'
import { RootStoreContext } from '../../app/stores/rootStore'
import { combineValidators, isRequired } from 'revalidate'
import { IUserFormValues } from '../../app/models/user'
import agent from '../../app/api/agent'
import { FORM_ERROR } from 'final-form'
import { ErrorMessage } from '../../app/common/forms/ErrorMessage'
import { observer } from 'mobx-react-lite'

const validate = combineValidators({
    email: isRequired('email'),
    password: isRequired('password')
})

const LoginForm = () => {
    const rootStore = useContext(RootStoreContext);
    const { closeModal } = rootStore.modalStore;
    const { login, loading } = rootStore.userStore;

    return (
        <FinalForm onSubmit={(values: IUserFormValues) => login(values).catch(error => (
            { [FORM_ERROR]: error }
        ))}
            validate={validate}
            render={({ handleSubmit, pristine, dirtySinceLastSubmit, submitError, valid }) => {
                return (
                    <Form onSubmit={handleSubmit} error style={{ overflow: 'auto' }}>
                        <Header as='h1' content='LOGIN' color='teal' />
                        <Field component={TextInput}
                            name='email'
                            placeholder='Email' />
                        <Field component={TextInput}
                            name='password'
                            type='password'
                            placeholder='Password' />

                        {submitError && !dirtySinceLastSubmit &&
                            <ErrorMessage text='Invalid email or password' error={submitError} />}

                        <Button content='LOGIN' type='submit' primary
                            icon='lock'
                            floated='right'
                            disabled={!valid && (!dirtySinceLastSubmit || pristine)} 
                            loading={loading}/>
                        <Button content='CANCEL'
                            floated='right'
                            onClick={closeModal} />
                    </Form>
                )
            }} />
    )
}

export default observer(LoginForm);