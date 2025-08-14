import React, { createContext, useContext, useState } from "react";
import LoginReqModal from "./components/LoginReqModal";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const showModal = () => setShowLoginModal(true);
  const hideModal = () => setShowLoginModal(false);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {showLoginModal && <LoginReqModal onClose={hideModal} />}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
