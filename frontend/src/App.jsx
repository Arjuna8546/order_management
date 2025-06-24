import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import FormPage from './pages/FormPage'

function App() {


  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<FormPage />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
