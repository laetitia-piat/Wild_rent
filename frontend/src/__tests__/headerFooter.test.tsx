import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "../components/Header";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import {
  useGetAllCategoriesQuery,
  useWhoamiQuery,
} from "../generated/graphql-types";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { RentalDatesProvider } from "@/context/RentalDatesContext";

// Créer un spy sur les fonctions
vi.mock("../generated/graphql-types", () => ({
  useWhoamiQuery: vi.fn(),
  useGetAllCategoriesQuery: vi.fn(),
}));

const categoriesMock = useGetAllCategoriesQuery as any;
const whoamiMock = useWhoamiQuery as any;

// Simule la réponse de la fonction
categoriesMock.mockReturnValue({
  loading: false,
  error: undefined,
  data: {
    getAllCategories: [
      {
        id: 1,
        image: "https://pathToImage.com",
        title: "Sports Nautiques",
      },
      { id: 2, image: "https://pathToImage.com", title: "Randonnée" },
      { id: 3, image: "https://pathToImage.com", title: "VTT/Vélos" },
      {
        id: 4,
        image: "https://pathToImage.com",
        title: "Sports d'hiver",
      },
    ],
  },
});

describe("Header", () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  it("should display header when user is not connected", async () => {
    whoamiMock.mockReturnValue({
      loading: false,
      error: undefined,
      data: {
        whoami: {
          email: null,
        },
      },
    });

    render(
      <MemoryRouter>
        <RentalDatesProvider>
          <Header />
        </RentalDatesProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText("Wild Rent")).toBeInTheDocument();
    expect(await screen.findByText("Connexion")).toBeInTheDocument();
  });

  it("should display header when user is connected", async () => {
    whoamiMock.mockReturnValue({
      loading: false,
      error: undefined,
      data: {
        whoami: {
          email: "email@gmail.com",
        },
      },
    });

    render(
      <MemoryRouter>
        <RentalDatesProvider>
          <Header />
        </RentalDatesProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText("Wild Rent")).toBeInTheDocument();
    expect(await screen.findByText("Mon compte")).toBeInTheDocument();
  });

  it("should display error when server is down", async () => {
    whoamiMock.mockReturnValue({
      loading: false,
      error: {
        message: "Server down",
      },
      data: undefined,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(whoamiMock.data).toBeUndefined();
    expect(await screen.findByText("An error occured")).toBeInTheDocument();
  });
});

describe("Navbar", () => {
  it("should display all categories", async () => {
    render(
      <MemoryRouter>
        <RentalDatesProvider>
          <Navbar />
        </RentalDatesProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText("Randonnée")).toBeVisible();
    expect(await screen.findByText("Sports Nautiques")).toBeVisible();
    expect(await screen.findByText("VTT/Vélos")).toBeVisible();
    expect(await screen.findByText("Sports d'hiver")).toBeVisible();
  });

  it("should return an error", async () => {
    categoriesMock.mockReturnValue({
      loading: false,
      error: {
        message: "Server down",
      },
      data: undefined,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(await screen.findByText("Error : Server down")).toBeInTheDocument();
  });
});

describe("Footer", () => {
  it("should display footer", async () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(await screen.findByText("Mentions légales")).toBeVisible();
  });
});
