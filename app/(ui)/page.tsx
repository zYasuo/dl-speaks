import FormSignin from "@/app/(ui)/signin/components/form-signin";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign in",
    description: "Sign in to your account",
};

export default function Page() {
    return (
        <div className="flex justify-center items-center min-h-screen md:max-w-md mx-auto max-w-xs">
            <FormSignin />
        </div>
    );
}
