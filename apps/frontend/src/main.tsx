import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SigninLayout from "./SignLayout.tsx";
import SignInComponent from "./components/auth/SignInComponent.tsx";
import PageNotFound from "./PageNotFound.tsx";
import SignUpComponent from "./components/auth/SignUpComponent.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<SigninLayout />}>
            <Route path="/signin" element={<SignInComponent />} />
            <Route path="/signup" element={<SignUpComponent />} />
          </Route>
          <Route element={<App />}>
            <Route path="/" element={<App />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
