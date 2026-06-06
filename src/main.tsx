import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider } from 'react-router'
import { router } from './Route/Routes'
import { store } from './redux/store'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <Provider store={store}>
    <AuthProvider>
    <Toaster />
    <RouterProvider  router={router} />
    </AuthProvider>
   </Provider>
  </StrictMode>,

 
)
