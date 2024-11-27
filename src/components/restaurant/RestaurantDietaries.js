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

const RestaurantDietaries = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [dietaries, setDietaries] = useState([]);
    const [restaurantDietaries, setRestaurantDietaries] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingDietary, setEditingDietary] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [dietaryToDelete, setDietaryToDelete] = useState(null);
    const [newDietary, setNewDietary] = useState({
        id: 0,
        restaurantId: '',
        dietaryIds: [],
        isDeleted: false
    });
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        fetchRestaurants();
        fetchDietaries();
        fetchRestaurantDietaries();
    }, [refresh]);

    const fetchRestaurants = async () => {
        fetchData('/Restaurants').then(response => {
            setRestaurants(response);
        })
            .catch(error => {
                console.error('There was an error fetching the restaurants!', error);
            });
    };

    const fetchDietaries = async () => {
        fetchData('/DietaryOption').then(response => {
            setDietaries(response);
        })
            .catch(error => {
                console.error('There was an error fetching the dietaries!', error);
            });
    };

    const fetchRestaurantDietaries = async () => {
        setFetching(true);
        fetchData('/RestaurantDietaryOption').then(response => {
            setRestaurantDietaries(response);
            setFetching(false);
        })
            .catch(error => {
                console.error('There was an error fetching the restaurant dietaries!', error);
                setFetching(false);
            });
    };

    const handleAddDietary = () => {
        setEditingDietary(null);
        setNewDietary({
            id: 0,
            restaurantId: '',
            dietaryIds: [],
            isDeleted: false
        });
        setShowPopup(true);
    };

    const handleEditDietary = (dietary) => {
        setEditingDietary(dietary);
        setNewDietary({
            id: dietary.id,
            restaurantId: dietary.restaurantId,
            dietaryIds: dietary.dietaryIds,
            isDeleted: dietary.isDeleted
        });
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewDietary(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDietaryChange = (selectedOptions) => {
        const selectedDietaries = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setNewDietary(prevState => ({
            ...prevState,
            dietaryIds: selectedDietaries
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const dietaryToSave = {
            ...newDietary
        };

        setLoading(false);
        handleClosePopup();

        if (editingDietary) {
            setToasts([...toasts, { type: 'success', message: 'Dietary updated successfully!' }]);

            updateData(`/RestaurantDietaryOption/${editingDietary.id}`, dietaryToSave).then(() => {
                setRefresh(!refresh);
            });
        } else {
            setToasts([...toasts, { type: 'success', message: 'Dietary created successfully!' }]);

            createData('/RestaurantDietaryOption', dietaryToSave).then(() => {
                setRefresh(!refresh);
            });
        }
    };

    const handleDeleteDietary = (dietaryId) => {
        setDietaryToDelete(dietaryId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteDietary = () => {
        deleteData(`/RestaurantDietaries/${dietaryToDelete}`).then(() => {
            setRefresh(!refresh);
            setToasts([...toasts, { type: 'success', message: 'Dietary deleted successfully!' }]);
            setShowDeleteConfirm(false);
            setDietaryToDelete(null);
        }).catch(error => {
            setToasts([...toasts, { type: 'danger', message: error.message }]);
            setShowDeleteConfirm(false);
            setDietaryToDelete(null);
        });
    };

    const dietaryOptions = dietaries.map(dietary => ({
        value: dietary.id,
        label: dietary.optionName
    }));

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
                        <CButton color="primary" onClick={handleAddDietary}>
                            <CIcon icon={cilUserFollow} /> Add Dietary
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
                                        <th>Restaurant</th>
                                        <th>Dietaries</th>
                                        <th>Status</th>
                                        <th style={{width: '130px'}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {restaurantDietaries.map(dietary => (
                                        <tr key={dietary.id}>
                                            <td>{dietary.id}</td>
                                            <td>{restaurants.find(r => r.id === dietary.restaurantId)?.name}</td>
                                            <td>{dietary.dietaryIds.map(id => dietaries.find(d => d.id === id)?.optionName).join(', ')}</td>
                                            <td>
                                                <CBadge color={getStatusBadge(dietary.isDeleted)}>
                                                    {getStatusText(dietary.isDeleted)}
                                                </CBadge>
                                            </td>
                                            <td>
                                                <CButton className='mx-2' color="info" size="sm" onClick={() => handleEditDietary(dietary)}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton color="danger" size="sm" onClick={() => handleDeleteDietary(dietary.id)}>
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
                <CModalHeader closeButton>{editingDietary ? 'Edit Dietary' : 'Add New Dietary'}</CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="restaurantId">Restaurant</CFormLabel>
                            <CFormSelect id="restaurantId" name="restaurantId" value={newDietary.restaurantId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Restaurant</option>
                                {restaurants.map(restaurant => (
                                    <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="dietaryIds">Dietaries</CFormLabel>
                            <Select
                                id="dietaryIds"
                                name="dietaryIds"
                                isMulti
                                options={dietaryOptions}
                                value={dietaryOptions.filter(option => newDietary.dietaryIds.includes(option.value))}
                                onChange={handleDietaryChange}
                                isDisabled={loading}
                            />
                        </div>
                        
                        <div className="mb-3">
                            <CFormCheck id="isDeleted" name="isDeleted" checked={newDietary.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />
                        </div>
                        
                        <CModalFooter className="d-flex justify-content-end">
                            <CButton color="primary" type="submit" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : (editingDietary ? 'Save Changes' : 'Add Dietary')}
                            </CButton>
                            <CButton color="secondary" onClick={handleClosePopup} disabled={loading}>Cancel</CButton>
                        </CModalFooter>
                    </CForm>
                </CModalBody>
            </CModal>

            <DeleteConfirmation
                visible={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteDietary}
            />
        </CRow>
    );
};

export default RestaurantDietaries;