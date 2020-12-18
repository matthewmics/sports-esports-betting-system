import { observer } from 'mobx-react-lite'
import React from 'react'
import { Header, Form, Button, Comment, Segment } from 'semantic-ui-react';

const MatchComments = () => {
    return (
        <Segment>

            <Comment.Group style={{maxWidth: 'initial'}}> 
                <Header as='h3' dividing>
                    Comments
            </Header>
                <Comment>
                    <Comment.Avatar src='/assets/user_default.png' />
                    <Comment.Content>
                        <Comment.Author as='a'>Matt</Comment.Author>
                        <Comment.Text>How artistic!</Comment.Text>
                    </Comment.Content>
                </Comment>

                <Comment>
                    <Comment.Avatar src='/assets/user_default.png' />
                    <Comment.Content>
                        <Comment.Author as='a'>Elliot Fu</Comment.Author>
                        <Comment.Text>
                            <p>This has been very useful for my research. Thanks as well!</p>
                        </Comment.Text>
                    </Comment.Content>
                </Comment>

                <Comment>
                    <Comment.Avatar src='/assets/user_default.png' />
                    <Comment.Content>
                        <Comment.Author as='a'>Joe Henderson</Comment.Author>
                        <Comment.Text>Dude, this is awesome. Thanks so much</Comment.Text>
                    </Comment.Content>
                </Comment>

                <Form reply>
                    <Form.TextArea style={{height: 'auto'}} rows={3}/>
                    <Button content='Comment' labelPosition='left' icon='edit' primary />
                </Form>
            </Comment.Group>
        </Segment>
    )
}

export default observer(MatchComments);
