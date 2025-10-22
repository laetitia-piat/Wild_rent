import "@testing-library/jest-dom";
import { expect, test, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../pages/Login";
import { UserProvider } from "@/context/UserContext";

// Pour la doc se référer au fichier Register.test.tsx

const loginMutationMock = vi.fn(async () => {});

const useNavigateMock = vi.fn();
vi.mock("../generated/graphql-types.ts", () => ({
  useLoginMutation: (options?: any) => {
    const mockMutationFn = async () => {
      if (options?.onCompleted) {
        options.onCompleted();
      }
      return Promise.resolve();
    };
    loginMutationMock.mockImplementation(mockMutationFn);
    return [loginMutationMock];
  },
  useWhoamiLazyQuery: () => [
    vi.fn(() => Promise.resolve()), // dummy whoami lazy query mock, can be improved below
  ],
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => useNavigateMock, //
}));

test("displays the login page", async () => {
  render(
    <UserProvider>
      <Login />
    </UserProvider>
  );
  const emailInput = screen.getByPlaceholderText("Email");
  const passwordInput = screen.getByPlaceholderText("Mot de passe");
  const submitButton = screen.getByRole("button", { name: "Se connecter" });

  fireEvent.change(emailInput, { target: { value: "email@gmail.com" } });
  fireEvent.change(passwordInput, { target: { value: "password" } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(useNavigateMock).toHaveBeenCalledWith("/");
    expect(loginMutationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { data: { email: "email@gmail.com", password: "password" } },
      })
    );
  });
});
