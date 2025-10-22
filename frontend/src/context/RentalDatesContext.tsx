import { createContext, PropsWithChildren, useState } from "react";

type RentalDatesContextType = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  changeRentalDates: (startDateValue: Date, endDateValue: Date) => void;
};

export const RentalDatesContext = createContext<
  RentalDatesContextType | undefined
>(undefined);

export const RentalDatesProvider = ({ children }: PropsWithChildren) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const changeRentalDates = (startDateValue: Date, endDateValue: Date) => {
    setStartDate(startDateValue);
    setEndDate(endDateValue);
  };

  return (
    <RentalDatesContext.Provider
      value={{ startDate, endDate, changeRentalDates }}
    >
      {children}
    </RentalDatesContext.Provider>
  );
};
