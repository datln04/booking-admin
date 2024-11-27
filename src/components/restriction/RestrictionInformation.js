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

const RestrictionInformation = () => {
    const [restrictions, setRestrictions] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingRestriction, setEditingRestriction] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [restrictionToDelete, setRestrictionToDelete] = useState(null);
    const [newRestriction, setNewRestriction] = useState({
        id: 0,
        name: '',
        isDeleted: false
    });
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        fetchRestrictions();
    }, [refresh]);

    const fetchRestrictions = async () => {
        setFetching(true);
        fetchData('/ActivityRestrictions').then(response => {
            setRestrictions(response);
            setFetching(false);
        })
            .catch(error => {
                console.error('There was an error fetching the restrictions!', error);
                setFetching(false);
            });
    };

    const handleAddRestriction = () => {
        setEditingRestriction(null);
        setNewRestriction({
            id: 0,
            name: '',
            isDeleted: false
        });
        setShowPopup(true);
    };

    const handleEditRestriction = (restriction) => {
        setEditingRestriction(restriction);
        setNewRestriction(restriction);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewRestriction(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const restrictionToSave = {
            ...newRestriction
        };

        setLoading(false);
        handleClosePopup();

        if (editingRestriction) {
            updateData(`/ActivityRestrictions/${editingRestriction.id}`, restrictionToSave).then(() => {
                setRefresh(!refresh);
            });
        } else {
            createData('/ActivityRestrictions', restrictionToSave).then(() => {
                setRefresh(!refresh);
            });
        }
    };

    const handleDeleteRestriction = (restrictionId) => {
        setRestrictionToDelete(restrictionId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteRestriction = () => {
        deleteData(`/ActivityRestrictions/${restrictionToDelete}`).then(() => {
            setRefresh(!refresh);
            setToasts([...toasts, { type: 'success', message: 'Restriction deleted successfully!' }]);
            setShowDeleteConfirm(false);
            setRestrictionToDelete(null);
        }).catch(error => {
            setToasts([...toasts, { type: 'danger', message: error.message }]);
            setShowDeleteConfirm(false);
            setRestrictionToDelete(null);
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
                        <CButton color="primary" onClick={handleAddRestriction}>
                            <CIcon icon={cilUserFollow} /> Add Restriction
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
                                    {restrictions.map(restriction => (
                                        <tr key={restriction.id}>
                                            <td>{restriction.id}</td>
                                            <td>{restriction.name}</td>
                                            <td>
                                                <CBadge color={getStatusBadge(restriction.isDeleted)}>
                                                    {getStatusText(restriction.isDeleted)}
                                                </CBadge>
                                            </td>
                                            <td>
                                                <CButton className='mx-2' color="info" size="sm" onClick={() => handleEditRestriction(restriction)}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton color="danger" size="sm" onClick={() => handleDeleteRestriction(restriction.id)}>
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
                <CModalHeader closeButton>{editingRestriction ? 'Edit Restriction' : 'Add New Restriction'}</CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="name">Name</CFormLabel>
                            <CFormInput type="text" id="name" name="name" value={newRestriction.name} onChange={handleChange} required disabled={loading} />
                        </div>
                        
                        <div className="mb-3">
                            <CFormCheck id="isDeleted" name="isDeleted" checked={newRestriction.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />
                        </div>
                        
                        <CModalFooter className="d-flex justify-content-end">
                            <CButton color="primary" type="submit" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : (editingRestriction ? 'Save Changes' : 'Add Restriction')}
                            </CButton>
                            <CButton color="secondary" onClick={handleClosePopup} disabled={loading}>Cancel</CButton>
                        </CModalFooter>
                    </CForm>
                </CModalBody>
            </CModal>

            <DeleteConfirmation
                visible={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteRestriction}
            />
        </CRow>
    );
};

export default RestrictionInformation;