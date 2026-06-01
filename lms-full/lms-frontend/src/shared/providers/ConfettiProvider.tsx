import React from "react";
import { useConfettiStore } from "../store/confetti.store";
import Confetti from "react-confetti";

const ConfettiProvider = () => {
  const confetti = useConfettiStore();

  if (!confetti.isOpen) return null;

  return (
    <Confetti
      className="pointer-events-none z-100 w-full"
      numberOfPieces={1000}
      recycle={false}
      onConfettiComplete={() => {
        confetti.onClose();
      }}
    />
  );
};

export default ConfettiProvider;
