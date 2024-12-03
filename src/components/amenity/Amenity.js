import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CBadge, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput, CFormCheck, CToast, CToastBody, CToastHeader, CToaster, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilUserFollow } from '@coreui/icons';
import { createData, fetchData, updateData, deleteData } from '../../service/service';
import DeleteConfirmation from '../../util/DeleteConfirmation'; // Import the DeleteConfirmation component

const getStatusBadge = (isDeleted) => {
    return isDeleted ? 'danger' : 'success';
};

const getStatusText = (isDeleted) => {
    return isDeleted ? 'Deleted' : 'Active';
};

const Amenity = () => {
    const [amenities, setAmenities] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingAmenity, setEditingAmenity] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [amenityToDelete, setAmenityToDelete] = useState(null);
    const [newAmenity, setNewAmenity] = useState({
        id: 0,
        name: '',
        description: '',
        isDeleted: false
    });
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false); // Add fetching state

    useEffect(() => {
        fetchAmenities();
    }, [refresh]);

    const fetchAmenities = async () => {
        setFetching(true); // Set fetching to true before fetching data
        fetchData('/Amenity').then(response => {
            setAmenities(response);
            setFetching(false); // Set fetching to false after data is fetched
        })
            .catch(error => {
                console.error('There was an error fetching the amenities!', error);
                setFetching(false); // Set fetching to false in case of error
            });
    };

    const handleAddAmenity = () => {
        setEditingAmenity(null);
        setNewAmenity({
            id: 0,
            name: '',
            description: '',
            isDeleted: false
        });
        setShowPopup(true);
    };

    const handleEditAmenity = (amenity) => {
        setEditingAmenity(amenity);
        setNewAmenity(amenity);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewAmenity(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const amenityToSave = {
            ...newAmenity
        };

        setLoading(false);
        handleClosePopup();

        if (editingAmenity) {
            updateData(`/Amenity/${editingAmenity.id}`, amenityToSave).then(() => {
                setRefresh(!refresh);
            });
        } else {
            createData('/Amenity', amenityToSave).then(() => {
                setRefresh(!refresh);
            });
        }
    };

    const handleDeleteAmenity = (amenityId) => {
        setAmenityToDelete(amenityId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteAmenity = () => {
        deleteData(`/Amenity/${amenityToDelete}`).then(() => {
            setRefresh(!refresh);
            setToasts([...toasts, { type: 'success', message: 'Amenity deleted successfully!' }]);
            setShowDeleteConfirm(false);
            setAmenityToDelete(null);
        }).catch(error => {
            setToasts([...toasts, { type: 'danger', message: error.message }]);
            setShowDeleteConfirm(false);
            setAmenityToDelete(null);
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
                        <CButton color="primary" onClick={handleAddAmenity}>
                            <CIcon icon={cilUserFollow} /> Add Amenity
                        </CButton>
                    </CCardHeader>
                    <CCardBody>
                        {fetching ? ( // Show spinner while fetching data
                            <div className="text-center">
                                <CSpinner color="primary" />
                            </div>
                        ) : (
                            <table className="table table-hover table-striped table-bordered text-center">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th style={{width: '130px'}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {amenities.map(amenity => (
                                        <tr key={amenity.id}>
                                            <td>{amenity.id}</td>
                                            <td>{amenity.name}</td>
                                            <td>{amenity.description}</td>
                                            <td>
                                                <CBadge color={getStatusBadge(amenity.isDeleted)}>
                                                    {getStatusText(amenity.isDeleted)}
                                                </CBadge>
                                            </td>
                                            <td>
                                                <CButton className='mx-2' color="info" size="sm" onClick={() => handleEditAmenity(amenity)}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton color="danger" size="sm" onClick={() => handleDeleteAmenity(amenity.id)}>
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
                <CModalHeader closeButton>{editingAmenity ? 'Edit Amenity' : 'Add New Amenity'}</CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="name">Name</CFormLabel>
                            <CFormInput type="text" id="name" name="name" value={newAmenity.name} onChange={handleChange} required disabled={loading} />
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="description">Description</CFormLabel>
                            <CFormInput type="text" id="description" name="description" value={newAmenity.description} onChange={handleChange} required disabled={loading} />
                        </div>
                        
                        <div className="mb-3">
                            <CFormCheck id="isDeleted" name="isDeleted" checked={newAmenity.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />
                        </div>
                        
                        <CModalFooter className="d-flex justify-content-end">
                            <CButton color="primary" type="submit" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : (editingAmenity ? 'Save Changes' : 'Add Amenity')}
                            </CButton>
                            <CButton color="secondary" onClick={handleClosePopup} disabled={loading}>Cancel</CButton>
                        </CModalFooter>
                    </CForm>
                </CModalBody>
            </CModal>

            <DeleteConfirmation
                visible={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteAmenity}
            />
        </CRow>
    );
};

export default Amenity;