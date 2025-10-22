import { RentalDatesContext } from "@/context/RentalDatesContext";
import { useContext } from "react";

export const useRentalDates = () => {
  const context = useContext(RentalDatesContext);
  if (!context) {
    throw new Error("useRentalDates must be used within a RentalDatesProvider");
  }
  return context;
};
