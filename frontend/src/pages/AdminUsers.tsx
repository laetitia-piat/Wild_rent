import { UserTable } from "@/components/UserTable";
import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GetAllUsersQuery,
  useGetAllUsersQuery,
  useGetTempUsersQuery,
} from "@/generated/graphql-types";

import { RiSearchLine } from "react-icons/ri";
import { FiPlusCircle } from "react-icons/fi";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { FaArrowLeftLong, FaUserClock } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import AdminUserForm from "@/components/adminUserForm";

export type User = GetAllUsersQuery["getAllUsers"]["users"][number];

const AdminUsers = () => {
  const [seeTempUsers, setSeeTempUsers] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [selectedRole, setSelectedRole] = useState<string | undefined>(
    undefined
  );
  const [formOpen, setFormOpen] = useState(false);
  const [modeUpdate, setModeUpdate] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<User | undefined>(undefined);
  const limit = 10;
  const debouncedSearch = useDebounce(search, 500);

  const { loading, data, error, refetch } = useGetAllUsersQuery({
    variables: { offset, limit, role: selectedRole, search: debouncedSearch },
  });

  const { data: tempUsersData, refetch: tempUserRefetch } =
    useGetTempUsersQuery();

  const users = data?.getAllUsers?.users ?? [];
  const totalUsersLength = data?.getAllUsers.totalUsersLength;
  const tempUsers = tempUsersData?.getAllTempUsers ?? [];

  const usersToShow = seeTempUsers ? tempUsers : users;

  const columns = [
    {
      accessorKey: "id",
      header: "Id",
    },
    {
      accessorKey: "last_name",
      header: "Nom",
    },
    {
      accessorKey: "first_name",
      header: "Prénom",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone_number",
      header: "Téléphone",
    },
  ];

  if (!seeTempUsers) {
    columns.push({
      accessorKey: "created_at",
      header: "Créé le",
    });
  }

  const fetchNextPage = () => {
    setCurrentPage(currentPage + 1);
    setOffset(offset + limit);
  };

  const fetchPreviousPage = () => {
    setCurrentPage(currentPage - 1);
    setOffset(offset - limit);
  };

  let totalPages: number = 1;
  if (totalUsersLength) {
    totalPages = Math.ceil(totalUsersLength / limit);
  }

  if (loading) return <Loader text={"Chargement des utilisateurs"} />;
  if (error) {
    console.error(error);
    return <p>Une erreur est survenue, veuillez réessayer plus tard</p>;
  }

  return (
    <div className="flex flex-col p-2 lg:mp-4 gap-4 w-full relative">
      <h1 className="font-bold text-lg md:text-xl lg:text-2xl mb-4">
        Utilisateurs {seeTempUsers && "en attente de validation"}
      </h1>
      {seeTempUsers && (
        <div className="w-full">
          <Button
            variant={"ghost"}
            className="flex items-center gap-2 text-gray-600 hover:cursor-pointer"
            onClick={() => setSeeTempUsers(false)}
          >
            <FaArrowLeftLong /> <p>Revenir à la liste des utilisateurs</p>
          </Button>
        </div>
      )}
      {!formOpen && !seeTempUsers && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex relative items-center ">
              <RiSearchLine className="absolute m-1 text-gray-500" size={20} />
              <Input
                value={search}
                className="pl-8"
                placeholder="Chercher un utilisateur"
                onChange={(e) => {
                  setOffset(0);
                  setCurrentPage(1);
                  setSearch(e.target.value);
                }}
              />
            </div>
            <Select
              value={selectedRole}
              onValueChange={(value: any) => {
                setCurrentPage(1);
                setOffset(0);
                setSelectedRole(value === "all" ? undefined : value);
                setSearch(undefined);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="all">Tous les utilisateurs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              variant={"outline"}
              className="text-green flex gap-2 items-center"
              onClick={() => setSeeTempUsers(true)}
            >
              <FaUserClock />
              En attente de validation ( {tempUsers.length} )
            </Button>
            <Button
              onClick={() => {
                setFormOpen(true);
                setModeUpdate(false);
              }}
              className="bg-green flex items-center hover:bg-green/70 hover:cursor-pointer"
            >
              <FiPlusCircle />
              <p className="translate-y-[1px]">Créer un utilisateur</p>
            </Button>
          </div>
        </div>
      )}
      {!formOpen ? (
        usersToShow && usersToShow.length > 0 ? (
          <>
            <UserTable
              columns={columns}
              data={usersToShow}
              setFormOpen={setFormOpen}
              setModeUpdate={setModeUpdate}
              setUserToUpdate={setUserToUpdate}
              refetchUsers={refetch}
              refetchTempUsers={tempUserRefetch}
              seeTempUsers={seeTempUsers}
            />
            {!seeTempUsers && (
              <div className="flex items-center justify-center gap-2">
                <button
                  className="bg-white rounded-md border-gray-300 text-gray-600 disabled:text-gray-300 disabled:hover:bg-white  hover:bg-gray-200 hover:cursor-pointer disabled:cursor-auto border py-2 px-2 text-center"
                  disabled={currentPage === 1}
                  onClick={() => fetchPreviousPage()}
                >
                  <SlArrowLeft size={15} />
                </button>
                <p>{`Page ${currentPage} de ${totalPages}`}</p>
                <button
                  className="bg-white rounded-md border-gray-300 text-gray-600 disabled:text-gray-300 disabled:hover:bg-white  hover:bg-gray-200 hover:cursor-pointer disabled:cursor-auto border py-2 px-2 text-center"
                  disabled={currentPage === totalPages}
                  onClick={() => fetchNextPage()}
                >
                  <SlArrowRight size={15} />
                </button>
              </div>
            )}
          </>
        ) : (
          <p>Aucun utilisateur trouvé</p>
        )
      ) : (
        <AdminUserForm
          modeUpdate={modeUpdate}
          userToUpdate={userToUpdate}
          setFormOpen={setFormOpen}
          refetchTempUsers={tempUserRefetch}
        />
      )}
    </div>
  );
};

export default AdminUsers;
