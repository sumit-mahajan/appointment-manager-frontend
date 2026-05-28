import { Link } from "react-router-dom";
import {
  Calendar,
  Mic,
  MessageSquare,
  Users,
  CheckCircle2,
  Clock,
  Shield,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { MainLayout } from "@/shared/components/layout/MainLayout";
import { ROUTES } from "@/shared/constants/app.constants";

const features = [
  {
    icon: Mic,
    title: "Voice booking",
    description:
      "Speak naturally to book, reschedule, or cancel — hands-free at the front desk.",
  },
  {
    icon: MessageSquare,
    title: "AI receptionist",
    description:
      "An assistant that searches patients, checks slots, and confirms bookings in conversation.",
  },
  {
    icon: Calendar,
    title: "Live calendar",
    description:
      "See today's schedule at a glance with conflict detection and emergency override.",
  },
  {
    icon: Users,
    title: "Patient records",
    description:
      "Create and find patients by name or phone, scoped to your clinic.",
  },
];

const steps = [
  {
    title: "Set up your clinic",
    description:
      "Register, create or join a clinic, and invite your reception team.",
  },
  {
    title: "Manage the schedule",
    description:
      "Book appointments from the calendar, voice assistant, or public booking link.",
  },
  {
    title: "Stay on top of requests",
    description:
      "Review pending online requests and confirm, reschedule, or cancel in one place.",
  },
];

const highlights = [
  "Multi-clinic support with role-based access",
  "Public booking link for patients — no login required",
  "Concurrent booking protection at the database level",
  "Voice + text input for the AI receptionist",
];

export default function LandingPage() {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <p className="mb-4 text-sm font-medium uppercase tracking-wide text-primary">
            For clinics of any specialty
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Voice-first appointment management for clinics
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            An AI receptionist that understands speech and text — book patients,
            check availability, and manage your calendar without switching tools.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to={ROUTES.AUTH}>
              <Button size="lg" className="min-w-[160px] px-8">
                Open App
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Everything a reception desk needs
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Built around how front-desk staff actually work — not generic
            scheduling software.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="border-border/60">
                <CardHeader>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">
              From signup to confirmed appointment in three steps.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="relative text-center md:text-left">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground md:mx-0">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Designed for real clinic operations
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Appoint handles the day-to-day work of a reception team — not just
              a calendar widget. Each clinic has its own patient list, schedule,
              and staff access.
            </p>
            <ul className="mt-8 space-y-4">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <Clock className="mb-2 h-8 w-8 text-primary" />
                <CardTitle className="text-base">Pending requests</CardTitle>
                <CardDescription>
                  Online bookings land as pending until your team approves them.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <Shield className="mb-2 h-8 w-8 text-primary" />
                <CardTitle className="text-base">Clinic isolation</CardTitle>
                <CardDescription>
                  Patient data and appointments stay scoped to each clinic.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-border/60 sm:col-span-2">
              <CardHeader className="pb-2">
                <Mic className="mb-2 h-8 w-8 text-primary" />
                <CardTitle className="text-base">Voice or type</CardTitle>
                <CardDescription>
                  Use the AI assistant by speaking or typing — same workflow,
                  same actions.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Ready to try it?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/90">
            Log in as reception staff, set up your clinic, and start managing
            appointments in minutes.
          </p>
          <Link to={ROUTES.AUTH} className="mt-8 inline-block">
            <Button size="lg" variant="secondary" className="min-w-[160px]">
              Open App
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
