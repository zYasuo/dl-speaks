import FormSignin from "@/app/(ui)/signin/components/form-signin";
import { GalleryVerticalEnd } from "lucide-react";
import { Metadata } from "next";
import { signin } from "@/app/actions/auth/signin.actions";
import { TSignin } from "@shared/schemas/auth/signin.schema";

export const metadata: Metadata = {
    title: "Sign in",
    description: "Sign in to your account"
};

export default function SigninPage() {
    async function handleSignin(data: TSignin) {
        "use server";
        return await signin(data);
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center font-medium">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    DL Speaks
                </a>
                <FormSignin onSignin={handleSignin} />
            </div>
        </div>
    );
}
