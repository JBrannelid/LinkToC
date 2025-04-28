import React from "react";

const FormMessage = ({ message }) => {
    if(!message || !message.text) return null;
    
    return (
        <div
            className={`mt-4 p-3 rounded-md ${
                message.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
            }`}
            role={message.type === "error" ? "alert" : "status"}
            aria-live="polite"
        >
            {message.text}
        </div>
    );
};

export default FormMessage;