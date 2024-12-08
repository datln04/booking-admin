import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CBadge, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput, CFormCheck, CFormSelect, CToast, CToastBody, CToastHeader, CToaster, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilUserFollow } from '@coreui/icons';
import { createData, fetchData, updateData, deleteData, fetchFilteredData } from '../../service/service';
import { uploadImage } from '../../util/Util';
import ImageUpload from '../../util/ImageUpload';
import DeleteConfirmation from '../../util/DeleteConfirmation';
import { UserRole } from '../../util/Enum';

const getStatusBadge = (isDeleted) => {
    return isDeleted ? 'danger' : 'success';
};

const getStatusText = (isDeleted) => {
    return isDeleted ? 'Deleted' : 'Active';
};

const Hotel = () => {
    const [hotels, setHotels] = useState([]);
    const [users, setUsers] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingHotel, setEditingHotel] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [hotelToDelete, setHotelToDelete] = useState(null);
    const [newHotel, setNewHotel] = useState({
        id: 0,
        ownerId: 0,
        name: '',
        address: '',
        phoneNumber: '',
        email: '',
        description: '',
        starRating: 0,
        provinceId: 0,
        districtId: 0,
        communeId: 0,
        isDeleted: false
    });
    const [image, setImage] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState(null);


    useEffect(() => {
        fetchHotels();
        fetchUsers();
        fetchProvinces();
        fetchDistricts();
        fetchCommunes();
    }, [refresh]);

    const fetchHotels = async () => {
        setFetching(true);
        fetchData('/Hotels').then(response => {
            setHotels(response);
            setFetching(false);
        })
            .catch(error => {
                console.error('There was an error fetching the hotels!', error);
                setFetching(false);
            });
    };

    const fetchUsers = async () => {
        const filter = {
            filters: [{
                field: "Role",
                operator: "Equal",
                value: UserRole.HOTEL_MANAGER
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

    const handleAddHotel = () => {
        setEditingHotel(null);
        setNewHotel({
            id: 0,
            ownerId: 0,
            name: '',
            address: '',
            phoneNumber: '',
            email: '',
            description: '',
            starRating: 0,
            provinceId: 0,
            districtId: 0,
            communeId: 0,
            isDeleted: false
        });
        setShowPopup(true);
    };

    const handleEditHotel = (hotel) => {
        setEditingHotel(hotel);
        setNewHotel(hotel);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewHotel(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name === 'provinceId') {
            handleProvinceChange(value);
        }

        if(name === 'districtId') {
            handleDistrictChange(value);
        }
    };

    const handleProvinceChange = (provinceId) => {
        const province = provinces.find(p => p.id === parseInt(provinceId));
        if (province) {
            setSelectedProvince(province);
            setDistricts(province.districts);
            setCommunes([]); // Reset communes when province changes
        }
    };
    
    const handleDistrictChange = (districtId) => {
        const district = districts.find(d => d.id === parseInt(districtId));
        if (district) {
            setCommunes(district.communes);
        }
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

        const hotelToSave = {
            ...newHotel,
            image: imageUrl || newHotel.image
        };

        setLoading(false);
        handleClosePopup();

        if (editingHotel) {
            updateData(`/Hotels/${editingHotel.id}`, hotelToSave).then(() => {
                setRefresh(!refresh);
            });
        } else {
            createData('/Hotels', hotelToSave).then(() => {
                setRefresh(!refresh);
            });
        }
    };

    const handleDeleteHotel = (hotelId) => {
        setHotelToDelete(hotelId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteHotel = () => {
        deleteData(`/Hotels/${hotelToDelete}`).then(() => {
            setRefresh(!refresh);
            setToasts([...toasts, { type: 'success', message: 'Hotel deleted successfully!' }]);
            setShowDeleteConfirm(false);
            setHotelToDelete(null);
        }).catch(error => {
            setToasts([...toasts, { type: 'danger', message: error.message }]);
            setShowDeleteConfirm(false);
            setHotelToDelete(null);
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
                        <CButton color="primary" onClick={handleAddHotel}>
                            <CIcon icon={cilUserFollow} /> Add Hotel
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
                                        <th>Owner</th>
                                        <th>Name</th>
                                        <th>Address</th>
                                        <th>Phone Number</th>
                                        <th>Email</th>
                                        <th>Description</th>
                                        <th>Star Rating</th>
                                        <th>Province</th>
                                        <th>District</th>
                                        <th>Commune</th>
                                        <th>Status</th>
                                        <th style={{ width: '130px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hotels.map(hotel => (
                                        <tr key={hotel.id}>
                                            <td>{hotel.id}</td>
                                            <td>{users.find(user => user.id === hotel.ownerId)?.username || 'N/A'}</td>
                                            <td>{hotel.name}</td>
                                            <td>{hotel.address}</td>
                                            <td>{hotel.phoneNumber}</td>
                                            <td>{hotel.email}</td>
                                            <td>{hotel.description}</td>
                                            <td>{hotel.starRating}</td>
                                            <td>{provinces.find(province => province.id === hotel.provinceId)?.name || 'N/A'}</td>
                                            <td>{districts.find(district => district.id === hotel.districtId)?.name || 'N/A'}</td>
                                            <td>{communes.find(commune => commune.id === hotel.communeId)?.name || 'N/A'}</td>
                                            <td>
                                                <CBadge color={getStatusBadge(hotel.isDeleted)}>
                                                    {getStatusText(hotel.isDeleted)}
                                                </CBadge>
                                            </td>
                                            <td>
                                                <CButton className='mx-2' color="info" size="sm" onClick={() => handleEditHotel(hotel)}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton color="danger" size="sm" onClick={() => handleDeleteHotel(hotel.id)}>
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
                <CModalHeader closeButton>{editingHotel ? 'Edit Hotel' : 'Add New Hotel'}</CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="name">Name</CFormLabel>
                            <CFormInput type="text" id="name" name="name" value={newHotel.name} onChange={handleChange} required disabled={loading} />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="ownerId">Owner</CFormLabel>
                            <CFormSelect id="ownerId" name="ownerId" value={newHotel.ownerId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Owner</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.username}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="address">Address</CFormLabel>
                            <CFormInput type="text" id="address" name="address" value={newHotel.address} onChange={handleChange} required disabled={loading} />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="phoneNumber">Phone Number</CFormLabel>
                            <CFormInput type="text" id="phoneNumber" name="phoneNumber" value={newHotel.phoneNumber} onChange={handleChange} required disabled={loading} />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="email">Email</CFormLabel>
                            <CFormInput type="email" id="email" name="email" value={newHotel.email} onChange={handleChange} required disabled={loading} />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="description">Description</CFormLabel>
                            <CFormInput type="text" id="description" name="description" value={newHotel.description} onChange={handleChange} required disabled={loading} />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="starRating">Star Rating</CFormLabel>
                            <CFormInput type="number" id="starRating" name="starRating" value={newHotel.starRating} onChange={handleChange} required disabled={loading} />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="provinceId">Province</CFormLabel>
                            <CFormSelect id="provinceId" name="provinceId" value={newHotel.provinceId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Province</option>
                                {provinces.map(province => (
                                    <option key={province.id} value={province.id}>{province.name}</option>
                                ))}
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="districtId">District</CFormLabel>
                            <CFormSelect id="districtId" name="districtId" value={newHotel.districtId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select District</option>
                                {districts.map(district => (
                                    <option key={district.id} value={district.id}>{district.name}</option>
                                ))}
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="communeId">Commune</CFormLabel>
                            <CFormSelect id="communeId" name="communeId" value={newHotel.communeId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Commune</option>
                                {communes.map(commune => (
                                    <option key={commune.id} value={commune.id}>{commune.name}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="image">Image URL</CFormLabel>
                            <ImageUpload setImage={setImage} imageUrl={editingHotel ? editingHotel.image : null} />
                        </div>
                        <div className="mb-3">
                            <CFormCheck id="isDeleted" name="isDeleted" checked={newHotel.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />
                        </div>
                        <CModalFooter className="d-flex justify-content-end">
                            <CButton color="primary" type="submit" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : (editingHotel ? 'Save Changes' : 'Add Hotel')}
                            </CButton>
                            <CButton color="secondary" onClick={handleClosePopup} disabled={loading}>Cancel</CButton>
                        </CModalFooter>
                    </CForm>
                </CModalBody>
            </CModal>

            <DeleteConfirmation
                visible={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteHotel}
            />
        </CRow>
    );
};

export default Hotel;