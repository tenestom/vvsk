"use client"

import { useState } from "react"
import { Search, Trash2, Plus, Calendar as CalendarIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { addMember, deleteMember } from "@/app/actions/admin"

export type Member = {
  id: string
  name: string
  role: string
  created_at: string
}

export type LokAttendance = {
  id: string
  date: string
  member_id: string
}

interface AdminMembersProps {
  initialMembers: Member[]
  initialAttendance: LokAttendance[]
}

export function AdminMembers({ initialMembers, initialAttendance }: AdminMembersProps) {
  const [search, setSearch] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [newName, setNewName] = useState("")
  const [newRole, setNewRole] = useState("åkare")
  const [isUpdating, setIsUpdating] = useState(false)

  // Calendar State
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const filteredMembers = initialMembers.filter((m) => 
    m.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    setIsUpdating(true)
    await addMember(newName, newRole)
    setNewName("")
    setNewRole("åkare")
    setIsAdding(false)
    setIsUpdating(false)
  }

  const handleDeleteMember = async (id: string, name: string) => {
    if (window.confirm(`Är du säker på att du vill ta bort ${name}?`)) {
      setIsUpdating(true)
      await deleteMember(id)
      setIsUpdating(false)
    }
  }

  // Get members who attended on the selected date
  const attendedMemberIds = new Set(
    initialAttendance.filter(a => a.date === selectedDate).map(a => a.member_id)
  )

  return (
    <div className="space-y-6 p-4 bg-white">
      {/* Calendar Section */}
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          Närvarohistorik
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full sm:w-auto"
          />
          <div className="text-sm text-slate-600">
            {attendedMemberIds.size} medlemmar närvarande detta datum
          </div>
        </div>
        
        {attendedMemberIds.size > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {initialMembers.filter(m => attendedMemberIds.has(m.id)).map(m => (
              <span key={m.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {m.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">Medlemmar</h2>
        <Button onClick={() => setIsAdding(!isAdding)} className="gap-2">
          <Plus className="w-4 h-4" />
          Ny medlem
        </Button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddMember} className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Namn</label>
            <Input 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)}
              placeholder="För- och efternamn"
              required
            />
          </div>
          <div className="w-full sm:w-48">
            <label className="block text-sm font-medium text-slate-700 mb-1">Roll</label>
            <select 
              className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="åkare">Åkare</option>
              <option value="båtförare">Båtförare</option>
              <option value="båda">Båda</option>
            </select>
          </div>
          <Button type="submit" disabled={isUpdating} className="w-full sm:w-auto">Spara</Button>
          <Button type="button" variant="ghost" onClick={() => setIsAdding(false)} className="w-full sm:w-auto">Avbryt</Button>
        </form>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input 
          placeholder="Sök medlemmar..." 
          className="pl-9 max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Members Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Namn</th>
              <th className="px-6 py-4 font-medium">Roll</th>
              <th className="px-6 py-4 font-medium text-right">Åtgärder</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                  Inga medlemmar hittades.
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">{member.name}</td>
                  <td className="px-6 py-4 capitalize">{member.role}</td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      disabled={isUpdating}
                      onClick={() => handleDeleteMember(member.id, member.name)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                      title="Ta bort"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
