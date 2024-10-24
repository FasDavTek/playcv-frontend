import React, { useEffect, useState } from 'react';

// import * as Assets from '@video-cv/assets';
import { Button, DashboardCard } from '@video-cv/ui-components';

import ProfileVisitsChart from '../../components/dashboard/PatientActivityChart';
import JobVacancyChart from '../../components/dashboard/MonthlyRevenueChart';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@mui/material';
import CreateVideoConfirmationModal from '../VideoManagement/modals/CreateVideoConfirmationModal';
// import queries from '../../services/queries/dashboard';

type ModalTypes = null | 'uploadModal' | 'confirmationModal' | 'paymentModal';

const Dashboard = () => {
  const navigate = useNavigate();
  // const { useGetDashboardSummary } = queries;
  // const { isLoading, data: DashboardSummary } = useGetDashboardSummary(
  //   `/dashboard-manager/superadmin/cards`
  // );
  const queryParams = new URLSearchParams(location.search);
  const [openModal, setOpenModal] = useState<ModalTypes>(null);

  const closeModal = () => setOpenModal(null);
  const openSetModalFn = (modalType: ModalTypes) => setOpenModal(modalType);

  useEffect(() => {
    const uploadModalParam = queryParams.get('uploadModal');
    if (uploadModalParam === 'true') {
      openSetModalFn('uploadModal');
    }
  }, [queryParams]);

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
                <span className="font-normal">Hello,</span> Emma Taylor
              </h3>
              <p className="text-greyText2">
                Check your activities in this dashboard.
              </p>
            </div>
          </div>

          <Button
            variant='custom'
            label="Upload your Video"
            onClick={() => openSetModalFn('confirmationModal')}
          />
        </div>
        <div className="grid mt-5 gap-4 grid-cols-1 md:grid-cols-3 2xl:grid-cols-4">
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
    </section>
  );
};

export default Dashboard;
