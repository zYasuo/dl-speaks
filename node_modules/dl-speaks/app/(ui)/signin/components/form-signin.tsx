"use client";
import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { SSignin, TSignin } from "@shared/schemas/auth/signin.schema";
import { useRouter } from "next/navigation";

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signin } from "@/app/actions/auth/signin.actions";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const FormSignin = () => {
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

    const onSubmit = async (form_data: TSignin) => {
        startSigningIn(async () => {
            const formData = new FormData();

            formData.append("email", form_data.email);
            formData.append("password", form_data.password);

            const { success, message, error, data } = await signin(formData);
            if (success) {
                toast.success(message);
                if (typeof window !== "undefined" && data.access_token) {
                    window.localStorage.setItem("access_token", data.access_token);
                }
                setTimeout(() => {
                    router.push("/dashboard/home");
                }, 1000);
            } else {
                toast.error(error || "Sign in failed", {
                    description: error,
                    action: {
                        label: "Retry",
                        onClick: () => {
                            form.reset();
                        }
                    }
                });
            }
        });
    };

    return (
        <Card className="w-full bg-muted ring-0">
            <CardHeader>
                <CardTitle>Sign in</CardTitle>
                <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
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
