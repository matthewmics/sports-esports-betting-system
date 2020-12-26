import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { FormFieldProps, Grid, Image } from 'semantic-ui-react'
import { IMatch } from '../../../app/models/match'

const selectionStyle = {
    cursor: 'pointer',
    backgroundColor: '#fafafa'
}
const activeSelectionStyle = {
    border: '1px dashed orange',
    backgroundColor: '#f1f8e9',
    opacity: '1'
}

interface IProps extends FormFieldProps, FieldRenderProps<number, HTMLElement> {
    match: IMatch
}

export const PredictionFormTeamInput: React.FC<IProps> = ({
    match,
    input
}) => {

    const { teamA, teamB } = match;

    return (
        <Grid centered>
            <Grid.Column width={6} textAlign='center'>
                <div style={input.value === teamA.id ? activeSelectionStyle : selectionStyle}
                    className='selection-team'
                    onClick={() => input.onChange(teamA.id)}>
                    <Image src={teamA.image || '/assets/noimage.png'} size='tiny' centered />
                    {teamA.name}
                    <div>(x1.95)</div>
                </div>
            </Grid.Column>
            <Grid.Column width={6} textAlign='center'>
                <div style={input.value === teamB.id ? activeSelectionStyle : selectionStyle}
                    className='selection-team'
                    onClick={() => input.onChange(teamB.id)}>
                    <Image src={teamB.image || '/assets/noimage.png'} size='tiny' centered />
                    {teamB.name}
                    <div>(x1.95)</div>
                </div>
            </Grid.Column>
        </Grid>
    )
}
