import React from 'react';
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button"

const NotFound = () => {
    return (
        <div className="flex h-screen items-center justify-center">
            <Card className="p-3 text-center w-2xl">
                <h1 className="text-3xl">Not Found</h1>
                <p>Sorry, We could not find the page...</p>
                <div className="text-center">
                    <Button className="w-2/12">Back to Home</Button>
                </div>

            </Card>
        </div>
    );
};

export default NotFound;