import { FORM_ERROR } from 'final-form'
import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { Field, Form as FinalForm } from 'react-final-form'
import { combineValidators, isRequired } from 'revalidate'
import { Button, Divider, Form, Header } from 'semantic-ui-react'
import { ErrorMessage } from '../../../app/common/forms/ErrorMessage'
import { RemoteSelectInput } from '../../../app/common/forms/RemoteSelectInput'
import SelectInput from '../../../app/common/forms/SelectInput'
import TextInput from '../../../app/common/forms/TextInput'
import { seriesSelection, gameSelection } from '../../../app/common/options'
import { IMatchForm } from '../../../app/models/match'
import { RootStoreContext } from '../../../app/stores/rootStore'

const validate = combineValidators({
    eventName: isRequired('Event'),
    teamAId: isRequired('Team A'),
    teamBId: isRequired('Team B'),
    series: isRequired('Series'),
    gameId: isRequired('Game'),
    title: isRequired('Title'),
    description: isRequired('Description'),
    startsAt: isRequired('Schedule'),
})

const CreateMatchForm = () => {

    const rootStore = useContext(RootStoreContext);
    const { closeModal } = rootStore.modalStore;
    const { loading, create } = rootStore.matchStore;

    return (
        <FinalForm validate={validate} onSubmit={(values: IMatchForm) =>
            create({ ...values, gameId: +values.gameId, series: +values.series })
                .then(() => {
                    closeModal();
                })
                .catch(error => ({
                    [FORM_ERROR]: error
                }))}
            render={({ handleSubmit, submitError, dirtySinceLastSubmit }) =>
                <Form error onSubmit={handleSubmit}>
                    <Header textAlign='center' content='Create match' />
                    <Divider />
                    <Field name='eventName'
                        label='Event'
                        placeholder='Event'
                        component={TextInput} />
                    <Form.Group widths='2'>

                        <Field name='teamAId'
                            label='Team A'
                            placeholder='Search team'
                            component={RemoteSelectInput} />

                        <Field name='teamBId'
                            label='Team B'
                            placeholder='Search team'
                            component={RemoteSelectInput} />
                    </Form.Group>


                    <Form.Group widths={2}>

                        <Field name='series'
                            label='Series'
                            placeholder='Series'
                            options={seriesSelection}
                            component={SelectInput} />


                        <Field name='gameId'
                            label='Game'
                            placeholder='Game'
                            options={gameSelection}
                            component={SelectInput} />

                    </Form.Group>

                    <Header textAlign='center' content='Main prediction' />
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

                    <Button primary content='Create' type='submit' loading={loading} />
                    <Button content='Cancel' onClick={closeModal}
                        type='button' disabled={loading} />
                </Form>
            }
        />
    )
}

export default observer(CreateMatchForm);
