import { Route, Routes } from "react-router"
import { Home, Interviewee, Interviewer, Summary } from "./pages"

function App() {

  return (
    <Routes>
      <Route index element={<Home/>} />
      <Route path="/interviewee" element={<Interviewee/>} />
      <Route path="/interviewer" element={<Interviewer/>} />
      <Route path="/summary" element={<Summary/>} />
    </Routes>
  )
}

export default App
