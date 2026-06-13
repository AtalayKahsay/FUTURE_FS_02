import "./DashBoard.css"

function DashBoard() {
  return (
    <div className="dashboard">

      <h2 className="title">Dashboard Overview</h2>

      <div className="stats-grid">

        <div className="card">
          <h3>Total Leads</h3>
          <p>120</p>
        </div>

        <div className="card">
          <h3>New Leads</h3>
          <p>45</p>
        </div>

        <div className="card">
          <h3>Converted</h3>
          <p>32</p>
        </div>

        <div className="card">
          <h3>Lost Leads</h3>
          <p>10</p>
        </div>
        
      </div>

      <div className="activity">
        <h3>Recent Activity</h3>

        <ul>
          <li>John Doe was contacted</li>
          <li>Golden Fork Company converted</li>
          <li>New lead added: Sarah</li>
        </ul>
      </div>

      
    </div>
  )
}

export default DashBoard