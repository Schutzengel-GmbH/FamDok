import NavItem from "@/components/mainPage/navItem";
import { useUserData } from "@/utils/authUtils";
import { Article } from "@mui/icons-material";
import { Box } from "@mui/material";
import { Prisma, Role } from "@prisma/client";

export default function AdminDashboard() {
  const { user } = useUserData();

  const adminNavList: {
    title: string;
    icon: JSX.Element;
    url: string;
    canAccess: (
      user: Prisma.UserGetPayload<{ include: { organization: true } }>
    ) => boolean;
  }[] = [
    {
      title: "Footer-Seiten",
      icon: <Article />,
      url: "/footerPages",
      canAccess: (user) =>
        user && (user.role === Role.ADMIN || user.role === Role.CONTROLLER),
    },
    {
      title: "Benutzer*innen",
      icon: <Article />,
      url: "/users",
      canAccess: (user) =>
        user &&
        (user.role === Role.ADMIN ||
          user.role === Role.CONTROLLER ||
          user.role === Role.ORGCONTROLLER),
    },
    {
      title: "Logs",
      icon: <Article />,
      url: "/logs",
      canAccess: (user) => user && user.role === Role.ADMIN,
    },
  ];
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "50% 50%",
        gap: ".5rem",
      }}
    >
      {adminNavList.map((i) => (
        <NavItem
          title={i.title}
          icon={i.icon}
          url={i.url}
          canAccess={i.canAccess(user)}
        />
      ))}
    </Box>
  );
}

