import { getAllLeads, getAllCarsAdmin } from '@/lib/queries/admin'
import LeadsClient from '@/components/admin/LeadsClient'

export default async function LeadsPage() {
  const [leads, cars] = await Promise.all([
    getAllLeads(),
    getAllCarsAdmin(),
  ])

  const carList = cars.map(c => ({ id: c.id, name: c.name }))

  return <LeadsClient leads={leads} cars={carList} />
}
