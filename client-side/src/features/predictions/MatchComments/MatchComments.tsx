import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useRef } from 'react'
import { Header, Form, Button, Comment, Segment, Label, Ref } from 'semantic-ui-react';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { Field, Form as FinalForm } from 'react-final-form';
import { MatchCommentReplyInput } from './MatchCommentReplyInput';
import { formatDistanceToNow } from 'date-fns';



const MatchComments = () => {

    const rootStore = useContext(RootStoreContext);
    const { selectedMatch, sendComment, loadRecentComments, loadingRecentComments } = rootStore.matchStore;
    const { isLoggedIn } = rootStore.userStore;

    const ref = useRef<any>(null);

    useEffect(() => {
        setTimeout(() => {

            if (ref && ref.current) {

                ref.current.scroll({ top: ref.current.scrollHeight, behavior: 'smooth' });

                ref.current.addEventListener('DOMNodeInserted', (event: any) => {
                    const { currentTarget: target } = event;
                    target!.scroll({ top: target!.scrollHeight, behavior: 'smooth' });
                });
            }

            if (selectedMatch) {
                loadRecentComments();
            }
        }, 20);
    }, [loadRecentComments, selectedMatch, ref])

    return (
        <Segment>

            <Header as='h3' dividing>
                Realtime comments
                </Header>
            <Ref innerRef={ref}>

                <Comment.Group style={{ maxWidth: 'initial', maxHeight: '250px', overflowY: 'auto' }}>

                    {selectedMatch && selectedMatch.comments && selectedMatch.comments.map(x =>
                        <Comment key={x.id}>
                            <Comment.Avatar src='/assets/user_default.png' />
                            <Comment.Content>
                                <Comment.Author as='a'>{x.displayName}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistanceToNow(x.createdAt)}</div>
                                </Comment.Metadata>
                                <Comment.Text>
                                    <p>{x.message}</p>
                                </Comment.Text>
                            </Comment.Content>
                        </Comment>
                    )}

                    {selectedMatch && selectedMatch.comments && selectedMatch.comments.length === 0 &&
                        !loadingRecentComments &&
                        <Label basic content='No comments yet' />
                    }


                </Comment.Group>
            </Ref>


            {isLoggedIn &&
                <FinalForm onSubmit={(values, f) => {

                    if (values.message && values.message.trim().length !== 0)
                        sendComment(values);

                    setTimeout(() => {
                        f.reset();
                    }, 1);
                }}
                    render={({ handleSubmit, form }) =>
                        <Form onSubmit={handleSubmit} reply error>
                            <Field component={MatchCommentReplyInput}
                                name='message'
                            />
                            <Button content='Comment' labelPosition='left' icon='edit' primary
                                type='submit'
                                style={{ marginTop: '10px', display: 'block' }} />
                        </Form>
                    } />}
        </Segment>
    )
}

export default observer(MatchComments);
