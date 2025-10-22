import AdminUsers from "@/pages/AdminUsers";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe } from "vitest";
import { GET_ALL_TEMP_USERS, GET_USERS } from "@/graphql/queries";
import { MockedProvider } from "@apollo/client/testing";

const mocks = [
  {
    request: {
      query: GET_USERS,
      variables: { offset: 0, limit: 10 },
    },
    result: {
      data: {
        getAllUsers: {
          users: [
            {
              __typename: "User",
              id: 1,
              first_name: "Alice",
              last_name: "Dupont",
              email: "alice@example.com",
              phone_number: "0600000000",
              role: "ADMIN",
              created_at: new Date().toISOString(),
              address: {
                city: "Tours",
                country: "France",
                street: "65 Avenue des Peupliers",
                zipcode: "67900",
              },
            },
            {
              __typename: "User",
              id: 2,
              first_name: "Stéphane",
              last_name: "Labrie",
              email: "stephane@example.com",
              phone_number: "0600000002",
              role: "USER",
              created_at: new Date().toISOString(),
              address: {
                city: "Paris",
                country: "France",
                street: "20 Rue du Bahut",
                zipcode: "24900",
              },
            },
          ],
          totalUsersLength: 2,
        },
      },
    },
  },
  {
    request: {
      query: GET_ALL_TEMP_USERS,
    },
    result: {
      data: {
        getAllTempUsers: [],
      },
    },
  },
];

const renderAdminUser = () =>
  render(
    <MockedProvider mocks={mocks}>
      <AdminUsers />
    </MockedProvider>
  );

describe("AdminUsers integration", () => {
  it("displays edit user form with pre-filled information when click on edit button", async () => {
    renderAdminUser();

    // Lutilisateur se trouve dans la table
    await screen.findByText("Alice");

    // On clique sur le bouton edit user
    const editUser1Button = screen.getByRole("button", { name: "Edit user 1" });

    fireEvent.click(editUser1Button);

    // On arrive sur le formulaire d'édition
    expect(
      screen.getByText("Modification d'un utilisateur")
    ).toBeInTheDocument();

    // Les champs sont préremplis avec les informations
    expect(screen.getByLabelText("Nom")).toHaveValue("Dupont");
    expect(screen.getByLabelText("Prénom")).toHaveValue("Alice");
    expect(screen.getByLabelText("Email")).toHaveValue("alice@example.com");
    expect(screen.getByLabelText("Téléphone")).toHaveValue("0600000000");
    expect(screen.getByLabelText("Adresse")).toHaveValue(
      "65 Avenue des Peupliers"
    );
    expect(screen.getByLabelText("Code Postal")).toHaveValue("67900");
    expect(screen.getByLabelText("Ville")).toHaveValue("Tours");
    const adminButton = screen.getByRole("radio", {
      name: (_accessibleName, element) => {
        return element.getAttribute("value") === "ADMIN";
      },
    });

    expect(adminButton).toBeChecked();
  });
});
