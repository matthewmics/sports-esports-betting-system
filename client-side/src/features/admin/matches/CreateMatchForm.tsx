import { observer } from 'mobx-react-lite'
import React from 'react'
import { Form as FinalForm } from 'react-final-form'
import { Divider, Form, Header } from 'semantic-ui-react'

const CreateMatchForm = () => {
    return (
        <FinalForm onSubmit={(values) => console.log(values)}
            render={() =>
                <Form>
                    <Header textAlign='center' content='Create match' />
                    <Divider/>
                </Form>
            }
        />
    )
}

export default observer(CreateMatchForm);
