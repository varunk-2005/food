import Tabs from "@/component/Tabs";
import { redirect } from "next/navigation";

export default function EditUserPage() {
    const { loading, data } = useProfile();
    if (loading) return <div>Loading...</div>;
    if (!data) return <div>No data</div>;
    if (!data.admin) {
        redirect("/profile");
    }
    return (<section className="mt-8 mx-auto max-w-2xl">
        <Tabs userData={data} />
    </section>)
}