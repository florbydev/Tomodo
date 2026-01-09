import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import './index.css'
import { createClient, cacheExchange, fetchExchange, Provider } from "urql";

export const client = createClient({
  url: "/graphql", // your GraphQL endpoint
  exchanges: [cacheExchange, fetchExchange],
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </React.StrictMode>,
)