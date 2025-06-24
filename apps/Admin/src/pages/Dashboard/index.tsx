import React from 'react';

// import * as Assets from '@video-cv/assets';
import { DashboardCard } from '@video-cv/ui-components';

import ProfileVisitsChart from '../../components/dashboard/PatientActivityChart';
import JobVacancyChart from '../../components/dashboard/MonthlyRevenueChart';
// import queries from '../../services/queries/dashboard';
import { useAuth } from './../../../../../libs/context/AuthContext';


interface Account {
  id: string;
  name: string;
  email: string;
  avatar: string;
  userType: string;
}

const Dashboard = () => {
  // const { useGetDashboardSummary } = queries;
  // const { isLoading, data: DashboardSummary } = useGetDashboardSummary(
  //   `/dashboard-manager/superadmin/cards`
  // );
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

  return (
    <section className="ce-px ce-py grid xl:grid-cols-[1fr_auto] gap-5 w-full">
      <div>
        <div className="flex justify-between md:items-center gap-4 py-5">
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

        <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-5">
          <ProfileVisitsChart />
          <JobVacancyChart />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
