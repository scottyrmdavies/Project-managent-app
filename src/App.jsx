import './App.css'

function App() {
  const jobs = [
    {
      id: 'JOB-1042',
      name: 'Riverfront Apartments',
      client: 'Northstar Developments',
      location: 'Portland, OR',
      superintendent: 'Jamie Cole',
      status: 'On Schedule',
      startDate: 'Mar 3, 2025',
      endDate: 'Dec 18, 2025',
      progress: 48,
    },
    {
      id: 'JOB-1038',
      name: 'Summit Tech HQ Renovation',
      client: 'Summit Technology',
      location: 'Seattle, WA',
      superintendent: 'Alana Ruiz',
      status: 'Needs Attention',
      startDate: 'Jan 20, 2025',
      endDate: 'Nov 5, 2025',
      progress: 62,
    },
    {
      id: 'JOB-1030',
      name: 'Eastside Logistics Center',
      client: 'Pioneer Freight',
      location: 'Tacoma, WA',
      superintendent: 'Marcus Hill',
      status: 'In Procurement',
      startDate: 'Feb 10, 2025',
      endDate: 'Jun 30, 2026',
      progress: 15,
    },
    {
      id: 'JOB-1024',
      name: 'Cedar Grove Elementary',
      client: 'City of Bellevue',
      location: 'Bellevue, WA',
      superintendent: 'Priya Desai',
      status: 'On Hold',
      startDate: 'Nov 14, 2024',
      endDate: 'Aug 22, 2025',
      progress: 73,
    },
  ]

  return (
    <main className="app-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Current workload</p>
          <h1>Active Construction Jobs</h1>
          <p className="subtitle">
            Track milestones, assignments, and risk indicators across every job in the field.
          </p>
        </div>
        <button type="button" className="primary-action">Create Job</button>
      </header>

      <section className="job-list">
        {jobs.map((job) => (
          <article key={job.id} className="job-card">
            <div className="job-card__main">
              <div>
                <h2>{job.name}</h2>
                <p className="job-meta">
                  <span>{job.id}</span>
                  <span>&bull;</span>
                  <span>{job.location}</span>
                </p>
              </div>
              <div className={`status status--${job.status.toLowerCase().replace(/\s+/g, '-')}`}>
                {job.status}
              </div>
            </div>

            <dl className="job-details">
              <div>
                <dt>Client</dt>
                <dd>{job.client}</dd>
              </div>
              <div>
                <dt>Superintendent</dt>
                <dd>{job.superintendent}</dd>
              </div>
              <div>
                <dt>Timeline</dt>
                <dd>
                  {job.startDate} &ndash; {job.endDate}
                </dd>
              </div>
              <div>
                <dt>Completion</dt>
                <dd>
                  <div className="progress">
                    <div className="progress__bar" style={{ width: `${job.progress}%` }} />
                    <span>{job.progress}%</span>
                  </div>
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </main>
  )
}

export default App
