import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Button, Icon, List, Modal } from 'semantic-ui-react'
import { RootStoreContext } from '../../stores/rootStore';

const ErrorModalContainer = () => {

    const rootStore = useContext(RootStoreContext);
    const { errorModal: { error, title, open }, closeErrorModal } = rootStore.modalStore;

    return (
        <Modal open={open}
            size='tiny'>
            {title &&
                <Modal.Header >
                    <Icon name='warning sign' color='red' />
                    {` ${title}`}
                </Modal.Header>}
            <Modal.Content>
                {error && error.data && error.data.errors && Object.keys(error.data.errors).length > 0 &&
                    <List as='ul'>
                        {Object.values<string>(error.data.errors).map((err, index) =>
                            <List.Item as='li' key={index}>{err}</List.Item>
                        )}
                    </List>
                }
            </Modal.Content>
            <Modal.Actions>
                <Button content='Okay' onClick={closeErrorModal} />
            </Modal.Actions>
        </Modal>
    )
}

export default observer(ErrorModalContainer);