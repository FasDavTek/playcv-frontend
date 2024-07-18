import React from 'react';

// import * as Assets from '@video-cv/assets';
import { DashboardCard } from '@video-cv/ui-components';

import ProfileVisitsChart from '../../components/dashboard/PatientActivityChart';
import JobVacancyChart from '../../components/dashboard/MonthlyRevenueChart';
// import queries from '../../services/queries/dashboard';

const Dashboard = () => {
  // const { useGetDashboardSummary } = queries;
  // const { isLoading, data: DashboardSummary } = useGetDashboardSummary(
  //   `/dashboard-manager/superadmin/cards`
  // );

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
        </div>
        <div className="grid mt-5 gap-4 md:grid-cols-2 2xl:grid-cols-4">
          <DashboardCard
            // icon={Assets.Icons.Dashboard.Calendar}
            text="My Purchased Videos"
            figure={({} as any)?.referredPatient ?? 0}
          />
          <DashboardCard
            // icon={Assets.Icons.Dashboard.RedCalendar}
            text="Active Ads"
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

        <div className="grid 2xl:grid-cols-2 mt-5 gap-5">
          <ProfileVisitsChart />
          <JobVacancyChart />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
