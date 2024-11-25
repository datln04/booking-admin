import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CBadge, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput, CFormCheck, CFormSelect, CToast, CToastBody, CToastHeader, CToaster, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilUserFollow } from '@coreui/icons';
import { createData, fetchData, updateData, deleteData, fetchFilteredData } from '../../service/service';
import DeleteConfirmation from '../../util/DeleteConfirmation';

const getStatusBadge = (isDeleted) => {
    return isDeleted ? 'danger' : 'success';
};

const getStatusText = (isDeleted) => {
    return isDeleted ? 'Deleted' : 'Active';
};

const TransportFeature = () => {
    const [transportFeatures, setTransportFeatures] = useState([]);
    const [features, setFeatures] = useState([]);
    const [transportServices, setTransportServices] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingTransportFeature, setEditingTransportFeature] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [transportFeatureToDelete, setTransportFeatureToDelete] = useState(null);
    const [newTransportFeature, setNewTransportFeature] = useState({
        id: 0,
        featureId: 0,
        transportServiceId: 0,
        isDeleted: false
    });
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        fetchTransportFeatures();
        fetchFeatures();
        fetchTransportServices();
    }, [refresh]);

    const fetchTransportFeatures = async () => {
        setFetching(true);
        const filter = {
            filters: [],
            includes: ["Feature", "TransportService"],
            logic: "string",
            pageSize: 0,
            pageNumber: 0,
            all: true
        };
        fetchFilteredData('/TransportFeatures', filter).then(response => {
            setTransportFeatures(response);
            setFetching(false);
        })
        .catch(error => {
            console.error('There was an error fetching the transport features!', error);
            setFetching(false);
        });
    };

    const fetchFeatures = async () => {
        fetchData('/Features').then(response => {
            setFeatures(response);
        })
        .catch(error => {
            console.error('There was an error fetching the features!', error);
        });
    };

    const fetchTransportServices = async () => {
        fetchData('/TransportServices').then(response => {
            setTransportServices(response);
        })
        .catch(error => {
            console.error('There was an error fetching the transport services!', error);
        });
    };

    const handleAddTransportFeature = () => {
        setEditingTransportFeature(null);
        setNewTransportFeature({
            id: 0,
            featureId: 0,
            transportServiceId: 0,
            isDeleted: false
        });
        setShowPopup(true);
    };

    const handleEditTransportFeature = (transportFeature) => {
        setEditingTransportFeature(transportFeature);
        setNewTransportFeature(transportFeature);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewTransportFeature(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const transportFeatureToSave = {
            ...newTransportFeature
        };

        setLoading(false);
        handleClosePopup();

        if (editingTransportFeature) {
            updateData(`/TransportFeatures/${editingTransportFeature.id}`, transportFeatureToSave).then(() => {
                setRefresh(!refresh);
            });
        } else {
            createData('/TransportFeatures', transportFeatureToSave).then(() => {
                setRefresh(!refresh);
            });
        }
    };

    const handleDeleteTransportFeature = (transportFeatureId) => {
        setTransportFeatureToDelete(transportFeatureId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteTransportFeature = () => {
        deleteData(`/TransportFeatures/${transportFeatureToDelete}`).then(() => {
            setRefresh(!refresh);
            setToasts([...toasts, { type: 'success', message: 'Transport feature deleted successfully!' }]);
            setShowDeleteConfirm(false);
            setTransportFeatureToDelete(null);
        }).catch(error => {
            setToasts([...toasts, { type: 'danger', message: error.message }]);
            setShowDeleteConfirm(false);
            setTransportFeatureToDelete(null);
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
                        <CButton color="primary" onClick={handleAddTransportFeature}>
                            <CIcon icon={cilUserFollow} /> Add Transport Feature
                        </CButton>
                    </CCardHeader>
                    <CCardBody>
                        {fetching ? (
                            <div className="text-center">
                                <CSpinner color="primary" />
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="table table-hover table-striped table-bordered text-center">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Feature</th>
                                            <th>Transport Service</th>
                                            <th>Status</th>
                                            <th style={{ width: '130px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transportFeatures.map(transportFeature => (
                                            <tr key={transportFeature.id}>
                                                <td>{transportFeature.id}</td>
                                                <td>{features.find(f => f.id === transportFeature.featureId)?.featureName || 'Unknown'}</td>
                                                <td>{transportServices.find(ts => ts.id === transportFeature.transportServiceId)?.name || 'Unknown'}</td>
                                                <td>
                                                    <CBadge color={getStatusBadge(transportFeature.isDeleted)}>
                                                        {getStatusText(transportFeature.isDeleted)}
                                                    </CBadge>
                                                </td>
                                                <td>
                                                    <CButton className='mx-2' color="info" size="sm" onClick={() => handleEditTransportFeature(transportFeature)}>
                                                        <CIcon icon={cilPencil} />
                                                    </CButton>
                                                    <CButton color="danger" size="sm" onClick={() => handleDeleteTransportFeature(transportFeature.id)}>
                                                        <CIcon icon={cilTrash} />
                                                    </CButton>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CCardBody>
                </CCard>
            </CCol>

            <CModal visible={showPopup} onClose={handleClosePopup}>
                <CModalHeader closeButton>{editingTransportFeature ? 'Edit Transport Feature' : 'Add New Transport Feature'}</CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="featureId">Feature</CFormLabel>
                            <CFormSelect id="featureId" name="featureId" value={newTransportFeature.featureId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Feature</option>
                                {features.map(feature => (
                                    <option key={feature.id} value={feature.id}>{feature.featureName}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="transportServiceId">Transport Service</CFormLabel>
                            <CFormSelect id="transportServiceId" name="transportServiceId" value={newTransportFeature.transportServiceId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Transport Service</option>
                                {transportServices.map(service => (
                                    <option key={service.id} value={service.id}>{service.name}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        
                        <div className="mb-3">
                            <CFormCheck id="isDeleted" name="isDeleted" checked={newTransportFeature.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />
                        </div>
                        
                        <CModalFooter className="d-flex justify-content-end">
                            <CButton color="primary" type="submit" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : (editingTransportFeature ? 'Save Changes' : 'Add Transport Feature')}
                            </CButton>
                            <CButton color="secondary" onClick={handleClosePopup} disabled={loading}>Cancel</CButton>
                        </CModalFooter>
                    </CForm>
                </CModalBody>
            </CModal>

            <DeleteConfirmation
                visible={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteTransportFeature}
            />
        </CRow>
    );
};

export default TransportFeature;