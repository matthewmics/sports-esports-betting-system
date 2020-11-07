import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label, Select } from 'semantic-ui-react';

interface IProps
    extends FieldRenderProps<string, HTMLElement>,
    FormFieldProps { }

const SelectInput: React.FC<IProps> = ({
    label,
    input,
    width,
    options,
    placeholder,
    meta: { touched, error }
}) => {
    return (
        <Form.Field error={touched && !!error} width={width}>

            {label &&
                <label>{label}</label>
            }

            <Select options={options}
                value={input.value}
                onChange={(e, data) => { input.onChange(data.value) }}
                placeholder={placeholder} />
            {touched && error && (
                <Label basic color='red'>
                    {error}
                </Label>
            )}
        </Form.Field>
    )
}

export default SelectInput;