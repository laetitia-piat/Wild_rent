import { Calendar as CalendarIcon, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useRentalDates } from "@/hooks/useRentalDates";

export function SelectRentalDates() {
  const {
    startDate: contextStartDate,
    endDate: contextEndDate,
    changeRentalDates,
  } = useRentalDates();

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(
    contextStartDate ?? undefined
  );
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [endDate, setEndDate] = useState<Date | undefined>(
    contextEndDate ?? undefined
  );

  const changeContextDates = (
    startDate: Date | undefined,
    endDate: Date | undefined
  ) => {
    if (startDate && endDate) {
      changeRentalDates(startDate, endDate);
    }
  };

  return (
    <div className="bg-white w-full flex justify-center">
      <div className="rounded-md sm:rounded-full w-fit shadow-md px-4 py-2 my-4 bg-green/30 flex flex-col sm:flex-row items-center gap-2  ">
        <div className="flex flex-col">
          <Label htmlFor="date" className="px-3 py-2 sm:pb-0">
            Début de la location
          </Label>
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal border-none shadow-none sm:bg-transparent text-gray-700"
              >
                {startDate
                  ? startDate.toLocaleDateString()
                  : "Sélectionnez une date"}
                <CalendarIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={startDate}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setStartDate(date);
                  setStartDateOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col">
          <Label htmlFor="date" className="px-3 py-2 sm:pb-0">
            Fin de la location
          </Label>
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal border-none shadow-none sm:bg-transparent text-gray-700"
              >
                {endDate
                  ? endDate.toLocaleDateString()
                  : "Sélectionnez une date"}
                <CalendarIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={startDate}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setEndDate(date);
                  setEndDateOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <button
          className="p-2 sm:p-3.5 my-2 sm:my-0 flex items-center w-full justify-center gap-2 rounded-md sm:rounded-full bg-green hover:cursor-pointer text-white hover:bg-white hover:text-black "
          onClick={() => changeContextDates(startDate, endDate)}
          aria-label="datebutton"
        >
          <Search size={20} />
          <p className="sm:hidden text-sm">Voir les produits </p>
        </button>
      </div>
    </div>
  );
}
