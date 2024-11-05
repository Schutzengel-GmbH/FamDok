import NavItem from "@/components/mainPage/navItem";
import { useUserData } from "@/utils/authUtils";
import {
  Article,
  Code,
  House,
  HouseOutlined,
  Merge,
  People,
  Settings,
} from "@mui/icons-material";
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
      icon: <People />,
      url: "/users",
      canAccess: (user) =>
        user &&
        (user.role === Role.ADMIN ||
          user.role === Role.CONTROLLER ||
          user.role === Role.ORGCONTROLLER),
    },
    {
      title: "Logs",
      icon: <Code />,
      url: "/logs",
      canAccess: (user) => user && user.role === Role.ADMIN,
    },
    {
      title: "Mögliche Wohnorte",
      icon: <House />,
      url: "/locations",
      canAccess: (user) =>
        user && (user.role === Role.ADMIN || user.role === Role.CONTROLLER),
    },
    {
      title: "Optionen für Zugang Über",
      icon: <Merge />,
      url: "/comingFromOptions",
      canAccess: (user) =>
        user && (user.role === Role.ADMIN || user.role === Role.CONTROLLER),
    },
    {
      title: "Organisation",
      icon: <HouseOutlined />,
      url: "/subOrganization",
      canAccess: (user) => user && user.role !== Role.USER,
    },
    {
      title: "Einstellungen",
      icon: <Settings />,
      url: "/settings",
      canAccess: (user) => user && user.role === Role.ADMIN,
    },
    {
      title: "Stammdatenarten",
      icon: <Settings />,
      url: "/masterDataTypes",
      canAccess: (user) =>
        user &&
        (user.role === Role.ADMIN ||
          user.role === Role.CONTROLLER ||
          user.role === Role.ORGCONTROLLER),
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
      {adminNavList.map((i, index) => (
        <NavItem
          key={index}
          title={i.title}
          icon={i.icon}
          url={i.url}
          canAccess={i.canAccess(user)}
        />
      ))}
    </Box>
  );
}

