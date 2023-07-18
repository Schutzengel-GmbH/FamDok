import { Modal } from "@mui/material";
import Loading from "@/components/utilityComponents/loadingMainContent";

type WorkingProps = {
  open: boolean;
};

export default function Working({ open }: WorkingProps) {
  return (
    <Modal open={open}>
      <Loading />
    </Modal>
  );
}
