import React from 'react';
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react';

const DeleteConfirmation = ({ visible, onClose, onConfirm }) => {
    return (
        <CModal visible={visible} onClose={onClose}>
            <CModalHeader closeButton>Confirm Delete</CModalHeader>
            <CModalBody>
                Are you sure you want to delete this user?
            </CModalBody>
            <CModalFooter>
                <CButton color="danger" onClick={onConfirm}>Delete</CButton>
                <CButton color="secondary" onClick={onClose}>Cancel</CButton>
            </CModalFooter>
        </CModal>
    );
};

export default DeleteConfirmation;