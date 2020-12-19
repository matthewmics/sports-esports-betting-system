import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { Button, Header } from 'semantic-ui-react'
import { RootStoreContext } from '../../stores/rootStore'

interface IProps {
    onConfirm?: () => void;
    onReject?: () => void;
    title?: string;
    message: string;
    closeModal: () => void;
}

const Confirmation: React.FC<IProps> = ({ message, title, onConfirm, onReject, closeModal }) => {
    return (
        <div className='clearFix'>
            {title &&
                <Header content={title} />}
            <p>
                {message}
            </p>
            <div>
                <Button content='Yes' floated='right' primary onClick={() => {
                    if (onConfirm)
                        onConfirm();
                    closeModal();
                }} />
                <Button content='No' floated='right' onClick={() => {
                    if (onReject)
                        onReject();
                    closeModal();
                }} />
            </div>
        </div>
    )
}

export default Confirmation;

