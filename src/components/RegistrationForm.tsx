"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  participant_name: z.string().min(2, "Namnet måste vara minst 2 tecken"),
  guardian1_name: z.string().min(2, "Målsmans namn måste vara minst 2 tecken"),
  guardian1_phone: z.string().min(6, "Ogiltigt telefonnummer"),
  guardian2_name: z.string().optional(),
  guardian2_phone: z.string().optional(),
  email: z.string().email("Ogiltig e-postadress"),
  selected_session: z.enum(["session_1", "session_2", "both"], {
    required_error: "Vänligen välj ett tillfälle",
  }),
})

type FormValues = z.infer<typeof formSchema>

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      participant_name: "",
      guardian1_name: "",
      guardian1_phone: "",
      guardian2_name: "",
      guardian2_phone: "",
      email: "",
      selected_session: undefined,
    },
  })

  const selectedSession = watch("selected_session")

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    // Simulate API call for now (to be implemented in step 8)
    console.log("Form data submitted:", data)
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Anmälan mottagen (simulering)")
    }, 1000)
  }

  const sessions = [
    {
      id: "session_1",
      title: "Tillfälle 1",
      date: "14–15 juni",
    },
    {
      id: "session_2",
      title: "Tillfälle 2",
      date: "6–7 juli",
    },
    {
      id: "both",
      title: "Båda tillfällena",
      date: "Båda datumen ovan",
    },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Participant Info */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold font-heading text-slate-900 border-b pb-2">Deltagare</h3>
        <div className="space-y-2">
          <Label htmlFor="participant_name">Deltagarens namn *</Label>
          <Input id="participant_name" placeholder="För- och efternamn" {...register("participant_name")} />
          {errors.participant_name && <p className="text-sm text-red-500">{errors.participant_name.message}</p>}
        </div>
      </div>

      {/* Guardian Info */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold font-heading text-slate-900 border-b pb-2">Målsmän</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guardian1_name">Målsman 1 namn *</Label>
            <Input id="guardian1_name" placeholder="För- och efternamn" {...register("guardian1_name")} />
            {errors.guardian1_name && <p className="text-sm text-red-500">{errors.guardian1_name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardian1_phone">Målsman 1 telefon *</Label>
            <Input id="guardian1_phone" placeholder="07X-XXX XX XX" {...register("guardian1_phone")} />
            {errors.guardian1_phone && <p className="text-sm text-red-500">{errors.guardian1_phone.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guardian2_name">Målsman 2 namn (Frivilligt)</Label>
            <Input id="guardian2_name" placeholder="För- och efternamn" {...register("guardian2_name")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardian2_phone">Målsman 2 telefon (Frivilligt)</Label>
            <Input id="guardian2_phone" placeholder="07X-XXX XX XX" {...register("guardian2_phone")} />
          </div>
        </div>
        
        <div className="space-y-2 pt-2">
          <Label htmlFor="email">E-postadress för bekräftelse *</Label>
          <Input id="email" type="email" placeholder="namn@exempel.se" {...register("email")} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
      </div>

      {/* Session Selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold font-heading text-slate-900 border-b pb-2">Välj tillfälle *</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setValue("selected_session", session.id as any, { shouldValidate: true })}
              className={cn(
                "cursor-pointer rounded-xl border-2 p-4 transition-all hover:border-primary/50 text-center",
                selectedSession === session.id
                  ? "border-primary bg-primary/5 shadow-soft"
                  : "border-slate-200 bg-white"
              )}
            >
              <div className="font-semibold text-lg text-slate-900">{session.title}</div>
              <div className="text-sm text-slate-500 mt-1">{session.date}</div>
            </div>
          ))}
        </div>
        {errors.selected_session && <p className="text-sm text-red-500">{errors.selected_session.message}</p>}
      </div>

      <Button type="submit" size="lg" className="w-full text-lg" disabled={isSubmitting}>
        {isSubmitting ? "Skickar..." : "Slutför anmälan"}
      </Button>
    </form>
  )
}
