import './App.css'
import { useCalidwellProgram } from './hooks/useCalidwellProgram'
import { formatCurrency, formatNumber } from './utils/formatters'

function App() {
  const { job: programJob, status: programStatus, error: programError } = useCalidwellProgram()

  const baseJobs = [
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
      plannedCost: 126_000_000,
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
      plannedCost: 58_500_000,
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
      plannedCost: 92_400_000,
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
      plannedCost: 34_800_000,
    },
  ]

  const jobs = programJob
    ? [
        {
          id: programJob.id,
          name: programJob.name,
          client: programJob.client,
          location: programJob.location,
          superintendent: programJob.superintendent,
          status: programJob.status,
          startDate: programJob.startDate
            ? new Date(programJob.startDate).toLocaleDateString('en-GB', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'TBC',
          endDate: programJob.endDate
            ? new Date(programJob.endDate).toLocaleDateString('en-GB', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'TBC',
          progress: Math.min(
            100,
            Math.round(
              (programJob.phases.reduce((set, phase) => {
                phase.activities.forEach((activity) => set.add(activity.weekStart))
                return set
              }, new Set()).size /
                Math.max(programJob.phases.length, 1)) *
                100,
            ),
          ),
          plannedCost: programJob.plannedCost,
        },
        ...baseJobs,
      ]
    : baseJobs

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
                <dt>Planned Cost</dt>
                <dd>{formatCurrency(job.plannedCost)}</dd>
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

      <section className="program-panel">
        <header className="program-header">
          <div>
            <p className="eyebrow">Imported data</p>
            <h2>Programs For Calidwell</h2>
            <p className="subtitle">
              Live quantities and prices synced from the shared spreadsheet. Use this panel to
              monitor budget exposure ahead of procurement.
            </p>
          </div>
          <span className={`status status--${programJob ? 'on-schedule' : 'in-procurement'}`}>
            {programStatus === 'loading' && 'Loading…'}
            {programStatus === 'error' && 'Refresh required'}
            {programStatus === 'success' && 'Synced'}
            {programStatus === 'idle' && 'Ready'}
          </span>
        </header>

        {programError ? (
          <div className="program-error">
            <p>There was a problem fetching the Calidwell program data.</p>
            <p className="hint">{programError.message}</p>
          </div>
        ) : (
          <>
            <dl className="program-metrics">
              <div>
                <dt>Planned Cost</dt>
                <dd>
                  {programJob ? formatCurrency(programJob.plannedCost) : <span className="skeleton" />}
                </dd>
              </div>
              <div>
                <dt>Planned Man Days</dt>
                <dd>
                  {programJob ? formatNumber(programJob.plannedManDays) : <span className="skeleton" />}
                </dd>
              </div>
              <div>
                <dt>Work Packages</dt>
                <dd>
                  {programJob ? programJob.phases.length : <span className="skeleton" />}
                </dd>
              </div>
              <div>
                <dt>Weeks Covered</dt>
                <dd>
                  {programJob ? (
                    programJob.phases.reduce((set, phase) => {
                      phase.activities.forEach((activity) => set.add(activity.weekLabel))
                      return set
                    }, new Set()).size
                  ) : (
                    <span className="skeleton" />
                  )}
                </dd>
              </div>
            </dl>

            <div className="program-table-wrapper">
              <table className="program-table">
                <thead>
                  <tr>
                    <th scope="col">Phase</th>
                    <th scope="col">Planned cost</th>
                    <th scope="col">Man days</th>
                    <th scope="col">Upcoming activity</th>
                    <th scope="col">Next week</th>
                  </tr>
                </thead>
                <tbody>
                  {(programJob?.phases ?? []).slice(0, 8).map((phase) => {
                    const upcoming = phase.activities.find((activity) =>
                      activity.weekStart ? new Date(activity.weekStart) >= new Date() : false,
                    )
                    return (
                      <tr key={phase.id}>
                        <th scope="row">{phase.name}</th>
                        <td>{formatCurrency(phase.totalPlannedCost)}</td>
                        <td>{formatNumber(phase.totalPlannedManDays)}</td>
                        <td>{upcoming?.label ?? phase.activities[0]?.label ?? '—'}</td>
                        <td>{upcoming?.weekLabel ?? '—'}</td>
                      </tr>
                    )
                  })}
                  {!programJob && (
                    <tr>
                      <td colSpan={5}>
                        <div className="program-placeholder">
                          <span className="skeleton" />
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </main>
  )
}

export default App
