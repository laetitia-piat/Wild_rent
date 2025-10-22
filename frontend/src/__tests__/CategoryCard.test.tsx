import "@testing-library/jest-dom";
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";

test("display category card with title", async () => {
  render(
    <MemoryRouter>
      <CategoryCard
        id={1}
        title={"Camping"}
        image={
          "https://images.unsplash.com/photo-1741567348603-0bef4612bea2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8"
        }
      />
    </MemoryRouter>
  );
  expect(await screen.findByText("Camping")).toBeInTheDocument();
});

test("display image alt text", async () => {
  render(
    <MemoryRouter>
      <CategoryCard
        id={1}
        title={"Camping"}
        image={
          "https://images.unsplash.com/photo-1741567348603-0bef4612bea2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8"
        }
      />
    </MemoryRouter>
  );
  const image = screen.getByRole("img");
  expect(image).toHaveAttribute("alt", "Camping");
});
