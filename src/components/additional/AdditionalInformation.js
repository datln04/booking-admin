import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CBadge, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput, CFormCheck, CToast, CToastBody, CToastHeader, CToaster, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilUserFollow } from '@coreui/icons';
import { createData, fetchData, updateData, deleteData } from '../../service/service';
import DeleteConfirmation from '../../util/DeleteConfirmation';

const getStatusBadge = (isDeleted) => {
    return isDeleted ? 'danger' : 'success';
};

const getStatusText = (isDeleted) => {
    return isDeleted ? 'Deleted' : 'Active';
};

const AdditionalInformation = () => {
    const [additionalInfo, setAdditionalInfo] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingInfo, setEditingInfo] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [infoToDelete, setInfoToDelete] = useState(null);
    const [newInfo, setNewInfo] = useState({
        id: 0,
        name: '',
        isDeleted: false
    });
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        fetchAdditionalInfo();
    }, [refresh]);

    const fetchAdditionalInfo = async () => {
        setFetching(true);
        fetchData('/AdditionalInfo').then(response => {
            setAdditionalInfo(response);
            setFetching(false);
        })
            .catch(error => {
                console.error('There was an error fetching the additional information!', error);
                setFetching(false);
            });
    };

    const handleAddInfo = () => {
        setEditingInfo(null);
        setNewInfo({
            id: 0,
            name: '',
            isDeleted: false
        });
        setShowPopup(true);
    };

    const handleEditInfo = (info) => {
        setEditingInfo(info);
        setNewInfo(info);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewInfo(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const infoToSave = {
            ...newInfo
        };

        setLoading(false);
        handleClosePopup();

        if (editingInfo) {
            updateData(`/AdditionalInfo/${editingInfo.id}`, infoToSave).then(() => {
                setRefresh(!refresh);
                setToasts([...toasts, { type: 'success', message: 'Information updated successfully!' }]);
            });
        } else {
            createData('/AdditionalInfo', infoToSave).then(() => {
                setToasts([...toasts, { type: 'success', message: 'Information created successfully!' }]);
                setRefresh(!refresh);
            });
        }
    };

    const handleDeleteInfo = (infoId) => {
        setInfoToDelete(infoId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteInfo = () => {
        deleteData(`/AdditionalInfo/${infoToDelete}`).then(() => {
            setRefresh(!refresh);
            setToasts([...toasts, { type: 'success', message: 'Information deleted successfully!' }]);
            setShowDeleteConfirm(false);
            setInfoToDelete(null);
        }).catch(error => {
            setToasts([...toasts, { type: 'danger', message: 'Error or already in used' }]);
            setShowDeleteConfirm(false);
            setInfoToDelete(null);
        });
    };

    return (
        <CRow>
            <CToaster position="top-center">
                {toasts.map((toast, index) => (
                    <CToast key={index} autohide={true} visible={true} color={toast.type}>
                        <CToastHeader closeButton>
                            <strong className="me-auto">Notification</strong>
                        </CToastHeader>
                        <CToastBody>{toast.message}</CToastBody>
                    </CToast>
                ))}
            </CToaster>
            <CCol>
                <CCard>
                    <CCardHeader>
                        <CButton color="primary" onClick={handleAddInfo}>
                            <CIcon icon={cilUserFollow} /> Add Information
                        </CButton>
                    </CCardHeader>
                    <CCardBody>
                        {fetching ? (
                            <div className="text-center">
                                <CSpinner color="primary" />
                            </div>
                        ) : (
                            <table className="table table-hover table-striped table-bordered text-center">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Status</th>
                                        <th style={{width: '130px'}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {additionalInfo.map(info => (
                                        <tr key={info.id}>
                                            <td>{info.id}</td>
                                            <td>{info.name}</td>
                                            <td>
                                                <CBadge color={getStatusBadge(info.isDeleted)}>
                                                    {getStatusText(info.isDeleted)}
                                                </CBadge>
                                            </td>
                                            <td>
                                                <CButton className='mx-2' color="info" size="sm" onClick={() => handleEditInfo(info)}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton color="danger" size="sm" onClick={() => handleDeleteInfo(info.id)}>
                                                    <CIcon icon={cilTrash} />
                                                </CButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CCardBody>
                </CCard>
            </CCol>

            <CModal visible={showPopup} onClose={handleClosePopup}>
                <CModalHeader closeButton>{editingInfo ? 'Edit Information' : 'Add New Information'}</CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="name">Name</CFormLabel>
                            <CFormInput type="text" id="name" name="name" value={newInfo.name} onChange={handleChange} required disabled={loading} />
                        </div>
                        
                        <div className="mb-3">
                            <CFormCheck id="isDeleted" name="isDeleted" checked={newInfo.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />
                        </div>
                        
                        <CModalFooter className="d-flex justify-content-end">
                            <CButton color="primary" type="submit" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : (editingInfo ? 'Save Changes' : 'Add Information')}
                            </CButton>
                            <CButton color="secondary" onClick={handleClosePopup} disabled={loading}>Cancel</CButton>
                        </CModalFooter>
                    </CForm>
                </CModalBody>
            </CModal>

            <DeleteConfirmation
                visible={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteInfo}
            />
        </CRow>
    );
};

export default AdditionalInformation;