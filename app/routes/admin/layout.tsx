import { Outlet } from "react-router";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Outlet />
    </div>
  );
}