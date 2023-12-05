import FamiliesComponent from "@/components/family/familiesComponent";
import { FamilyCard } from "@/components/family/familyCard";
import FamilyDialog from "@/components/family/familyDialog";
import NavItem from "@/components/mainPage/navItem";
import SearchTextField from "@/components/utilityComponents/searchTextField";
import { FullFamily } from "@/types/prismaHelperTypes";
import { Add, Poll } from "@mui/icons-material";
import { Box, Button, TextField } from "@mui/material";
import { Gender, Education, Disability } from "@prisma/client";
import { GetResult } from "@prisma/client/runtime";
import { useState } from "react";

export function FamiliesPageComponent() {
  return <FamiliesComponent />;
}

