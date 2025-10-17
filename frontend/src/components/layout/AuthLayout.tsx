import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left Side - Branding */}
        <div className="relative hidden h-full flex-col bg-gradient-to-br from-primary to-secondary p-10 text-white lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mr-3">
              <span className="text-3xl">🐾</span>
            </div>
            <span className="text-2xl font-bold">Stray DogCare</span>
          </div>
          <div className="relative z-20 mt-auto space-y-4">
            <h2 className="text-4xl font-bold leading-tight">
              Every dog deserves <br />a second chance
            </h2>
            <p className="text-lg text-white/90">
              Join our community in rescuing, rehabilitating, and rehoming stray dogs.
              Together, we can make a difference.
            </p>
            <div className="flex items-center space-x-8 pt-6">
              <div>
                <div className="text-3xl font-bold">5,000+</div>
                <div className="text-sm text-white/80">Dogs Rescued</div>
              </div>
              <div>
                <div className="text-3xl font-bold">2,000+</div>
                <div className="text-sm text-white/80">Adoptions</div>
              </div>
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm text-white/80">Volunteers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
            <div className="flex flex-col space-y-2 text-center lg:hidden mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl mx-auto mb-4">
                <span className="text-4xl">🐾</span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Stray DogCare
              </h1>
              <p className="text-sm text-muted-foreground">
                Rescue & Adoption Platform
              </p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
