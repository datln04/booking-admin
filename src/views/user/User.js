import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CBadge, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput, CFormSelect, CFormCheck, CToast, CToastBody, CToastHeader, CToaster, CSpinner, CAvatar } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import moment from 'moment';
import { cilDelete, cilPencil, cilTrash, cilUserFollow } from '@coreui/icons';
import './User.scss'; // Import the SCSS file
import { createData, deleteData, fetchData, updateData } from '../../service/service';
import { UserRole } from '../../util/Enum';
import { uploadImage } from '../../util/Util'; // Import the uploadImage function
import ImageUpload from '../../util/ImageUpload';
import DeleteConfirmation from '../../util/DeleteConfirmation';

const getStatusBadge = (isDeleted) => {
    return isDeleted ? 'danger' : 'success';
};

const getStatusText = (isDeleted) => {
    return isDeleted ? 'Deleted' : 'Active';
};

const User = () => {
    const [users, setUsers] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [newUser, setNewUser] = useState({
        userId: 0,
        username: '',
        passwordHash: '',
        email: '',
        fullName: '',
        role: UserRole.ADMINISTRATOR,
        image: '',
        isDeleted: false,
        createdDate: null,
        lastLoginDate: null
    });
    const [image, setImage] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [refresh]);

    const fetchUsers = async () => {
        setFetching(true);
        fetchData('/Users').then(response => {
            setUsers(response);
            setFetching(false);
        })
        .catch(error => {
            console.error('There was an error fetching the users!', error);
            setFetching(false);
        });
    };

    const handleAddUser = () => {
        setEditingUser(null);
        setNewUser({
            userId: 0,
            username: '',
            passwordHash: '',
            email: '',
            fullName: '',
            role: UserRole.ADMINISTRATOR,
            image: '',
            isDeleted: false,
            createdDate: null,
            lastLoginDate: null
        });
        setShowPopup(true);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setNewUser(user);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewUser(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const currentDate = new Date().toISOString();
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

        const userToSave = {
            ...newUser,
            image: imageUrl || newUser.image,
            createdDate: editingUser ? newUser.createdDate : currentDate,
            lastLoginDate: currentDate
        };

        setLoading(false);
        handleClosePopup();

        if (editingUser) {
            updateData(`/Users/${editingUser.id}`, userToSave).then(() => {
                setRefresh(!refresh);
            });
        } else {
            createData('/Users', userToSave).then(() => {
                setRefresh(!refresh);
            });
        }
    };

    const handleDeleteUser = (userId) => {
        setUserToDelete(userId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteUser = () => {
        deleteData(`/Users/${userToDelete}`).then(() => {
            setRefresh(!refresh);
            setToasts([...toasts, { type: 'success', message: 'User deleted successfully!' }]);
            setShowDeleteConfirm(false);
            setUserToDelete(null);
        }).catch(error => {
            setToasts([...toasts, { type: 'danger', message: error.message }]);
            setShowDeleteConfirm(false);
            setUserToDelete(null);
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
                        <CButton color="primary" onClick={handleAddUser}>
                            <CIcon icon={cilUserFollow} /> Add User
                        </CButton>
                    </CCardHeader>
                    <CCardBody>
                        {fetching ? (
                            <div className="text-center">
                                <CSpinner color="primary" />
                            </div>
                        ) : (
                            <table className="table table-hover table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>User ID</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Full Name</th>
                                        <th>Role</th>
                                        <th>Created Date</th>
                                        <th>Last Login Date</th>
                                        <th>Status</th>
                                        <th style={{ width: '130px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td>
                                                <CAvatar size="md" src={user.image} />
                                            </td>
                                            <td>{user.id}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{user.fullName}</td>
                                            <td>{user.role}</td>
                                            <td>{moment(user.createdDate).format('YYYY-MM-DD HH:mm:ss')}</td>
                                            <td>{moment(user.lastLoginDate).format('YYYY-MM-DD HH:mm:ss')}</td>
                                            <td>
                                                <CBadge color={getStatusBadge(user.isDeleted)}>
                                                    {getStatusText(user.isDeleted)}
                                                </CBadge>
                                            </td>
                                            <td>
                                                <CButton className='button' color="info" size="sm" onClick={() => handleEditUser(user)}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton color="danger" size="sm" onClick={() => handleDeleteUser(user.id)}>
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
                <CModalHeader closeButton>{editingUser ? 'Edit User' : 'Add New User'}</CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSubmit}>
                        <CFormLabel htmlFor="username">Username</CFormLabel>
                        <CFormInput type="text" id="username" name="username" value={newUser.username} onChange={handleChange} required disabled={loading} />

                        <CFormLabel htmlFor="passwordHash">Password</CFormLabel>
                        <CFormInput type="password" id="passwordHash" name="passwordHash" value={newUser.passwordHash} onChange={handleChange} required disabled={loading} />

                        <CFormLabel htmlFor="email">Email</CFormLabel>
                        <CFormInput type="email" id="email" name="email" value={newUser.email} onChange={handleChange} required disabled={loading} />

                        <CFormLabel htmlFor="fullName">Full Name</CFormLabel>
                        <CFormInput type="text" id="fullName" name="fullName" value={newUser.fullName} onChange={handleChange} required disabled={loading} />

                        <CFormLabel htmlFor="role">Role</CFormLabel>
                        <CFormSelect id="role" name="role" value={newUser.role} onChange={handleChange} disabled={loading}>
                            {Object.values(UserRole).map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </CFormSelect>

                        <CFormLabel htmlFor="image">Image URL</CFormLabel>
                        <ImageUpload setImage={setImage} imageUrl={editingUser ? editingUser.image : null} />

                        <CFormCheck id="isDeleted" name="isDeleted" checked={newUser.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />

                        <CModalFooter>
                            <CButton color="primary" type="submit" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : (editingUser ? 'Save Changes' : 'Add User')}
                            </CButton>
                            <CButton color="secondary" onClick={handleClosePopup} disabled={loading}>Cancel</CButton>
                        </CModalFooter>
                    </CForm>
                </CModalBody>
            </CModal>

            <CModal visible={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
                <CModalHeader closeButton>Confirm Delete</CModalHeader>
                <CModalBody>
                    Are you sure you want to delete this user?
                </CModalBody>
                <CModalFooter>
                    <CButton color="danger" onClick={confirmDeleteUser}>Delete</CButton>
                    <CButton color="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</CButton>
                </CModalFooter>
            </CModal>

            <DeleteConfirmation
                visible={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteUser}
            />
        </CRow>
    );
};

export default User;