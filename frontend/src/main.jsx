import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./shared/context/AuthContext.jsx";
import { ApolloCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./services/apolloClient.js";
import { PermissionProvider } from "./shared/context/PermissionContext.jsx";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider } from "ag-grid-react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <PermissionProvider>
        <ApolloProvider client={client} cache={new ApolloCache()}>
          <AgGridProvider modules={[AllCommunityModule]}>
          <App />
          </AgGridProvider>
        </ApolloProvider>
      </PermissionProvider>
    </AuthProvider>
  </StrictMode>,
);
