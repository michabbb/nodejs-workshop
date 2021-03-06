/**
 * @author Sven Koelpin
 */
import React, { PureComponent } from 'react';
import { object } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import Navigation from '../nav/Navigation';
import Loading from '../component/Loading';
import style from './authView.less';

import { signIn } from './Auth';
import { ROUTES } from '../router/AppRouter';


class AuthView extends PureComponent {
    static get propTypes() {
        return {
            history: object.isRequired
        };
    }

    constructor() {
        super();
        this.onLogin = this.onLogin.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);

        this.state = {
            userName: '',
            pass: '',
            loading: false,
            loginError: false
        };
    }

    async onLogin(event) {
        event.preventDefault();
        this.setState({loading: true, loginError: false});

        try {
            await signIn(this.state);
            this.props.history.push(ROUTES.HOME);
        } catch (e) {
            this.setState({loading: false, loginError: true});
        }
    }

    handleFormChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }


    render() {
        const {userName, pass, loading, loginError} = this.state;

        return (
            <Container>
                <Navigation/>
                <Row>
                    <Col>
                        {loading && <Loading cover/>}
                        <Form onSubmit={this.onLogin}>
                            <FormGroup>
                                <Label>Your name (min. 3 characters)</Label>
                                <Input name="userName" value={userName} onChange={this.handleFormChange} required pattern=".{3,50}" type="text"/>
                            </FormGroup>
                            <FormGroup>
                                <Label>Your pass</Label>
                                <Input name="pass" value={pass} onChange={this.handleFormChange} required pattern=".{6,50}" type="password"/>
                            </FormGroup>
                            {
                                loginError && <div className={style.err}>Ups that did not work. The password is 'summit' :)</div>
                            }
                            <Button disabled={loading} color="primary">Let&apos;s go</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withRouter(AuthView);
