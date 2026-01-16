import ServersManagement from "@/components/dashboard/ServersManagement";

export default function Servers() {
    return (
        <div className="container mx-auto py-6">
            <ServersManagement role="admin" />
        </div>
    );
}
