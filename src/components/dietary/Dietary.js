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

const Dietary = () => {
    const [dietaryOption, setDietaryOption] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingOption, setEditingOption] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [optionToDelete, setOptionToDelete] = useState(null);
    const [newOption, setNewOption] = useState({
        id: 0,
        optionName: '',
        isDeleted: false
    });
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        fetchDietaryOption();
    }, [refresh]);

    const fetchDietaryOption = async () => {
        setFetching(true);
        fetchData('/DietaryOption').then(response => {
            setDietaryOption(response);
            setFetching(false);
        })
            .catch(error => {
                console.error('There was an error fetching the dietary options!', error);
                setFetching(false);
            });
    };

    const handleAddOption = () => {
        setEditingOption(null);
        setNewOption({
            id: 0,
            optionName: '',
            isDeleted: false
        });
        setShowPopup(true);
    };

    const handleEditOption = (option) => {
        setEditingOption(option);
        setNewOption(option);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewOption(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

     
        handleClosePopup();

        if (editingOption) {
            updateData(`/DietaryOption/${editingOption.id}`, newOption).then(() => {
                setToasts([...toasts, { type: 'success', message: 'Image uploaded successfully!' }]);
                setLoading(false);
                setRefresh(!refresh);
            });
        } else {
            createData('/DietaryOption', newOption).then(() => {
                setToasts([...toasts, { type: 'success', message: 'Image uploaded successfully!' }]);
                setLoading(false);
                setRefresh(!refresh);
            });
        }
    };

    const handleDeleteOption = (optionId) => {
        setOptionToDelete(optionId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteOption = () => {
        deleteData(`/DietaryOption/${optionToDelete}`).then(() => {
            setRefresh(!refresh);
            setToasts([...toasts, { type: 'success', message: 'Dietary option deleted successfully!' }]);
            setShowDeleteConfirm(false);
            setOptionToDelete(null);
        }).catch(error => {
            setToasts([...toasts, { type: 'danger', message: error.message }]);
            setShowDeleteConfirm(false);
            setOptionToDelete(null);
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
                        <CButton color="primary" onClick={handleAddOption}>
                            <CIcon icon={cilUserFollow} /> Add Dietary Option
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
                                        <th>Option Name</th>
                                        <th>Status</th>
                                        <th style={{width: '130px'}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dietaryOption.map(option => (
                                        <tr key={option.id}>
                                            <td>{option.id}</td>
                                            <td>{option.optionName}</td>
                                            <td>
                                                <CBadge color={getStatusBadge(option.isDeleted)}>
                                                    {getStatusText(option.isDeleted)}
                                                </CBadge>
                                            </td>
                                            <td>
                                                <CButton className='mx-2' color="info" size="sm" onClick={() => handleEditOption(option)}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton color="danger" size="sm" onClick={() => handleDeleteOption(option.id)}>
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
                <CModalHeader closeButton>{editingOption ? 'Edit Dietary Option' : 'Add New Dietary Option'}</CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="optionName">Option Name</CFormLabel>
                            <CFormInput type="text" id="optionName" name="optionName" value={newOption.optionName} onChange={handleChange} required disabled={loading} />
                        </div>
                        
                        <div className="mb-3">
                            <CFormCheck id="isDeleted" name="isDeleted" checked={newOption.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />
                        </div>
                        
                        <CModalFooter className="d-flex justify-content-end">
                            <CButton color="primary" type="submit" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : (editingOption ? 'Save Changes' : 'Add Dietary Option')}
                            </CButton>
                            <CButton color="secondary" onClick={handleClosePopup} disabled={loading}>Cancel</CButton>
                        </CModalFooter>
                    </CForm>
                </CModalBody>
            </CModal>

            <DeleteConfirmation
                visible={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteOption}
            />
        </CRow>
    );
};

export default Dietary;