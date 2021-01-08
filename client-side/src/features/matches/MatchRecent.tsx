import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext, useEffect } from 'react'
import { Header, Segment, Label, Image, Placeholder } from 'semantic-ui-react'
import { history } from '../..'
import { RootStoreContext } from '../../app/stores/rootStore'

const MatchRecent = () => {

    const rootStore = useContext(RootStoreContext);
    const { loadRecentMatches, loadingMatchRecent, recentMatchesList } = rootStore.matchStore;

    useEffect(() => {
        loadRecentMatches();
    }, [loadRecentMatches]);


    return (
        <Fragment>
            <Header color='teal' attached='top' content='Recent matches' />
            <div className='ui segments' style={{ borderTop: '0', marginTop: '0' }}>
                {loadingMatchRecent && recentMatchesList.length === 0 ?
                    <Fragment>
                        <Segment className='flex-even match-recent height-70'>
                            <Placeholder style={{ height: '30px', width: '100%' }}>
                                <Placeholder.Image />
                            </Placeholder>
                        </Segment>
                        <Segment className='flex-even match-recent height-70'>
                            <Placeholder style={{ height: '30px', width: '100%' }}>
                                <Placeholder.Image />
                            </Placeholder>
                        </Segment>
                    </Fragment>
                    :
                    recentMatchesList.map(x =>
                        <Segment key={x.id} className='flex-even match-recent height-70'
                            textAlign='center' onClick={() => {
                                history.push(`/matches/${x.id}`)
                            }}>
                            <Label size='mini' corner={x.winner.id === x.teamA.id ? 'left' : 'right'} icon='trophy' color='green' />
                            <Image src={x.teamA.image || '/assets/noimage.png'} className='height-41' />
                            <span className='width-35p'>vs</span>
                            <Image src={x.teamB.image || '/assets/noimage.png'} className='height-41' />
                        </Segment>
                    )
                }
            </div>

        </Fragment>
    )
}

export default observer(MatchRecent);