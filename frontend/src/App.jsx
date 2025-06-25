import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import FormPage from './pages/FormPage'
import { Toaster } from 'sonner';

function App() {


  return (
    <>
      <Router>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<FormPage />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
