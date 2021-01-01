import React, { Fragment } from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Label } from 'semantic-ui-react'

interface IProps extends FieldRenderProps<string, HTMLElement> { }

export const MatchCommentReplyInput: React.FC<IProps> = ({
    input,
    meta: { error, touched }
}) => {
    return (
        <Fragment>
            <textarea onSubmit={() => input.onChange('')} {...input} style={{ height: 'auto' }} rows={3}>
                {input.value}
            </textarea>
            {/* <TextArea value={input.value} style={{ height: 'auto' }} rows={3} onChange={(e, data) => {
                input.onChange(data.value);
            }} /> */}
            {touched && !!error &&
                <Label basic color='red'>
                    {error}
                </Label>
            }
        </Fragment>
    )
}
