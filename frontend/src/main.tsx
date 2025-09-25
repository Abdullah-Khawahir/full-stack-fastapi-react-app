import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import Home from "./pages/Home";
import Items from "./pages/Items";

import "./index.css";
import ItemForm from "./pages/item-form";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={client}>

        <Routes>
          <Route path="/" element={<App />}>

            <Route index element={<Home />} />
            <Route path="items" element={<Items />} />
            <Route path="item-form/:item_id?" element={<ItemForm />} />
            <Route path="dashboard" element={<Home />} />

          </Route>

        </Routes>

      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
