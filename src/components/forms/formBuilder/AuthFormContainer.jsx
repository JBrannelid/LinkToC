import React from "react";
import { X } from "lucide-react";

const AuthFormContainer = ({
    children,
    title,
    subtitle,
    onCancel = null,
                           }) => {
    
    return (
        <div className="flex justify-center px-4 py-6 w-full">
            <div className="w-full max-w-md p-4 sm:p-5 rounded-sm shadow-lg bg-white bg-opacity-70">
                {title && (
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center justify-between">
                        {typeof title === 'string' ? title : title}
                        {onCancel && (
                            <button
                                onClick={onCancel}
                                className="p-2 text-gray-500 hover:text-gray-700"
                                aria-label="Stäng"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        )}
                    </h1>
                )}

                {subtitle && (
                    <p className="text-sm lg:text-base mt-2">{subtitle}</p>
                )}

                {children}
            </div>
        </div>
    );
};

export default AuthFormContainer;