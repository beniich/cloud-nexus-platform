import { Card } from "@/components/ui/card";

export default function Analytics() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground mt-2">
                    View analytics and insights for your platform
                </p>
            </div>

            <Card className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
                        <p className="text-muted-foreground">
                            This feature is under development
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
