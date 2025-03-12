import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { themeSettings } from "theme";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "pages/layoout/Layout";
import Dashboard from "pages/dashboard/Dashboard";
import Products from "pages/products/Products"
import Customers from "pages/customers/Customers";
import Transactions from "pages/transactions/Transactions";
import Geography from "pages/geography/Geography";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/products" element={<Products/>}/>
              <Route path="/customers" element={<Customers/>}/>
              <Route path="/transactions" element={<Transactions/>}/>
              <Route path="/geography" element={<Geography/>}/>
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
