import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Form, FormFieldProps, Label } from 'semantic-ui-react'

interface IProps extends FormFieldProps, FieldRenderProps<string, any> { }

export const TextInput: React.FC<IProps> = ({
    input,
    width,
    type,
    placeholder,
    meta: { touched, error }
}) => {
    return (
        <Form.Field error={touched && !!error} type={type} width={width}>
            <input {...input} placeholder={placeholder} />
            {touched && !!error &&
                (
                    <Label basic color='red'>
                        {error}
                    </Label>
                )
            }
        </Form.Field>
    )
}
