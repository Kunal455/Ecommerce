import './index.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout'
function App() {
  return (
  <BrowserRouter>
  <Routes>
    <Route>
      {/*User Layout*/}
      {/*Home*/}
      {/*Products*/}
      {/*Cart*/}
    </Route>
    <Route path='/' element={<UserLayout/>}></Route>
  </Routes>
  </BrowserRouter>
  )
}

export default App

