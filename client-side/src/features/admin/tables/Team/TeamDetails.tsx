import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Segment, Image, Loader, Header, Button, Breadcrumb, Divider, Reveal, Placeholder, Card } from 'semantic-ui-react'
import PhotoSelectAndCrop from '../../../../app/common/photos/PhotoSelectAndCrop'
import { RootStoreContext } from '../../../../app/stores/rootStore'

interface RouteParams {
    id: string
}
interface IProps extends RouteComponentProps<RouteParams> {

}

const TeamDetails: React.FC<IProps> = ({ match }) => {
    const rootStore = useContext(RootStoreContext);
    const { selectedTeam: team, selectTeam, changeImage, loading } = rootStore.teamStore;
    const { openModal } = rootStore.modalStore;

    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        selectTeam(+match.params.id);

        return (() => {
            if (previewImage)
                URL.revokeObjectURL(previewImage);
        })

    }, [selectTeam, match.params.id, previewImage])

    const handleChangeImage = () => {
        openModal(<PhotoSelectAndCrop onImageSet={(file) => {
            if (file)
                changeImage(file).then(() => {
                    if (previewImage)
                        URL.revokeObjectURL(previewImage);
                    setPreviewImage(URL.createObjectURL(file));
                });
        }} />);
    }

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
            <Card>
                {loading ?
                    <Placeholder style={{ height: '188px', width: '100%' }}>
                        <Placeholder.Image />
                    </Placeholder>
                    :
                    <Reveal animated='move' instant style={{ display: 'inline-block' }}>
                        <Reveal.Content visible>
                            <Image src={previewImage || team.image || '/assets/noimage.png'}
                                style={{ backgroundColor: '#f9fbe7', height: '200px', width: '100%' }} />
                        </Reveal.Content>
                        <Reveal.Content hidden>
                            <Button content='UPDATE PHOTO' style={{ height: '200px', width: '100%' }} icon='upload cloud'
                                onClick={handleChangeImage} />
                        </Reveal.Content>
                    </Reveal>
                }
                <Card.Content>
                    <Card.Header>{team.name}</Card.Header>
                    <Card.Meta>
                        <span className='date'>Created at {team.createdAt}</span>
                    </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                    <Button primary content='Edit' as={Link}
                        to={`${team.id}/edit`} />
                </Card.Content>
            </Card>
        </Fragment>
    )
}

export default observer(TeamDetails);
