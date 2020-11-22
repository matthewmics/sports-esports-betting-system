import React, { Fragment } from 'react'
import { Breadcrumb, Divider } from 'semantic-ui-react'

export const LiveMatchesPage = () => {
    return (
        <Fragment>
            <Breadcrumb size='huge'>
                <Breadcrumb.Section>Live Matches</Breadcrumb.Section>
            </Breadcrumb>
            <Divider />

            Live matches content here.
        </Fragment>
    )
}
