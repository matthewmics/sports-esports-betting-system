import { FORM_ERROR } from 'final-form'
import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { Field, Form as FinalForm } from 'react-final-form'
import { combineValidators, isRequired } from 'revalidate'
import { Button, Divider, Form, Header, Segment } from 'semantic-ui-react'
import { ErrorMessage } from '../../app/common/forms/ErrorMessage'
import TextInput from '../../app/common/forms/TextInput'
import { IUserFormValues } from '../../app/models/user'
import { RootStoreContext } from '../../app/stores/rootStore'

const validate = combineValidators({
    email: isRequired('email'),
    password: isRequired('password')
})

const AdminLoginPage = () => {

    const rootStore = useContext(RootStoreContext);
    const { login, loading } = rootStore.adminUserStore;

    return (
        <Segment className='fixed-center' style={{ maxWidth: '380px', top: '7em' }}>
            <Header content='ADMIN LOGIN' color='teal' />
            <Divider />
            <FinalForm onSubmit={(values: IUserFormValues) => login(values).catch((error) => ({
                [FORM_ERROR]: error
            }))}
                validate={validate}
                render={({ handleSubmit, submitError, dirtySinceLastSubmit }) => {
                    return (
                        <Form error onSubmit={handleSubmit}>
                            <Field component={TextInput}
                                name='email'
                                placeholder='Email'
                            />

                            <Field component={TextInput}
                                name='password'
                                placeholder='Password'
                                type='password'
                            />

                            {submitError && !dirtySinceLastSubmit &&
                                <ErrorMessage text='Invalid email or password' error={submitError} />}

                            <Button content='LOGIN' icon='lock' primary fluid loading={loading}/>
                        </Form>
                    )
                }} />
        </Segment>
    )
}

export default observer(AdminLoginPage);
