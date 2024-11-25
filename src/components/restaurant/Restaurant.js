import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CBadge, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput, CFormCheck, CFormSelect, CToast, CToastBody, CToastHeader, CToaster, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilUserFollow } from '@coreui/icons';
import { createData, fetchData, updateData, deleteData, fetchFilteredData } from '../../service/service';
import DeleteConfirmation from '../../util/DeleteConfirmation';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';

const getStatusBadge = (isDeleted) => {
    return isDeleted ? 'danger' : 'success';
};

const getStatusText = (isDeleted) => {
    return isDeleted ? 'Deleted' : 'Active';
};

const Restaurant = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [users, setUsers] = useState([]);
    const [cuisineTypes, setCuisineTypes] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingRestaurant, setEditingRestaurant] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [restaurantToDelete, setRestaurantToDelete] = useState(null);
    const [newRestaurant, setNewRestaurant] = useState({
        id: 0,
        ownerId: 0,
        name: '',
        address: '',
        phoneNumber: '',
        cuisineTypeId: 0,
        email: '',
        openingHours: [new Date(), new Date()],
        description: '',
        starRating: 0,
        createdDate: new Date().toISOString(),
        provinceId: 0,
        districtId: 0,
        communeId: 0,
        isDeleted: false
    });
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        fetchRestaurants();
        fetchUsers();
        fetchCuisineTypes();
        fetchProvinces();
        fetchDistricts();
        fetchCommunes();
    }, [refresh]);

    const fetchRestaurants = async () => {
        setFetching(true);
        const filter = {
            filters: [],
            includes: ["Owner"],
            logic: "string",
            pageSize: 0,
            pageNumber: 0,
            all: true
        };
        await fetchFilteredData('/Restaurants', filter).then(response => {
            setRestaurants(response);
            setFetching(false);
        })
            .catch(error => {
                console.error('There was an error fetching the users!', error);
                setFetching(false);
            });
    };

    const fetchUsers = async () => {
        const filter = {
            filters: [{
                field: "Role",
                operator: "Equal",
                value: "RestaurantManager"
            }],
            includes: [],
            logic: "string",
            pageSize: 0,
            pageNumber: 0,
            all: true
        };
        fetchFilteredData('/Users', filter).then(response => {
            setUsers(response);
        })
            .catch(error => {
                console.error('There was an error fetching the users!', error);
            });
    };

    const fetchCuisineTypes = async () => {
        fetchData('/CuisineType').then(response => {
            setCuisineTypes(response);
        })
            .catch(error => {
                console.error('There was an error fetching the cuisine types!', error);
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

    const fetchDistricts = async () => {
        fetchData('/Districts').then(response => {
            setDistricts(response);
        })
            .catch(error => {
                console.error('There was an error fetching the districts!', error);
            });
    };

    const fetchCommunes = async () => {
        fetchData('/Communes').then(response => {
            setCommunes(response);
        })
            .catch(error => {
                console.error('There was an error fetching the communes!', error);
            });
    };

    const handleAddRestaurant = () => {
        setEditingRestaurant(null);
        setNewRestaurant({
            id: 0,
            ownerId: 0,
            name: '',
            address: '',
            phoneNumber: '',
            cuisineTypeId: 0,
            email: '',
            openingHours: [new Date(), new Date()],
            description: '',
            starRating: 0,
            createdDate: new Date().toISOString(),
            provinceId: 0,
            districtId: 0,
            communeId: 0,
            isDeleted: false
        });
        setShowPopup(true);
    };

    const handleEditRestaurant = (restaurant) => {
        const parsedOpeningHours = restaurant.openingHours.split(' - ').map(time => {
            const [hour] = time?.trim().split('h');
            return `${hour}:00`;
        });

        setEditingRestaurant(restaurant);
        setNewRestaurant({
            ...restaurant,
            openingHours: parsedOpeningHours
        });
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewRestaurant(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDateTimeRangeChange = (value) => {
        setNewRestaurant(prevState => ({
            ...prevState,
            openingHours: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let openingHoursString;
        if (editingRestaurant) {
            // Parse the time strings into Date objects
            const openingHoursStart = new Date();
            const openingHoursEnd = new Date();
            const [startHour, startMinute] = newRestaurant.openingHours[0].split(':');
            const [endHour, endMinute] = newRestaurant.openingHours[1].split(':');
            openingHoursStart.setHours(startHour, startMinute);
            openingHoursEnd.setHours(endHour, endMinute);

            // Merge openingHours into a string
            openingHoursString = `${openingHoursStart.getHours()}h - ${openingHoursEnd.getHours()}h`;
        } else {
            // Merge openingHours into a string
            openingHoursString = `${newRestaurant.openingHours[0].getHours()}h - ${newRestaurant.openingHours[1].getHours()}h`;
        }

        const restaurantToSave = {
            ...newRestaurant,
            openingHours: openingHoursString
        };



        setLoading(false);
        handleClosePopup();

        if (editingRestaurant) {
            updateData(`/Restaurants/${editingRestaurant.id}`, restaurantToSave).then(() => {
                setToasts([...toasts, { type: 'success', message: 'Restaurant updated successfully!' }]);
                setRefresh(!refresh);
            });
        } else {
            createData('/Restaurants', restaurantToSave).then(() => {
                setToasts([...toasts, { type: 'success', message: 'Restaurant created successfully!' }]);
                setRefresh(!refresh);
            });
        }
    };

    const handleDeleteRestaurant = (restaurantId) => {
        setRestaurantToDelete(restaurantId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteRestaurant = () => {
        deleteData(`/Restaurants/${restaurantToDelete}`).then(() => {
            setRefresh(!refresh);
            setToasts([...toasts, { type: 'success', message: 'Restaurant deleted successfully!' }]);
            setShowDeleteConfirm(false);
            setRestaurantToDelete(null);
        }).catch(error => {
            setToasts([...toasts, { type: 'danger', message: error.message }]);
            setShowDeleteConfirm(false);
            setRestaurantToDelete(null);
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
                        <CButton color="primary" onClick={handleAddRestaurant}>
                            <CIcon icon={cilUserFollow} /> Add Restaurant
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
                                        <th>Owner</th>
                                        <th>Cuisine Type</th>
                                        <th>Province</th>
                                        <th>District</th>
                                        <th>Commune</th>
                                        <th>Status</th>
                                        <th style={{ width: '130px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {restaurants.map(restaurant => (
                                        <tr key={restaurant.id}>
                                            <td>{restaurant.id}</td>
                                            <td>{restaurant.name}</td>
                                            <td>{restaurant?.owner?.username || 'Unknown'}</td>
                                            <td>{cuisineTypes.find(c => c.id === restaurant.cuisineTypeId)?.cuisineName || 'Unknown'}</td>
                                            <td>{provinces.find(p => p.id === restaurant.provinceId)?.name || 'Unknown'}</td>
                                            <td>{districts.find(d => d.id === restaurant.districtId)?.name || 'Unknown'}</td>
                                            <td>{communes.find(c => c.id === restaurant.communeId)?.name || 'Unknown'}</td>
                                            <td>
                                                <CBadge color={getStatusBadge(restaurant.isDeleted)}>
                                                    {getStatusText(restaurant.isDeleted)}
                                                </CBadge>
                                            </td>
                                            <td>
                                                <CButton className='mx-2' color="info" size="sm" onClick={() => handleEditRestaurant(restaurant)}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton color="danger" size="sm" onClick={() => handleDeleteRestaurant(restaurant.id)}>
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
                <CModalHeader closeButton>{editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}</CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="name">Name</CFormLabel>
                            <CFormInput type="text" id="name" name="name" value={newRestaurant.name} onChange={handleChange} required disabled={loading} />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="ownerId">Owner</CFormLabel>
                            <CFormSelect id="ownerId" name="ownerId" value={newRestaurant.ownerId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Owner</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.username}</option>
                                ))}
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="address">Address</CFormLabel>
                            <CFormInput type="text" id="address" name="address" value={newRestaurant.address} onChange={handleChange} required disabled={loading} />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="phoneNumber">Phone Number</CFormLabel>
                            <CFormInput type="text" id="phoneNumber" name="phoneNumber" value={newRestaurant.phoneNumber} onChange={handleChange} required disabled={loading} />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="cuisineTypeId">Cuisine Type</CFormLabel>
                            <CFormSelect id="cuisineTypeId" name="cuisineTypeId" value={newRestaurant.cuisineTypeId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Cuisine Type</option>
                                {cuisineTypes.map(cuisineType => (
                                    <option key={cuisineType.id} value={cuisineType.id}>{cuisineType.cuisineName}</option>
                                ))}
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="email">Email</CFormLabel>
                            <CFormInput type="email" id="email" name="email" value={newRestaurant.email} onChange={handleChange} required disabled={loading} />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="openingHours">Opening Hours</CFormLabel>
                            <TimeRangePicker
                                onChange={handleDateTimeRangeChange}
                                value={newRestaurant.openingHours}
                                disabled={loading}
                            />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="description">Description</CFormLabel>
                            <CFormInput type="text" id="description" name="description" value={newRestaurant.description} onChange={handleChange} required disabled={loading} />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="starRating">Star Rating</CFormLabel>
                            <CFormInput type="number" id="starRating" name="starRating" value={newRestaurant.starRating} onChange={handleChange} required disabled={loading} />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="provinceId">Province</CFormLabel>
                            <CFormSelect id="provinceId" name="provinceId" value={newRestaurant.provinceId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Province</option>
                                {provinces.map(province => (
                                    <option key={province.id} value={province.id}>{province.name}</option>
                                ))}
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="districtId">District</CFormLabel>
                            <CFormSelect id="districtId" name="districtId" value={newRestaurant.districtId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select District</option>
                                {districts.map(district => (
                                    <option key={district.id} value={district.id}>{district.name}</option>
                                ))}
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="communeId">Commune</CFormLabel>
                            <CFormSelect id="communeId" name="communeId" value={newRestaurant.communeId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Commune</option>
                                {communes.map(commune => (
                                    <option key={commune.id} value={commune.id}>{commune.name}</option>
                                ))}
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormCheck id="isDeleted" name="isDeleted" checked={newRestaurant.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />
                        </div>

                        <CModalFooter className="d-flex justify-content-end">
                            <CButton color="primary" type="submit" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : (editingRestaurant ? 'Save Changes' : 'Add Restaurant')}
                            </CButton>
                            <CButton color="secondary" onClick={handleClosePopup} disabled={loading}>Cancel</CButton>
                        </CModalFooter>
                    </CForm>
                </CModalBody>
            </CModal>

            <DeleteConfirmation
                visible={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteRestaurant}
            />
        </CRow>
    );
};

export default Restaurant;