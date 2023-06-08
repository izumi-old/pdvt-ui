import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import CodeDto from "./CodeDto";
import logger from "../../utils/Logger";

class CreateCodeModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            specialValue: '',
            validated: false,
            valid: false
        };
    }

    handleChangeSpecialValue = (e) => {
        this.setState({ specialValue: e.target.value });
    };

    handleCreateCode = () => {
        if (this.state.valid === false) {
            return;
        }

        const { specialValue } = this.state;
        let dto = new CodeDto(specialValue);
        this.props.onCreate(dto);
        this.setState({
            specialValue: "",
        });
    };

    handleSubmit = (event) => {
        const form = event.currentTarget;
        let valid = form.checkValidity();
        event.preventDefault();
        if (valid === false) {
            event.stopPropagation();
            this.setState({
                validated: true,
                valid: false
            });
        } else {
            this.setState({
                validated: true,
                valid: true
            }, this.handleCreateCode);
        }
    };

    render() {
        const { show, onClose, t } = this.props;
        const { specialValue } = this.state;

        return (
            <Modal show={show} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('code-screen.create-modal-title')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id={"form"} noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                        <Form.Group controlId="formSpecialValue" className={"mb-4"}>
                            <Form.Label>{t('code-screen.special-value-label')}</Form.Label>
                            <Form.Control type="text" value={specialValue} onChange={this.handleChangeSpecialValue} required/>
                            <Form.Control.Feedback type="invalid">
                                {t("code-screen.fill-code")}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button type={"submit"} variant="primary" className={"mr-3"}>
                            {t('code-screen.create-button')}
                        </Button>
                        <Button variant="secondary" onClick={onClose}>
                            {t('code-screen.cancel-button')}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        );
    }
}

export default withTranslation()(CreateCodeModal);
