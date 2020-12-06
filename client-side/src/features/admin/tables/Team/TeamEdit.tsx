import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext, useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom';
import { Breadcrumb, Button, Divider, Form, Grid, Loader } from 'semantic-ui-react';
import { RootStoreContext } from '../../../../app/stores/rootStore';
import { Field, Form as FinalForm } from 'react-final-form'
import TextInput from '../../../../app/common/forms/TextInput';
import { ErrorMessage } from '../../../../app/common/forms/ErrorMessage';

interface RouteParams {
    id: string
}
interface IProps extends RouteComponentProps<RouteParams> {

}

const TeamEdit: React.FC<IProps> = ({ match }) => {

    const rootStore = useContext(RootStoreContext);
    const { selectedTeam: team, selectTeam } = rootStore.teamStore;

    useEffect(() => {
        selectTeam(+match.params.id);
    }, [selectTeam, match.params.id])

    if (!team)
        return <Loader active content='Loading...' />

    return (
        <Fragment>
            <Breadcrumb size='huge'>
                <Breadcrumb.Section link as={Link} to='/admin/tables/teams'>Teams</Breadcrumb.Section>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section link as={Link} to={`/admin/tables/teams/${team.id}`}>{team.name}</Breadcrumb.Section>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section active>Edit</Breadcrumb.Section>
            </Breadcrumb>
            <Divider />
            <Grid>
                <Grid.Column computer={6} mobile={16} tablet={8}>
                    <FinalForm
                        initialValues={team}
                        onSubmit={(values) => console.log(values)}
                        render={({ handleSubmit, submitError, dirtySinceLastSubmit }) =>
                            <Form onSubmit={handleSubmit}>
                                <Field component={TextInput}
                                    value={team.name}
                                    label='Name'
                                    name='name' />
                                <Button primary content='SAVE' />
                                <Button content='CANCEL' as={Link}
                                    to={`/admin/tables/teams/${team.id}`} />

                                {submitError && !dirtySinceLastSubmit &&
                                    <ErrorMessage error={submitError} />}
                            </Form>
                        } />
                </Grid.Column>
            </Grid>
        </Fragment>
    )
}

export default observer(TeamEdit);
