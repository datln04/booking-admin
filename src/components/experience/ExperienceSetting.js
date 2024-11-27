import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CBadge, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormCheck, CFormSelect, CToast, CToastBody, CToastHeader, CToaster, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilUserFollow } from '@coreui/icons';
import Select from 'react-select';
import { createData, fetchData, updateData, deleteData } from '../../service/service';
import DeleteConfirmation from '../../util/DeleteConfirmation';

const getStatusBadge = (isDeleted) => {
    return isDeleted ? 'danger' : 'success';
};

const getStatusText = (isDeleted) => {
    return isDeleted ? 'Deleted' : 'Active';
};

const ExperienceSetting = () => {
    const [activities, setActivities] = useState([]);
    const [restrictions, setRestrictions] = useState([]);
    const [additionalInfo, setAdditionalInfo] = useState([]);
    const [experienceSettings, setExperienceSettings] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingSetting, setEditingSetting] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [settingToDelete, setSettingToDelete] = useState(null);
    const [newSetting, setNewSetting] = useState({
        id: 0,
        activityId: '',
        restrictionIds: [],
        additionalIds: [],
        isDeleted: false
    });
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        fetchActivities();
        fetchRestrictions();
        fetchAdditionalInfo();
        fetchExperienceSettings();
    }, [refresh]);

    const fetchActivities = async () => {
        fetchData('/LeisureActivities').then(response => {
            setActivities(response);
        })
            .catch(error => {
                console.error('There was an error fetching the activities!', error);
            });
    };

    const fetchRestrictions = async () => {
        fetchData('/ActivityRestrictions').then(response => {
            setRestrictions(response);
        })
            .catch(error => {
                console.error('There was an error fetching the restrictions!', error);
            });
    };

    const fetchAdditionalInfo = async () => {
        fetchData('/AdditionalInfo').then(response => {
            setAdditionalInfo(response);
        })
            .catch(error => {
                console.error('There was an error fetching the additional information!', error);
            });
    };

    const fetchExperienceSettings = async () => {
        setFetching(true);
        fetchData('/LeisureActivities').then(response => {
            setExperienceSettings(response);
            setFetching(false);
        })
            .catch(error => {
                console.error('There was an error fetching the experience settings!', error);
                setFetching(false);
            });
    };

    const handleAddSetting = () => {
        setEditingSetting(null);
        setNewSetting({
            id: 0,
            activityId: '',
            restrictionIds: [],
            additionalIds: [],
            isDeleted: false
        });
        setShowPopup(true);
    };

    const handleEditSetting = (setting) => {
        setEditingSetting(setting);
        setNewSetting({
            id: setting.id,
            activityId: setting.activityId,
            restrictionIds: setting.restrictionIds,
            additionalIds: setting.additionalIds,
            isDeleted: setting.isDeleted
        });
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewSetting(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRestrictionChange = (selectedOptions) => {
        const selectedRestrictions = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setNewSetting(prevState => ({
            ...prevState,
            restrictionIds: selectedRestrictions
        }));
    };

    const handleAdditionalChange = (selectedOptions) => {
        const selectedAdditional = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setNewSetting(prevState => ({
            ...prevState,
            additionalIds: selectedAdditional
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const settingToSave = {
            ...newSetting
        };

        setLoading(false);
        handleClosePopup();

        if (editingSetting) {
            updateData(`/ExperienceSettings/${editingSetting.id}`, settingToSave).then(() => {
                setRefresh(!refresh);
            });
        } else {
            createData('/ExperienceSettings', settingToSave).then(() => {
                setRefresh(!refresh);
            });
        }
    };

    const handleDeleteSetting = (settingId) => {
        setSettingToDelete(settingId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteSetting = () => {
        deleteData(`/ExperienceSettings/${settingToDelete}`).then(() => {
            setRefresh(!refresh);
            setToasts([...toasts, { type: 'success', message: 'Setting deleted successfully!' }]);
            setShowDeleteConfirm(false);
            setSettingToDelete(null);
        }).catch(error => {
            setToasts([...toasts, { type: 'danger', message: error.message }]);
            setShowDeleteConfirm(false);
            setSettingToDelete(null);
        });
    };

    const restrictionOptions = restrictions.map(restriction => ({
        value: restriction.id,
        label: restriction.name
    }));

    const additionalOptions = additionalInfo.map(info => ({
        value: info.id,
        label: info.name
    }));

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
                        <CButton color="primary" onClick={handleAddSetting}>
                            <CIcon icon={cilUserFollow} /> Add Setting
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
                                        <th>Activity</th>
                                        <th>Restrictions</th>
                                        <th>Additional Info</th>
                                        <th>Status</th>
                                        <th style={{width: '130px'}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {experienceSettings.map(setting => (
                                        <tr key={setting.id}>
                                            <td>{setting.id}</td>
                                            <td>{activities.find(a => a.id === setting.activityId)?.name}</td>
                                            <td>{setting?.restrictionIds?.map(id => restrictions.find(r => r.id === id)?.name).join(', ')}</td>
                                            <td>{setting?.additionalIds?.map(id => additionalInfo.find(a => a.id === id)?.name).join(', ')}</td>
                                            <td>
                                                <CBadge color={getStatusBadge(setting.isDeleted)}>
                                                    {getStatusText(setting.isDeleted)}
                                                </CBadge>
                                            </td>
                                            <td>
                                                <CButton className='mx-2' color="info" size="sm" onClick={() => handleEditSetting(setting)}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton color="danger" size="sm" onClick={() => handleDeleteSetting(setting.id)}>
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
                <CModalHeader closeButton>{editingSetting ? 'Edit Setting' : 'Add New Setting'}</CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="activityId">Activity</CFormLabel>
                            <CFormSelect id="activityId" name="activityId" value={newSetting.activityId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Activity</option>
                                {activities.map(activity => (
                                    <option key={activity.id} value={activity.id}>{activity.activityName}</option>
                                ))}
                            </CFormSelect>
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="restrictionIds">Restrictions</CFormLabel>
                            <Select
                                id="restrictionIds"
                                name="restrictionIds"
                                isMulti
                                options={restrictionOptions}
                                value={restrictionOptions.filter(option => newSetting.restrictionIds.includes(option.value))}
                                onChange={handleRestrictionChange}
                                isDisabled={loading}
                            />
                        </div>
                        
                        <div className="mb-3">
                            <CFormLabel htmlFor="additionalIds">Additional Info</CFormLabel>
                            <Select
                                id="additionalIds"
                                name="additionalIds"
                                isMulti
                                options={additionalOptions}
                                value={additionalOptions.filter(option => newSetting.additionalIds.includes(option.value))}
                                onChange={handleAdditionalChange}
                                isDisabled={loading}
                            />
                        </div>
                        
                        <div className="mb-3">
                            <CFormCheck id="isDeleted" name="isDeleted" checked={newSetting.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />
                        </div>
                        
                        <CModalFooter className="d-flex justify-content-end">
                            <CButton color="primary" type="submit" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : (editingSetting ? 'Save Changes' : 'Add Setting')}
                            </CButton>
                            <CButton color="secondary" onClick={handleClosePopup} disabled={loading}>Cancel</CButton>
                        </CModalFooter>
                    </CForm>
                </CModalBody>
            </CModal>

            <DeleteConfirmation
                visible={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteSetting}
            />
        </CRow>
    );
};

export default ExperienceSetting;