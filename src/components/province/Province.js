import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CBadge, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput, CFormCheck, CFormSelect, CToast, CToastBody, CToastHeader, CToaster, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilUserFollow } from '@coreui/icons';
import { createData, fetchData, updateData, deleteData } from '../../service/service';
import { uploadImage } from '../../util/Util'; // Import the uploadImage function
import ImageUpload from '../../util/ImageUpload';
import DeleteConfirmation from '../../util/DeleteConfirmation'; // Import the DeleteConfirmation component

const getStatusBadge = (isDeleted) => {
    return isDeleted ? 'danger' : 'success';
};

const getStatusText = (isDeleted) => {
    return isDeleted ? 'Deleted' : 'Active';
};

const Province = () => {
    const [provinces, setProvinces] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingProvince, setEditingProvince] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [provinceToDelete, setProvinceToDelete] = useState(null);
    const [newProvince, setNewProvince] = useState({
        id: 0,
        name: '',
        image: '',
        typeId: 1,
        isDeleted: false
    });
    const [image, setImage] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false); // Add fetching state

    useEffect(() => {
        fetchProvinces();
    }, [refresh]);

    const fetchProvinces = async () => {
        setFetching(true); // Set fetching to true before fetching data
        fetchData('/Provinces').then(response => {
            setProvinces(response);
            setFetching(false); // Set fetching to false after data is fetched
        })
            .catch(error => {
                console.error('There was an error fetching the provinces!', error);
                setFetching(false); // Set fetching to false in case of error
            });
    };

    const handleAddProvince = () => {
        setEditingProvince(null);
        setNewProvince({
            id: 0,
            name: '',
            image: '',
            typeId: 1,
            isDeleted: false
        });
        setShowPopup(true);
    };

    const handleEditProvince = (province) => {
        setEditingProvince(province);
        setNewProvince(province);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewProvince(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let imageUrl = '';

        if (image) {
            const formData = new FormData();
            try {
                imageUrl = await uploadImage(formData, image);
                setToasts([...toasts, { type: 'success', message: 'Image uploaded successfully!' }]);
            } catch (error) {
                setToasts([...toasts, { type: 'danger', message: error.message }]);
                setLoading(false);
                return;
            }
        }

        const provinceToSave = {
            ...newProvince,
            image: imageUrl || newProvince.image
        };

        setLoading(false);
        handleClosePopup();

        if (editingProvince) {
            updateData(`/Provinces/${editingProvince.id}`, provinceToSave).then(() => {
                setRefresh(!refresh);
            });
        } else {
            createData('/Provinces', provinceToSave).then(() => {
                setRefresh(!refresh);
            });
        }
    };

    const handleDeleteProvince = (provinceId) => {
        setProvinceToDelete(provinceId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteProvince = () => {
        deleteData(`/Provinces/${provinceToDelete}`).then(() => {
            setRefresh(!refresh);
            setToasts([...toasts, { type: 'success', message: 'Province deleted successfully!' }]);
            setShowDeleteConfirm(false);
            setProvinceToDelete(null);
        }).catch(error => {
            setToasts([...toasts, { type: 'danger', message: error.message }]);
            setShowDeleteConfirm(false);
            setProvinceToDelete(null);
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
                        <CButton color="primary" onClick={handleAddProvince}>
                            <CIcon icon={cilUserFollow} /> Add Province
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
                                        <th>Image</th>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Status</th>
                                        <th style={{width: '130px'}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {provinces.map(province => (
                                        <tr key={province.id}>
                                            <td><img src={province.image} alt={province.name} className="img-fluid mx-auto d-block" width="50" height="50" /></td>
                                            <td>{province.id}</td>
                                            <td>{province.name}</td>
                                            <td>
                                                <CBadge color={getStatusBadge(province.isDeleted)}>
                                                    {getStatusText(province.isDeleted)}
                                                </CBadge>
                                            </td>
                                            <td>
                                                <CButton className='mx-2' color="info" size="sm" onClick={() => handleEditProvince(province)}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton color="danger" size="sm" onClick={() => handleDeleteProvince(province.id)}>
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
                <CModalHeader closeButton>{editingProvince ? 'Edit Province' : 'Add New Province'}</CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="name">Name</CFormLabel>
                            <CFormInput type="text" id="name" name="name" value={newProvince.name} onChange={handleChange} required disabled={loading} />
                        </div>
                        
                        {/* <div className="mb-3">
                            <CFormLabel htmlFor="typeId">Type ID</CFormLabel>
                            <CFormInput type="number" id="typeId" name="typeId" value={newProvince.typeId} onChange={handleChange} required disabled={loading} />
                        </div> */}
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="image">Image URL</CFormLabel>
                            <ImageUpload setImage={setImage} imageUrl={editingProvince ? editingProvince.image : null}/>
                        </div>
                        
                        <div className="mb-3">
                            <CFormCheck id="isDeleted" name="isDeleted" checked={newProvince.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />
                        </div>
                        
                        <CModalFooter className="d-flex justify-content-end">
                            <CButton color="primary" type="submit" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : (editingProvince ? 'Save Changes' : 'Add Province')}
                            </CButton>
                            <CButton color="secondary" onClick={handleClosePopup} disabled={loading}>Cancel</CButton>
                        </CModalFooter>
                    </CForm>
                </CModalBody>
            </CModal>

            <DeleteConfirmation
                visible={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteProvince}
            />
        </CRow>
    );
};

export default Province;