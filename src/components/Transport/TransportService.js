import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CBadge, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput, CFormCheck, CFormSelect, CToast, CToastBody, CToastHeader, CToaster, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCarAlt, cilPencil, cilTrash } from '@coreui/icons';
import { createData, fetchData, updateData, deleteData, fetchFilteredData } from '../../service/service';
import DeleteConfirmation from '../../util/DeleteConfirmation';
import {UserRole, VehicleData, FuelTypes, Transmissions, AvailabilityStatuses } from '../../util/Enum';

const getStatusBadge = (isDeleted) => {
    return isDeleted ? 'danger' : 'success';
};

const getStatusText = (isDeleted) => {
    return isDeleted ? 'Deleted' : 'Active';
};

const TransportService = () => {
    const [services, setServices] = useState([]);
    const [users, setUsers] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [newService, setNewService] = useState({
        id: 0,
        ownerId: 0,
        make: '',
        model: '',
        year: 0,
        color: '',
        fuelType: '',
        transmission: '',
        seatingCapacity: 0,
        rentalPricePerDay: 0,
        availabilityStatus: '',
        mileage: 0,
        location: '',
        licensePlate: '',
        isDeleted: false
    });
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        fetchServices();
        fetchUsers();
    }, [refresh]);

    const fetchServices = async () => {
        setFetching(true);
        const filter = {
            filters: [],
            includes: ["Owner"],
            logic: "string",
            pageSize: 0,
            pageNumber: 0,
            all: true
        };
        fetchFilteredData('/TransportServices', filter).then(response => {
            setServices(response);
            setFetching(false);
        })
        .catch(error => {
            console.error('There was an error fetching the services!', error);
            setFetching(false);
        });
    };

    const fetchUsers = async () => {
        const filter = {
            filters: [{
                field: "Role",
                operator: "Equal",
                value: UserRole.TRANSPORT_SERVICE_MANAGER.toString()
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

    const handleAddService = () => {
        setEditingService(null);
        setNewService({
            id: 0,
            ownerId: 0,
            make: '',
            model: '',
            year: 0,
            color: '',
            fuelType: '',
            transmission: '',
            seatingCapacity: 0,
            rentalPricePerDay: 0,
            availabilityStatus: '',
            mileage: 0,
            location: '',
            licensePlate: '',
            isDeleted: false
        });
        setShowPopup(true);
    };

    const handleEditService = (service) => {
        setEditingService(service);
        setNewService(service);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewService(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const serviceToSave = {
            ...newService
        };

        setLoading(false);
        handleClosePopup();

        if (editingService) {
            updateData(`/TransportServices/${editingService.id}`, serviceToSave).then(() => {
                setRefresh(!refresh);
            });
        } else {
            createData('/TransportServices', serviceToSave).then(() => {
                setRefresh(!refresh);
            });
        }
    };

    const handleDeleteService = (serviceId) => {
        setServiceToDelete(serviceId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteService = () => {
        deleteData(`/TransportServices/${serviceToDelete}`).then(() => {
            setRefresh(!refresh);
            setToasts([...toasts, { type: 'success', message: 'Transport service deleted successfully!' }]);
            setShowDeleteConfirm(false);
            setServiceToDelete(null);
        }).catch(error => {
            setToasts([...toasts, { type: 'danger', message: error.message }]);
            setShowDeleteConfirm(false);
            setServiceToDelete(null);
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
                        <CButton color="primary" onClick={handleAddService}>
                            <CIcon icon={cilCarAlt} /> Add Transport Service
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
                                            <th>Owner</th>
                                            <th>Make</th>
                                            <th>Model</th>
                                            <th>Year</th>
                                            <th>Color</th>
                                            <th>Fuel Type</th>
                                            <th>Transmission</th>
                                            <th>Seating Capacity</th>
                                            <th>Rental Price Per Day</th>
                                            <th>Availability Status</th>
                                            <th>Mileage</th>
                                            <th>Location</th>
                                            <th>License Plate</th>
                                            <th>Status</th>
                                            <th style={{ width: '130px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {services.map(service => (
                                            <tr key={service.id}>
                                                <td>{service.id}</td>
                                                <td>{users.find(u => u.id === service.ownerId)?.username || 'Unknown'}</td>
                                                <td>{service.make}</td>
                                                <td>{service.model}</td>
                                                <td>{service.year}</td>
                                                <td>{service.color}</td>
                                                <td>{service.fuelType}</td>
                                                <td>{service.transmission}</td>
                                                <td>{service.seatingCapacity}</td>
                                                <td>{service.rentalPricePerDay}</td>
                                                <td>{service.availabilityStatus}</td>
                                                <td>{service.mileage}</td>
                                                <td>{service.location}</td>
                                                <td>{service.licensePlate}</td>
                                                <td>
                                                    <CBadge color={getStatusBadge(service.isDeleted)}>
                                                        {getStatusText(service.isDeleted)}
                                                    </CBadge>
                                                </td>
                                                <td>
                                                    <CButton className='mx-2' color="info" size="sm" onClick={() => handleEditService(service)}>
                                                        <CIcon icon={cilPencil} />
                                                    </CButton>
                                                    <CButton color="danger" size="sm" onClick={() => handleDeleteService(service.id)}>
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
                <CModalHeader closeButton>{editingService ? 'Edit Transport Service' : 'Add New Transport Service'}</CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="ownerId">Owner</CFormLabel>
                            <CFormSelect id="ownerId" name="ownerId" value={newService.ownerId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Owner</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.username}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="make">Make</CFormLabel>
                            <CFormSelect id="make" name="make" value={newService.make} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Make</option>
                                {VehicleData.map(vehicle => (
                                    <option key={vehicle.make} value={vehicle.make}>{vehicle.make}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="model">Model</CFormLabel>
                            <CFormSelect id="model" name="model" value={newService.model} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Model</option>
                                {VehicleData.find(vehicle => vehicle.make === newService.make)?.models.map(model => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="year">Year</CFormLabel>
                            <CFormInput type="number" id="year" name="year" value={newService.year} onChange={handleChange} required disabled={loading} />
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="color">Color</CFormLabel>
                            <CFormInput type="text" id="color" name="color" value={newService.color} onChange={handleChange} required disabled={loading} />
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="fuelType">Fuel Type</CFormLabel>
                            <CFormSelect id="fuelType" name="fuelType" value={newService.fuelType} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Fuel Type</option>
                                {Object.values(FuelTypes).map(fuelType => (
                                    <option key={fuelType} value={fuelType}>{fuelType}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="transmission">Transmission</CFormLabel>
                            <CFormSelect id="transmission" name="transmission" value={newService.transmission} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Transmission</option>
                                {Object.values(Transmissions).map(transmission => (
                                    <option key={transmission} value={transmission}>{transmission}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="seatingCapacity">Seating Capacity</CFormLabel>
                            <CFormInput type="number" id="seatingCapacity" name="seatingCapacity" value={newService.seatingCapacity} onChange={handleChange} required disabled={loading} />
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="rentalPricePerDay">Rental Price Per Day</CFormLabel>
                            <CFormInput type="number" id="rentalPricePerDay" name="rentalPricePerDay" value={newService.rentalPricePerDay} onChange={handleChange} required disabled={loading} />
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="availabilityStatus">Availability Status</CFormLabel>
                            <CFormSelect id="availabilityStatus" name="availabilityStatus" value={newService.availabilityStatus} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Availability Status</option>
                                {Object.values(AvailabilityStatuses).map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="mileage">Mileage</CFormLabel>
                            <CFormInput type="number" id="mileage" name="mileage" value={newService.mileage} onChange={handleChange} required disabled={loading} />
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="location">Location</CFormLabel>
                            <CFormInput type="text" id="location" name="location" value={newService.location} onChange={handleChange} required disabled={loading} />
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="licensePlate">License Plate</CFormLabel>
                            <CFormInput type="text" id="licensePlate" name="licensePlate" value={newService.licensePlate} onChange={handleChange} required disabled={loading} />
                        </div>
                        
                        <div className="mb-3">
                            <CFormCheck id="isDeleted" name="isDeleted" checked={newService.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />
                        </div>
                        
                        <CModalFooter className="d-flex justify-content-end">
                            <CButton color="primary" type="submit" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : (editingService ? 'Save Changes' : 'Add Transport Service')}
                            </CButton>
                            <CButton color="secondary" onClick={handleClosePopup} disabled={loading}>Cancel</CButton>
                        </CModalFooter>
                    </CForm>
                </CModalBody>
            </CModal>

            <DeleteConfirmation
                visible={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteService}
            />
        </CRow>
    );
};

export default TransportService;