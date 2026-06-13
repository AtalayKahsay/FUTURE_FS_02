import { Navbar, Sidebar } from "../components";
import "./layout.css"

function Layout({ Children }) {
  return (
    <div className="layout">
      <Sidebar />

      <div className="main-section">
        <Navbar />
        <div className="page-content">
          {Children}
        </div>
      </div>
    </div>
  )
}

export default Layout