import { profile } from "@/app/actions/users/profile.actions";

export default async function HomePage() {
    const result = await profile();

    if (!result.success) {
        console.error(result.error);
    }

    const user = result.data;

    return (
        <div>
            <h1>Home</h1>
            <p>Welcome, {user.email}</p>
        </div>
    );
}
