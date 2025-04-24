import {useState, useEffect } from "react";

export const useHorseForm = (horse, onSubmit, onCancel) => {
    // Form state
    const [formData, setFormData] = useState({
        name: "",
        breed: "",
        color: "",
        age: "",
    });
    
    // Validation state
    const [formError, setFormError] = useState(null);
    const [isValid, setValid] = useState(false);
    
    useEffect(() => {
        if (horse){
            setFormData({
                name: horse.name,
                breed: horse.breed,
                color: horse.color,
                age: horse.age,
            })
        }
    }, [horse]);
    
    const handleChange = (horse) => {
        const {name, value} = horse.target;
        setFormData((formData) => ({
            ...formData,
            [name]: value,
        }));
        
        if(formError){
            setFormError(null);
        }
    };
    
    const handleCancel = (horse) => {
        horse.preventDefault();
        if(onCancel){
            onCancel();
        }
    };
    
   const handleSubmit = (horse) => {
       horse.preventDefault();
       if(onSubmit){
           onSubmit(formData);
       }
   };
    
    return{
        formError,
        formData,
        handleChange,
        handleSubmit,
        handleCancel,
        isValid,
    };
};