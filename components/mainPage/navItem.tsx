import { Box, Typography, SxProps, Button } from "@mui/material";
import { useRouter } from "next/router";

type NavItemProps = {
  title: string;
  icon: JSX.Element;
  url: string;
  canAccess: boolean;
};

export default function NavItem({ title, icon, url, canAccess }: NavItemProps) {
  const router = useRouter();

  const sx: SxProps = {
    display: canAccess ? "flex" : "none",
    flexDirection: "row",
    padding: "1rem",
    gap: ".5rem",
  };

  function handleClick() {
    router.push(url);
  }

  return (
    <Button onClick={handleClick} sx={sx} variant="outlined">
      {icon} <Typography>{title}</Typography>
    </Button>
  );
}
