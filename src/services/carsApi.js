const BASE_URL = '/api'

export const fetchAllCars = async () => {
  const res = await fetch(`${BASE_URL}/cars`)
  if (!res.ok) throw new Error('Failed to fetch cars')
  const json = await res.json()
  return json.data
}

export const fetchCarById = async (id) => {
  const res = await fetch(`${BASE_URL}/cars/${id}`)
  if (!res.ok) throw new Error(`Car not found: ${id}`)
  const json = await res.json()
  return json.data
}
