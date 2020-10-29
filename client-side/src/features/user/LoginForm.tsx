import React, { useContext } from 'react'
import { Field, Form as FinalForm } from 'react-final-form'
import { Button, Form, Header } from 'semantic-ui-react'
import { TextInput } from '../../app/common/forms/TextInput'
import { RootStoreContext } from '../../app/stores/rootStore'
import {combineValidators, isRequired} from 'revalidate'

const validate = combineValidators({
    email: isRequired('email'),
    password: isRequired('password')
})

export const LoginForm = () => {
    const rootStore = useContext(RootStoreContext);
    const { closeModal } = rootStore.modalStore;
    return (
        <FinalForm onSubmit={(values: any) => console.log(values)}
            validate={validate}
            render={({ handleSubmit }) => {
                return (
                    <Form onSubmit={handleSubmit} style={{ overflow: 'auto' }}>
                        <Header as='h1' content='LOGIN' color='teal' />
                        <Field component={TextInput}
                            name='email'
                            placeholder='Email' />
                        <Field component={TextInput}
                            name='password'
                            type='password'
                            placeholder='Password' />
                        <Button content='LOGIN' type='submit' primary
                            floated='right'
                            icon='lock' />
                        <Button content='CANCEL'
                            onClick={closeModal}
                            floated='right' />
                    </Form>
                )
            }} />
    )
}
