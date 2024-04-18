import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "@fontsource-variable/plus-jakarta-sans";
import "./app.css";
import { Navbar } from "./components/Navbar";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>Tiny Forum</Title>
          <Navbar />
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
