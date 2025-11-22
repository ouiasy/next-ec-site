import React from 'react';
import {Spinner} from "@/components/ui/spinner";

const Loading = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <Spinner className="size-16 block"/>
        </div>
    );
};

export default Loading;