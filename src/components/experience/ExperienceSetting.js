import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CBadge, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormLabel, CFormCheck, CFormSelect, CToast, CToastBody, CToastHeader, CToaster, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilSettings, cilTrash, cilUserFollow } from '@coreui/icons';
import Select from 'react-select';
import { createData, fetchData, updateData, deleteData, fetchFilteredDataWithoutFilter } from '../../service/service';
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
    const [additionalInfor, setAdditionalInfo] = useState([]);
    const [activityAdditonalInfor, setActivitiesAdditionalInfor] = useState([]);
    const [activityRestrictionInfor, setActivityRestrictionInfor] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingSetting, setEditingSetting] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [settingToDelete, setSettingToDelete] = useState(null);
    const [newSetting, setNewSetting] = useState({
        addtionalId: 0,
        restrictionId: 0,
        activityId: '',
        restrictionIds: [],
        additionalIds: [],
        isDeleted: false
    });
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [allActivities, setAllActivities] = useState([]);

    useEffect(() => {
        fetchActivities();
        fetchRestrictions();
        fetchExperienceSettings();
        fetchFilterActivities();
        fetchAdditionalInfo();
    }, [refresh]);

    const fetchActivities = async () => {
        fetchData('/LeisureActivities').then(response => {
            setActivities(response);
        })
            .catch(error => {
                console.error('There was an error fetching the activities!', error);
            });
    };

    const fetchFilterActivities = async () => {
        const filter = {
            filters: [],
            includes: [],
            logic: "string",
            pageSize: 0,
            pageNumber: 0,
            all: true
        };
        fetchFilteredDataWithoutFilter('/LeisureActivities/GetFilteredActivities', filter).then(response => {
            setAllActivities(response);
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
                console.error('There was an error fetching the restrictions!', error);
            });
    };

    const fetchExperienceSettings = async () => {
        setFetching(true);
        fetchData('/LeisureActivitiesAdditionalInfo').then(response => {
            setActivitiesAdditionalInfor(response);

        })
            .catch(error => {
                console.error('There was an error fetching the experience settings!', error);
                setFetching(false);
            });

        fetchData('/LeisureActivitiesRestriction').then(response => {
            setActivityRestrictionInfor(response);
        })
            .catch(error => {
                console.error('There was an error fetching the experience settings!', error);
                setFetching(false);
            });
        setFetching(false);
    };

    const handleAddSetting = () => {
        setEditingSetting(null);
        setNewSetting({
            addtionalId: 0,
            restrictionId: 0,
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
            addtionalId: setting?.additionalId,
            restrictionId: setting?.restrictionId,
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
        const selectedAdditionals = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setNewSetting(prevState => ({
            ...prevState,
            additionalIds: selectedAdditionals
        }));
    };

    // const handleUpdateRestriction = async () => {
    //     if (newSetting?.restrictionIds?.length > editingSetting?.restrictionIds?.length) {
    //         const restrictionToAdd = newSetting?.restrictionIds.filter(a => !editingSetting?.restrictionIds.includes(a));
    //         return restrictionPromises = restrictionToAdd.map(restrictionId => {
    //             const restrictionToSave = {
    //                 id: 0,
    //                 activityId: editingSetting.activityId,
    //                 infoId: restrictionId,
    //                 isDeleted: editingSetting.isDeleted
    //             };
    //             return createData('/LeisureActivitiesRestriction', restrictionToSave);
    //         });
    //     } else if (newSetting?.restrictionIds?.length < editingSetting?.restrictionIds?.length) {
    //         const restrictionToRemove = editingSetting?.restrictionIds.filter(a => !newSetting?.restrictionIds.includes(a));
    //         return restrictionPromises = restrictionToRemove?.map(restrictionId => {

    //             return deleteData(`/LeisureActivitiesRestriction/DeleteByActivityAndRestriction?activityId=${editingSetting?.activityId}&restrictionId=${restrictionId}`).then(() => {
    //                 setRefresh(!refresh);
    //                 setToasts([...toasts, { type: 'success', message: 'Amenity updated successfully!' }]);
    //             }).catch(error => {
    //                 setToasts([...toasts, { type: 'danger', message: error.message }]);
    //             });
    //         });
    //     }
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (editingSetting) {
            // Update existing setting
            if (newSetting?.additionalIds?.length > editingSetting?.additionalIds?.length) {
                const additionalInformationToAdd = newSetting?.additionalIds.filter(a => !editingSetting?.additionalIds.includes(a));
                const additionalPromises = additionalInformationToAdd.map(additionalId => {
                    const additionalToSave = {
                        id: 0,
                        activityId: editingSetting.activityId,
                        infoId: additionalId,
                        isDeleted: editingSetting.isDeleted
                    };
                    return createData('/LeisureActivitiesAdditionalInfo', additionalToSave);
                });

                try {
                    await Promise.all(additionalPromises);
                    setToasts([...toasts, { type: 'success', message: 'Amenity updated successfully!' }]);
                    // setRefresh(!refresh);
                } catch (error) {
                    setToasts([...toasts, { type: 'danger', message: error.message }]);
                } finally {
                }
            } else if (newSetting?.additionalIds?.length < editingSetting?.additionalIds?.length) {
                const additionalToRemove = editingSetting?.additionalIds.filter(a => !newSetting?.additionalIds.includes(a));
                const additionalPromises = additionalToRemove?.map(additionalId => {

                    return deleteData(`/LeisureActivitiesAdditionalInfo/DeleteByActivityAndInfo?activityId=${editingSetting?.activityId}&infoId=${additionalId}`).then(() => {
                        setRefresh(!refresh);
                        setToasts([...toasts, { type: 'success', message: 'Amenity updated successfully!' }]);
                    }).catch(error => {
                        setToasts([...toasts, { type: 'danger', message: error.message }]);
                    });
                });

                try {
                    await Promise.all(additionalPromises);
                    setToasts([...toasts, { type: 'success', message: 'Amenity updated successfully!' }]);
                    // setRefresh(!refresh);
                } catch (error) {
                    setToasts([...toasts, { type: 'danger', message: error.message }]);
                } finally {
                    // setLoading(false);
                    // handleClosePopup();
                    // setNewAmenity(null);
                    // setEditingAmenity(null);
                }
            }

            if (newSetting?.restrictionIds?.length > editingSetting?.restrictionIds?.length) {
                const restrictionToAdd = newSetting?.restrictionIds.filter(a => !editingSetting?.restrictionIds.includes(a));
                const restrictionPromises = restrictionToAdd.map(restrictionId => {
                    const restrictionToSave = {
                        id: 0,
                        activityId: editingSetting.activityId,
                        restrictionId: restrictionId,
                        isDeleted: editingSetting.isDeleted
                    };
                    return createData('/LeisureActivitiesRestriction', restrictionToSave);
                    
                });
                try {
                    await Promise.all(restrictionPromises);
                    setToasts([...toasts, { type: 'success', message: 'Amenity updated successfully!' }]);
                    // setRefresh(!refresh);
                } catch (error) {
                    setToasts([...toasts, { type: 'danger', message: error.message }]);
                } finally {
                }
            } else if (newSetting?.restrictionIds?.length < editingSetting?.restrictionIds?.length) {
                const restrictionToRemove = editingSetting?.restrictionIds.filter(a => !newSetting?.restrictionIds.includes(a));
                const restrictionPromises = restrictionToRemove?.map(restrictionId => {
    
                    return deleteData(`/LeisureActivitiesRestriction/DeleteByActivityAndRestriction?activityId=${editingSetting?.activityId}&restrictionId=${restrictionId}`).then(() => {
                        setRefresh(!refresh);
                        setToasts([...toasts, { type: 'success', message: 'leisure activity updated successfully!' }]);
                    }).catch(error => {
                        setToasts([...toasts, { type: 'danger', message: error.message }]);
                    });
                });
                try {
                    await Promise.all(restrictionPromises);
                    setToasts([...toasts, { type: 'success', message: 'leisure activity updated successfully!' }]);
                    // setRefresh(!refresh);
                } catch (error) {
                    setToasts([...toasts, { type: 'danger', message: error.message }]);
                } finally {
                }
            }
            setLoading(false);
            handleClosePopup();
            setNewSetting(null);
            setEditingSetting(null);
            setRefresh(!refresh);
        }else {
            const additionalPromise = newSetting.additionalIds.map(id => {
                const additionalToSave = {
                    id: 0,
                    activityId: newSetting?.activityId,
                    infoId: id,
                    isDeleted: newSetting?.isDeleted
                };
                return createData('/LeisureActivitiesAdditionalInfo', additionalToSave);
            });

            const restrictionPromise = newSetting.restrictionIds.map(id => {
                const restrictionToSave = {
                    id: 0,
                    activityId: newSetting?.activityId,
                    restrictionId: id,
                    isDeleted: newSetting?.isDeleted
                };
                return createData('/LeisureActivitiesRestriction', restrictionToSave);
            });

            try {
                await Promise.all([...additionalPromise, ...restrictionPromise]);
                setToasts([...toasts, { type: 'success', message: 'Setting created successfully!' }]);
                setRefresh(!refresh);
            } catch (error) {
                setToasts([...toasts, { type: 'danger', message: error.message }]);
            } finally {
                setLoading(false);
                handleClosePopup();
            }
        }
    };

    const handleDeleteSetting = (setting) => {
        setSettingToDelete(setting);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteSetting = async () => {
        if(settingToDelete?.additionalIds?.length > 0 && settingToDelete?.restrictionIds?.length > 0) {
            const additionalDeleted = settingToDelete?.additionalIds?.map(additionalId => {
                return deleteData(`/LeisureActivitiesAdditionalInfo/${additionalId}`).then(() => {
                    setRefresh(!refresh);
                    setToasts([...toasts, { type: 'success', message: 'Leisure activity deleted successfully!' }]);

                }).catch(error => {
                    setToasts([...toasts, { type: 'danger', message: error.message }]);
                });
            });

            const restrictionDeleted = settingToDelete?.restrictionIds?.map(restrictionId => {
                return deleteData(`/LeisureActivitiesRestriction/${restrictionId}`).then(() => {
                    setRefresh(!refresh);
                    setToasts([...toasts, { type: 'success', message: 'Leisure activity deleted successfully!' }]);

                }).catch(error => {
                    setToasts([...toasts, { type: 'danger', message: error.message }]);
                });
            });

            try {
                await Promise.all([...additionalDeleted, ...restrictionDeleted]);
                setToasts([...toasts, { type: 'success', message: 'Dietary deleted successfully!' }]);
                setRefresh(!refresh);
            } catch (error) {
                setToasts([...toasts, { type: 'danger', message: error.message }]);
            } finally {
                setLoading(false);
                handleClosePopup();
                setShowDeleteConfirm(false);
                setSettingToDelete(null);
            }
        }
    };

    const restrictionOptions = restrictions.map(restriction => ({
        value: restriction.id,
        label: restriction.name
    }));

    const additionalOptions = additionalInfor.map(additional => ({
        value: additional.id,
        label: additional.name
    }));

    // Group additional and restriction information by activity    
    const groupedSettings = activities.reduce((acc, activity) => {
        const additionalInfors = activityAdditonalInfor
            .filter(adn => adn.activityId === activity.id)
            .map(adn => ({
                id: adn.id,
                additionalInfor: additionalInfor.find(d => d.id === adn.infoId)
            }));

        const restrictionInfors = activityRestrictionInfor
            .filter(res => res.activityId === activity.id)
            .map(res => ({
                id: res.id,
                restrictionInfor: restrictions.find(d => d.id === res.restrictionId)
            }));

        if (additionalInfors.length > 0 || restrictionInfors.length > 0) {
            acc[activity.id] = {
                activity,
                additionalInfors,
                restrictionInfors
            };
        }

        return acc;
    }, {});
console.log(groupedSettings);

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
                            <CIcon icon={cilSettings} /> Add Setting
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
                                        <th>Additionals</th>
                                        <th>Status</th>
                                        <th style={{ width: '130px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(groupedSettings).map(({ activity, additionalInfors, restrictionInfors }) => (
                                        <tr key={activity.id}>
                                            <td>{activity.id}</td>
                                            <td>{activity.activityName}</td>
                                            <td>{additionalInfors.map(a => a.additionalInfor?.name).join(', ')}</td>
                                            <td>{restrictionInfors.map(r => r.restrictionInfor?.name).join(', ')}</td>
                                            <td>
                                                <CBadge color={getStatusBadge(activity.isDeleted)}>
                                                    {getStatusText(activity.isDeleted)}
                                                </CBadge>
                                            </td>
                                            <td>
                                                <CButton className="mx-2" color="info" size="sm" onClick={() => handleEditSetting({ additionalId: additionalInfors.map(a => a.id), restrictionId: restrictionInfors.map(d => d?.id), activityId: activity.id, additionalIds: additionalInfors?.map(d => d?.additionalInfor?.id), restrictionIds: restrictionInfors?.map(d => d?.restrictionInfor?.id), isDeleted: activity.isDeleted })}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton color="danger" size="sm" onClick={() => handleDeleteSetting({additionalIds: additionalInfors?.map(d => d.id), restrictionIds: restrictionInfors?.map(d => d.id)})}>
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
                            <CFormSelect id="activityId" name="activityId" value={newSetting?.activityId} onChange={handleChange} required disabled={loading}>
                                <option value="">Select Activity</option>
                                {activities?.map(activity => (
                                    <option key={activity.id} value={activity.id}>{activity.activityName}</option>
                                ))}
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="restrictionIds">Restrictions</CFormLabel>
                            <Select
                                id="restrictionIds"
                                name="restrictionIds"
                                required
                                isMulti
                                options={restrictionOptions}
                                value={restrictionOptions.filter(option => newSetting?.restrictionIds?.includes(option.value))}
                                onChange={handleRestrictionChange}
                                isDisabled={loading}
                            />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="additionalIds">Additionals</CFormLabel>
                            <Select
                                id="additionalIds"
                                name="additionalIds"
                                required
                                isMulti
                                options={additionalOptions}
                                value={additionalOptions.filter(option => newSetting?.additionalIds?.includes(option.value))}
                                onChange={handleAdditionalChange}
                                isDisabled={loading}
                            />
                        </div>

                        <div className="mb-3">
                            <CFormCheck id="isDeleted" name="isDeleted" checked={newSetting?.isDeleted} onChange={handleChange} label="Is Deleted" disabled={loading} />
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