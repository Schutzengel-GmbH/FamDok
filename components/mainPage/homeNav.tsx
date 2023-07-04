import { AdminPanelSettings, AccountBox } from "@mui/icons-material";
import { Box } from "@mui/material";
import NavItem from "./navItem";
import { Role } from "@prisma/client";
import { useUserData } from "../../utils/authUtils";

export default function HomeNav() {
  const { user } = useUserData();

  if (!user) return null;

  const canAccessAdminDashboard =
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
      <NavItem title="Profil" icon={<AccountBox />} url="/me" />
      {canAccessAdminDashboard && (
        <NavItem
          title="Admin Dashboard"
          icon={<AdminPanelSettings />}
          url="/adminDashboard"
        />
      )}
    </Box>
  );
}
