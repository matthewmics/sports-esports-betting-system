import React, { Fragment } from 'react'
import { Segment, Grid, Placeholder } from 'semantic-ui-react'

const placeHolderStyle = {
    display: 'inline-block', width: '250px', height: '30px', margin: '0px'
}

interface IProps {
    total: number;
}

const MatchPlaceholder: React.FC<IProps> = ({ total }) => {
    return (
        <Fragment>
            {
                [...Array(total)].map((e,i) =>
                    <Segment.Group key={i}>
                        <Segment clearing>
                            <Placeholder style={placeHolderStyle}>
                                <Placeholder.Header image>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Header>
                            </Placeholder>

                            <Placeholder style={{ ...placeHolderStyle, float: 'right', width: '100px' }}>
                                <Placeholder.Line />
                            </Placeholder>
                        </Segment>
                        <Segment>
                            <Grid columns={3} stackable textAlign='center'>
                                <Grid.Row verticalAlign='middle'>
                                    <Grid.Column>
                                        <Placeholder style={placeHolderStyle}>
                                            <Placeholder.Header image>
                                                <Placeholder.Line />
                                                <Placeholder.Line />
                                            </Placeholder.Header>
                                        </Placeholder>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Placeholder style={placeHolderStyle}>
                                            <Placeholder.Header image>
                                                <Placeholder.Line />
                                                <Placeholder.Line />
                                            </Placeholder.Header>
                                        </Placeholder>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                        <Segment clearing>
                            <Placeholder style={{ ...placeHolderStyle, width: '100px' }}>
                                <Placeholder.Line />
                            </Placeholder>
                        </Segment>
                    </Segment.Group>
                )
            }
        </Fragment>
    )
}

export default MatchPlaceholder;