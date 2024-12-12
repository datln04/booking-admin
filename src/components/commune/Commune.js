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

const Commune = () => {
    const [communes, setCommunes] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingCommune, setEditingCommune] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [communeToDelete, setCommuneToDelete] = useState(null);
    const [newCommune, setNewCommune] = useState({
        id: 0,
        name: '',
        districtId: 0,
        isDeleted: false
    });
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        fetchCommunes();
        fetchDistricts();
    }, [refresh]);

    const fetchCommunes = async () => {
        setFetching(true);
        const filter = {
            filters: [],
            includes: ["District"],
            logic: "string",
            pageSize: 0,
            pageNumber: 0,
            all: true
        };
        fetchFilteredData('/Communes', filter).then(response => {
            setCommunes(response);
            setFetching(false);
        })
        .catch(error => {
            console.error('There was an error fetching the communes!', error);
            setFetching(false);
        });
    };

    const fetchDistricts = async () => {
        fetchData('/Districts').then(response => {
            setDistricts(response);
        })
            .catch(error => {
                console.error('There was an error fetching the districts!', error);
            });
    };

    const handleAddCommune = () => {
        setEditingCommune(null);
        setNewCommune({
            id: 0,
            name: '',
            districtId: 0,
            isDeleted: false
        });
        setShowPopup(true);
    };

    const handleEditCommune = (commune) => {
        setEditingCommune(commune);
        setNewCommune(commune);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewCommune(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        setLoading(false);
        handleClosePopup();

        if (editingCommune) {
            updateData(`/Communes/${editingCommune.id}`, newCommune).then(() => {
                setRefresh(!refresh);
            });
        } else {
            createData('/Communes', newCommune).then(() => {
                setRefresh(!refresh);
            });
        }
    };

    const handleDeleteCommune = (communeId) => {
        setCommuneToDelete(communeId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteCommune = () => {
        deleteData(`/Communes/${communeToDelete}`).then(() => {
            setRefresh(!refresh);
            setToasts([...toasts, { type: 'success', message: 'Commune deleted successfully!' }]);
            setShowDeleteConfirm(false);
            setCommuneToDelete(null);
        }).catch(error => {
            setToasts([...toasts, { type: 'danger', message: 'Error or already in used' }]);
            setShowDeleteConfirm(false);
            setCommuneToDelete(null);
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
                        <CButton color="primary" onClick={handleAddCommune}>
                            <CIcon icon={cilUserFollow} /> Add Commune
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
                                        <th>District</th>
                                        <th>Status</th>
                                        <th style={{width: '130px'}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {communes.map(commune => (
                                        <tr key={commune.id}>
                                            <td>{commune.id}</td>
                                            <td>{commune.name}</td>
                                            <td>{commune?.district?.name}</td>
                                            <td>
                                                <CBadge color={getStatusBadge(commune.isDeleted)}>
                                                    {getStatusText(commune.isDeleted)}
                                                </CBadge>
                                            </td>
                                            <td>
                                                <CButton className='mx-2' color="info" size="sm" onClick={() => handleEditCommune(commune)}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton color="danger" size="sm" onClick={() => handleDeleteCommune(commune.id)}>
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
                <CModalHeader closeButton>{editingCommune ? 'Edit Commune' : 'Add New Commune'}</CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="name">Name</CFormLabel>
                            <CFormInput type="text" id="name" name="name" value={newCommune.name} onChange={handleChange} required disabled={loading} />
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="districtId">District</CFormLabel>
                            <CFormSelect id="districtId" name="districtId" value={newCommune.districtId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select District</option>
                                {districts.map(district => (
                                    <option key={district.id} value={district.id}>{district.name}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        
                        <div className="mb-3">
                            <CFormCheck id="isDeleted" name="isDeleted" checked={newCommune.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />
                        </div>
                        
                        <CModalFooter className="d-flex justify-content-end">
                            <CButton color="primary" type="submit" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : (editingCommune ? 'Save Changes' : 'Add Commune')}
                            </CButton>
                            <CButton color="secondary" onClick={handleClosePopup} disabled={loading}>Cancel</CButton>
                        </CModalFooter>
                    </CForm>
                </CModalBody>
            </CModal>

            <DeleteConfirmation
                visible={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteCommune}
            />
        </CRow>
    );
};

export default Commune;