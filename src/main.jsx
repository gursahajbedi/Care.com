import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "./index.css"
import { AuthContextProvider } from './AuthLogic/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
<<<<<<< HEAD
  <AuthContextProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </AuthContextProvider>
=======
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
>>>>>>> master
)
