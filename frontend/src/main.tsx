import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext.tsx";
import { RentalDatesProvider } from "./context/RentalDatesContext.tsx";
import { Provider } from "react-redux";
import { store } from "./store.ts";

export const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache(),
  credentials: "same-origin",
});

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <UserProvider>
      <RentalDatesProvider>
        <Provider store={store}>
          <StrictMode>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </StrictMode>
        </Provider>
      </RentalDatesProvider>
    </UserProvider>
  </ApolloProvider>,
);
