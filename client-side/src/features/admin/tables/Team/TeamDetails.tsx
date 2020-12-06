import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext, useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Segment, Image, Loader, Header, Button, Breadcrumb, Divider, Reveal } from 'semantic-ui-react'
import { RootStoreContext } from '../../../../app/stores/rootStore'

interface RouteParams {
    id: string
}
interface IProps extends RouteComponentProps<RouteParams> {

}

const TeamDetails: React.FC<IProps> = ({ match }) => {
    const rootStore = useContext(RootStoreContext);
    const { selectedTeam: team, selectTeam } = rootStore.teamStore;

    useEffect(() => {
        selectTeam(+match.params.id);
    }, [selectTeam, match.params.id])

    if (!team)
        return <Loader active content='Loading...' />

    return (
        <Fragment>
            <Breadcrumb size='huge'>
                <Breadcrumb.Section link as={Link} to='/admin/tables/teams'>Teams</Breadcrumb.Section>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section active>{team.name}</Breadcrumb.Section>
            </Breadcrumb>
            <Divider />
            <Segment basic>
                <Reveal animated='move' instant style={{display: 'inline-block'}}>
                    <Reveal.Content visible>
                        <Image src={team.image || '/assets/noimage.png'} 
                        style={{ backgroundColor: '#eee', height: '188px', width: '250px' }} />
                    </Reveal.Content>
                    <Reveal.Content hidden>
                        <Button content='UPDATE PHOTO' style={{ height: '188px', width: '250px' }} icon='upload cloud' />
                    </Reveal.Content>
                </Reveal>
                <Header content={team.name} size='huge' />
                <Button color='green' content='Edit' as={Link}
                    to={`${team.id}/edit`} />
            </Segment>
        </Fragment>
    )
}

export default observer(TeamDetails);
