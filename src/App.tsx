import { useState } from 'react'
import './App.css'
import HomePage from './Home/HomePage'
import Auth from './Auth/Auth'
import AppRoutes from './Route/Route'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AppRoutes />
    </>
  )
}

export default App
