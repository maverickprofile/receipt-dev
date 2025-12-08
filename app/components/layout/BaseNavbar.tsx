"use client";

import { useMemo } from "react";

// Next
import Link from "next/link";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";

// Assets
import Logo from "@/public/assets/img/invoify-logo.svg";

// ShadCn
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Components
import { DevDebug, LanguageSelector, ThemeSwitcher } from "@/app/components";

const BaseNavbar = () => {
    const devEnv = useMemo(() => {
        return process.env.NODE_ENV === "development";
    }, []);

    const params = useParams();
    const pathname = usePathname();
    const locale = (params.locale as string) || "en";

    return (
        <header className="lg:container z-[99]">
            <nav>
                <Card className="flex flex-wrap justify-between items-center px-5 gap-5">
                    <Link href={"/"}>
                        <Image
                            src={Logo}
                            alt="Invoify Logo"
                            width={190}
                            height={100}
                            loading="eager"
                            style={{ height: "auto" }}
                        />
                    </Link>

                    {/* Navigation for Invoice and Receipt */}
                    <div className="flex gap-2">
                        <Link href={`/${locale}`}>
                            <Button
                                variant={
                                    pathname === `/${locale}` || pathname === "/"
                                        ? "secondary"
                                        : "ghost"
                                }
                            >
                                Invoice
                            </Button>
                        </Link>
                        <Link href={`/${locale}/receipt/templates`}>
                            <Button
                                variant={
                                    pathname.includes("/receipt")
                                        ? "secondary"
                                        : "ghost"
                                }
                            >
                                Receipt
                            </Button>
                        </Link>
                    </div>

                    {/* ? DEV Only */}
                    {devEnv && <DevDebug />}
                    <LanguageSelector />
                    <ThemeSwitcher />
                </Card>
            </nav>
        </header>
    );
};

export default BaseNavbar;
