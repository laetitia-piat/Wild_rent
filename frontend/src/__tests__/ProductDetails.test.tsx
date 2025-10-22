import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import ProductDetails from "../pages/ProductDetails";
import { GET_PRODUCT_BY_ID, WHO_AM_I } from "../graphql/queries";
import "@testing-library/jest-dom";
import { RentalDatesProvider } from "@/context/RentalDatesContext";
import { vi } from "vitest";

const { id }: any = "1";
const useNavigateMock = vi.fn();
const mocks = [
  {
    request: {
      query: GET_PRODUCT_BY_ID,
      variables: { getProductByIdId: parseInt(id) },
    },
    result: {
      data: {
        getProductById: {
          id: 1,
          name: "Produit Test",
          description: "Description",
          price: 100,
          pictures: [{ id: 1, url: "https://via.placeholder.com/150" }],
          created_at: "2023-01-01",
          product_options: [],
        },
      },
    },
  },
  {
    request: {
      query: WHO_AM_I,
    },
    result: {
      data: {
        whoAmI: {
          id: "1",
          email: "test@example.com",
          role: "user",
        },
      },
    },
  },
];
vi.mock("react-router-dom", async () => {
  const actual: any = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => useNavigateMock,
  };
});

test("affiche le nom du produit", async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <RentalDatesProvider>
        <ProductDetails />
      </RentalDatesProvider>
    </MockedProvider>
  );

  expect(await screen.findByText("Produit Test")).toBeInTheDocument();
});
