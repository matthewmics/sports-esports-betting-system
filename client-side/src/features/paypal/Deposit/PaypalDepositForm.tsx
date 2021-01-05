import { FORM_ERROR } from 'final-form'
import { observer } from 'mobx-react-lite'
import React, { useContext, useRef, useState } from 'react'
import { Field, Form as FinalForm } from 'react-final-form'
import { combineValidators, composeValidators, isNumeric, isRequired } from 'revalidate'
import { Button, Divider, Form, Header, Icon, Segment } from 'semantic-ui-react'
import { ErrorMessage } from '../../../app/common/forms/ErrorMessage'
import { isGreaterThan, isLessThan } from '../../../app/common/forms/formValidations'
import { formatToLocalPH } from '../../../app/common/util/util'
import { RootStoreContext } from '../../../app/stores/rootStore'
import { PaypalAmountInput } from '../PaypalAmountInput'

const validate = combineValidators({
    amount: composeValidators(
        isRequired('Amount'),
        isNumeric({ message: 'Invalid input' }),
        isGreaterThan(499)({ message: 'Minimum amount is 500' }),
        isLessThan(1000001)({ message: 'Maximum amount is 1,000,000' }),
    )(),
})

const getPaypalFees = (value: number) => {
    value = (value + 15 + (value * 0.029)) - value;
    value += (value * 0.029)
    return value;
}

const PaypalDepositForm = () => {

    const rootStore = useContext(RootStoreContext);
    const { closeModal } = rootStore.modalStore;
    const { loading, paypalDeposit } = rootStore.fundStore;

    var refTotal = useRef<HTMLSpanElement>(null);
    var refPaypalFees = useRef<HTMLSpanElement>(null);

    const [state, setState] = useState<{
        checkoutLink: string;
        amount: number;
    } | null>(null);

    const submitHandle = (values: any) => {
        return paypalDeposit(+values.amount).then(checkoutLink => {
            setState({
                amount: +values.amount,
                checkoutLink: checkoutLink
            });
        }).catch(error => ({
            [FORM_ERROR]: error
        }))
    }

    const computeTotal = (value: string) => {
        var result = 0;
        var resultFees = 0;

        if (!isNaN(Number(value)) && value.length !== 0) {
            resultFees = getPaypalFees(Number(value));
            result = Number(value) + resultFees;
        }

        if (refTotal.current)
            refTotal.current.innerHTML = formatToLocalPH(result);
        if (refPaypalFees.current)
            refPaypalFees.current.innerHTML = formatToLocalPH(resultFees);
    }

    if (state)
        return (
            <Segment placeholder basic>
                <Header icon>
                    <Icon name='paypal' />
                    You are about to pay {" "}
                    <span style={{ color: 'green' }}
                        className='text-bold'>
                        {formatToLocalPH(state.amount + getPaypalFees(state.amount))}</span>
                </Header>
                <Button.Group>

                    <Button basic content='Cancel' onClick={closeModal} />
                    <Button primary onClick={() => {
                        const left = (window.screen.width / 2) - (480 / 2);
                        window.open(state.checkoutLink, "_blank",
                            `toolbar=yes,scrollbars=yes,resizable=yes,top=10,left=${left},width=480,height=720`);
                        closeModal();
                    }}>Proceed</Button>
                </Button.Group>
            </Segment>
        )

    return (
        <div className='clearFix x-hidden'>
            <Header color='blue' icon='paypal' content='Add credits using PayPal' />
            <Divider />
            <FinalForm onSubmit={(values) => submitHandle(values)}
                validate={validate}
                render={({ handleSubmit, submitError, dirtySinceLastSubmit }) =>
                    <Form error onSubmit={handleSubmit}>
                        <Field component={PaypalAmountInput}
                            name='amount'
                            label='Amount'
                            placeholder='Amount'
                            onValueChanged={computeTotal}
                        />
                        <div style={{ color: 'teal', marginTop: '10px' }}>
                            PayPal fee: <span ref={refPaypalFees} className='text-bold'>{formatToLocalPH(0.00)}</span>
                        </div>
                        <div style={{ fontSize: '27px', }}>
                            Total: <span ref={refTotal} className='text-bold'>{formatToLocalPH(0.00)}</span>
                        </div>

                        {submitError && !dirtySinceLastSubmit &&
                            <ErrorMessage error={submitError} />}

                        <Button floated='right' content='Submit' primary type='submit' loading={loading} />
                        <Button floated='right' content='Cancel' onClick={closeModal} type='button'
                            disabled={loading} />
                    </Form>
                } />
        </div>
    )
}

export default observer(PaypalDepositForm);