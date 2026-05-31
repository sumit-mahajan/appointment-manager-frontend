import { Link } from 'react-router-dom'
import { APP_NAME, ROUTES } from '@/shared/constants/app.constants'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/20">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <p className="text-lg font-semibold text-foreground">{APP_NAME}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Voice-first appointment management for clinics. AI-assisted
              scheduling, patient records, and a public booking link — built for
              reception teams.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Product</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to={ROUTES.AUTH} className="hover:text-primary transition-colors">
                  Staff login
                </Link>
              </li>
              <li>
                <Link to={ROUTES.BOOK} className="hover:text-primary transition-colors">
                  Book appointment
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Source</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://github.com/sumit-mahajan/appointment-manager-backend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-8 text-center text-sm text-muted-foreground">
          © {year} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
