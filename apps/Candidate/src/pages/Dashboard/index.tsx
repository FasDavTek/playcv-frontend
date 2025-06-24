import React, { useEffect, useState } from 'react';

// import * as Assets from '@video-cv/assets';
import { Button, DashboardCard } from '@video-cv/ui-components';

import ProfileVisitsChart from '../../components/dashboard/PatientActivityChart';
import JobVacancyChart from '../../components/dashboard/MonthlyRevenueChart';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@mui/material';
import CreateVideoConfirmationModal from '../VideoManagement/modals/CreateVideoConfirmationModal';
import { getData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
// import queries from '../../services/queries/dashboard';
import { useAuth } from './../../../../../libs/context/AuthContext';
import { SESSION_STORAGE_KEYS } from './../../../../../libs/utils/sessionStorage';


interface Account {
  id: string;
  name: string;
  email: string;
  avatar: string;
  userType: string;
}

type ModalTypes = null | 'uploadModal' | 'confirmationModal' | 'paymentModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  
  const currentUser = authState.user;

  if (!currentUser) {
    return null;
  };

  const currentAccount: Account = {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email || '',
    avatar: '/path/to/default/avatar.png',
    userType: currentUser.userTypeId === 1 ? 'Admin' : currentUser.userTypeId === 2 ? 'Employer' : 'Professional'
  };
  // const { useGetDashboardSummary } = queries;
  // const { isLoading, data: DashboardSummary } = useGetDashboardSummary(
  //   `/dashboard-manager/superadmin/cards`
  // );
  const queryParams = new URLSearchParams(location.search);
  const [openModal, setOpenModal] = useState<ModalTypes>(null);
  // const [show404, setShow404] = useState(false);

  const closeModal = () => setOpenModal(null);
  const openSetModalFn = (modalType: ModalTypes) => setOpenModal(modalType);

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);

  // useEffect(() => {
  //   if (sessionStorage.getItem('show404') === 'true') {
  //     navigate('/Home', { replace: true });
  //     return;
  //   }
    
  //   const timeoutId = setTimeout(() => {
  //     setShow404(true);
  //     sessionStorage.setItem('show404', 'true');
  //   }, 604800000);
  //   return () => clearTimeout(timeoutId);
  // }, [navigate]);

  const checkPaymentStatus = async () => {
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_STATUS}?Page=1&Limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 'success' && response.hasValidUpploadRequest === true) {
        toast.info('You have an existing payment for video upload that you have not yet completed.');
        navigate('/candidate/video-management/upload', {
          state: {
            uploadTypeId: response.uploadRequest.uploadTypeId,
            uploadTypeName: response.uploadRequest.uploadType,
            uploadRequestId: response.uploadRequest.id,
            paymentDate: response.uploadRequest.paymentDate,
            duration: response.uploadRequest.duration
          }
        });
      }
      else {
        openSetModalFn('confirmationModal');
      }
    } 
    catch (error) {
      if(!token) {
        toast.error('Your session has expired. Please log in again');
        navigate('/');
      }
      else {
        console.error('Error checking payment status:', error);
        toast.warning('There was an error checking your payment status. Please try again later.');
      }
    }
  };

  // useEffect(() => {
  //   const uploadModalParam = queryParams.get('uploadModal');
  //   if (uploadModalParam === 'true') {
  //     openSetModalFn('uploadModal');
  //   }
  // }, [queryParams]);

  return (
    <section className="ce-px ce-py grid xl:grid-cols-[1fr_auto] gap-5">
      <div>
        <div className="md:flex justify-between md:items-center gap-4 py-5">
          <div className="flex gap-2 items-center">
            {/* <img
              src={Assets.Images.Temp.DummyUserIcon3}
              alt="User Profile Pic"
            /> */}
            <div>
              <h3 className="text-ce-green text-2xl">
                <span className="font-normal">Hello,</span> {currentAccount.name}
              </h3>
              <p className="text-greyText2">
                Check your activities in this dashboard.
              </p>
            </div>
          </div>

          <Button
            variant='custom'
            label="Upload your Video"
            onClick={checkPaymentStatus}
            // onClick={() => openSetModalFn('confirmationModal')}
          />
        </div>
        <div className="grid mt-5 gap-4 grid-cols-1 md:grid-cols-2 2xl:grid-cols-4">
          <DashboardCard
            // icon={Assets.Icons.Dashboard.Calendar}
            text="Number of Downloads"
            figure={({} as any)?.referredPatient ?? 0}
          />
          <DashboardCard
            // icon={Assets.Icons.Dashboard.RedCalendar}
            text="Clicks"
            figure={({} as any)?.inpatientToday ?? 0}
          />
          <DashboardCard
            // icon={Assets.Icons.Dashboard.RedTelephone}
            text="Number of Uploaded Videos"
            figure={({} as any)?.manageFacilities ?? 0}
          />
          <DashboardCard
            // icon={Assets.Icons.Dashboard.Equipment}
            text="Videos"
            figure={({} as any)?.manageEquip ?? 0}
          />
        </div>

        <Modal open={openModal === 'confirmationModal'} onClose={closeModal}>
          <CreateVideoConfirmationModal onClose={closeModal}/>
        </Modal>

        <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-5">
          <ProfileVisitsChart />
          <JobVacancyChart />
        </div>
      </div>

      {/* {show404 && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            backgroundColor: '#fff',
            color: '#333',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '3rem',
            zIndex: 9999,
            userSelect: 'none',
          }}
        >
          <h1>404</h1>
          <p>The page you are looking for could not be found.</p>
        </div>
      )} */}
    </section>
  );
};

export default Dashboard;
