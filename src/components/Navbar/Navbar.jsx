import "./Navbar.css"

function Navbar() {
  return (
    <div className="navbar">
      <h3>CRM Dashboard</h3>

      <div className="nav-right">
        <span>Admin</span>
        <button>Logout</button>
      </div>
    </div>
  )
}

export default Navbar