import React from 'react'
import { Input } from 'semantic-ui-react'

interface IProps {
    handleSearch: (term: string) => void;
}

export const SearchAsYouType: React.FC<IProps> = ({ handleSearch }) => {

    var typeAndSearch: any;

    const handleSearchInput = (term: string) => {
        clearTimeout(typeAndSearch);
        typeAndSearch = setTimeout(() => {
            handleSearch(term);
        }, 500);
    }

    return (
        <Input onChange={(e) => handleSearchInput(e.target.value)}
            style={{ marginLeft: '10px' }} placeholder='Search...' icon='search' />
    )
}
