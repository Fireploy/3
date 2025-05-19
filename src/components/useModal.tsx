import { useState } from "react";

function useModal() {
  const [openModal, setOpenModal] = useState(false);
  function handleOpen() {
    setOpenModal(true);
  }
  function handleClose() {
    setOpenModal(false);
  }
  return {
    openModal,
    handleClose,
    handleOpen,
  };
}

export default useModal;
