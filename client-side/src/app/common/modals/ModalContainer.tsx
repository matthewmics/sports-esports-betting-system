import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Modal } from 'semantic-ui-react'
import { RootStoreContext } from '../../stores/rootStore'

const ModalContainer = () => {

    const rootStore = useContext(RootStoreContext);
    const { modal: { open }, closeModal } = rootStore.modalStore;

    return (
        <Modal open={open}
            size='tiny'
            closeIcon
            onClose={closeModal}>
            <Modal.Content>
                This is for login
            </Modal.Content>
        </Modal>
    )
}

export default observer(ModalContainer);
