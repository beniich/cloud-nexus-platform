import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CloudSpacesBrowser from "@/components/dashboard/CloudSpacesBrowser";
import CloudSpacesUpload from "@/components/dashboard/CloudSpacesUpload";

export default function CloudSpaces() {
    const [activeTab, setActiveTab] = useState<'browse' | 'upload'>('browse');

    return (
        <div className="container mx-auto py-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'browse' | 'upload')}>
                <TabsList className="mb-6">
                    <TabsTrigger value="browse">Navigateur de fichiers</TabsTrigger>
                    <TabsTrigger value="upload">Téléversement</TabsTrigger>
                </TabsList>

                <TabsContent value="browse">
                    <CloudSpacesBrowser />
                </TabsContent>

                <TabsContent value="upload">
                    <CloudSpacesUpload />
                </TabsContent>
            </Tabs>
        </div>
    );
}
