import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  Building2,
  Shield,
  Sparkles,
  Mic,
  MessageSquare,
  Zap,
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

export default function LandingPage() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Assistant",
      description:
        "Natural language AI that understands your commands and manages appointments intelligently.",
      highlight: true,
    },
    {
      icon: Mic,
      title: "Voice-Operated Interface",
      description:
        "Speak naturally to book appointments, check schedules, and manage patients hands-free.",
      highlight: true,
    },
    {
      icon: MessageSquare,
      title: "Conversational AI",
      description:
        "Chat with AI to handle complex scheduling tasks, conflict resolution, and availability checks.",
      highlight: true,
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description:
        "Intelligent appointment scheduling with AI-powered conflict detection and suggestions.",
    },
    {
      icon: Users,
      title: "Patient Management",
      description:
        "Comprehensive patient records with AI-assisted search and organization.",
    },
    {
      icon: Clock,
      title: "Real-time Availability",
      description:
        "Check available time slots instantly with voice or text commands.",
    },
    {
      icon: Building2,
      title: "Multi-Clinic Support",
      description: "Manage multiple clinics with role-based access control.",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description:
        "Enterprise-grade security with data isolation for complete privacy.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant responses with real-time streaming AI technology.",
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 via-primary/5 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              AI-Powered · Voice-Operated · Real-time Streaming
            </div>
            {/* <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Voice-Operated <span className="text-primary">AI Assistant</span>
              <br />
              for Healthcare */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Smart Scheduling, <span className="text-primary">Simplified</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Talk to your AI assistant to manage appointments, patients, and
              clinic operations. No typing required - just speak naturally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to={ROUTES.AUTH}>
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <Mic className="mr-2 h-5 w-5" />
                  Try Voice Assistant
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <MessageSquare className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-2">
                <Mic className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Voice Commands</h3>
              <p className="text-white/90">"Book John for tomorrow at 2pm"</p>
            </div>
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-2">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Natural Language</h3>
              <p className="text-white/90">
                Chat like you're talking to a colleague
              </p>
            </div>
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-2">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Real-time AI</h3>
              <p className="text-white/90">
                Streaming responses powered by Gemini
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Everything You Need, Voice-Activated
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced AI features combined with powerful clinic management
              tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className={`border-2 transition-all ${
                    feature.highlight
                      ? "border-primary bg-primary/5 hover:shadow-lg hover:border-primary/80"
                      : "hover:border-primary/50"
                  }`}
                >
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                        feature.highlight ? "bg-primary/20" : "bg-primary/10"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          feature.highlight ? "text-primary" : "text-primary/80"
                        }`}
                      />
                    </div>
                    {feature.highlight && (
                      <div className="inline-flex items-center gap-1 text-xs font-semibold text-primary mb-2">
                        <Sparkles className="h-3 w-3" />
                        AI FEATURE
                      </div>
                    )}
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              How Voice AI Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to manage your clinic with voice commands
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-transparent hover:border-primary/20 transition-all">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Click & Speak</h3>
              <p className="text-gray-600">
                Open the AI assistant and click the microphone button to start
                speaking your command.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-transparent hover:border-primary/20 transition-all">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Understands</h3>
              <p className="text-gray-600">
                Our AI processes your voice in real-time, understanding context
                and intent naturally.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-transparent hover:border-primary/20 transition-all">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Action Complete</h3>
              <p className="text-gray-600">
                AI executes your command—booking appointments, checking
                schedules, or managing patients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">
            Ready to Experience Voice AI?
          </h2>
          <p className="text-xl text-white/90">
            Join healthcare professionals using AI to save hours every week.
          </p>
          <Link to={ROUTES.AUTH}>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 mt-6 shadow-xl"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Built for Modern Healthcare
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      AI-Powered Intelligence
                    </h3>
                    <p className="text-gray-600">
                      Advanced natural language processing with Google Gemini
                      for accurate understanding.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      Real-time Streaming
                    </h3>
                    <p className="text-gray-600">
                      See AI responses appear instantly as they're generated, no
                      waiting.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      Multi-Tenant Security
                    </h3>
                    <p className="text-gray-600">
                      Complete data isolation with enterprise-grade security for
                      each clinic.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      Web Speech API
                    </h3>
                    <p className="text-gray-600">
                      Browser-native voice recognition for fast, accurate
                      transcription.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-12 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px]" />
              <div className="relative">
                <Sparkles className="h-64 w-64 text-primary/20" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
