import React, { Fragment } from 'react'
import { FieldRenderProps } from 'react-final-form'
import { FormFieldProps, Input, Label } from 'semantic-ui-react'

interface IProps extends FormFieldProps, FieldRenderProps<string, HTMLElement> { }

export const PaypalAmountInput: React.FC<IProps> = ({
    onValueChanged,
    input,
    placeholder,
    meta: { touched, error }
}) => {
    return (
        <Fragment>

            <Input fluid labelPosition='right' type='text' placeholder='Amount'>
                <Label basic>₱</Label>
                <input {...input} placeholder={placeholder} onChange={(e) => {
                    if (onValueChanged)
                        onValueChanged(e.target.value);
                    input.onChange(e);
                }} />
                <Label>.00</Label>
            </Input>

            {touched && !!error &&
                <Label basic color='red' style={{ marginBottom: '10px' }}>
                    {error}
                </Label>
            }
        </Fragment >
    )
}
