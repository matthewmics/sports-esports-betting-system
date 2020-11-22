import React, { Fragment } from 'react'
import { Breadcrumb, Divider } from 'semantic-ui-react'

export const AdminDashboard = () => {
    return (
        <Fragment>
            <Breadcrumb size='huge'>
                <Breadcrumb.Section>Dashboard</Breadcrumb.Section>
            </Breadcrumb>
            <Divider />

            Admin dashboard content here.
        </Fragment>

    )
}
