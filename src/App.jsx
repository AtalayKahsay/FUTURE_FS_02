import { Routes, Route } from "react-router-dom"

import { Dashboard, Leads, AddLead, Login } from "./pages"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/leads" element={<Leads />} />
      <Route path="/add-lead" element={<AddLead />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
