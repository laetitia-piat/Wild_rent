import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils/formatDate";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  TempUser,
  useDeleteTempUserMutation,
  useDeleteUserMutation,
} from "@/generated/graphql-types";
import { User } from "@/pages/AdminUsers";
import { toast } from "react-toastify";

interface UserTableProps {
  columns: {
    accessorKey: string;
    header: string;
  }[];
  data: User[] | TempUser[];
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setModeUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  setUserToUpdate: React.Dispatch<React.SetStateAction<User | undefined>>;
  seeTempUsers: boolean;
  refetchUsers: () => void;
  refetchTempUsers: () => void;
}

export function UserTable({
  columns,
  data,
  setFormOpen,
  setModeUpdate,
  setUserToUpdate,
  refetchUsers,
  refetchTempUsers,
  seeTempUsers,
}: UserTableProps) {
  const [deleteUserMutation] = useDeleteUserMutation({
    onError: () => {
      toast.error(
        "Une erreur est survenue, l'utilisateur n'a pas pu être supprimé"
      );
    },
  });
  const [deleteTempUserMutation] = useDeleteTempUserMutation({
    onError: () => {
      toast.error(
        "Une erreur est survenue, l'utilisateur n'a pas pu être supprimé"
      );
    },
  });

  const deteleUser = async (id: number) => {
    try {
      if (!seeTempUsers) {
        const response = await deleteUserMutation({
          variables: {
            data: {
              userId: id,
            },
          },
        });
        refetchUsers();
        if (response.data?.deleteUser) {
          toast.success("Utilisateur supprimé avec succès");
        }
        return response.data;
      } else {
        const response = await deleteTempUserMutation({
          variables: { deleteTempUserId: id },
        });
        refetchTempUsers();
        if (response.data?.deleteTempUser) {
          toast.success("Utilisateur supprimé avec succès");
        }
        return response.data;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditForm = (user: User) => {
    setFormOpen(true);
    setModeUpdate(true);
    setUserToUpdate(user);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => {
              return (
                <TableHead key={column.accessorKey}>{column.header}</TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody className="text-gray-600">
          {data.map((item) => {
            return (
              <TableRow key={item.id} className="hover:bg-gray-100">
                <TableCell className="py-4">{item.id}</TableCell>
                <TableCell>{item.last_name}</TableCell>
                <TableCell>{item.first_name}</TableCell>
                <TableCell>
                  <Badge
                    variant={"outline"}
                    className={`${item.role === "ADMIN" ? "bg-green/30" : ""}`}
                  >
                    {item.role}
                  </Badge>
                </TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.phone_number}</TableCell>
                {item.__typename === "User" && (
                  <TableCell>{formatDate(item.created_at)}</TableCell>
                )}
                {item.__typename === "User" && (
                  <TableCell>
                    <Button
                      variant={"ghost"}
                      className="hover:cursor-pointer"
                      onClick={() => openEditForm(item)}
                      aria-label={`Edit user ${item.id}`}
                    >
                      <MdOutlineModeEdit size={25} className="text-green" />
                    </Button>
                  </TableCell>
                )}

                <TableCell>
                  <Dialog>
                    <DialogTrigger
                      aria-label={`Delete user ${item.id}`}
                      className="hover:cursor-pointer"
                    >
                      <RiDeleteBin6Line size={20} className="text-red-600" />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center gap-5">
                      <DialogHeader>
                        <DialogTitle className="flex flex-col items-center gap-4">
                          <div>
                            Êtes-vous certain de vouloir supprimer cet
                            utilisateur:
                          </div>
                          <p className="text-green">
                            {item.first_name} {item.last_name}
                          </p>
                        </DialogTitle>
                        <DialogDescription className="text-center mt-5 flex flex-col items-center">
                          Cette action est irréversible. Elle entraînera la
                          suppression définitive du compte ainsi que
                          l’effacement des données de nos serveurs.
                          <Button
                            onClick={() => deteleUser(item.id)}
                            variant={"destructive"}
                            className="mt-5 w-[140px] hover:cursor-pointer hover:bg-red-600/70"
                          >
                            Confirmer
                          </Button>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
