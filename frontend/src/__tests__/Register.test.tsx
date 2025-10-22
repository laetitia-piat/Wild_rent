import "@testing-library/jest-dom";
import {  expect, test, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Register } from "../pages/Register";
import { toast } from "react-toastify";
// Attention vi.mock ne fonctionne qu'avec les modules importés avec le mot clé "import" et non "require"
// vi.fn est équivalent à un spy. Il est utilisé pour créer des fonctions simulées qui peuvent surveiller les appels, les arguments, et les valeurs de retour.
// Permet de vérifier si une fonction a été appelée, combien de fois elle a été appelée, et avec quels arguments.

const registerMutationMock = vi.fn(({ onCompleted }) => {
    onCompleted();  //onCompleted permet de simuler l'appel de la fonction
});

const useNavigateMock = vi.fn();  //vi.fn() permet de créer une fonction mock
vi.mock("../generated/graphql-types.ts", () => ({ 
    useRegisterMutation: () => [registerMutationMock],
}));
vi.mock("react-router-dom", () => ({ 
    useNavigate: () => useNavigateMock,
}));
vi.mock("react-toastify", () => ({ 
    toast: {
        success: vi.fn(), 
    },
}));

test("displays the registration page", async () => {
    render(<Register />);
        const firstNameInput = screen.getByPlaceholderText("Prénom");
        const lastNameInput = screen.getByPlaceholderText("Nom de famille");
        const phoneNumberInput = screen.getByPlaceholderText("Numéro de téléphone"); //screen.getByPlaceholderText permet de récupérer un élément par son placeholder
        const emailInput = screen.getByPlaceholderText("Email");
        const passwordInput = screen.getByPlaceholderText("Mot de passe"); 
        const submitButton = screen.getByRole("button", { name: "S'inscrire" }); //screen.getByRole permet de récupérer un élément par son rôle

        // fireEvent.change simule une donnée mise par un utilisateur dans le champ de texte
        fireEvent.change(firstNameInput, { target: { value: "Pierre" } }); 
        fireEvent.change(lastNameInput, { target: { value: "Caillou" } });
        fireEvent.change(phoneNumberInput, { target: { value: "0636656565" } });
        fireEvent.change(emailInput, { target: { value: "email@gmail.com" } });
        fireEvent.change(passwordInput, { target: { value: "password" } });
        fireEvent.click(submitButton);

    await waitFor(() => { // waitFor permet d'attendre que l'élément soit affiché

        expect(toast.success).toHaveBeenCalledWith("Consultez vos emails afin de finaliser votre inscription !"); //expect permet de vérifier que la fonction a été appelée avec les bons arguments

        expect(useNavigateMock).toHaveBeenCalledWith("/"); //expect permet de vérifier que la fonction a été appelée avec les bons arguments

        expect(registerMutationMock).toHaveBeenCalledWith(
            expect.objectContaining({  //expect.objectContaining permet de vérifier que l'objet contient les propriétés spécifiées
                variables: { data: 
                    { first_name: "Pierre", last_name: "Caillou", phone_number:"0636656565" , email: "email@gmail.com", password: "password" } },
            })
        );
    });
});