import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

interface IProps {
    content: string;
}

export const LoadingComponent: React.FC<IProps> = ({ content }) => {
    return (
        <Dimmer active inverted>
            <Loader size='mini'>{content}</Loader>
        </Dimmer>
    )
}
