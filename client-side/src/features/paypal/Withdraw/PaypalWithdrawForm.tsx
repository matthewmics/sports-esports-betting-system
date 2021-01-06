import { FORM_ERROR } from 'final-form'
import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { Field, Form as FinalForm } from 'react-final-form'
import { combineValidators, composeValidators, isNumeric, isRequired } from 'revalidate'
import { Button, Divider, Form, Header } from 'semantic-ui-react'
import { ErrorMessage } from '../../../app/common/forms/ErrorMessage'
import { isGreaterThan, isValidEmail } from '../../../app/common/forms/formValidations'
import TextInput from '../../../app/common/forms/TextInput'
import { formatToLocalPH } from '../../../app/common/util/util'
import { paypalPayoutFee } from '../../../app/stores/fundStore'
import { RootStoreContext } from '../../../app/stores/rootStore'
import { PaypalAmountInput } from '../PaypalAmountInput'

const validate = combineValidators({
    amount: composeValidators(
        isRequired('Amount'),
        isNumeric({ message: 'Invalid input' }),
        isGreaterThan(499)({ message: 'Minimum amount is 500' }),
    )(),
    email: composeValidators(
        isRequired('Email'),
        isValidEmail()
    )()
})

const PaypalWithdrawForm = () => {

    const rootStore = useContext(RootStoreContext);
    const { closeModal } = rootStore.modalStore;
    const { paypalWithdraw, loading } = rootStore.fundStore;

    const handleFormSubmit = (values: any) => {
        return paypalWithdraw(+values.amount, values.email).then(closeModal)
            .catch(error => (
                { [FORM_ERROR]: error }
            ))
    }

    return (
        <div className='clearFix x-hidden'>
            <Header color='blue' icon='paypal' content='Withdraw using PayPal' />
            <Divider />
            <FinalForm onSubmit={(values) => handleFormSubmit(values)}
                validate={validate}
                render={({ handleSubmit, submitError, dirtySinceLastSubmit }) =>
                    <Form error onSubmit={handleSubmit} autoComplete='off'>
                        <Field name='email'
                            label='Email'
                            component={TextInput}
                            placeholder='Email' />
                        <Field name='amount'
                            label='Amount'
                            component={PaypalAmountInput}
                            placeholder='Amount' />

                        <div style={{ color: 'teal', marginTop: '10px' }}>
                            PayPal fee: <span className='text-bold'>{formatToLocalPH(paypalPayoutFee)}</span>
                        </div>

                        {submitError && !dirtySinceLastSubmit &&
                            <ErrorMessage error={submitError} />}

                        <Button floated='right' content='Submit'
                            primary type='submit'
                            loading={loading} />
                        <Button floated='right'
                            content='Cancel' onClick={closeModal} type='button'
                            disabled={loading}
                        />

                    </Form>} />
        </div>
    )
}

export default observer(PaypalWithdrawForm);