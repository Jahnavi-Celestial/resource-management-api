import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ApolloCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { client } from './apolloClient.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ApolloProvider client={client} cache={new ApolloCache()}>
        <App />
      </ApolloProvider>
    </AuthProvider>
  </StrictMode>
)
