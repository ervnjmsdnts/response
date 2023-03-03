import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InfoIcon from "@mui/icons-material/Info";
import DateRangeIcon from "@mui/icons-material/DateRange";
export const navData = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <HomeIcon />,
  },
  {
    title: "Daily Report",
    path: "/daily-report",
    icon: <DateRangeIcon />,
  },
  {
    title: "Account",
    path: "/account",
    icon: <AccountCircleIcon />,
  },
];
