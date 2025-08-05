import '../css/app.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import NextThemesProvider from "./pages/landing"


ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <NextThemesProvider />
  </React.StrictMode>
)
