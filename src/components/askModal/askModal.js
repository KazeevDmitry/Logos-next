import React from 'react';


import Modal from 'react-bootstrap/Modal';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import Button from 'react-bootstrap/Button';




export default function AskModal({
    
    labelText="Вы уверены, что хотите выйти из текущего профиля?",
    xCoord = 0,
    yCoord=0,
    visible = false,
    setShow
}) {

    // if (!visible) {
    //     return null;
    // }

    return (
        <Modal
        show={visible}
        onHide={() => setShow(false)}
        centered
        // dialogClassName="modal-90w"
        // aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Body>
          <p>
            {labelText}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" 
           onClick={() => setShow(false)}
        >
            Отмена
          </Button>
          <Button variant="primary" 
           onClick={() => setShow(true)}
          >
            ОК
          </Button>
        </Modal.Footer>
      </Modal>
    )
}