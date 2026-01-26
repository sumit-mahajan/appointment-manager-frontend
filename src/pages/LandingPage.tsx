import { Link } from 'react-router-dom'
import { Calendar, Users, Clock, CheckCircle2, Building2, Shield } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { MainLayout } from '@/shared/components/layout/MainLayout'
import { ROUTES } from '@/shared/constants/app.constants'

export default function LandingPage() {
  const features = [
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Intelligent appointment scheduling with conflict detection and automated reminders.',
    },
    {
      icon: Users,
      title: 'Patient Management',
      description: 'Comprehensive patient records and history tracking in one secure location.',
    },
    {
      icon: Clock,
      title: 'Real-time Availability',
      description: 'Check available time slots instantly and book appointments with ease.',
    },
    {
      icon: Building2,
      title: 'Multi-Clinic Support',
      description: 'Manage multiple clinics or join existing ones with role-based access control.',
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with data isolation for complete privacy.',
    },
    {
      icon: CheckCircle2,
      title: 'Easy Onboarding',
      description: 'Get started in minutes with our intuitive setup wizard.',
    },
  ]

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Simplify Your{' '}
              <span className="text-primary">Appointment Management</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A modern, intuitive platform designed for healthcare professionals to manage appointments, 
              patients, and clinic operations efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={ROUTES.AUTH}>
                <Button size="lg" className="text-lg px-8 py-6">
                  Get Started Free
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Everything You Need to Manage Your Clinic
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to streamline your workflow and improve patient care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-2 hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Ready to Transform Your Clinic?
          </h2>
          <p className="text-xl text-gray-600">
            Join healthcare professionals who trust our platform for their daily operations.
          </p>
          <Link to={ROUTES.AUTH}>
            <Button size="lg" className="text-lg px-8 py-6">
              Start Your Free Trial
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
                    <h3 className="font-semibold text-lg text-gray-900">Multi-Tenant Architecture</h3>
                    <p className="text-gray-600">Complete data isolation ensures privacy and security for each clinic.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Role-Based Access</h3>
                    <p className="text-gray-600">Owner and staff roles with appropriate permissions and controls.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Cloud-Based Access</h3>
                    <p className="text-gray-600">Access your data anywhere, anytime with our secure cloud platform.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-12 flex items-center justify-center">
              <Building2 className="h-64 w-64 text-primary/20" />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
