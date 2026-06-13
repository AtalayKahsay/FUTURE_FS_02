import { Navbar, Sidebar } from "../";
import "./Layout.css"

function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />

      <div className="main-section">
        <Navbar />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout