import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CBadge, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormCheck, CFormSelect, CToast, CToastBody, CToastHeader, CToaster, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilUserFollow } from '@coreui/icons';
import Select from 'react-select';
import { createData, fetchData, updateData, deleteData, fetchFilteredData, fetchFilteredDataWithoutFilter } from '../../service/service';
import DeleteConfirmation from '../../util/DeleteConfirmation';

const getStatusBadge = (isDeleted) => {
    return isDeleted ? 'danger' : 'success';
};

const getStatusText = (isDeleted) => {
    return isDeleted ? 'Deleted' : 'Active';
};

const HotelAmenity = () => {
    const [hotels, setHotels] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [hotelAmenities, setHotelAmenities] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingAmenity, setEditingAmenity] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [amenityToDelete, setAmenityToDelete] = useState(null);
    const [newAmenity, setNewAmenity] = useState({
        id: 0,
        hotelId: '',
        amenityIds: [],
        isDeleted: false
    });
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [allHotel, setAllHotel] = useState([]);

    useEffect(() => {
        fetchHotels();
        fetchAmenities();
        fetchHotelAmenities();
        fetchAllHotels()
    }, [refresh]);

    const fetchHotels = async () => {
        const filter = {
            filters: [],
            includes: [],
            logic: "string",
            pageSize: 0,
            pageNumber: 0,
            all: true
        };
        fetchFilteredDataWithoutFilter('/Hotels/GetRestaurantsWithoutDietaryOptions', filter).then(response => {
            setHotels(response);
        })
            .catch(error => {
                console.error('There was an error fetching the hotels!', error);
            });
    };

    const fetchAllHotels = async () => {
        fetchData('/Hotels').then(response => {
            setAllHotel(response);
        })
            .catch(error => {
                console.error('There was an error fetching the hotels!', error);
            });
    }


    const fetchAmenities = async () => {
        fetchData('/Amenity').then(response => {
            setAmenities(response);
        })
            .catch(error => {
                console.error('There was an error fetching the amenities!', error);
            });
    };

    const fetchHotelAmenities = async () => {
        setFetching(true);
        const filter = {
            filters: [],
            includes: ["Amenity"],
            logic: "string",
            pageSize: 0,
            pageNumber: 0,
            all: true
        };
        fetchFilteredData('/HotelAmenity', filter).then(response => {
            setHotelAmenities(response);
            setFetching(false);
        })
            .catch(error => {
                console.error('There was an error fetching the hotel amenities!', error);
                setFetching(false);
            });
    };

    const handleAddAmenity = () => {
        setEditingAmenity(null);
        setNewAmenity({
            id: 0,
            hotelId: '',
            amenityIds: [],
            isDeleted: false
        });
        setShowPopup(true);
    };

    const handleEditAmenity = (amenity) => {
        setEditingAmenity(amenity);
        setNewAmenity({
            id: amenity.id,
            hotelId: amenity.hotelId,
            amenityIds: amenity.amenityIds,
            isDeleted: amenity.isDeleted
        });
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

    const handleAmenityChange = (selectedOptions) => {
        const selectedAmenities = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setNewAmenity(prevState => ({
            ...prevState,
            amenityIds: selectedAmenities
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (editingAmenity) {
            if (newAmenity?.amenityIds?.length > editingAmenity?.amenityIds?.length) {
                const amenityToAdd = newAmenity?.amenityIds.filter(a => !editingAmenity?.amenityIds.includes(a));
                const amenityPromises = amenityToAdd.map(amenityId => {
                    const amenityToSave = {
                        id: 0,
                        hotelId: editingAmenity.hotelId,
                        amenityId: amenityId,
                        isDeleted: editingAmenity.isDeleted
                    };                    
                    return createData('/HotelAmenity', amenityToSave);
                });

                try {
                    await Promise.all(amenityPromises);
                    setToasts([...toasts, { type: 'success', message: 'Amenity updated successfully!' }]);
                    setRefresh(!refresh);
                } catch (error) {
                    setToasts([...toasts, { type: 'danger', message: 'Error or already in used' }]);
                } finally {
                    setLoading(false);
                    setNewAmenity(null);
                    setEditingAmenity(null);
                    handleClosePopup();
                }
            } else if (newAmenity?.amenityIds?.length < editingAmenity?.amenityIds?.length) {
                const amenityToRemove = editingAmenity?.amenityIds.filter(a => !newAmenity?.amenityIds.includes(a));
                console.log(amenityToRemove);
                
                const amenityPromises = amenityToRemove?.map(amenityId => {
                    console.log(editingAmenity);
                    
                    return deleteData(`/HotelAmenity/DeleteByHotelIdAndAmenityIdAsync?hotelId=${editingAmenity?.hotelId}&amenityId=${amenityId}`).then(() => {
                        setRefresh(!refresh);
                        setToasts([...toasts, { type: 'success', message: 'Amenity updated successfully!' }]);
                    }).catch(error => {
                        setToasts([...toasts, { type: 'danger', message: 'Error or already in used' }]);
                    });
                });

                try {
                    await Promise.all(amenityPromises);
                    setToasts([...toasts, { type: 'success', message: 'Amenity updated successfully!' }]);
                    setRefresh(!refresh);
                } catch (error) {
                    setToasts([...toasts, { type: 'danger', message: 'Error or already in used' }]);
                } finally {
                    setLoading(false);
                    handleClosePopup();
                    setNewAmenity(null);
                    setEditingAmenity(null);
                }
            }

        } else {
            const amenityPromises = newAmenity.amenityIds.map(amenityId => {
                const amenityToSave = {
                    id: newAmenity.id,
                    hotelId: newAmenity.hotelId,
                    amenityId: amenityId,
                    isDeleted: newAmenity.isDeleted
                };
                return createData('/HotelAmenity', amenityToSave);
            });

            try {
                await Promise.all(amenityPromises);
                setToasts([...toasts, { type: 'success', message: editingAmenity ? 'Amenity updated successfully!' : 'Amenity created successfully!' }]);
                setRefresh(!refresh);
            } catch (error) {
                setToasts([...toasts, { type: 'danger', message: 'Error or already in used' }]);
            } finally {
                setLoading(false);
                handleClosePopup();
            }
        }
    };

    const handleDeleteAmenity = (amenityIds) => {
        setAmenityToDelete(amenityIds);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteAmenity = async () => {
        if(amenityToDelete?.length > 0){
            const amenitiesDeleted = amenityToDelete?.map(amenityId => {
                return deleteData(`/HotelAmenity/${amenityId}`).then(() => {
                    setRefresh(!refresh);
                    setToasts([...toasts, { type: 'success', message: 'Amenity deleted successfully!' }]);

                }).catch(error => {
                    setToasts([...toasts, { type: 'danger', message: 'Error or already in used' }]);
                });
            });

            try {
                await Promise.all(amenitiesDeleted);
                setToasts([...toasts, { type: 'success', message: 'Amenity deleted successfully!' }]);
                setRefresh(!refresh);
            } catch (error) {
                setToasts([...toasts, { type: 'danger', message: 'Error or already in used' }]);
            } finally {
                setLoading(false);
                handleClosePopup();
                setShowDeleteConfirm(false);
                setAmenityToDelete(null);
            }
        }
    };

    const amenityOptions = amenities.map(amenity => ({
        value: amenity.id,
        label: amenity.name
    }));

    // Group amenities by hotel    
    const groupedAmenities = hotelAmenities.reduce((acc, amenity) => {
        const hotel = allHotel.find(h => h.id === amenity.hotelId);
        if (hotel) {
            if (!acc[hotel.id]) {
                acc[hotel.id] = {
                    hotel,
                    amenities: []
                };
            }
            acc[hotel.id].amenities.push({
                id: amenity?.id,
                amenity: amenities.find(a => a.id == amenity.amenityId)
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
                        <CButton color="primary" onClick={handleAddAmenity}>
                            <CIcon icon={cilUserFollow} /> Add Amenity
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
                                        <th>Hotel</th>
                                        <th>Amenities</th>
                                        <th>Status</th>
                                        <th style={{ width: '130px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(groupedAmenities).map(({ hotel, amenities }) => (
                                        <tr key={hotel.id}>
                                            <td>{hotel.id}</td>
                                            <td>{hotel.name}</td>
                                            <td>{amenities.map(a => a?.amenity?.name).join(', ')}</td>
                                            <td>
                                                <CBadge color={getStatusBadge(hotel.isDeleted)}>
                                                    {getStatusText(hotel.isDeleted)}
                                                </CBadge>
                                            </td>
                                            <td>
                                                <CButton className='mx-2' color="info" size="sm" onClick={() => handleEditAmenity({ id: amenities.map(a => a?.id), hotelId: hotel.id, amenityIds: amenities?.map(a => a?.amenity?.id), isDeleted: hotel.isDeleted })}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton color="danger" size="sm" onClick={() => handleDeleteAmenity(amenities.map(a => a?.id))}>
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
                            <CFormLabel htmlFor="hotelId">Hotel</CFormLabel>
                            <CFormSelect id="hotelId" name="hotelId" value={newAmenity?.hotelId} onChange={handleChange} required disabled={newAmenity?.hotelId || loading}>
                                <option value="">Select Hotel</option>
                                {allHotel.map(hotel => (
                                    <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                                ))}
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="amenityIds">Amenities</CFormLabel>
                            <Select
                                id="amenityIds"
                                name="amenityIds"
                                required
                                isMulti
                                options={amenityOptions}
                                value={amenityOptions.filter(option => newAmenity?.amenityIds?.includes(option.value))}
                                onChange={handleAmenityChange}
                                isDisabled={loading}
                            />
                        </div>

                        <div className="mb-3">
                            <CFormCheck id="isDeleted" name="isDeleted" checked={newAmenity?.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />
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

export default HotelAmenity;