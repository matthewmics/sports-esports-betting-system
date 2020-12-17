import React, { useContext, useState } from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label, Dropdown, DropdownProps, DropdownOnSearchChangeData } from 'semantic-ui-react';
import { RootStoreContext } from '../../stores/rootStore';

interface IProps
    extends FieldRenderProps<string, HTMLElement>,
    FormFieldProps { }

export const RemoteSelectInput: React.FC<IProps> = ({
    label,
    width,
    input,
    placeholder,
    meta: { touched, error }
}) => {
    const rootStore = useContext(RootStoreContext);
    const { searchTeams } = rootStore.teamStore;

    const [state, setState] = useState({
        isFetching: false,
        search: true,
        searchQuery: '' as string,
        value: null as any,
        options: [] as any[],
    });

    const { options, isFetching, search, value } = state;

    let fetch: any;

    const fetchOptions = (query: string) => {
        fetch = setTimeout(() => {
            setState({ ...state, isFetching: true });
            searchTeams(query).then((teams) => {
                setState({
                    ...state, isFetching: false,
                    options: teams.map(team => ({ key: team.id, value: team.id, text: team.name }))
                });
            }).catch(() => {
                setState({ ...state, isFetching: false });
            });
        }, 500);
    }

    const handleChange = (e: React.SyntheticEvent<HTMLElement, Event>, { value }:
        DropdownProps) => {
            input.onChange(value);
            setState({ ...state, 'value': value });
        };

    const handleSearchChange = (e: React.SyntheticEvent<HTMLElement, Event>, { searchQuery }:
        DropdownOnSearchChangeData) => {
        clearTimeout(fetch);
        fetchOptions(searchQuery);
    }

    return (

        <Form.Field error={touched && !!error} width={width}>

            {label &&
                <label>{label}</label>
            }

            <Dropdown
                fluid
                selection
                multiple={false}
                search={search}
                options={options}
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
                onSearchChange={handleSearchChange}
                disabled={isFetching}
                loading={isFetching}
            />

            {touched && error && (
                <Label basic color='red'>
                    {error}
                </Label>
            )}

        </Form.Field>

    )
}
