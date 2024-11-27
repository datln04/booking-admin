import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CBadge, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput, CFormCheck, CFormSelect, CToast, CToastBody, CToastHeader, CToaster, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilUserFollow } from '@coreui/icons';
import { createData, fetchData, updateData, deleteData, fetchFilteredData } from '../../service/service';
import { uploadImage } from '../../util/Util';
import ImageUpload from '../../util/ImageUpload';
import DeleteConfirmation from '../../util/DeleteConfirmation';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import { UserRole } from '../../util/Enum';

const getStatusBadge = (availabilityStatus) => {
    return availabilityStatus === 'Unavailable' ? 'danger' : 'success';
};

const getStatusText = (availabilityStatus) => {
    return availabilityStatus === 'Unavailable' ? 'Unavailable' : 'Available';
};

const Activities = () => {
    const [activities, setActivities] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [activityToDelete, setActivityToDelete] = useState(null);
    const [newActivity, setNewActivity] = useState({
        id: 0,
        managerId: 0,
        activityName: '',
        activityType: '',
        priceAdult: 0,
        priceChild: 0,
        rating: 0,
        reviews: 0,
        duration: [new Date(), new Date()],
        availabilityStatus: 'Available',
        description: '',
        image: '',
        locationCity: '',
        locationLat: 0,
        locationLng: 0,
        includes: '',
        isDeleted: false
    });
    const [image, setImage] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchActivities();
        fetchUsers();
    }, [refresh]);

    const fetchActivities = async () => {
        setFetching(true);
        fetchData('/LeisureActivities').then(response => {
            setActivities(response);
            setFetching(false);
        })
            .catch(error => {
                console.error('There was an error fetching the activities!', error);
                setFetching(false);
            });
    };

    const handleAddActivity = () => {
        setEditingActivity(null);
        setNewActivity({
            id: 0,
            managerId: 0,
            activityName: '',
            activityType: '',
            priceAdult: 0,
            priceChild: 0,
            rating: 0,
            reviews: 0,
            duration: [new Date(), new Date()],
            availabilityStatus: 'Available',
            description: '',
            image: '',
            locationCity: '',
            locationLat: 0,
            locationLng: 0,
            includes: '',
            isDeleted: false
        });
        setShowPopup(true);
    };

    const fetchUsers = async () => {
        const filter = {
            filters: [{
                field: "Role",
                operator: "Equal",
                value: UserRole.AMUSEMENT_CENTER_MANAGER
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

    const handleEditActivity = (activity) => {
        const parsedOpeningHours = activity.duration.split(' - ').map(time => {
            const [hour] = time?.trim().split('h');
            return `${hour}:00`;
        });
        setEditingActivity(activity);
        setNewActivity({
            ...activity,
            duration: parsedOpeningHours
        });
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewActivity(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDateTimeRangeChange = (value) => {
        setNewActivity(prevState => ({
            ...prevState,
            duration: value
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
            } catch (error) {
                setToasts([...toasts, { type: 'danger', message: error.message }]);
                setLoading(false);
                return;
            }
        }

        let durationString;
        console.log(newActivity);

        if (editingActivity) {
            // Parse the time strings into Date objects
            const openingHoursStart = new Date();
            const openingHoursEnd = new Date();
            const [startHour, startMinute] = newActivity.duration[0].split(':');
            const [endHour, endMinute] = newActivity.duration[1].split(':');
            openingHoursStart.setHours(startHour, startMinute);
            openingHoursEnd.setHours(endHour, endMinute);

            // Merge openingHours into a string
            durationString = `${openingHoursStart.getHours()}h - ${openingHoursEnd.getHours()}h`;
        } else {
            // Merge openingHours into a string
            durationString = `${newActivity.duration[0].getHours()}h - ${newActivity.duration[1].getHours()}h`;
        }

        const activityToSave = {
            ...newActivity,
            duration: durationString,
            image: imageUrl || newActivity.image,
            locationLat: 0,
            locationLng: 0
        };

        setLoading(false);
        handleClosePopup();

        if (editingActivity) {
            setToasts([...toasts, { type: 'success', message: 'Updated successfully!' }]);

            updateData(`/LeisureActivities/${editingActivity.id}`, activityToSave).then(() => {
                setRefresh(!refresh);
            });
        } else {
            setToasts([...toasts, { type: 'success', message: 'Created successfully!' }]);

            createData('/LeisureActivities', activityToSave).then(() => {
                setRefresh(!refresh);
            });
        }
    };

    const handleDeleteActivity = (activityId) => {
        setActivityToDelete(activityId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteActivity = () => {
        deleteData(`/LeisureActivities/${activityToDelete}`).then(() => {
            setRefresh(!refresh);
            setToasts([...toasts, { type: 'success', message: 'Activity deleted successfully!' }]);
            setShowDeleteConfirm(false);
            setActivityToDelete(null);
        }).catch(error => {
            setToasts([...toasts, { type: 'danger', message: error.message }]);
            setShowDeleteConfirm(false);
            setActivityToDelete(null);
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
                        <CButton color="primary" onClick={handleAddActivity}>
                            <CIcon icon={cilUserFollow} /> Add Activity
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
                                        <th>Image</th>
                                        <th>ID</th>
                                        <th>Activity Name</th>
                                        <th>Status</th>
                                        <th style={{ width: '130px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activities.map(activity => (
                                        <tr key={activity.id}>
                                            <td><img src={activity.image} alt={activity.activityName} className="img-fluid mx-auto d-block" width="50" height="50" /></td>
                                            <td>{activity.id}</td>
                                            <td>{activity.activityName}</td>
                                            <td>
                                                <CBadge color={getStatusBadge(activity.availabilityStatus)}>
                                                    {getStatusText(activity.availabilityStatus)}
                                                </CBadge>
                                            </td>
                                            <td>
                                                <CButton className='mx-2' color="info" size="sm" onClick={() => handleEditActivity(activity)}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton color="danger" size="sm" onClick={() => handleDeleteActivity(activity.id)}>
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
                <CModalHeader closeButton>{editingActivity ? 'Edit Activity' : 'Add New Activity'}</CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="managerId">Manager</CFormLabel>
                            <CFormSelect id="managerId" name="managerId" value={newActivity.managerId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Manager</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.username}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="activityName">Activity Name</CFormLabel>
                            <CFormInput type="text" id="activityName" name="activityName" value={newActivity.activityName} onChange={handleChange} required disabled={loading} />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="activityType">Activity Type</CFormLabel>
                            <CFormInput type="text" id="activityType" name="activityType" value={newActivity.activityType} onChange={handleChange} required disabled={loading} />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="priceAdult">Price Adult</CFormLabel>
                            <CFormInput type="number" id="priceAdult" name="priceAdult" value={newActivity.priceAdult} onChange={handleChange} required disabled={loading} min="0" />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="priceChild">Price Child</CFormLabel>
                            <CFormInput type="number" id="priceChild" name="priceChild" value={newActivity.priceChild} onChange={handleChange} required disabled={loading} min="0" />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="rating">Rating</CFormLabel>
                            <CFormInput type="number" id="rating" name="rating" value={newActivity.rating} onChange={handleChange} required disabled={loading} min="0" />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="reviews">Reviews</CFormLabel>
                            <CFormInput type="number" id="reviews" name="reviews" value={newActivity.reviews} onChange={handleChange} required disabled={loading} min="0" />
                        </div>
                        {/*                         
                        <div className="mb-3">
                            <CFormLabel htmlFor="duration">Duration</CFormLabel>
                            <CFormInput type="text" id="duration" name="duration" value={newActivity.duration} onChange={handleChange} required disabled={loading} placeholder="HH:MM - HH:MM" />
                        </div> */}

                        <div className="mb-3">
                            <CFormLabel htmlFor="duration">Duration</CFormLabel>
                            <TimeRangePicker
                                onChange={handleDateTimeRangeChange}
                                value={newActivity.duration}
                                disabled={loading}
                            />
                        </div>


                        <div className="mb-3">
                            <CFormLabel htmlFor="availabilityStatus">Availability Status</CFormLabel>
                            <CFormSelect id="availabilityStatus" name="availabilityStatus" value={newActivity.availabilityStatus} onChange={handleChange} required disabled={loading}>
                                <option value="Available">Available</option>
                                <option value="Unavailable">Unavailable</option>
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="description">Description</CFormLabel>
                            <CFormInput type="text" id="description" name="description" value={newActivity.description} onChange={handleChange} required disabled={loading} />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="image">Image URL</CFormLabel>
                            <ImageUpload setImage={setImage} imageUrl={editingActivity ? editingActivity.image : null} />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="locationCity">Location City</CFormLabel>
                            <CFormInput type="text" id="locationCity" name="locationCity" value={newActivity.locationCity} onChange={handleChange} required disabled={loading} />
                        </div>
                        {/*                         
                        <div className="mb-3">
                            <CFormLabel htmlFor="locationLat">Location Latitude</CFormLabel>
                            <CFormInput type="number" id="locationLat" name="locationLat" value={0} disabled />
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="locationLng">Location Longitude</CFormLabel>
                            <CFormInput type="number" id="locationLng" name="locationLng" value={0} disabled />
                        </div> */}

                        <div className="mb-3">
                            <CFormLabel htmlFor="includes">Includes</CFormLabel>
                            <CFormInput type="text" id="includes" name="includes" value={newActivity.includes} onChange={handleChange} required disabled={loading} />
                        </div>

                        <div className="mb-3">
                            <CFormCheck id="isDeleted" name="isDeleted" checked={newActivity.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />
                        </div>

                        <CModalFooter className="d-flex justify-content-end">
                            <CButton color="primary" type="submit" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : (editingActivity ? 'Save Changes' : 'Add Activity')}
                            </CButton>
                            <CButton color="secondary" onClick={handleClosePopup} disabled={loading}>Cancel</CButton>
                        </CModalFooter>
                    </CForm>
                </CModalBody>
            </CModal>

            <DeleteConfirmation
                visible={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteActivity}
            />
        </CRow>
    );
};

export default Activities;