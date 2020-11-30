import { observer } from 'mobx-react-lite'
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Divider, Form, Grid } from 'semantic-ui-react'
import { Field, Form as FinalForm } from 'react-final-form'
import TextInput from '../../../../app/common/forms/TextInput'

const TeamForm = () => {
    return (
        <Fragment>
            <Breadcrumb size='huge'>
                <Breadcrumb.Section link as={Link} to='/admin/tables/teams'>Teams</Breadcrumb.Section>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section active>Create</Breadcrumb.Section>
            </Breadcrumb>
            <Divider />
            <Grid>
                <Grid.Column computer={6} mobile={16} tablet={8}>

                    <FinalForm onSubmit={() => console.log("test")}
                        render={({ handleSubmit }) =>
                            <Form onSubmit={handleSubmit}>
                                <Field name='name'
                                    label='Team Name'
                                    component={TextInput} />
                            </Form>}
                    />
                </Grid.Column>
            </Grid>
        </Fragment>
    )
}

export default observer(TeamForm)