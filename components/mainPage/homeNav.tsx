import { AdminPanelSettings, AccountBox, Poll } from "@mui/icons-material";
import { Box } from "@mui/material";
import NavItem from "./navItem";
import { Role } from "@prisma/client";
import { useUserData } from "../../utils/authUtils";
import { navigationList } from "../../utils/navigationUtils";

export default function HomeNav() {
  const { user } = useUserData();

  if (!user) return null;

  const canAccessAdminDashboard =
    user.role === Role.ADMIN ||
    user.role === Role.CONTROLLER ||
    user.role === Role.ORGCONTROLLER;

  const canAccessSurveyDashboard =
    user.role === Role.ADMIN ||
    user.role === Role.CONTROLLER ||
    user.role === Role.ORGCONTROLLER;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "50% 50%",
        gap: ".5rem",
      }}
    >
      {navigationList.map((navItem, i) => (
        <NavItem
          title={navItem.title}
          icon={navItem.icon}
          url={navItem.url}
          key={i}
          canAccess={navItem.canAccess(user)}
        />
      ))}
    </Box>
  );
}
