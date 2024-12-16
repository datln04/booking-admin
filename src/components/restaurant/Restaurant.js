import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CBadge, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput, CFormCheck, CFormSelect, CToast, CToastBody, CToastHeader, CToaster, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilImage, cilImagePlus, cilPencil, cilTrash, cilUserFollow } from '@coreui/icons';
import { createData, fetchData, updateData, deleteData, fetchFilteredData } from '../../service/service';
import DeleteConfirmation from '../../util/DeleteConfirmation';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import { ImageType, UserRole } from '../../util/Enum';
import ImageUpload from '../../util/ImageUpload';
import { uploadImage } from '../../util/Util';

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

    const [showImagePopup, setShowImagePopup] = useState(false);
    const [showImageSubPopup, setShowImageSubPopup] = useState(false);
    const [image, setImage] = useState(null);
    const [images, setImages] = useState([]);
    const [editingImage, setEditingImage] = useState(null);
    const [newImage, setNewImage] = useState({ id: 0, url: '', description: '' });

    const [selectedProvince, setSelectedProvince] = useState(null);

    const [subDistricts, setSubDistricts] = useState([]);
    const [subCommunes, setSubCommunes] = useState([]);

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
                value: UserRole.RESTAURANT_MANAGER
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
        const filter = {
            filters: [
            ],
            includes: [
                "Districts",
                "Districts.Communes"
            ],
            logic: "string",
            pageSize: 0,
            pageNumber: 0,
            all: true
        }
        fetchFilteredData('/Provinces', filter).then(response => {
            setProvinces(response);
        })
            .catch(error => {
                console.error('There was an error fetching the provinces!', error);
            });
    };

    const fetchDistricts = async () => {
        const filter = {
            filters: [
            ],
            includes: [
                "Communes"
            ],
            logic: "string",
            pageSize: 0,
            pageNumber: 0,
            all: true
        }
        fetchFilteredData('/Districts', filter).then(response => {
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
        const parsedOpeningHours = restaurant.openingHours.split(';')


        const province = provinces?.find(province => province?.id === restaurant?.provinceId);
        setEditingRestaurant(restaurant);
        setSubDistricts(province.districts);
        setSubCommunes(restaurant ? province?.districts?.find(d => restaurant?.districtId === d.id)?.communes : []); // Reset communes when province changes
        setNewRestaurant({
            ...restaurant,
            openingHours: parsedOpeningHours
        });
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setShowImageSubPopup(false);
        setShowImagePopup(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewRestaurant(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name === 'provinceId') {
            handleProvinceChange(value);
        }

        if (name === 'districtId') {
            handleDistrictChange(value);
        }
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
        // let openingHoursString;
        // // Parse the time strings into Date objects
        // const openingHoursStart = new Date();
        // const openingHoursEnd = new Date();
        // const [startHour, startMinute] = newRestaurant.openingHours[0].split(':');
        // const [endHour, endMinute] = newRestaurant.openingHours[1].split(':');
        // openingHoursStart.setHours(startHour, startMinute);
        // openingHoursEnd.setHours(endHour, endMinute);
        // if (editingRestaurant) {
        //     // Merge openingHours into a string
        //     openingHoursString = `${openingHoursStart.getHours()}h - ${openingHoursEnd.getHours()}h`;
        // } else {
        //     // Merge openingHours into a string
        //     openingHoursString = `${newRestaurant.openingHours[0].getHours()}h - ${newRestaurant.openingHours[1].getHours()}h`;
        // }
        // openingHoursString = `${openingHoursStart.getHours()}h - ${openingHoursEnd.getHours()}h`;


        const restaurantToSave = {
            ...newRestaurant,
            openingHours: newRestaurant.openingHours.join(';')
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
            setToasts([...toasts, { type: 'danger', message: 'Error or already in used' }]);
            setShowDeleteConfirm(false);
            setRestaurantToDelete(null);
        });
    };

    const handleImageSetup = (restaurantId) => {
        const filter = {
            filters: [
                {
                    field: "ServiceId",
                    operator: "Equal",
                    value: restaurantId
                },
                {
                    field: "ServiceType",
                    operator: "Equal",
                    value: "Restaurant"
                }
            ],
            includes: [],
            logic: "And",
            pageSize: 0,
            pageNumber: 0,
            all: true
        };
        // Fetch images for the room
        fetchFilteredData(`/Images`, filter).then(response => {
            setNewImage({ id: 0, imageUrl: '', serviceId: restaurantId, serviceType: 'Restaurant', imageType: '', isDeleted: false });
            setImages(response);
            setShowImagePopup(true);
        }).catch(error => {
            console.error('There was an error fetching the images!', error);
        });
    };

    const handleAddImage = () => {
        setEditingImage(null);
        // setNewImage({ id: 0, url: '', description: '' });
        setShowImageSubPopup(true);
    };

    const handleEditImage = (image) => {
        setEditingImage(image);
        setShowImageSubPopup(true);
    };

    const handleDeleteImage = (imageId) => {
        deleteData(`/Images/${imageId}`).then(() => {
            setImages(images.filter(image => image.id !== imageId));
            setToasts([...toasts, { type: 'success', message: 'Image deleted successfully!' }]);
        }).catch(error => {
            setToasts([...toasts, { type: 'danger', message: 'Error or already in used' }]);
        });
    };

    const handleImageChange = (e) => {
        const { name, value } = e.target;
        if (editingImage) {
            setEditingImage(prevState => ({
                ...prevState,
                [name]: value
            }));
        } else {
            setNewImage(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleImageSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let imageUrl = '';

        if (image) {
            const formData = new FormData();
            try {
                imageUrl = await uploadImage(formData, image);
                setToasts([...toasts, { type: 'success', message: 'Image uploaded successfully!' }]);
            } catch (error) {
                setToasts([...toasts, { type: 'danger', message: 'Error or already in used' }]);
                setLoading(false);
                return;
            }
        }

        if (editingImage) {
            const imageToSave = {
                ...editingImage,
                imageUrl: imageUrl || editingImage.imageUrl,
            };
            updateData(`/Images/${editingImage.id}`, imageToSave).then(() => {
                setToasts([...toasts, { type: 'success', message: 'Image updated successfully!' }]);
                handleImageSetup(editingImage?.serviceId);
                setRefresh(!refresh);
            });
        } else {
            const imageToSave = {
                ...newImage,
                imageUrl: imageUrl || newImage.imageUrl,
            };
            createData('/Images', imageToSave).then(() => {
                setToasts([...toasts, { type: 'success', message: 'Image created successfully!' }]);
                handleImageSetup(newImage?.serviceId);

                setRefresh(!refresh);
            });
        }
        setLoading(false);
        setShowImageSubPopup(false);

    };

    const handleProvinceChange = (provinceId) => {
        const province = provinces.find(p => p.id === parseInt(provinceId));
        if (province) {
            setSelectedProvince(province);
            setSubDistricts(province.districts);
            setSubCommunes([]); // Reset communes when province changes
        }
    };

    const handleDistrictChange = (districtId) => {
        const district = districts.find(d => d.id === parseInt(districtId));
        if (district) {
            setSubCommunes(district.communes);
        }
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
                                        <th style={{ width: '15%' }}>Actions</th>
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
                                                <CButton className='' color="info" size="sm" onClick={() => handleEditRestaurant(restaurant)}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton className='mx-2' color="warning" size="sm" onClick={() => handleImageSetup(restaurant?.id)}>
                                                    <CIcon icon={cilImage} />
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
                                    <option key={province.id} value={province.id} selected={editingRestaurant && editingRestaurant?.provinceId === province.id}>{province.name}</option>
                                ))}
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="districtId">District</CFormLabel>
                            <CFormSelect id="districtId" name="districtId" value={newRestaurant.districtId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select District</option>
                                {subDistricts && subDistricts?.length > 0 && subDistricts.map(district => (
                                    <option key={district.id} value={district.id} selected={editingRestaurant && editingRestaurant?.districtId === district.id}>{district.name}</option>
                                ))}
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="communeId">Commune</CFormLabel>
                            <CFormSelect id="communeId" name="communeId" value={newRestaurant.communeId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Commune</option>
                                {subCommunes && subCommunes?.length > 0 && subCommunes.map(commune => (
                                    <option key={commune.id} value={commune.id} selected={editingRestaurant && editingRestaurant?.communeId === commune.id}>{commune.name}</option>
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

            <CModal visible={showImagePopup} onClose={() => setShowImagePopup(false)}>
                <CModalHeader closeButton>Manage Images</CModalHeader>
                <CModalBody>
                    <CButton color="primary" onClick={handleAddImage}>
                        <CIcon icon={cilImagePlus} /> Add Image
                    </CButton>
                    <table className="table table-hover table-striped table-bordered text-center mt-3">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Image Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {images.map(image => (
                                <tr key={image.id}>
                                    <td>{image.id}</td>
                                    <td>
                                        <img src={image?.imageUrl} alt="Room" style={{ width: '100px' }} />
                                    </td>
                                    <td>{image?.imageType}</td>
                                    <td>
                                        <CButton className='' color="info" size="sm" onClick={() => handleEditImage(image)}>
                                            <CIcon icon={cilPencil} />
                                        </CButton>
                                        <CButton className='mx-1' color="danger" size="sm" onClick={() => handleDeleteImage(image.id)}>
                                            <CIcon icon={cilTrash} />
                                        </CButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CModalBody>
            </CModal>

            <CModal visible={showImageSubPopup} onClose={() => setShowImageSubPopup(false)}>
                <CModalHeader closeButton>{editingImage ? 'Edit Image' : 'Add New Image'}</CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleImageSubmit}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="image">Image URL</CFormLabel>
                            <ImageUpload setImage={setImage} imageUrl={editingImage ? editingImage?.imageUrl : null} />
                        </div>

                        <div className='mb-3'>
                            <CFormSelect id="imageType" name="imageType" value={editingImage?.imageType} onChange={handleImageChange} required disabled={loading}>
                                <option value="">Select Image Type</option>
                                {ImageType.map(imageType =>
                                    <option key={imageType.key} value={imageType.value}>{imageType.value}</option>
                                )}
                            </CFormSelect>
                        </div>

                        <CModalFooter className="d-flex justify-content-end">
                            <CButton color="primary" type="submit" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : (editingImage ? 'Save Changes' : 'Add Image')}
                            </CButton>
                            <CButton color="secondary" onClick={() => setShowImageSubPopup(false)} disabled={loading}>Cancel</CButton>
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