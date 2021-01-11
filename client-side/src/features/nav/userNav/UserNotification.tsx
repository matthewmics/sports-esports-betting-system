import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react'
import { Dropdown, Icon, Menu, Popup, Segment } from 'semantic-ui-react';
import { history } from '../../..';
import { formatToLocalPH } from '../../../app/common/util/util';
import { RootStoreContext } from '../../../app/stores/rootStore';

const notificationBadgeStyle = {
    backgroundColor: '#f44336',
    height: '22px',
    width: '22px',
    position: 'absolute' as 'absolute',
    right: 12, top: 12,
    border: '3px solid white',
    borderRadius: '20px',
    boxSizing: 'border-box' as 'border-box',
    color: 'white',
    fontSize: '9px',
    fontWeight: 'bold' as 'bold',
    textAlign: 'center' as 'center',
    lineHeight: '16px'
};

const UserNotification = () => {

    const rootStore = useContext(RootStoreContext);
    const { user, readPredictionNotification } = rootStore.userStore;

    const [open, setOpen] = useState(false);

    if (!user) return null

    const { predictionNotifications: pn } = user;

    return (

        <Popup
            on='click'
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={
                <Menu.Item>
                    <Icon size='large' name='bell outline' />
                    {pn.length !== 0 &&
                        <div style={notificationBadgeStyle}>{pn.length}</div>
                    }
                </Menu.Item>
            }
            style={{ padding: '0', maxHeight:'80vh', overflowY: 'auto' }}
            focusable={false}
            position='bottom right'
        >
            {pn.length === 0 ?
                <div style={{ padding: '16px', color: 'teal' }}>You have no notifications</div>
                :
                pn.map(x =>
                    <div key={x.id} className='item-notification text-small' onClick={() => {
                        setOpen(false);
                        readPredictionNotification(x.id)
                        history.push(`/matches/${x.matchId}?pid=${x.predictionId}`);
                    }}>
                        {x.outcome > 0 ? "You have won " : "You have lost "}
                        <span className={x.outcome > 0 ? 'text-green text-bold' : 'text-red text-bold'}>
                            {formatToLocalPH(x.outcome)}
                        </span> in the match
                    {" "}<span className='text-bold'>{x.matchPredictionName}</span>
                    </div>
                )
            }
        </Popup>
    )
}

export default observer(UserNotification)