import {
  AdminPanelSettings,
  AccountBox,
  Poll,
  Edit,
  FamilyRestroom,
  Article,
  QueryStats,
  Description,
} from "@mui/icons-material";
import { Prisma, Role } from "@prisma/client";

export const navigationList: {
  title: string;
  icon: JSX.Element;
  url: string;
  canAccess: (
    user: Prisma.UserGetPayload<{ include: { organization: true } }>
  ) => boolean;
}[] = [
  {
    title: "Mein Profil",
    icon: <AccountBox />,
    url: "/me",
    canAccess: (user) => (user ? true : false),
  },
  {
    title: "Administration",
    icon: <AdminPanelSettings />,
    url: "/admin",
    canAccess: (user) =>
      user &&
      (user.role === Role.ADMIN ||
        user.role === Role.CONTROLLER ||
        user.role === Role.ORGCONTROLLER),
  },
  {
    title: "Fragebögen bearbeiten",
    icon: <Poll />,
    url: "/surveyDashboard",
    canAccess: (user) =>
      user &&
      (user.role === Role.ADMIN ||
        user.role === Role.CONTROLLER ||
        user.role === Role.ORGCONTROLLER),
  },
  {
    title: "Daten",
    icon: <QueryStats />,
    url: "/dashboards",
    canAccess: (user) =>
      user &&
      (user.role === Role.ADMIN ||
        user.role === Role.CONTROLLER ||
        user.role === Role.ORGCONTROLLER),
  },
  {
    title: "Fragebögen beantworten",
    icon: <Edit />,
    url: "/surveys",
    canAccess: (user) => (user ? true : false),
  },
  // {
  //   title: "Familien",
  //   icon: <FamilyRestroom />,
  //   url: "/families",
  //   canAccess: (user) => (user ? true : false),
  // },
  {
    title: "Stammdaten",
    icon: <Description />,
    url: "/masterData",
    canAccess: (user) => (user ? true : false),
  },
];
