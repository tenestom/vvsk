"use client"

import { useState } from "react"
import { Search, CheckCircle2, Circle, MailCheck, Mail, Download, Eye, EyeOff, Trash2, Pencil, Save, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { togglePaymentStatus, deleteRegistration, updateRegistration } from "@/app/actions/admin"

type Registration = {
  id: string
  created_at: string
  participant_name: string
  participant_personnummer: string
  guardian1_name: string
  guardian1_phone: string
  guardian2_name: string | null
  guardian2_phone: string | null
  email: string
  selected_session: string
  total_price: number
  paid: boolean
  confirmation_sent: boolean
}

interface AdminRegistrationsTableProps {
  initialRegistrations: Registration[]
}

export function AdminRegistrationsTable({ initialRegistrations }: AdminRegistrationsTableProps) {
  const [search, setSearch] = useState("")
  const [sessionFilter, setSessionFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [unmasked, setUnmasked] = useState<Record<string, boolean>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Registration>>({})

  const toggleMask = (id: string) => {
    setUnmasked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const maskPersonnummer = (pn: string) => {
    if (!pn || pn.length < 13) return pn
    return `${pn.substring(0, 9)}****`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const sessionLabels: Record<string, string> = {
    session_1: "Tillfälle 1",
    session_2: "Tillfälle 2",
    session_2_after: "Efteranmälan",
    both: "Båda",
  }

  const handleTogglePayment = async (id: string, currentStatus: boolean) => {
    setIsUpdating(id)
    await togglePaymentStatus(id, currentStatus)
    setIsUpdating(null)
  }

  const startEditing = (reg: Registration) => {
    setEditingId(reg.id)
    setEditData(reg)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditData({})
  }

  const saveEdit = async () => {
    if (!editingId) return
    setIsUpdating(editingId)
    await updateRegistration(editingId, editData)
    setIsUpdating(null)
    setEditingId(null)
  }

  const filteredRegistrations = initialRegistrations.filter((reg) => {
    // 1. Search Filter
    const matchesSearch = reg.participant_name.toLowerCase().includes(search.toLowerCase()) || 
                          reg.guardian1_name.toLowerCase().includes(search.toLowerCase())
    if (!matchesSearch) return false

    // 2. Session Filter
    if (sessionFilter !== "all" && reg.selected_session !== sessionFilter) return false

    // 3. Payment Filter
    if (paymentFilter === "paid" && !reg.paid) return false
    if (paymentFilter === "unpaid" && reg.paid) return false

    return true
  })

  const exportToCSV = () => {
    const headers = [
      "Datum",
      "Deltagare",
      "Personnummer",
      "Målsman 1",
      "Telefon 1",
      "Målsman 2",
      "Telefon 2",
      "E-post",
      "Tillfälle",
      "Pris (kr)",
      "Betald",
    ]

    const escapeCSV = (value: string | number | null | undefined) => {
      if (value === null || value === undefined) return ""
      const stringValue = String(value)
      if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }

    const rows = filteredRegistrations.map((reg) => [
      formatDate(reg.created_at),
      reg.participant_name,
      reg.participant_personnummer,
      reg.guardian1_name,
      reg.guardian1_phone,
      reg.guardian2_name || "",
      reg.guardian2_phone || "",
      reg.email,
      sessionLabels[reg.selected_session] || reg.selected_session,
      reg.total_price,
      reg.paid ? "Ja" : "Nej",
    ])

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map(row => row.map(escapeCSV).join(","))
    ].join("\n")

    // Add UTF-8 BOM so Excel interprets the Swedish characters correctly
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement("a")
    link.href = url
    const dateStr = new Date().toISOString().split("T")[0]
    link.setAttribute("download", `vvsk-anmalningar-${dateStr}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      {/* Filters & Export */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-white border-b border-slate-100 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Sök på deltagare eller målsman..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="h-10 rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value)}
          >
            <option value="all">Alla tillfällen</option>
            <option value="session_1">Tillfälle 1</option>
            <option value="session_2">Tillfälle 2</option>
            <option value="both">Båda tillfällena</option>
          </select>
          <select 
            className="h-10 rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="all">Alla betalstatus</option>
            <option value="paid">Endast betalda</option>
            <option value="unpaid">Endast obetalda</option>
          </select>
        </div>
        
        <Button onClick={exportToCSV} variant="outline" className="gap-2 w-full lg:w-auto">
          <Download className="w-4 h-4" />
          Exportera CSV
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Datum</th>
              <th className="px-6 py-4 font-medium">Deltagare</th>
              <th className="px-6 py-4 font-medium">Personnummer</th>
              <th className="px-6 py-4 font-medium">Målsman & E-post</th>
              <th className="px-6 py-4 font-medium">Tillfälle</th>
              <th className="px-6 py-4 font-medium text-right">Pris</th>
              <th className="px-6 py-4 font-medium text-center">Betalt</th>
              <th className="px-6 py-4 font-medium text-center">Mejl</th>
              <th className="px-6 py-4 font-medium text-center">Åtgärder</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredRegistrations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  Inga anmälningar matchar dina filter.
                </td>
              </tr>
            ) : (
              filteredRegistrations.map((reg) => {
                const isEditing = editingId === reg.id;
                return (
                <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(reg.created_at)}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {isEditing ? (
                      <Input value={editData.participant_name || ""} onChange={e => setEditData({...editData, participant_name: e.target.value})} className="w-full text-sm h-8" />
                    ) : reg.participant_name}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <Input value={editData.participant_personnummer || ""} onChange={e => setEditData({...editData, participant_personnummer: e.target.value})} className="w-full text-sm h-8 font-mono" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">
                          {unmasked[reg.id] ? reg.participant_personnummer : maskPersonnummer(reg.participant_personnummer)}
                        </span>
                        <button 
                          onClick={() => toggleMask(reg.id)}
                          className="text-slate-400 hover:text-slate-600 transition-colors"
                          title={unmasked[reg.id] ? "Dölj" : "Visa"}
                        >
                          {unmasked[reg.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <div className="flex flex-col gap-1">
                        <Input value={editData.guardian1_name || ""} onChange={e => setEditData({...editData, guardian1_name: e.target.value})} placeholder="Namn" className="text-sm h-8" />
                        <Input value={editData.guardian1_phone || ""} onChange={e => setEditData({...editData, guardian1_phone: e.target.value})} placeholder="Telefon" className="text-sm h-8" />
                        <Input value={editData.email || ""} onChange={e => setEditData({...editData, email: e.target.value})} placeholder="E-post" className="text-sm h-8" />
                      </div>
                    ) : (
                      <>
                        <div>{reg.guardian1_name} <span className="text-slate-400 text-xs">({reg.guardian1_phone})</span></div>
                        <a href={`mailto:${reg.email}`} className="text-xs text-primary hover:underline">{reg.email}</a>
                      </>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <select 
                        className="w-full text-sm h-8 rounded-md border border-slate-300"
                        value={editData.selected_session || ""}
                        onChange={e => {
                          const val = e.target.value;
                          setEditData(prev => {
                            let newPrice = prev.total_price;
                            if (val === "both") newPrice = 1200;
                            else if (prev.selected_session === "both" && val !== "both") newPrice = 600;
                            return { ...prev, selected_session: val, total_price: newPrice };
                          });
                        }}
                      >
                        <option value="session_1">Tillfälle 1</option>
                        <option value="session_2">Tillfälle 2</option>
                        <option value="session_2_after">Efteranmälan</option>
                        <option value="both">Båda</option>
                      </select>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {sessionLabels[reg.selected_session] || reg.selected_session}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-right">
                    {isEditing ? (
                      <Input type="number" value={editData.total_price || 0} onChange={e => setEditData({...editData, total_price: parseInt(e.target.value) || 0})} className="w-full text-sm h-8 text-right" />
                    ) : (
                      `${reg.total_price} kr`
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleTogglePayment(reg.id, reg.paid)}
                      disabled={isUpdating === reg.id}
                      className={reg.paid ? "text-green-600 hover:text-green-700 hover:bg-green-50" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}
                      title={reg.paid ? "Markera som obetald" : "Markera som betald"}
                    >
                      {reg.paid ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </Button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {reg.confirmation_sent ? (
                       <span title="Bekräftelse skickad"><MailCheck className="w-4 h-4 text-green-500 mx-auto" /></span>
                    ) : (
                       <span title="Ej skickad"><Mail className="w-4 h-4 text-slate-300 mx-auto" /></span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {isEditing ? (
                      <div className="flex justify-center gap-1">
                        <Button variant="ghost" size="sm" onClick={saveEdit} disabled={isUpdating === reg.id} className="text-green-600 hover:text-green-700 hover:bg-green-50" title="Spara">
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={cancelEditing} disabled={isUpdating === reg.id} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100" title="Avbryt">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => startEditing(reg)} className="text-slate-400 hover:text-blue-600 hover:bg-blue-50" title="Redigera">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            if (window.confirm(`Är du säker på att du vill ta bort ${reg.participant_name}?`)) {
                              deleteRegistration(reg.id)
                            }
                          }}
                          className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                          title="Ta bort anmälan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              )})
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
