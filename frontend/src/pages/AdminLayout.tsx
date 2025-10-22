import { Outlet } from "react-router-dom";
import { AdminNavbar } from "../components/AdminNavbar";

export const AdminLayout = () => {
  return (
    <div className="flex flex-col flex-1">
      <div className="grid grid-cols-[auto_1fr] flex-1 ">
        <AdminNavbar />
        <main className="overflow-auto p-4 bg-gray-50 flex flex-col flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
