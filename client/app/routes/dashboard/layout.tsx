import React from "react";
import { Outlet } from "react-router";
import Dashboard from "~/components/dashboard";

const DashboardWrapper = () => (
  <Dashboard>
    <Outlet />
  </Dashboard>
);

export default DashboardWrapper;
