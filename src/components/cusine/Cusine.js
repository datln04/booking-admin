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

const Cusine = () => {
    const [cuisines, setCuisines] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingCuisine, setEditingCuisine] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [cuisineToDelete, setCuisineToDelete] = useState(null);
    const [newCuisine, setNewCuisine] = useState({
        id: 0,
        cuisineName: '',
        isDeleted: false
    });
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        fetchCuisines();
    }, [refresh]);

    const fetchCuisines = async () => {
        setFetching(true);
        fetchData('/CuisineType').then(response => {
            setCuisines(response);
            setFetching(false);
        })
            .catch(error => {
                console.error('There was an error fetching the cuisines!', error);
                setFetching(false);
            });
    };

    const handleAddCuisine = () => {
        setEditingCuisine(null);
        setNewCuisine({
            id: 0,
            cuisineName: '',
            isDeleted: false
        });
        setShowPopup(true);
    };

    const handleEditCuisine = (cuisine) => {
        setEditingCuisine(cuisine);
        setNewCuisine(cuisine);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewCuisine(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        setLoading(false);
        handleClosePopup();

        if (editingCuisine) {
            updateData(`/CuisineType/${editingCuisine.id}`, newCuisine).then(() => {
                setToasts([...toasts, { type: 'success', message: 'Cuisine updated successfully!' }]);
                setRefresh(!refresh);
            });
        } else {
            createData('/CuisineType', newCuisine).then(() => {
                setToasts([...toasts, { type: 'success', message: 'Cuisine created successfully!' }]);
                setRefresh(!refresh);
            });
        }
    };

    const handleDeleteCuisine = (cuisineId) => {
        setCuisineToDelete(cuisineId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteCuisine = () => {
        deleteData(`/CuisineType/${cuisineToDelete}`).then(() => {
            setRefresh(!refresh);
            setToasts([...toasts, { type: 'success', message: 'Cuisine deleted successfully!' }]);
            setShowDeleteConfirm(false);
            setCuisineToDelete(null);
        }).catch(error => {
            setToasts([...toasts, { type: 'danger', message: 'Error or already in used' }]);
            setShowDeleteConfirm(false);
            setCuisineToDelete(null);
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
                        <CButton color="primary" onClick={handleAddCuisine}>
                            <CIcon icon={cilUserFollow} /> Add Cuisine
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
                                        <th>Cuisine Name</th>
                                        <th>Status</th>
                                        <th style={{width: '130px'}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cuisines.map(cuisine => (
                                        <tr key={cuisine.id}>
                                            <td>{cuisine.id}</td>
                                            <td>{cuisine.cuisineName}</td>
                                            <td>
                                                <CBadge color={getStatusBadge(cuisine.isDeleted)}>
                                                    {getStatusText(cuisine.isDeleted)}
                                                </CBadge>
                                            </td>
                                            <td>
                                                <CButton className='mx-2' color="info" size="sm" onClick={() => handleEditCuisine(cuisine)}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton color="danger" size="sm" onClick={() => handleDeleteCuisine(cuisine.id)}>
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
                <CModalHeader closeButton>{editingCuisine ? 'Edit Cuisine' : 'Add New Cuisine'}</CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="cuisineName">Cuisine Name</CFormLabel>
                            <CFormInput type="text" id="cuisineName" name="cuisineName" value={newCuisine.cuisineName} onChange={handleChange} required disabled={loading} />
                        </div>
                        
                        <div className="mb-3">
                            <CFormCheck id="isDeleted" name="isDeleted" checked={newCuisine.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />
                        </div>
                        
                        <CModalFooter className="d-flex justify-content-end">
                            <CButton color="primary" type="submit" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : (editingCuisine ? 'Save Changes' : 'Add Cuisine')}
                            </CButton>
                            <CButton color="secondary" onClick={handleClosePopup} disabled={loading}>Cancel</CButton>
                        </CModalFooter>
                    </CForm>
                </CModalBody>
            </CModal>

            <DeleteConfirmation
                visible={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteCuisine}
            />
        </CRow>
    );
};

export default Cusine;