import Papa from 'papaparse'

const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1IN21qO0aFqwGtHj7vMwgZbs3jO-YBnsF5yJaiZ4PKE4/export?format=csv&gid=1388455377'

const BASE_NAME_COL = 12
const BASE_COST_COL = 13
const BASE_MAN_DAY_COL = 14
const WEEK_START_COL = 15
const WEEK_STRIDE = 3

const IGNORED_PHASES = new Set(['paid', 'left to pay', 'total'])

const currencyPattern = /-?\d+(?:[\d,]*\d)?(?:\.\d+)?/g

function normaliseCurrency(value) {
  if (!value) return null
  const match = String(value).match(currencyPattern)
  if (!match) return null
  const numeric = match.join('').replace(/,/g, '')
  return Number.parseFloat(numeric)
}

function normaliseNumber(value) {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number.parseFloat(String(value).replace(/,/g, ''))
  return Number.isNaN(parsed) ? null : parsed
}

function parseWeekDates(weekRow) {
  const dates = []
  weekRow.forEach((label) => {
    if (!label) return
    const trimmed = String(label).trim()
    if (!trimmed) return
    const [day, month, year] = trimmed.split('/').map((segment) => segment.trim())
    const dayNumber = Number.parseInt(day, 10)
    const monthNumber = Number.parseInt(month, 10)
    const yearNumber = Number.parseInt(year, 10)
    if (
      Number.isInteger(dayNumber) &&
      Number.isInteger(monthNumber) &&
      Number.isInteger(yearNumber)
    ) {
      const fullYear = year.length === 2 ? 2000 + yearNumber : yearNumber
      const iso = new Date(Date.UTC(fullYear, monthNumber - 1, dayNumber)).toISOString()
      dates.push({ label: trimmed, iso })
    }
  })
  return dates
}

function parsePhases(rows, weekDates) {
  const phases = []

  for (let i = 4; i < rows.length; i += 1) {
    const row = rows[i]
    if (!row) continue

    const rawName = row[BASE_NAME_COL]
    if (!rawName) continue

    const normalisedName = String(rawName).trim()
    if (!normalisedName) continue

    if (IGNORED_PHASES.has(normalisedName.toLowerCase())) continue

    const baseCost = normaliseCurrency(row[BASE_COST_COL])
    const baseManDays = normaliseNumber(row[BASE_MAN_DAY_COL])

    const activities = []
    let runningCost = baseCost ?? 0
    let runningManDays = baseManDays ?? 0

    weekDates.forEach((week, index) => {
      const startIndex = WEEK_START_COL + index * WEEK_STRIDE
      const activityName = row[startIndex] ? String(row[startIndex]).trim() : ''
      const activityCost = normaliseCurrency(row[startIndex + 1]) ?? 0
      const activityManDays = normaliseNumber(row[startIndex + 2]) ?? 0

      if (!activityName && activityCost === 0 && activityManDays === 0) {
        return
      }

      activities.push({
        id: `${normalisedName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`,
        label: activityName || normalisedName,
        weekLabel: week.label,
        weekStart: week.iso,
        cost: activityCost,
        manDays: activityManDays,
      })

      runningCost += activityCost
      runningManDays += activityManDays
    })

    phases.push({
      id: `${normalisedName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`,
      name: normalisedName,
      baseCost: baseCost ?? 0,
      baseManDays: baseManDays ?? 0,
      activities,
      totalPlannedCost: runningCost,
      totalPlannedManDays: runningManDays,
    })
  }

  return phases
}

function composeJob(phases, weekDates) {
  const totalCost = phases.reduce((sum, phase) => sum + phase.totalPlannedCost, 0)
  const totalManDays = phases.reduce((sum, phase) => sum + phase.totalPlannedManDays, 0)

  const firstWeek = weekDates[0]?.iso ?? null
  const lastWeek = weekDates[weekDates.length - 1]?.iso ?? null

  return {
    id: 'calidwell-program',
    name: 'Programs For Calidwell',
    client: 'Calidwell',
    location: 'Unknown',
    superintendent: 'TBD',
    status: 'Planning',
    plannedCost: totalCost,
    plannedManDays: totalManDays,
    startDate: firstWeek,
    endDate: lastWeek,
    phases,
  }
}

export async function fetchCalidwellProgram() {
  const response = await fetch(SHEET_URL)
  if (!response.ok) {
    throw new Error('Unable to load Calidwell program data.')
  }

  const csv = await response.text()
  const { data } = Papa.parse(csv, { skipEmptyLines: false })

  const weekRow = data[1] ?? []
  const weekDates = parseWeekDates(weekRow)
  const phases = parsePhases(data, weekDates)

  return composeJob(phases, weekDates)
}


