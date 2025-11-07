const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
})

export function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '£0'
  }
  return currencyFormatter.format(value)
}

const numberFormatter = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 1,
})

export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '0'
  }
  return numberFormatter.format(value)
}


