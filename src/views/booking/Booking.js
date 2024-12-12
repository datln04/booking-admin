import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CBadge, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput, CFormSelect, CFormCheck, CToast, CToastBody, CToastHeader, CToaster, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import moment from 'moment';
import { cilDelete, cilPencil, cilTrash, cilUserFollow } from '@coreui/icons';
// import './Booking.scss'; // Import the SCSS file
import { createData, deleteData, fetchData, updateData } from '../../service/service';
import { BookingStatus, PaymentStatus, ServiceType } from '../../util/Enum';

const getStatusBadge = (isDeleted) => {
    return isDeleted ? 'danger' : 'success';
};

const getStatusText = (isDeleted) => {
    return isDeleted ? 'Deleted' : 'Active';
};

const Booking = () => {
    const [bookings, setBookings] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [newBooking, setNewBooking] = useState({
        id: 0,
        customerId: 0,
        serviceType: '',
        serviceId: 0,
        bookingDate: '',
        price: 0,
        paymentStatus: '',
        bookingStatus: '',
        isDeleted: false
    });
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, [refresh]);

    const fetchBookings = async () => {
        setFetching(true);
        fetchData('/Bookings').then(response => {
            setBookings(response);
            setFetching(false);
        })
        .catch(error => {
            console.error('There was an error fetching the bookings!', error);
            setFetching(false);
        });
    };

    const handleAddBooking = () => {
        setEditingBooking(null);
        setNewBooking({
            id: 0,
            customerId: 0,
            serviceType: '',
            serviceId: 0,
            bookingDate: '',
            price: 0,
            paymentStatus: '',
            bookingStatus: '',
            isDeleted: false
        });
        setShowPopup(true);
    };

    const handleEditBooking = (booking) => {
        setEditingBooking(booking);
        setNewBooking(booking);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewBooking(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const currentDate = new Date().toISOString();

        const bookingToSave = {
            ...newBooking,
            bookingDate: editingBooking ? newBooking.bookingDate : currentDate
        };

        setLoading(false);
        handleClosePopup();

        if (editingBooking) {
            updateData(`/Bookings/updateBooking`, bookingToSave).then(() => {
                setRefresh(!refresh);
            });
        } else {
            createData('/Bookings/register', bookingToSave).then(() => {
                setRefresh(!refresh);
            });
        }
    };

    const handleDeleteBooking = (bookingId) => {
        setBookingToDelete(bookingId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteBooking = () => {
        deleteData(`/Bookings/${bookingToDelete}`).then(() => {
            setRefresh(!refresh);
            setToasts([...toasts, { type: 'success', message: 'Booking deleted successfully!' }]);
            setShowDeleteConfirm(false);
            setBookingToDelete(null);
        }).catch(error => {
            setToasts([...toasts, { type: 'danger', message: 'Error or already in used' }]);
            setShowDeleteConfirm(false);
            setBookingToDelete(null);
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
                    {/* <CCardHeader>
                        <CButton color="primary" onClick={handleAddBooking}>
                            <CIcon icon={cilUserFollow} /> Add Booking
                        </CButton>
                    </CCardHeader> */}
                    <CCardBody>
                        {fetching ? (
                            <div className="text-center">
                                <CSpinner color="primary" />
                            </div>
                        ) : (
                            <table className="table table-hover table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Booking ID</th>
                                        <th>Customer ID</th>
                                        <th>Service Type</th>
                                        <th>Service ID</th>
                                        <th>Booking Date</th>
                                        <th>Price</th>
                                        <th>Payment Status</th>
                                        <th>Booking Status</th>
                                        <th>Status</th>
                                        <th style={{ width: '130px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(booking => (
                                        <tr key={booking.id}>
                                            <td>{booking.id}</td>
                                            <td>{booking.customerId}</td>
                                            <td>{booking.serviceType}</td>
                                            <td>{booking.serviceId}</td>
                                            <td>{moment(booking.bookingDate).format('YYYY-MM-DD HH:mm:ss')}</td>
                                            <td>{booking.price}</td>
                                            <td>{booking.paymentStatus}</td>
                                            <td>{booking.bookingStatus}</td>
                                            <td>
                                                <CBadge color={getStatusBadge(booking.isDeleted)}>
                                                    {getStatusText(booking.isDeleted)}
                                                </CBadge>
                                            </td>
                                            <td>
                                                <CButton className='button' color="info" size="sm" onClick={() => handleEditBooking(booking)}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton color="danger" size="sm" onClick={() => handleDeleteBooking(booking.id)}>
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
                <CModalHeader closeButton>{editingBooking ? 'Edit Booking' : 'Add New Booking'}</CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSubmit}>
                        <CFormLabel htmlFor="customerId">Customer ID</CFormLabel>
                        <CFormInput type="number" id="customerId" name="customerId" value={newBooking.customerId} onChange={handleChange} required disabled={loading} />

                        <CFormLabel htmlFor="serviceType">Service Type</CFormLabel>
                        <CFormSelect id="serviceType" name="serviceType" value={newBooking.serviceType} onChange={handleChange} disabled={loading}>
                            {Object.values(ServiceType).map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </CFormSelect>

                        <CFormLabel htmlFor="serviceId">Service ID</CFormLabel>
                        <CFormInput type="number" id="serviceId" name="serviceId" value={newBooking.serviceId} onChange={handleChange} required disabled={loading} />

                        <CFormLabel htmlFor="bookingDate">Booking Date</CFormLabel>
                        <CFormInput type="datetime-local" id="bookingDate" name="bookingDate" value={newBooking.bookingDate} onChange={handleChange} required disabled={loading} />

                        <CFormLabel htmlFor="price">Price</CFormLabel>
                        <CFormInput type="number" id="price" name="price" value={newBooking.price} onChange={handleChange} required disabled={loading} />

                        <CFormLabel htmlFor="paymentStatus">Payment Status</CFormLabel>
                        <CFormSelect id="paymentStatus" name="paymentStatus" value={newBooking.paymentStatus} onChange={handleChange} disabled={loading}>
                            {Object.values(PaymentStatus).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </CFormSelect>

                        <CFormLabel htmlFor="bookingStatus">Booking Status</CFormLabel>
                        <CFormSelect id="bookingStatus" name="bookingStatus" value={newBooking.bookingStatus} onChange={handleChange} disabled={loading}>
                            {Object.values(BookingStatus).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </CFormSelect>

                        <CFormCheck id="isDeleted" name="isDeleted" checked={newBooking.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />

                        <CModalFooter>
                            <CButton color="primary" type="submit" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : (editingBooking ? 'Save Changes' : 'Add Booking')}
                            </CButton>
                            <CButton color="secondary" onClick={handleClosePopup} disabled={loading}>Cancel</CButton>
                        </CModalFooter>
                    </CForm>
                </CModalBody>
            </CModal>

            <CModal visible={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
                <CModalHeader closeButton>Confirm Delete</CModalHeader>
                <CModalBody>
                    Are you sure you want to delete this booking?
                </CModalBody>
                <CModalFooter>
                    <CButton color="danger" onClick={confirmDeleteBooking}>Delete</CButton>
                    <CButton color="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</CButton>
                </CModalFooter>
            </CModal>
        </CRow>
    );
};

export default Booking;