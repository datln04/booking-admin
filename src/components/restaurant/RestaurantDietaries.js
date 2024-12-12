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

        if (editingDietary) {
            // if editingDietary is not null, then update the dietary
            // loop newDietary.dietaryIds
            // if length of newDietary.dietaryIds > editingDietary.dietaryIds
            // insert more dietary  -- [1,2,3,4] > [1,2,3] => insert [4]
            // if length of newDietary.dietaryIds < editingDieary.dietaryIds
            // remove dietary  -- [1,2,3] > [1,2,3,4] => remove [4]

            if (newDietary?.dietaryIds?.length > editingDietary?.dietaryIds?.length) {
                const dietaryToAdd = newDietary?.dietaryIds.filter(d => !editingDietary?.dietaryIds.includes(d));
                const dietaryPromises = dietaryToAdd.map(dietaryOptionId => {
                    const dietaryToSave = {
                        id: 0,
                        restaurantId: editingDietary.restaurantId,
                        dietaryOptionId: dietaryOptionId,
                        isDeleted: editingDietary.isDeleted
                    };
                    return createData('/RestaurantDietaryOption', dietaryToSave);
                });

                try {
                    await Promise.all(dietaryPromises);
                    setToasts([...toasts, { type: 'success', message: 'Dietary updated successfully!' }]);
                    setRefresh(!refresh);
                } catch (error) {
                    setToasts([...toasts, { type: 'danger', message: 'Error or already in used' }]);
                } finally {
                    setLoading(false);
                    setNewDietary(null);
                    setEditingDietary(null);
                    handleClosePopup();
                }
            } else if (newDietary?.dietaryIds?.length < editingDietary?.dietaryIds?.length) {
                const dietaryToRemove = editingDietary?.dietaryIds.filter(d => !newDietary?.dietaryIds.includes(d));
                const dietaryPromises = dietaryToRemove?.map(dietaryOptionId => {
                    return deleteData(`/RestaurantDietaryOption/DeleteByRestaurantAndDietaryOption?restaurantId=${editingDietary?.restaurantId}&dietaryOptionId=${dietaryOptionId}`).then(() => {
                        setRefresh(!refresh);
                        setToasts([...toasts, { type: 'success', message: 'Dietary updated successfully!' }]);
                    }).catch(error => {
                        setToasts([...toasts, { type: 'danger', message: 'Error or already in used' }]);
                    });
                });

                try {
                    await Promise.all(dietaryPromises);
                    setToasts([...toasts, { type: 'success', message: 'Dietary updated successfully!' }]);
                    setRefresh(!refresh);
                } catch (error) {
                    setToasts([...toasts, { type: 'danger', message: 'Error or already in used' }]);
                } finally {
                    setLoading(false);
                    handleClosePopup();
                    setNewDietary(null);
                    setEditingDietary(null);
                }
            }

        } else {
            const dietaryPromises = newDietary.dietaryIds.map(dietaryOptionId => {
                const dietaryToSave = {
                    id: newDietary.id,
                    restaurantId: newDietary.restaurantId,
                    dietaryOptionId: dietaryOptionId,
                    isDeleted: newDietary.isDeleted
                };
                return createData('/RestaurantDietaryOption', dietaryToSave);
            });

            try {
                await Promise.all(dietaryPromises);
                setToasts([...toasts, { type: 'success', message: editingDietary ? 'Dietary updated successfully!' : 'Dietary created successfully!' }]);
                setRefresh(!refresh);
            } catch (error) {
                setToasts([...toasts, { type: 'danger', message: 'Error or already in used' }]);
            } finally {
                setLoading(false);
                handleClosePopup();
            }
        }
    };

    const handleDeleteDietary = (dietaryIds) => {
        setDietaryToDelete(dietaryIds);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteDietary = async () => {
        if(dietaryToDelete?.length > 0){
            const dietariesDeleted = dietaryToDelete?.map(dietaryId => {
                return deleteData(`/RestaurantDietaryOption/${dietaryId}`).then(() => {
                    setRefresh(!refresh);
                    setToasts([...toasts, { type: 'success', message: 'Dietary deleted successfully!' }]);

                }).catch(error => {
                    setToasts([...toasts, { type: 'danger', message: 'Error or already in used' }]);
                });
            });

            try {
                await Promise.all(dietariesDeleted);
                setToasts([...toasts, { type: 'success', message: 'Dietary deleted successfully!' }]);
                setRefresh(!refresh);
            } catch (error) {
                setToasts([...toasts, { type: 'danger', message: 'Error or already in used' }]);
            } finally {
                setLoading(false);
                handleClosePopup();
                setShowDeleteConfirm(false);
                setDietaryToDelete(null);
            }
        }
    };

    const dietaryOptions = dietaries.map(dietary => ({
        value: dietary.id,
        label: dietary.optionName
    }));

    // Group dietaries by restaurant
    const groupedDietaries = restaurantDietaries.reduce((acc, dietary) => {
        const restaurant = restaurants.find(r => r.id === dietary.restaurantId);
        if (restaurant) {
            if (!acc[restaurant.id]) {
                acc[restaurant.id] = {
                    restaurant,
                    dietaries: []
                };
            }
            acc[restaurant.id].dietaries.push({
                id: dietary?.id,
                dietary: dietaries.find(d => d.id === dietary.dietaryOptionId)
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
                                        <th style={{ width: '130px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(groupedDietaries).map(({ restaurant, dietaries }) => (
                                        <tr key={restaurant.id}>
                                            <td>{restaurant.id}</td>
                                            <td>{restaurant.name}</td>
                                            <td>{dietaries.map(d => d?.dietary?.optionName).join(', ')}</td>
                                            <td>
                                                <CBadge color={getStatusBadge(restaurant.isDeleted)}>
                                                    {getStatusText(restaurant.isDeleted)}
                                                </CBadge>
                                            </td>
                                            <td>
                                                <CButton className='mx-2' color="info" size="sm" onClick={() => handleEditDietary({ id: dietaries.map(d => d?.id), restaurantId: restaurant.id, dietaryIds: dietaries?.map(d => d?.dietary?.id), isDeleted: restaurant.isDeleted })}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton color="danger" size="sm" onClick={() => handleDeleteDietary(dietaries.map(d => d?.id))}>
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
                            <CFormSelect id="restaurantId" name="restaurantId" value={newDietary?.restaurantId} onChange={handleChange} required disabled={loading}>
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
                                required
                                isMulti
                                options={dietaryOptions}
                                value={dietaryOptions.filter(option => newDietary?.dietaryIds?.includes(option.value))}
                                onChange={handleDietaryChange}
                                isDisabled={loading}
                            />
                        </div>

                        <div className="mb-3">
                            <CFormCheck id="isDeleted" name="isDeleted" checked={newDietary?.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />
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