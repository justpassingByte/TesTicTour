"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Trophy, Users, UserCircle, Settings, Menu, X, BarChart3 } from "lucide-react"

import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useLanguage } from "@/components/language-provider"
import { useAuthModalStore } from '@/stores/authModalStore'
import { AuthModal } from '@/components/auth/AuthModal'

interface NavItem {
  title: string
  href?: string
  disabled?: boolean
}

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({
}: MainNavProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()
  const { openModal } = useAuthModalStore()

  const toggleMenu = () => setIsOpen(!isOpen)

  const navItems = [
    {
      href: "/",
      label: t("home"),
      icon: <Home className="h-5 w-5" />,
    },
    {
      href: "/tournaments",
      label: t("tournaments"),
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      href: "/players",
      label: t("players"),
      icon: <Users className="h-5 w-5" />,
    },
    {
      href: "/leaderboard",
      label: t("leaderboard"),
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      href: "/profile",
      label: t("profile"),
      icon: <UserCircle className="h-5 w-5" />,
    },
    {
      href: "/admin",
      label: t("admin"),
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-transparent backdrop-blur supports-[backdrop-filter]:bg-transparent">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center mr-6">
            <span className="text-2xl font-bold tracking-tighter gradient-text">TesTicTour</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map(({ href, label, icon }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <TooltipProvider key={href} delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={href}
                        className={cn(
                          "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                          isActive ? "text-primary" : "text-muted-foreground",
                        )}
                      >
                        {icon}
                        <span>{label}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>{label}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <LanguageToggle />
          <ModeToggle />

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isOpen ? <X /> : <Menu />}
          </Button>

          <Button
            variant="ghost"
            className="text-lg font-bold mr-4"
            onClick={() => openModal('login')}
          >
            {t("header.login")}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"} py-4 px-6 space-y-2 bg-transparent border-b`}>
        {navItems.map(({ href, label, icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 py-2 text-base font-medium transition-colors hover:text-primary",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
              onClick={() => setIsOpen(false)}
            >
              {icon}
              <span>{label}</span>
            </Link>
          )
        })}
      </div>

      <AuthModal />
    </header>
  )
}
