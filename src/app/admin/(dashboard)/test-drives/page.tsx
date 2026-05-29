import { getTestDriveRequests } from '@/lib/queries/admin'

interface TestDriveRow {
  id: string
  name: string
  phone: string
  email: string | null
  created_at: string
  cars: { name: string; slug: string } | null
}

export default async function TestDrivesPage() {
  const requests = await getTestDriveRequests()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Solicitações de Test Drive</h1>
        <p className="text-white/40 text-sm mt-1">{requests.length} solicitação(ões)</p>
      </div>

      {requests.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-white/30">Nenhuma solicitação ainda.</p>
        </div>
      ) : (
        <div className="glass rounded-xl overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 sm:px-6 py-4 text-white/40 text-xs uppercase tracking-widest font-medium">Nome</th>
                <th className="text-left px-4 py-4 text-white/40 text-xs uppercase tracking-widest font-medium">Telefone</th>
                <th className="text-left px-4 py-4 text-white/40 text-xs uppercase tracking-widest font-medium hidden sm:table-cell">Veículo</th>
                <th className="text-left px-4 py-4 text-white/40 text-xs uppercase tracking-widest font-medium hidden md:table-cell">Data</th>
              </tr>
            </thead>
            <tbody>
              {(requests as TestDriveRow[]).map((req) => (
                <tr key={req.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 sm:px-6 py-4">
                    <p className="text-white text-sm font-medium">{req.name}</p>
                    {req.email && <p className="text-white/30 text-xs">{req.email}</p>}
                  </td>
                  <td className="px-4 py-4 text-white/60 text-sm whitespace-nowrap">{req.phone}</td>
                  <td className="px-4 py-4 text-white/60 text-sm hidden sm:table-cell">{req.cars?.name ?? '—'}</td>
                  <td className="px-4 py-4 text-white/30 text-xs hidden md:table-cell">
                    {new Date(req.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
