import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AdminNavbar } from "../components/AdminNavbar";

describe("AdminNavbar", () => {
  const renderNavbar = () =>
    render(
      <MemoryRouter>
        <AdminNavbar />
      </MemoryRouter>
    );

  it("renders the AdminNavbar component correctly", () => {
    renderNavbar();
    expect(screen.getByLabelText("admin logo")).toBeInTheDocument();
  });

  it('displays the text "Menu" when isOpen is true', () => {
    renderNavbar();
    expect(screen.getByRole("heading", { name: "Menu" })).toBeInTheDocument();
  });

  it("toggles the menu when clicking the button", () => {
    renderNavbar();
    const toggleButton = screen.getByRole("button");

    expect(screen.getByText("Menu")).toBeInTheDocument();

    fireEvent.click(toggleButton);

    expect(screen.queryByText("Menu")).not.toBeInTheDocument();
  });

  it("displays all navigation links when the menu is open", () => {
    renderNavbar();
    expect(screen.getByText("Utilisateurs")).toBeInTheDocument();
    expect(screen.getByText("Catégories")).toBeInTheDocument();
    expect(screen.getByText("Articles")).toBeInTheDocument();
    expect(screen.getByText("Commandes")).toBeInTheDocument();
    expect(screen.getByText("Inventaire")).toBeInTheDocument();
  });
});
