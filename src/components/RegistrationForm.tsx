"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { submitRegistration } from "@/app/actions/register"

const formSchema = z.object({
  participant_name: z.string().min(2, "Namnet måste vara minst 2 tecken"),
  participant_personnummer: z.string().regex(/^\d{8}-\d{4}$/, "Måste vara i formatet ÅÅÅÅMMDD-XXXX"),
  guardian1_name: z.string().min(2, "Målsmans namn måste vara minst 2 tecken"),
  guardian1_phone: z.string().min(6, "Ogiltigt telefonnummer"),
  guardian2_name: z.string().optional(),
  guardian2_phone: z.string().optional(),
  email: z.string().email("Ogiltig e-postadress"),
  selected_session: z.enum(["session_1", "session_2", "session_2_after", "both"], {
    message: "Vänligen välj ett tillfälle",
  }),
})

type FormValues = z.infer<typeof formSchema>

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

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
      participant_personnummer: "",
      guardian1_name: "",
      guardian1_phone: "",
      guardian2_name: "",
      guardian2_phone: "",
      email: "",
      selected_session: undefined,
    },
  })

  const selectedSession = watch("selected_session")
  const participantName = watch("participant_name")

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      const result = await submitRegistration(data)
      if (result.success) {
        setIsSuccess(true)
      } else {
        setSubmitError(result.error || "Ett oväntat fel inträffade.")
      }
    } catch (err) {
      setSubmitError("Kunde inte ansluta till servern.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold font-heading text-slate-900">Tack för din anmälan!</h2>
          <p className="text-slate-600 max-w-md mx-auto">
            Din anmälan för <strong className="text-slate-900">{participantName}</strong> har registrerats.
          </p>
        </div>
        <Button onClick={() => window.location.href = "/"} variant="outline" className="mt-8">
          Tillbaka till startsidan
        </Button>
      </div>
    )
  }

  const sessions = [
    {
      id: "session_1",
      title: "Tillfälle 1",
      date: "14–15 juni",
      price: 800,
    },
    {
      id: "session_2",
      title: "Tillfälle 2",
      date: "6–7 juli",
      price: 800,
    },
    {
      id: "session_2_after",
      title: "Tillfälle 2 efteranmälan",
      date: "Vid deltagande i tillfälle 1",
      price: 400,
    },
    {
      id: "both",
      title: "Båda tillfällena",
      date: "Båda datumen ovan",
      price: 1200,
    },
  ]

  const totalPrice = selectedSession === "both" ? 1200 : selectedSession === "session_2_after" ? 400 : selectedSession ? 800 : 0

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {submitError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
          {submitError}
        </div>
      )}

      {/* Participant Info */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold font-heading text-slate-900 border-b pb-2">Deltagare</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="participant_name">Deltagarens namn *</Label>
            <Input id="participant_name" placeholder="För- och efternamn" {...register("participant_name")} />
            {errors.participant_name && <p className="text-sm text-red-500">{errors.participant_name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="participant_personnummer">Personnummer *</Label>
            <Input id="participant_personnummer" placeholder="ÅÅÅÅMMDD-XXXX" {...register("participant_personnummer")} />
            {errors.participant_personnummer && <p className="text-sm text-red-500">{errors.participant_personnummer.message}</p>}
          </div>
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
                "cursor-pointer rounded-xl border-2 p-4 transition-all hover:border-primary/50 text-center flex flex-col items-center justify-center",
                selectedSession === session.id
                  ? "border-primary bg-primary/5 shadow-soft"
                  : "border-slate-200 bg-white"
              )}
            >
              <div className="font-semibold text-lg text-slate-900">{session.title}</div>
              <div className="text-sm text-slate-500 mt-1">{session.date}</div>
              <div className="mt-3 font-medium text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">
                {session.price} kr
              </div>
            </div>
          ))}
        </div>
        {errors.selected_session && <p className="text-sm text-red-500">{errors.selected_session.message}</p>}
      </div>

      {/* Pricing & Payment Info */}
      <div className="space-y-4 bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 className="text-xl font-semibold font-heading text-slate-900 border-b border-slate-200 pb-2">Betalningsinformation</h3>
        
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-center text-lg">
              <span className="text-slate-600">Totalt att betala:</span>
              <span className="text-3xl font-bold text-slate-900">{totalPrice} kr</span>
            </div>
            
            <div className="space-y-2 pt-4">
              <p className="font-medium text-slate-900">Betalning sker till:</p>
              <ul className="space-y-1 text-slate-600">
                <li><strong className="text-slate-900">Bankgiro:</strong> 5031-4426</li>
                <li><strong className="text-slate-900">Swish:</strong> 1232752855</li>
              </ul>
              <p className="text-sm text-slate-500 italic mt-2">
                Märk betalningen med deltagarens namn.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full text-lg" disabled={isSubmitting || !selectedSession}>
        {isSubmitting ? "Skickar..." : "Slutför anmälan"}
      </Button>
    </form>
  )
}
