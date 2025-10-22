import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const Layout = () => {
  return (
    <main className="main-content flex flex-col min-h-screen ">
      <Header />
      <div className="flex flex-col flex-1">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};
