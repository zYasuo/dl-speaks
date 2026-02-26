"use client";
import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { SSignin, TSignin, TSigninResponse } from "@shared/schemas/auth/signin.schema";
import type { IActionResponse } from "@/app/types/api/api.types";
import { useRouter } from "next/navigation";

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface IFormSigninProps {
    onSignin: (form_data: TSignin) => Promise<IActionResponse<TSigninResponse>>;
}

const FormSignin = ({ onSignin }: IFormSigninProps) => {
    const [isSigningIn, startSigningIn] = React.useTransition();
    const [showPassword, setShowPassword] = React.useState(false);
    const router = useRouter();

    const form = useForm<TSignin>({
        resolver: zodResolver(SSignin),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    async function handleSubmit(form_data: TSignin) {
        startSigningIn(async () => {
            const result = await onSignin(form_data);
            if (result.success) {
                toast.success(result.message);
                router.push("/dashboard/dictionary/words");
            } else {
                toast.error(result.error ?? result.message);
            }
        });
    }

    return (
        <Card className="w-full bg-muted ring-0">
            <CardHeader>
                <CardTitle>Sign in</CardTitle>
                <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form id="form-rhf-demo" onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="space-y-8">
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                        <Input id={field.name} disabled={isSigningIn} placeholder="Enter your email" {...field} />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        <FieldGroup>
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                        <div className="relative">
                                            <Input
                                                id={field.name}
                                                disabled={isSigningIn}
                                                placeholder="Enter your password"
                                                {...field}
                                                type={showPassword ? "text" : "password"}
                                                className="pr-10"
                                            />
                                            <Button
                                                type="button"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                                onClick={() => setShowPassword(!showPassword)}
                                                size="icon-xs"
                                                variant="ghost"
                                                className="absolute right-0 top-1/2 -translate-y-1/2"
                                            >
                                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                            </Button>
                                        </div>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        <Button type="submit" className="w-full" disabled={isSigningIn}>
                            {isSigningIn ? <Spinner /> : "Sign in"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default FormSignin;
