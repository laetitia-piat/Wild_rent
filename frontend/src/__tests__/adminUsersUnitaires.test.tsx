import { UserTable } from "@/components/UserTable";
import { User } from "@/pages/AdminUsers";
import { MemoryRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, vi } from "vitest";
import { TempUser } from "@/generated/graphql-types";

vi.mock("../generated/graphql-types", () => ({
  useDeleteUserMutation: () => [vi.fn()],
  useDeleteTempUserMutation: () => [vi.fn()],
}));

const baseUsers = [
  {
    id: 1,
    first_name: "Alice",
    last_name: "Dupont",
    email: "alice@example.com",
    phone_number: "0600000000",
    role: "ADMIN",
  },
  {
    id: 2,
    first_name: "Stéphane",
    last_name: "Labrie",
    email: "stephane@example.com",
    phone_number: "0600000002",
    role: "USER",
  },
];

const mockUsers: User[] = baseUsers.map((user) => ({
  ...user,
  __typename: "User",
  created_at: new Date().toISOString(),
}));
const mockTempUsers: TempUser[] = baseUsers.map((user) => ({
  ...user,
  __typename: "TempUser",
}));

const mockColumnsWithoutCreatedAt = [
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

const mockColumns = [
  ...mockColumnsWithoutCreatedAt,
  { accessorKey: "created_at", header: "Créé le" },
];

const defaultProps = {
  columns: mockColumns,
  data: mockUsers,
  setFormOpen: vi.fn(),
  setModeUpdate: vi.fn(),
  setUserToUpdate: vi.fn(),
  refetchUsers: vi.fn(),
  refetchTempUsers: vi.fn(),
  seeTempUsers: false,
};

describe("UserTable", () => {
  const renderUserTable = () =>
    render(
      <MemoryRouter>
        <UserTable {...defaultProps} />
      </MemoryRouter>
    );

  it("displays columns and users datas", () => {
    renderUserTable();

    // Affiche des colones passées en props
    expect(screen.getByText("Nom")).toBeInTheDocument();
    expect(screen.getByText("Prénom")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Téléphone")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Créé le")).toBeInTheDocument();

    // Affiche les données des utilisateurs passés en props
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("stephane@example.com")).toBeInTheDocument();
    expect(screen.getByText("0600000000")).toBeInTheDocument();
    expect(screen.getByText("Dupont")).toBeInTheDocument();
    expect(screen.getByText("ADMIN")).toBeInTheDocument();
    expect(screen.getByText("USER")).toBeInTheDocument();

    // Affiche correctement les badges si admin ou user
    const adminBadge = screen.getByText("ADMIN");
    const userBadge = screen.getByText("USER");
    expect(adminBadge).toHaveClass("bg-green/30");
    expect(userBadge).not.toHaveClass("bg-green/30");
  });

  it("triggers funtions to open the form when clicking on edit user button", () => {
    renderUserTable();
    const editUser1Button = screen.getByRole("button", { name: "Edit user 1" });
    fireEvent.click(editUser1Button);
    expect(defaultProps.setFormOpen).toHaveBeenCalledWith(true);
    expect(defaultProps.setModeUpdate).toHaveBeenCalledWith(true);
    expect(defaultProps.setUserToUpdate).toHaveBeenCalledWith(mockUsers[0]);
  });

  it("Opens the Dialog when clicking on delete button", () => {
    renderUserTable();
    const deleteUser1Button = screen.getByRole("button", {
      name: "Delete user 1",
    });
    fireEvent.click(deleteUser1Button);
    expect(
      screen.getByText(
        "Êtes-vous certain de vouloir supprimer cet utilisateur:"
      )
    ).toBeVisible();
  });

  it("does not display edit button and created_at column on temp user table", () => {
    render(
      <MemoryRouter>
        <UserTable
          {...{
            ...defaultProps,
            data: mockTempUsers,
            seeTempUsers: true,
            columns: mockColumnsWithoutCreatedAt,
          }}
        />
      </MemoryRouter>
    );

    expect(screen.queryByText("Créé le")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Edit user 1" })
    ).not.toBeInTheDocument();
  });
});
