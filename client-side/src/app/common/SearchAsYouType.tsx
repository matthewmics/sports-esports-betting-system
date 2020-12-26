import React from 'react'
import { Input } from 'semantic-ui-react'

interface IProps {
    handleSearch: (term: string) => void;
    initialValue?: string;
}

export const SearchAsYouType: React.FC<IProps> = ({ handleSearch, initialValue }) => {

    var typeAndSearch: any;
    var ref = React.createRef<any>();

    const handleSearchInput = (term: string) => {
        clearTimeout(typeAndSearch);
        typeAndSearch = setTimeout(() => {
            handleSearch(term);
        }, 500);
    }

    return (
        <Input onChange={(e) => handleSearchInput(e.target.value)}
            defaultValue={initialValue}
            style={{ marginLeft: '10px' }} placeholder='Search...' icon='search' />
    )
}
