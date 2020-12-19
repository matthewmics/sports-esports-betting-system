import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Form, Grid, Image } from 'semantic-ui-react'
import { Field, Form as FinalForm } from 'react-final-form'
import TextInput from '../../../../app/common/forms/TextInput'
import { RootStoreContext } from '../../../../app/stores/rootStore'
import PhotoSelectAndCrop from '../../../../app/common/photos/PhotoSelectAndCrop'
import { combineValidators, isRequired } from 'revalidate'
import { ITeamFormValues } from '../../../../app/models/team'
import { ErrorMessage } from '../../../../app/common/forms/ErrorMessage'
import { FORM_ERROR } from 'final-form'
import { history } from '../../../..'

const validate = combineValidators({
    name: isRequired('name')
})

const TeamForm = () => {

    const rootStore = useContext(RootStoreContext);
    const { openModal } = rootStore.modalStore;
    const { loading, createTeam } = rootStore.teamStore;

    const [state, setState] = useState({
        preview: '',
        file: null as Blob | null,
    });

    const resetState = () => {
        setState({
            file: null, preview: ''
        })
    }

    const { preview, file } = state;

    useEffect(() => {
        return (() => {
            if (preview)
                URL.revokeObjectURL(preview);
        });
    });

    const onImageSet = (selectedFile: Blob | null) => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }
        const prev = selectedFile ? URL.createObjectURL(selectedFile) : '';
        setState({
            preview: prev,
            file: selectedFile,
        });
    };

    const handleFormSubmit = (values: ITeamFormValues) => {
        let teamValues: ITeamFormValues;
        if (file) {
            values.file = file;
            teamValues = values;
        }
        else {
            const { file, ...rest } = values;
            teamValues = rest;
        }
        return createTeam(teamValues).then(() => {            
            history.push('/admin/tables/teams/create')
        }).catch(error => ({
            [FORM_ERROR]: error
        }));

    };

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

                    <FinalForm onSubmit={(values) => handleFormSubmit(values)}
                        validate={validate}
                        render={({ handleSubmit, submitError, dirtySinceLastSubmit }) =>
                            <Form onSubmit={handleSubmit} error>
                                <Field name='name'
                                    label='Team Name'
                                    component={TextInput} />
                                {preview &&
                                    <Form.Field>
                                        <Image src={preview} size='small' />
                                    </Form.Field>}
                                <Form.Field>
                                    <Button basic content={!preview ? 'Upload Photo' : 'Change Photo'}
                                        icon='cloud upload'
                                        type='button'
                                        onClick={() => openModal(<PhotoSelectAndCrop
                                            onImageSet={onImageSet}
                                        />)} />
                                    {preview &&
                                        <Button content='Remove Photo'
                                            onClick={() => {
                                                URL.revokeObjectURL(preview);
                                                resetState();
                                            }} />}
                                </Form.Field>
                                {submitError && !dirtySinceLastSubmit &&
                                    <ErrorMessage error={submitError} />}
                                <Button primary content='SAVE' type='submit' loading={loading} />
                            </Form>}
                    />
                </Grid.Column>
            </Grid>
        </Fragment>
    )
}

export default observer(TeamForm)