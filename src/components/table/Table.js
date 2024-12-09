import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CBadge, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput, CFormSelect, CToast, CToastBody, CToastHeader, CToaster, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilUserFollow } from '@coreui/icons';
import { createData, fetchData, updateData, deleteData } from '../../service/service';
import DeleteConfirmation from '../../util/DeleteConfirmation';
import { AvailabilityStatuses } from '../../util/Enum';

const getStatusBadge = (status) => {
    return status === 'Available' ? 'success' : 'danger';
};

const Table = () => {
    const [tables, setTables] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [tableToDelete, setTableToDelete] = useState(null);
    const [newTable, setNewTable] = useState({
        id: 0,
        restaurantId: 0,
        tableSize: 0,
        availabilityStatus: 'Available'
    });
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        fetchTables();
        fetchRestaurants();
    }, [refresh]);

    const fetchTables = async () => {
        setFetching(true);
        fetchData('/Table').then(response => {
            setTables(response);
            setFetching(false);
        }).catch(error => {
            console.error('There was an error fetching the tables!', error);
            setFetching(false);
        });
    };

    const fetchRestaurants = async () => {
        fetchData('/Restaurants').then(response => {
            setRestaurants(response);
        }).catch(error => {
            console.error('There was an error fetching the restaurants!', error);
        });
    };

    const handleAddTable = () => {
        setEditingTable(null);
        setNewTable({
            id: 0,
            restaurantId: 0,
            tableSize: 0,
            availabilityStatus: 'Available'
        });
        setShowPopup(true);
    };

    const handleEditTable = (table) => {
        setEditingTable(table);
        setNewTable(table);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTable(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const tableToSave = {
            ...newTable
        };

        setLoading(false);
        handleClosePopup();

        if (editingTable) {
            updateData(`/Table/${editingTable.id}`, tableToSave).then(() => {
                setRefresh(!refresh);
            });
        } else {
            createData('/Table', tableToSave).then(() => {
                setRefresh(!refresh);
            });
        }
    };

    const handleDeleteTable = (tableId) => {
        setTableToDelete(tableId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteTable = () => {
        deleteData(`/Table/${tableToDelete}`).then(() => {
            setRefresh(!refresh);
            setToasts([...toasts, { type: 'success', message: 'Table deleted successfully!' }]);
            setShowDeleteConfirm(false);
            setTableToDelete(null);
        }).catch(error => {
            setToasts([...toasts, { type: 'danger', message: error.message }]);
            setShowDeleteConfirm(false);
            setTableToDelete(null);
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
                        <CButton color="primary" onClick={handleAddTable}>
                            <CIcon icon={cilUserFollow} /> Add Table
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
                                        <th>Table Size</th>
                                        <th>Status</th>
                                        <th style={{width: '130px'}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tables.map(table => (
                                        <tr key={table.id}>
                                            <td>{table.id}</td>
                                            <td>{restaurants.find(r => r.id === table.restaurantId)?.name || 'Unknown'}</td>
                                            <td>{table.tableSize}</td>
                                            <td>
                                                <CBadge color={getStatusBadge(table.availabilityStatus)}>
                                                    {table.availabilityStatus}
                                                </CBadge>
                                            </td>
                                            <td>
                                                <CButton className='mx-2' color="info" size="sm" onClick={() => handleEditTable(table)}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton color="danger" size="sm" onClick={() => handleDeleteTable(table.id)}>
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
                <CModalHeader closeButton>{editingTable ? 'Edit Table' : 'Add New Table'}</CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="restaurantId">Restaurant</CFormLabel>
                            <CFormSelect id="restaurantId" name="restaurantId" value={newTable.restaurantId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Restaurant</option>
                                {restaurants.map(restaurant => (
                                    <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="tableSize">Table Size</CFormLabel>
                            <CFormInput type="number" id="tableSize" name="tableSize" value={newTable.tableSize} onChange={handleChange} required disabled={loading} />
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="availabilityStatus">Availability Status</CFormLabel>
                            <CFormSelect id="availabilityStatus" name="availabilityStatus" value={newTable.availabilityStatus} onChange={handleChange} required disabled={loading}>
                                {Object.keys(AvailabilityStatuses).map(status => (
                                    <option key={status} value={status}>{AvailabilityStatuses[status]}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        
                        <CModalFooter className="d-flex justify-content-end">
                            <CButton color="primary" type="submit" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : (editingTable ? 'Save Changes' : 'Add Table')}
                            </CButton>
                            <CButton color="secondary" onClick={handleClosePopup} disabled={loading}>Cancel</CButton>
                        </CModalFooter>
                    </CForm>
                </CModalBody>
            </CModal>

            <DeleteConfirmation
                visible={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteTable}
            />
        </CRow>
    );
};

export default Table;