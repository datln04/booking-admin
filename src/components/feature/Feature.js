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

const Feature = () => {
    const [features, setFeatures] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingFeature, setEditingFeature] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [featureToDelete, setFeatureToDelete] = useState(null);
    const [newFeature, setNewFeature] = useState({
        id: 0,
        featureName: '',
        isDeleted: false
    });
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        fetchFeatures();
    }, [refresh]);

    const fetchFeatures = async () => {
        setFetching(true);
        fetchData('/Feature').then(response => {
            setFeatures(response);
            setFetching(false);
        })
            .catch(error => {
                console.error('There was an error fetching the features!', error);
                setFetching(false);
            });
    };

    const handleAddFeature = () => {
        setEditingFeature(null);
        setNewFeature({
            id: 0,
            featureName: '',
            isDeleted: false
        });
        setShowPopup(true);
    };

    const handleEditFeature = (feature) => {
        setEditingFeature(feature);
        setNewFeature(feature);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewFeature(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        setLoading(false);
        handleClosePopup();

        if (editingFeature) {
            updateData(`/Feature/${editingFeature.id}`, newFeature).then(() => {
                setToasts([...toasts, { type: 'success', message: 'Feature updated successfully!' }]);
                setRefresh(!refresh);
            });
        } else {
            createData('/Feature', newFeature).then(() => {
                setToasts([...toasts, { type: 'success', message: 'Feature created successfully!' }]);
                setRefresh(!refresh);
            });
        }
    };

    const handleDeleteFeature = (featureId) => {
        setFeatureToDelete(featureId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteFeature = () => {
        deleteData(`/Feature/${featureToDelete}`).then(() => {
            setRefresh(!refresh);
            setToasts([...toasts, { type: 'success', message: 'Feature deleted successfully!' }]);
            setShowDeleteConfirm(false);
            setFeatureToDelete(null);
        }).catch(error => {
            setToasts([...toasts, { type: 'danger', message: error.message }]);
            setShowDeleteConfirm(false);
            setFeatureToDelete(null);
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
                        <CButton color="primary" onClick={handleAddFeature}>
                            <CIcon icon={cilUserFollow} /> Add Feature
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
                                        <th>Feature Name</th>
                                        <th>Status</th>
                                        <th style={{width: '130px'}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {features.map(feature => (
                                        <tr key={feature.id}>
                                            <td>{feature.id}</td>
                                            <td>{feature.featureName}</td>
                                            <td>
                                                <CBadge color={getStatusBadge(feature.isDeleted)}>
                                                    {getStatusText(feature.isDeleted)}
                                                </CBadge>
                                            </td>
                                            <td>
                                                <CButton className='mx-2' color="info" size="sm" onClick={() => handleEditFeature(feature)}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton color="danger" size="sm" onClick={() => handleDeleteFeature(feature.id)}>
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
                <CModalHeader closeButton>{editingFeature ? 'Edit Feature' : 'Add New Feature'}</CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="featureName">Feature Name</CFormLabel>
                            <CFormInput type="text" id="featureName" name="featureName" value={newFeature.featureName} onChange={handleChange} required disabled={loading} />
                        </div>
                        
                        <div className="mb-3">
                            <CFormCheck id="isDeleted" name="isDeleted" checked={newFeature.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />
                        </div>
                        
                        <CModalFooter className="d-flex justify-content-end">
                            <CButton color="primary" type="submit" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : (editingFeature ? 'Save Changes' : 'Add Feature')}
                            </CButton>
                            <CButton color="secondary" onClick={handleClosePopup} disabled={loading}>Cancel</CButton>
                        </CModalFooter>
                    </CForm>
                </CModalBody>
            </CModal>

            <DeleteConfirmation
                visible={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteFeature}
            />
        </CRow>
    );
};

export default Feature;