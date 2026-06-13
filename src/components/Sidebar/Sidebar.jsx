import { Link } from "react-router-dom"
import "./Sidebar.css"


function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">Mini CRM</h2>

      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/leads">Leads</Link>
        <Link to="/add-lead">Add Lead</Link>
        <Link to="/login">Login</Link>
      </nav>
    </div>
  )
}

export default Sidebar