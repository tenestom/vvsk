"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, CheckSquare, Square, Save } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { registerLokAttendance } from "@/app/actions/lok"
import { Member } from "@/components/AdminMembers"

interface LokAttendanceFormProps {
  members: Member[]
}

export function LokAttendanceForm({ members }: LokAttendanceFormProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendedIds, setAttendedIds] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const toggleAttendance = (id: string) => {
    setAttendedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSuccessMessage("")
    
    const result = await registerLokAttendance(selectedDate, Array.from(attendedIds))
    
    if (result.success) {
      setSuccessMessage("Närvaro registrerad! Ett mejl har skickats till Sara.")
      // Reset after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000)
    } else {
      alert("Ett fel inträffade när närvaron skulle sparas.")
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-soft">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Välj Datum</h2>
              <p className="text-sm text-slate-500">Registrera LOK-närvaro för ett specifikt datum.</p>
            </div>
          </div>
          <Input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full sm:w-auto h-12 px-4"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-slate-700">Klicka på de medlemmar som var närvarande:</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {members.map(member => {
              const isPresent = attendedIds.has(member.id)
              return (
                <button
                  key={member.id}
                  onClick={() => toggleAttendance(member.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                    isPresent 
                      ? 'border-green-500 bg-green-50 text-green-900' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {isPresent ? (
                    <CheckSquare className="w-5 h-5 text-green-500 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-300 shrink-0" />
                  )}
                  <div className="truncate">
                    <div className="font-medium truncate">{member.name}</div>
                    <div className="text-xs opacity-70 capitalize">{member.role}</div>
                  </div>
                </button>
              )
            })}
          </div>
          
          {members.length === 0 && (
            <p className="text-slate-500 text-center py-8">
              Inga medlemmar finns inlagda i systemet ännu.
            </p>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm font-medium text-slate-600">
            {attendedIds.size} medlemmar markerade för närvaro
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {successMessage && (
              <span className="text-sm text-green-600 font-medium">
                {successMessage}
              </span>
            )}
            <Button 
              size="lg" 
              onClick={handleSubmit} 
              disabled={isSubmitting || members.length === 0}
              className="gap-2 w-full sm:w-auto"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Registrerar..." : "Registrera Närvaro"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
