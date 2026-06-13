import { Routes, Route } from "react-router-dom"

import { Layout } from "./components"

import { Dashboard, Leads, AddLead, Login } from "./pages"

function App() {

  return (
    <Routes>

      <Route path="/" element={
        <Layout>
          <Dashboard />
        </Layout>
      } />

      <Route path="/leads" element={
        <Layout>
          <Leads />
        </Layout>
      } />

      <Route path="/add-lead" element={
        <Layout>
          <AddLead />
        </Layout>
      } />

      <Route path="/login" element={<Login />} />

    </Routes>
  )
}

export default App
