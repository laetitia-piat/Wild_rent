import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Register } from "./pages/Register";
import Home from "./pages/Home";
import ProductsByCategories from "./pages/ProductsByCategories";
import ProductDetails from "./pages/ProductDetails";
import { Layout } from "./pages/Layout";
import ConfirmEmailPage from "./pages/ConfirmEmail";
import { ToastContainer } from "react-toastify";
import Cart from "./pages/Cart";
import { AdminLayout } from "./pages/AdminLayout";
import { AdminArticle } from "./pages/AdminArticle";
import { AdminHomepage } from "./pages/AdminHomepage";
import { AccountDetails } from "./pages/Account/AccountDetails";
import AdminUsers from "./pages/AdminUsers";
import ConfirmRegistration from "./pages/ConfirmRegistration";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import LegalNotice from "./pages/LegalNotice";
import Login from "./pages/Login";
import AdminOrder from "./pages/AdminOrder";
import AdminCategory from "./pages/AdminCategory";
import AccountOrder from "./pages/Account/AccountOrder";
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPassword from "./pages/Account/ResetPassword";
import ForgottenPasswordRequest from "./pages/Account/ForgottenPasswordRequest";
import { AdminInventory } from "./pages/AdminInventory";
import NotFound from "./pages/NotFound";
import Success from "./pages/SuccessPayment";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="categorie/:title" element={<ProductsByCategories />} />
          <Route path="produit/:id" element={<ProductDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="moncompte" element={<AccountDetails />} />
          <Route path="moncompte/mes-commandes" element={<AccountOrder />} />
          <Route path="panier" element={<Cart />} />
          <Route path="enregistrement" element={<Register />} />
          <Route path="RGPD" element={<PrivacyPolicy />} />
          <Route path="mentionslegales" element={<LegalNotice />} />
          <Route path="confirmation/:code?" element={<ConfirmEmailPage />} />
          <Route path="mdp-oublie" element={<ForgottenPasswordRequest />} />
          <Route path="mdp-reset" element={<ResetPassword />} />
          <Route path="success" element={<Success />} />
          <Route
            path="confirmation/enregistrement/:code?"
            element={<ConfirmRegistration />}
          />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHomepage />} />
            <Route path="article" element={<AdminArticle />} />
            <Route path="utilisateurs" element={<AdminUsers />} />
            <Route path="commandes" element={<AdminOrder />} />
            <Route path="categories" element={<AdminCategory />} />
            <Route path="inventaire" element={<AdminInventory />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer theme="colored" />
    </>
  );
}

export default App;
