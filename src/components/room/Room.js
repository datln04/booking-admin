import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CBadge, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput, CFormCheck, CFormSelect, CToast, CToastBody, CToastHeader, CToaster, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilUserFollow } from '@coreui/icons';
import { createData, fetchData, updateData, deleteData, fetchFilteredData } from '../../service/service';
import DeleteConfirmation from '../../util/DeleteConfirmation';
import { AvailabilityStatuses, RoomTypes, BedTypes } from '../../util/Enum';

const getStatusBadge = (isDeleted) => {
    return isDeleted ? 'danger' : 'success';
};

const getStatusText = (isDeleted) => {
    return isDeleted ? 'Deleted' : 'Active';
};

const Room = () => {
    const [rooms, setRooms] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState(null);
    const [newRoom, setNewRoom] = useState({
        id: 0,
        hotelId: 0,
        roomType: '',
        price: 0,
        availabilityStatus: '',
        bedType: '',
        maxGuests: 0,
        roomSize: '',
        amenities: '',
        isDeleted: false
    });
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        fetchRooms();
        fetchHotels();
    }, [refresh]);

    const fetchRooms = async () => {
        setFetching(true);
        const filter = {
            filters: [],
            includes: ["Hotel"],
            logic: "string",
            pageSize: 0,
            pageNumber: 0,
            all: true
        };
        fetchFilteredData('/Rooms', filter).then(response => {
            setRooms(response);
            setFetching(false);
        })
        .catch(error => {
            console.error('There was an error fetching the rooms!', error);
            setFetching(false);
        });
    };

    const fetchHotels = async () => {
        fetchData('/Hotels').then(response => {
            setHotels(response);
        })
        .catch(error => {
            console.error('There was an error fetching the hotels!', error);
        });
    };

    const handleAddRoom = () => {
        setEditingRoom(null);
        setNewRoom({
            id: 0,
            hotelId: 0,
            roomType: '',
            price: 0,
            availabilityStatus: '',
            bedType: '',
            maxGuests: 0,
            roomSize: '',
            amenities: '',
            isDeleted: false
        });
        setShowPopup(true);
    };

    const handleEditRoom = (room) => {
        setEditingRoom(room);
        setNewRoom(room);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewRoom(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const roomToSave = {
            ...newRoom
        };

        setLoading(false);
        handleClosePopup();

        if (editingRoom) {
            updateData(`/Rooms/${editingRoom.id}`, roomToSave).then(() => {
                setRefresh(!refresh);
            });
        } else {
            createData('/Rooms', roomToSave).then(() => {
                setRefresh(!refresh);
            });
        }
    };

    const handleDeleteRoom = (roomId) => {
        setRoomToDelete(roomId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteRoom = () => {
        deleteData(`/Rooms/${roomToDelete}`).then(() => {
            setRefresh(!refresh);
            setToasts([...toasts, { type: 'success', message: 'Room deleted successfully!' }]);
            setShowDeleteConfirm(false);
            setRoomToDelete(null);
        }).catch(error => {
            setToasts([...toasts, { type: 'danger', message: error.message }]);
            setShowDeleteConfirm(false);
            setRoomToDelete(null);
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
                        <CButton color="primary" onClick={handleAddRoom}>
                            <CIcon icon={cilUserFollow} /> Add Room
                        </CButton>
                    </CCardHeader>
                    <CCardBody>
                        {fetching ? (
                            <div className="text-center">
                                <CSpinner color="primary" />
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="table table-hover table-striped table-bordered text-center">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Hotel</th>
                                            <th>Room Type</th>
                                            <th>Price</th>
                                            <th>Availability Status</th>
                                            <th>Bed Type</th>
                                            <th>Max Guests</th>
                                            <th>Room Size</th>
                                            <th>Amenities</th>
                                            <th>Status</th>
                                            <th style={{ width: '130px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rooms.map(room => (
                                            <tr key={room.id}>
                                                <td>{room.id}</td>
                                                <td>{hotels.find(h => h.id === room.hotelId)?.name || 'Unknown'}</td>
                                                <td>{room.roomType}</td>
                                                <td>{room.price}</td>
                                                <td>{room.availabilityStatus}</td>
                                                <td>{room.bedType}</td>
                                                <td>{room.maxGuests}</td>
                                                <td>{room.roomSize}</td>
                                                <td>{room.amenities}</td>
                                                <td>
                                                    <CBadge color={getStatusBadge(room.isDeleted)}>
                                                        {getStatusText(room.isDeleted)}
                                                    </CBadge>
                                                </td>
                                                <td>
                                                    <CButton className='mx-2' color="info" size="sm" onClick={() => handleEditRoom(room)}>
                                                        <CIcon icon={cilPencil} />
                                                    </CButton>
                                                    <CButton color="danger" size="sm" onClick={() => handleDeleteRoom(room.id)}>
                                                        <CIcon icon={cilTrash} />
                                                    </CButton>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CCardBody>
                </CCard>
            </CCol>

            <CModal visible={showPopup} onClose={handleClosePopup}>
                <CModalHeader closeButton>{editingRoom ? 'Edit Room' : 'Add New Room'}</CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="hotelId">Hotel</CFormLabel>
                            <CFormSelect id="hotelId" name="hotelId" value={newRoom.hotelId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Hotel</option>
                                {hotels.map(hotel => (
                                    <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="roomType">Room Type</CFormLabel>
                            <CFormSelect id="roomType" name="roomType" value={newRoom.roomType} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Room Type</option>
                                {RoomTypes.map(roomType => (
                                    <option key={roomType.key} value={roomType.value}>{roomType.value}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="price">Price</CFormLabel>
                            <CFormInput type="number" id="price" name="price" value={newRoom.price} onChange={handleChange} required disabled={loading} />
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="availabilityStatus">Availability Status</CFormLabel>
                            <CFormSelect id="availabilityStatus" name="availabilityStatus" value={newRoom.availabilityStatus} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Availability Status</option>
                                {Object.values(AvailabilityStatuses).map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="bedType">Bed Type</CFormLabel>
                            <CFormSelect id="bedType" name="bedType" value={newRoom.bedType} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Bed Type</option>
                                {BedTypes.map(bedType => (
                                    <option key={bedType.key} value={bedType.value}>{bedType.value}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="maxGuests">Max Guests</CFormLabel>
                            <CFormInput type="number" id="maxGuests" name="maxGuests" value={newRoom.maxGuests} onChange={handleChange} required disabled={loading} />
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="roomSize">Room Size</CFormLabel>
                            <CFormInput type="text" id="roomSize" name="roomSize" value={newRoom.roomSize} onChange={handleChange} required disabled={loading} />
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="amenities">Amenities</CFormLabel>
                            <CFormInput type="text" id="amenities" name="amenities" value={newRoom.amenities} onChange={handleChange} required disabled={loading} />
                        </div>
                        
                        <div className="mb-3">
                            <CFormCheck id="isDeleted" name="isDeleted" checked={newRoom.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />
                        </div>
                        
                        <CModalFooter className="d-flex justify-content-end">
                            <CButton color="primary" type="submit" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : (editingRoom ? 'Save Changes' : 'Add Room')}
                            </CButton>
                            <CButton color="secondary" onClick={handleClosePopup} disabled={loading}>Cancel</CButton>
                        </CModalFooter>
                    </CForm>
                </CModalBody>
            </CModal>

            <DeleteConfirmation
                visible={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteRoom}
            />
        </CRow>
    );
};

export default Room;