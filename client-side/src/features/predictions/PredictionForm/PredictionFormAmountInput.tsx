import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { FormFieldProps, Grid, Input, Label } from 'semantic-ui-react'

interface IProps extends FormFieldProps, FieldRenderProps<string, HTMLElement> { }

export const PredictionFormAmountInput: React.FC<IProps> = ({
    onValueChanged,
    input,
    meta: { touched, error }
}) => {
    return (
        <Grid centered>
            <Grid.Column computer={12} mobile={16}>
                <Input labelPosition='right' type='text' placeholder='Amount'>
                    <Label basic>₱</Label>
                    <input {...input} onChange={(e) => {
                        onValueChanged(e.target.value);
                        input.onChange(e);
                    }} />
                    <Label>.00</Label>
                </Input>
                <br />
                {touched && !!error &&
                    <Label basic color='red'>
                        {error}
                    </Label>
                }
            </Grid.Column>
        </Grid>
    )
}
