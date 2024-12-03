import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CBadge, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormCheck, CFormSelect, CToast, CToastBody, CToastHeader, CToaster, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilUserFollow } from '@coreui/icons';
import Select from 'react-select';
import { createData, fetchData, updateData, deleteData } from '../../service/service';
import DeleteConfirmation from '../../util/DeleteConfirmation';

const getStatusBadge = (isDeleted) => {
    return isDeleted ? 'danger' : 'success';
};

const getStatusText = (isDeleted) => {
    return isDeleted ? 'Deleted' : 'Active';
};

const TransportFeatures = () => {
    const [transportServices, setTransportServices] = useState([]);
    const [features, setFeatures] = useState([]);
    const [transportFeatures, setTransportFeatures] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingFeature, setEditingFeature] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [featureToDelete, setFeatureToDelete] = useState(null);
    const [newFeature, setNewFeature] = useState({
        id: 0,
        transportServiceId: 0,
        featureIds: [],
        isDeleted: false
    });
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        fetchTransportServices();
        fetchFeatures();
        fetchTransportFeatures();
    }, [refresh]);

    const fetchTransportServices = async () => {
        fetchData('/TransportServices').then(response => {
            setTransportServices(response);
        })
            .catch(error => {
                console.error('There was an error fetching the transport services!', error);
            });
    };

    const fetchFeatures = async () => {
        fetchData('/Feature').then(response => {
            setFeatures(response);
        })
            .catch(error => {
                console.error('There was an error fetching the features!', error);
            });
    };

    const fetchTransportFeatures = async () => {
        setFetching(true);
        fetchData('/TransportServiceFeature').then(response => {
            setTransportFeatures(response);
            setFetching(false);
        })
            .catch(error => {
                console.error('There was an error fetching the transport features!', error);
                setFetching(false);
            });
    };

    const handleAddFeature = () => {
        setEditingFeature(null);
        setNewFeature({
            id: 0,
            transportServiceId: 0,
            featureIds: [],
            isDeleted: false
        });
        setShowPopup(true);
    };

    const handleEditFeature = (feature) => {
        setEditingFeature(feature);
        setNewFeature({
            id: feature.id,
            transportServiceId: feature.transportServiceId,
            featureIds: feature.featureIds,
            isDeleted: feature.isDeleted
        });
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

    const handleFeatureChange = (selectedOptions) => {
        const selectedFeatures = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setNewFeature(prevState => ({
            ...prevState,
            featureIds: selectedFeatures
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (editingFeature) {
            if (newFeature?.featureIds?.length > editingFeature?.featureIds?.length) {
                const featuresToAdd = newFeature?.featureIds.filter(f => !editingFeature?.featureIds.includes(f));
                const featurePromises = featuresToAdd.map(featureId => {
                    const featureToSave = {
                        id: 0,
                        transportServiceId: editingFeature.transportServiceId,
                        featureId: featureId,
                        isDeleted: editingFeature.isDeleted
                    };
                    return createData('/TransportServiceFeature', featureToSave);
                });

                try {
                    await Promise.all(featurePromises);
                    setToasts([...toasts, { type: 'success', message: 'Feature updated successfully!' }]);
                    setRefresh(!refresh);
                } catch (error) {
                    setToasts([...toasts, { type: 'danger', message: error.message }]);
                } finally {
                    setLoading(false);
                    setNewFeature(null);
                    setEditingFeature(null);
                    handleClosePopup();
                }
            } else if (newFeature?.featureIds?.length < editingFeature?.featureIds?.length) {
                const featuresToRemove = editingFeature?.featureIds.filter(f => !newFeature?.featureIds.includes(f));
                const featurePromises = featuresToRemove?.map(featureId => {
                    return deleteData(`/TransportServiceFeature/DeleteByTransportServiceAndFeature?transportServiceId=${editingFeature?.transportServiceId}&featureId=${featureId}`).then(() => {
                        setRefresh(!refresh);
                        setToasts([...toasts, { type: 'success', message: 'Feature updated successfully!' }]);
                    }).catch(error => {
                        setToasts([...toasts, { type: 'danger', message: error.message }]);
                    });
                });

                try {
                    await Promise.all(featurePromises);
                    setToasts([...toasts, { type: 'success', message: 'Feature updated successfully!' }]);
                    setRefresh(!refresh);
                } catch (error) {
                    setToasts([...toasts, { type: 'danger', message: error.message }]);
                } finally {
                    setLoading(false);
                    handleClosePopup();
                    setNewFeature(null);
                    setEditingFeature(null);
                }
            }

        } else {
            const featurePromises = newFeature.featureIds.map(featureId => {
                const featureToSave = {
                    id: newFeature.id,
                    transportServiceId: newFeature.transportServiceId,
                    featureId: featureId,
                    isDeleted: newFeature.isDeleted
                };
                return createData('/TransportServiceFeature', featureToSave);
            });

            try {
                await Promise.all(featurePromises);
                setToasts([...toasts, { type: 'success', message: editingFeature ? 'Feature updated successfully!' : 'Feature created successfully!' }]);
                setRefresh(!refresh);
            } catch (error) {
                setToasts([...toasts, { type: 'danger', message: error.message }]);
            } finally {
                setLoading(false);
                handleClosePopup();
            }
        }
    };

    const handleDeleteFeature = (featureIds) => {
        setFeatureToDelete(featureIds);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteFeature = async () => {
        if(featureToDelete?.length > 0){
            const featuresDeleted = featureToDelete?.map(featureId => {
                return deleteData(`/TransportServiceFeature/${featureId}`).then(() => {
                    setRefresh(!refresh);
                    setToasts([...toasts, { type: 'success', message: 'Feature deleted successfully!' }]);

                }).catch(error => {
                    setToasts([...toasts, { type: 'danger', message: error.message }]);
                });
            });

            try {
                await Promise.all(featuresDeleted);
                setToasts([...toasts, { type: 'success', message: 'Feature deleted successfully!' }]);
                setRefresh(!refresh);
            } catch (error) {
                setToasts([...toasts, { type: 'danger', message: error.message }]);
            } finally {
                setLoading(false);
                handleClosePopup();
                setShowDeleteConfirm(false);
                setFeatureToDelete(null);
            }
        }
    };

    const featureOptions = features.map(feature => ({
        value: feature.id,
        label: feature.featureName
    }));

    // Group features by transport service    
    const groupedFeatures = transportFeatures.reduce((acc, feature) => {
        const transportService = transportServices.find(ts => ts.id === feature.transportServiceId);
        if (transportService) {
            if (!acc[transportService.id]) {
                acc[transportService.id] = {
                    transportService,
                    features: []
                };
            }
            acc[transportService.id].features.push({
                id: feature?.id,
                feature: features.find(f => f.id === feature.featureId)
            });
        }
        return acc;
    }, {});

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
                                        <th>Transport Service</th>
                                        <th>Features</th>
                                        <th>Status</th>
                                        <th style={{ width: '130px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(groupedFeatures).map(({ transportService, features }) => (
                                        <tr key={transportService.id}>
                                            <td>{transportService.id}</td>
                                            <td>{transportService.model} - {transportService.make}</td>
                                            <td>{features.map(f => f?.feature?.featureName).join(', ')}</td>
                                            <td>
                                                <CBadge color={getStatusBadge(transportService.isDeleted)}>
                                                    {getStatusText(transportService.isDeleted)}
                                                </CBadge>
                                            </td>
                                            <td>
                                                <CButton className='mx-2' color="info" size="sm" onClick={() => handleEditFeature({ id: features.map(f => f?.id), transportServiceId: transportService.id, featureIds: features?.map(f => f?.feature?.id), isDeleted: transportService.isDeleted })}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton color="danger" size="sm" onClick={() => handleDeleteFeature(features.map(f => f?.id))}>
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
                            <CFormLabel htmlFor="transportServiceId">Transport Service</CFormLabel>
                            <CFormSelect id="transportServiceId" name="transportServiceId" value={newFeature?.transportServiceId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Transport Service</option>
                                {transportServices.map(transportService => (
                                    <option key={transportService.id} value={transportService.id}>{transportService?.model} - {transportService.make}</option>
                                ))}
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="featureIds">Features</CFormLabel>
                            <Select
                                id="featureIds"
                                name="featureIds"
                                required
                                isMulti
                                options={featureOptions}
                                value={featureOptions.filter(option => newFeature?.featureIds?.includes(option.value))}
                                onChange={handleFeatureChange}
                                isDisabled={loading}
                            />
                        </div>

                        <div className="mb-3">
                            <CFormCheck id="isDeleted" name="isDeleted" checked={newFeature?.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />
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

export default TransportFeatures;