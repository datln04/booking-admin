import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CBadge, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput, CFormCheck, CFormSelect, CToast, CToastBody, CToastHeader, CToaster, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import moment from 'moment';
import { cilLocationPin, cilPencil, cilTrash } from '@coreui/icons';
import { createData, fetchData, updateData, deleteData, fetchFilteredData } from '../../service/service';
import DeleteConfirmation from '../../util/DeleteConfirmation'; // Import the DeleteConfirmation component

const getStatusBadge = (isDeleted) => {
    return isDeleted ? 'danger' : 'success';
};

const getStatusText = (isDeleted) => {
    return isDeleted ? 'Deleted' : 'Active';
};

const District = () => {
    const [districts, setDistricts] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingDistrict, setEditingDistrict] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [districtToDelete, setDistrictToDelete] = useState(null);
    const currentDate = new Date().toISOString();
    const [newDistrict, setNewDistrict] = useState({
        id: 0,
        name: '',
        provinceId: 0,
        isDeleted: false
    });
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        fetchDistricts();
        fetchProvinces();
    }, [refresh]);

    const fetchDistricts = async () => {
        const filter = {
            filters: [],
            includes: ["Province"],
            logic: "string",
            pageSize: 0,
            pageNumber: 0,
            all: true
        };
        fetchFilteredData('/Districts', filter).then(response => {
            setDistricts(response);
        })
        .catch(error => {
            console.error('There was an error fetching the districts!', error);
        });
    };

    const fetchProvinces = async () => {
        fetchData('/Provinces').then(response => {
            setProvinces(response);
        })
            .catch(error => {
                console.error('There was an error fetching the provinces!', error);
            });
    };

    const handleAddDistrict = () => {
        setEditingDistrict(null);
        setNewDistrict({
            id: 0,
            name: '',
            provinceId: 0,
            isDeleted: false
        });
        setShowPopup(true);
    };

    const handleEditDistrict = (district) => {
        setEditingDistrict(district);
        setNewDistrict(district);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewDistrict(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const districtToSave = {
            ...newDistrict
        };

        setLoading(false);
        handleClosePopup();

        if (editingDistrict) {
            updateData(`/Districts/${editingDistrict.id}`, districtToSave).then(() => {
                setToasts([...toasts, { type: 'success', message: 'District updated successfully!' }]);
                setRefresh(!refresh);
            });
        } else {
            createData('/Districts', districtToSave).then(() => {
                setToasts([...toasts, { type: 'success', message: 'District created successfully!' }]);
                setRefresh(!refresh);
            });
        }
    };

    const handleDeleteDistrict = (districtId) => {
        setDistrictToDelete(districtId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteDistrict = () => {
        deleteData(`/Districts/${districtToDelete}`).then(() => {
            setRefresh(!refresh);
            setToasts([...toasts, { type: 'success', message: 'District deleted successfully!' }]);
            setShowDeleteConfirm(false);
            setDistrictToDelete(null);
        }).catch(error => {
            setToasts([...toasts, { type: 'danger', message: 'Error or already in used' }]);
            setShowDeleteConfirm(false);
            setDistrictToDelete(null);
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
                        <CButton color="primary" onClick={handleAddDistrict}>
                            <CIcon icon={cilLocationPin} /> Add District
                        </CButton>
                    </CCardHeader>
                    <CCardBody>
                        <table className="table table-hover table-striped table-bordered text-center">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Province Name</th>
                                    <th>Status</th>
                                    <th style={{width: '130px'}}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {districts.map(district => (
                                    <tr key={district.id}>
                                        <td>{district.id}</td>
                                        <td>{district.name}</td>
                                        <td>{district.province.name}</td>
                                        <td>
                                            <CBadge color={getStatusBadge(district.isDeleted)}>
                                                {getStatusText(district.isDeleted)}
                                            </CBadge>
                                        </td>
                                        <td>
                                            <CButton className='mx-2' color="info" size="sm" onClick={() => handleEditDistrict(district)}>
                                                <CIcon icon={cilPencil} />
                                            </CButton>
                                            <CButton color="danger" size="sm" onClick={() => handleDeleteDistrict(district.id)}>
                                                <CIcon icon={cilTrash} />
                                            </CButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CCardBody>
                </CCard>
            </CCol>

            <CModal visible={showPopup} onClose={handleClosePopup}>
                <CModalHeader closeButton>{editingDistrict ? 'Edit District' : 'Add New District'}</CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="name">Name</CFormLabel>
                            <CFormInput type="text" id="name" name="name" value={newDistrict.name} onChange={handleChange} required disabled={loading} />
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="provinceId">Province</CFormLabel>
                            <CFormSelect id="provinceId" name="provinceId" value={newDistrict.provinceId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Province</option>
                                {provinces.map(province => (
                                    <option key={province.id} value={province.id}>{province.name}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        
                        <div className="mb-3">
                            <CFormCheck id="isDeleted" name="isDeleted" checked={newDistrict.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />
                        </div>
                        
                        <CModalFooter className="d-flex justify-content-end">
                            <CButton color="primary" type="submit" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : (editingDistrict ? 'Save Changes' : 'Add District')}
                            </CButton>
                            <CButton color="secondary" onClick={handleClosePopup} disabled={loading}>Cancel</CButton>
                        </CModalFooter>
                    </CForm>
                </CModalBody>
            </CModal>

            <DeleteConfirmation
                visible={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteDistrict}
            />
        </CRow>
    );
};

export default District;