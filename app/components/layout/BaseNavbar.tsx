"use client";

import { useMemo, useState } from "react";

// Next
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

// Icons
import { Menu, X, Receipt, User, ChevronDown, Coins } from "lucide-react";

// ShadCn
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Components
import { DevDebug, LanguageSelector, ThemeSwitcher } from "@/app/components";

// Auth
import { useSession, signOut } from "@/lib/auth-client";

// Hooks
import { useCredits } from "@/hooks/useCredits";

const NAV_LINKS = [
    { name: "Templates", href: "/templates" },
    { name: "Examples", href: "/examples" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
    { name: "Suggest a Feature", href: "/suggest" },
];

const BaseNavbar = () => {
    const devEnv = useMemo(() => {
        return process.env.NODE_ENV === "development";
    }, []);

    const params = useParams();
    const pathname = usePathname();
    const locale = (params.locale as string) || "en";
    const { data: session, isPending } = useSession();
    const { credits, isLoading: creditsLoading } = useCredits();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isLoggedIn = !!session?.user;
    const userName = session?.user?.name || "User";
    const userEmail = session?.user?.email || "";

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <header className="sticky top-0 z-[99] bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700">
            <nav className="container mx-auto px-3 sm:px-4">
                {/* Increased height from h-16 to h-20 */}
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href={`/${locale}`} className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            MakeReceipt
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.name}
                                href={`/${locale}${link.href}`}
                                className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${pathname.includes(link.href)
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-gray-600 dark:text-gray-300"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* ? DEV Only - Commented out for now */}
                        {/* {devEnv && <DevDebug />} */}

                        <LanguageSelector />
                        <ThemeSwitcher />

                        {isPending ? (
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                        ) : isLoggedIn ? (
                            <>
                                {/* Credits Badge */}
                                {!creditsLoading && credits && (
                                    <Link
                                        href={`/${locale}/pricing`}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 rounded-full hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 transition-colors"
                                        title="View Pricing"
                                    >
                                        <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                        <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                                            {credits.balance}
                                        </span>
                                    </Link>
                                )}

                                <Link href={`/${locale}/generate`}>
                                    <Button
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 h-8 text-xs font-medium"
                                    >
                                        Generate Receipt
                                    </Button>
                                </Link>

                                {/* Profile Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-1 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <ChevronDown className="w-3 h-3 text-gray-500" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <div className="px-3 py-2">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {userName}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {userEmail}
                                            </p>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href={`/${locale}/profile`} className="cursor-pointer">
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={`/${locale}/pricing`} className="cursor-pointer">
                                                Pricing
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleSignOut}
                                            className="cursor-pointer text-red-600 dark:text-red-400"
                                        >
                                            Sign Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Link href={`/${locale}/sign-in`}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 h-8 text-xs font-medium"
                                    >
                                        Log In
                                    </Button>
                                </Link>
                                <Link href={`/${locale}/generate`}>
                                    <Button
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 h-8 text-xs font-medium"
                                    >
                                        Generate Receipt
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col gap-3">
                            {/* User info for logged in users */}
                            {isLoggedIn && (
                                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {userName}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {userEmail}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Mobile Credits Badge */}
                                    {!creditsLoading && credits && (
                                        <Link
                                            href={`/${locale}/pricing`}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 rounded-full"
                                        >
                                            <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                                                {credits.balance}
                                            </span>
                                        </Link>
                                    )}
                                </div>
                            )}

                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.name}
                                    href={`/${locale}${link.href}`}
                                    className={`text-sm font-medium py-2 transition-colors ${pathname.includes(link.href)
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-600 dark:text-gray-300"
                                        }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                <LanguageSelector />
                                <ThemeSwitcher />
                            </div>

                            {!isPending && !isLoggedIn && (
                                <Link href={`/${locale}/sign-in`} onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="outline" size="sm" className="w-full">
                                        Log In
                                    </Button>
                                </Link>
                            )}

                            <Link href={`/${locale}/generate`} onClick={() => setMobileMenuOpen(false)}>
                                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                    Generate Receipt
                                </Button>
                            </Link>

                            {isLoggedIn && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleSignOut}
                                    className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    Sign Out
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default BaseNavbar;
