import React from 'react'
import { Segment, Header, Icon } from 'semantic-ui-react'

export const NotFound = () => {
    return (
        <Segment placeholder>
            <Header icon>
                <Icon name='times circle outline' />
            We couldn't find what you're looking for.
        </Header>
        </Segment>
    )
}
