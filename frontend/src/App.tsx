import { Outlet } from "react-router-dom";
import AppSidebar from "./components/app-sidebar";
import { SidebarProvider } from "./components/ui/sidebar";

function App() {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <main className="m-2 p-2 w-full">
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}


export default App;
