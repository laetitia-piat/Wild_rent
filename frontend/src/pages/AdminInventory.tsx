import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetInventoryByOptionsQuery } from "@/generated/graphql-types";
import { useMemo, useState } from "react";

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getAllDates(
  start: string,
  end: string
): { iso: string; day: string; month: string }[] {
  const dates: { iso: string; day: string; month: string }[] = [];
  let current = new Date(start);
  const last = new Date(end);

  const monthFormatter = new Intl.DateTimeFormat("fr-FR", { month: "short" });

  while (current <= last) {
    const iso = current.toISOString().split("T")[0]; // YYYY-MM-DD
    const day = String(current.getDate()).padStart(2, "0");
    const month = monthFormatter.format(current).replace(".", ""); // retire le point
    dates.push({ iso, day, month });
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export function AdminInventory() {
  const today = new Date();
  const end = new Date();
  end.setDate(today.getDate() + 7);
  const [startDate, setStartDate] = useState<Date>(today);
  const [endDate, setEndDate] = useState<Date>(end);
  const allDates = useMemo(() => {
    return getAllDates(formatDate(startDate), formatDate(endDate)) ?? [];
  }, [startDate, endDate]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<{
    type: "id" | "category";
    order: "asc" | "desc";
  }>({ type: "id", order: "asc" });

  const { data, refetch, loading } = useGetInventoryByOptionsQuery({
    variables: {
      endDate: formatDate(endDate),
      startDate: formatDate(startDate),
    },
  });

  const optionInventory = data?.getInventoryByOptions ?? [];

  const handleSort = (type: "category" | "id") => {
    if (type === "category") {
      if (sortBy.type === "category") {
        if (sortBy.order === "asc") {
          setSortBy({ type: "category", order: "desc" });
        } else {
          setSortBy({ type: "category", order: "asc" });
        }
      } else {
        setSortBy({ type: "category", order: "asc" });
      }
    }
    if (type === "id") {
      if (sortBy.type === "id") {
        if (sortBy.order === "asc") {
          setSortBy({ type: "id", order: "desc" });
        } else {
          setSortBy({ type: "id", order: "asc" });
        }
      } else {
        setSortBy({ type: "id", order: "asc" });
      }
    } else return null;
  };

  const filteredInventory = useMemo(() => {
    let result = optionInventory;
    if (search.trim().length > 0) {
      result = result.filter((option) =>
        option.product.toLowerCase().includes(search.toLowerCase())
      );
    }
    const sorted = [...result].sort((a, b) => {
      if (sortBy.type === "id") {
        if (sortBy.order === "asc") return a.id - b.id;
        else {
          return b.id - a.id;
        }
      }
      if (sortBy.type === "category") {
        if (sortBy.order === "asc") {
          return a.category.title.localeCompare(b.category.title);
        } else {
          return b.category.title.localeCompare(a.category.title);
        }
      }
      return 0;
    });

    return sorted;
  }, [optionInventory, search, sortBy]);

  const handleDecrementDate = () => {
    const newStart = new Date(startDate);
    newStart.setDate(newStart.getDate() - 1);
    const newEnd = new Date(endDate);
    newEnd.setDate(newEnd.getDate() - 1);
    setStartDate(newStart);
    setEndDate(newEnd);
    refetch({
      endDate: formatDate(newEnd),
      startDate: formatDate(newStart),
    });
  };

  const handleIncrementDate = () => {
    const newStart = new Date(startDate);
    newStart.setDate(newStart.getDate() + 1);
    const newEnd = new Date(endDate);
    newEnd.setDate(newEnd.getDate() + 1);
    setStartDate(newStart);
    setEndDate(newEnd);
    refetch({
      endDate: formatDate(newEnd),
      startDate: formatDate(newStart),
    });
  };

  return (
    <div className="w-full px-4">
      <h1 className="font-bold text-lg md:text-xl lg:text-2xl"> Inventaire</h1>
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Chercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 w-full justify-between">
            <p className="text-sm">Quantité réservée:</p>
            <div className="h-5 w-6 bg-yellow-600/50"></div>
          </div>
          <div className="flex items-center gap-2 w-full justify-between">
            <p className="text-sm">Quantité disponible:</p>
            <div className="h-5 w-6 bg-green/50"></div>
          </div>
        </div>
      </div>

      <div className="rounded-md border max-h-[500px] 2xl:max-h-[700px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="sticky top-0 z-10 bg-white">
              <TableHead className="flex items-center">
                <p>Id</p>
                <Button variant={"ghost"} onClick={() => handleSort("id")}>
                  <ArrowUpDown />
                </Button>
              </TableHead>
              <TableHead>Produit</TableHead>
              <TableHead>Option</TableHead>
              <TableHead className="flex items-center">
                <p>Catégorie</p>
                <Button
                  variant={"ghost"}
                  onClick={() => handleSort("category")}
                >
                  <ArrowUpDown />
                </Button>
              </TableHead>
              <TableHead>Qté totale</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="w-5 hover:cursor-pointer"
                  onClick={handleDecrementDate}
                  disabled={loading}
                >
                  <ChevronLeft />
                </Button>
              </TableHead>
              {allDates.map((date) => {
                const columnId = `${date.day}-${date.month}`;
                return (
                  <TableHead key={columnId}>
                    <div className="flex flex-col items-center">
                      <div>{date.month}</div>
                      <div>{date.day}</div>
                    </div>
                  </TableHead>
                );
              })}
              <TableHead>
                <Button
                  variant="ghost"
                  className="w-5 hover:cursor-pointer"
                  onClick={handleIncrementDate}
                  disabled={loading}
                >
                  <ChevronRight />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((option) => (
              <TableRow key={option.id}>
                <TableCell>{option.id}</TableCell>
                <TableCell>{option.product}</TableCell>
                <TableCell>{option.option}</TableCell>
                <TableCell>{option.category.title}</TableCell>
                <TableCell>{option.totalQty}</TableCell>
                <TableCell></TableCell>
                {allDates.map((date) => {
                  const columnId = `${date.day}-${date.month}`;
                  const reservedOnDate = option.reservations.find(
                    (reservation) => reservation.date.split("T")[0] === date.iso
                  );
                  const reservedQty = reservedOnDate
                    ? reservedOnDate.reservedQty
                    : 0;
                  const availableQty = reservedOnDate
                    ? reservedOnDate.availableQty
                    : option.totalQty;

                  return (
                    <TableCell key={`${option.id}-${columnId}`}>
                      <div className="flex justify-center">
                        <div
                          className={`w-6 text-center ${
                            availableQty === 0
                              ? "bg-red-600/50"
                              : "bg-yellow-600/50"
                          } `}
                        >
                          {reservedQty}
                        </div>
                        <div className=" w-6 text-center bg-green/50">
                          {availableQty}
                        </div>
                      </div>
                    </TableCell>
                  );
                })}
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
