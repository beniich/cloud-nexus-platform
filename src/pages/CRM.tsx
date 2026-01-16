import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CRM() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
                <p className="text-muted-foreground mt-2">
                    Customer Relationship Management Hub
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Live Pulse</h3>
                    <p className="text-muted-foreground mb-4">
                        Monitor real-time customer interactions and engagement
                    </p>
                    <Link to="/crm/live-pulse">
                        <Button variant="outline" className="w-full">View Live Pulse</Button>
                    </Link>
                </Card>

                <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Ticket Support</h3>
                    <p className="text-muted-foreground mb-4">
                        Manage customer support tickets and requests
                    </p>
                    <Link to="/crm/tickets">
                        <Button variant="outline" className="w-full">View Tickets</Button>
                    </Link>
                </Card>

                <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Sales Pipeline</h3>
                    <p className="text-muted-foreground mb-4">
                        Track deals and opportunities through the sales funnel
                    </p>
                    <Link to="/crm/pipeline">
                        <Button variant="outline" className="w-full">View Pipeline</Button>
                    </Link>
                </Card>
            </div>
        </div>
    );
}
