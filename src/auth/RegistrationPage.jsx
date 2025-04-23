import {useState, useEffect } from "react";
import {useForm} from "react-hook-form";
import {useAuth} from "./AuthContext.jsx";

const RegistrationPage = () => {
   
    const [serverError, setServerError] = useState ('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {login} = useAuth();
    
    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
        watch,
    } = useForm({
        mode: 'onSubmit',
        defaultValues:{
            firstName: '',
            lastName: '',
            userName: '',
            email: '',
            password: '',
            phoneNumber: '',
        },
    });
    
    const fullNameValue = watch('fullName');
    useEffect(() => {
        if (fullNameValue) {
            const nameParts = fullNameValue.split(' ');
            if (nameParts.length >= 2) {
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(' ');
                setValue('firstName', firstName);
                setValue('lastName', lastName);
            }else {
                setValue('firstName', fullNameValue);
                setValue('lastName', '');
            }
        }
    }, [fullNameValue, setValue]);
    
    const onSubmit = async (data) => {

        try {
            setIsSubmitting(true);
            setServerError('');

            if (!data.lastName) {
                data.lastName = data.firstName;
            }
            
            console.log('Submitting registration data:', data);
            
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            
            const responseData = await response.json();
            
            if(!response.ok){
                const errorMessage = responseData.error || responseData.Message || response.statusText;
                throw new Error(errorMessage || 'Registration misslyckades');
            }
            await login(data.email, data.password);
        } catch(error){
            console.error('Registration failed', error);
            setServerError(error.message || 'Registration misslyckades. Försök igen');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="flex flex-col h-screen">
            {/* Logo Section - Green background */}
            <div className="bg-[#556B2F] py-16 flex justify-center items-center">
                <div className="h-20 w-20">
                    {/* Horse rider icon */}
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path
                            d="M12 4C14.2091 4 16 5.79086 16 8H17.5C18.8807 8 20 9.11929 20 10.5V12H19V10.5C19 9.67157 18.3284 9 17.5 9H16.9353C16.9776 9.16357 17 9.33535 17 9.5122V14C17 15.3432 16.1652 16.5509 15 17.0765V20H14V17.9182C13.7059 17.9722 13.4037 18 13.0918 18C12.7703 18 12.4502 17.9722 12.1444 17.9181L12 18H11V17.07C9.86343 16.551 9 15.3354 9 14V11.3137L7.58579 9.89949C7.21071 9.52441 7 9.02135 7 8.5C7 7.39543 7.89543 6.5 9 6.5C9.58667 6.5 10.1669 6.76747 10.5388 7.16615C11.1079 5.36525 12.4078 4 14 4H12ZM9 7.5C8.44772 7.5 8 7.94772 8 8.5C8 8.76173 8.09763 9.01293 8.2725 9.1878L10 10.9153V14C10 15.1239 11.033 16 12.1556 16C13.2778 16 14 15.1239 14 14V9.51218C14 8.67376 13.3262 8 12.4878 8H10.6224C10.3459 7.68722 10.0417 7.41274 9.71418 7.17153C9.51122 7.28099 9.26641 7.5 9 7.5Z"
                            fill="rgba(200, 200, 200, 0.8)"
                        />
                    </svg>
                </div>
            </div>

            {/* Form Section - White background */}
            <div className="flex-1 px-6 py-8 bg-white overflow-y-auto">
                <form onSubmit={handleSubmit(onSubmit)} aria-labelledby="register-heading" noValidate className="flex flex-col gap-4">
                    {serverError && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md" role="alert" aria-live="assertive">
                            <p className="text-sm text-red-700">{serverError}</p>
                        </div>
                    )}

                    <div className="mb-2">
                        <label htmlFor="fullName" className="sr-only">
                            För- och efternamn
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            placeholder="För- och efternamn"
                            className={`w-full px-3 py-4 border ${
                                errors.fullName ? 'border-red-300' : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-1 focus:ring-olive-500 focus:border-olive-500 text-gray-900`}
                            aria-invalid={errors.fullName ? 'true' : 'false'}
                            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                            disabled={isSubmitting}
                            {...register('fullName', {
                                required: 'Namn krävs',
                            })}
                        />
                        {errors.fullName && (
                            <p id="fullName-error" className="mt-1 text-sm text-red-600" role="alert">
                                {errors.fullName.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-2">
                        <label htmlFor="userName" className="sr-only">
                            Användarnamn
                        </label>
                        <input
                            id="userName"
                            type="text"
                            autoComplete="username"
                            placeholder="Användarnamn"
                            className={`w-full px-3 py-4 border ${
                                errors.userName ? 'border-red-300' : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-1 focus:ring-olive-500 focus:border-olive-500 text-gray-900`}
                            aria-invalid={errors.userName ? 'true' : 'false'}
                            aria-describedby={errors.userName ? 'userName-error' : undefined}
                            disabled={isSubmitting}
                            {...register('userName', {
                                required: 'Användarnamn krävs',
                                minLength: {
                                    value: 3,
                                    message: 'Användarnamn måste vara minst 3 tecken',
                                },
                            })}
                        />
                        {errors.userName && (
                            <p id="userName-error" className="mt-1 text-sm text-red-600" role="alert">
                                {errors.userName.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-2">
                        <label htmlFor="email" className="sr-only">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="Email"
                            className={`w-full px-3 py-4 border ${
                                errors.email ? 'border-red-300' : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-1 focus:ring-olive-500 focus:border-olive-500 text-gray-900`}
                            aria-invalid={errors.email ? 'true' : 'false'}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                            disabled={isSubmitting}
                            {...register('email', {
                                required: 'Email krävs',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Ogiltig email adress',
                                },
                            })}
                        />
                        {errors.email && (
                            <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Password"
                            className={`w-full px-3 py-4 border ${
                                errors.password ? 'border-red-300' : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-1 focus:ring-olive-500 focus:border-olive-500 text-gray-900`}
                            aria-invalid={errors.password ? 'true' : 'false'}
                            aria-describedby={errors.password ? 'password-error' : undefined}
                            disabled={isSubmitting}
                            {...register('password', {
                                required: 'Lösenord krävs',
                                minLength: {
                                    value: 6,
                                    message: 'Lösenord måste vara minst 6 tecken',
                                },
                            })}
                        />
                        {errors.password && (
                            <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Hidden fields for backend compatibility */}
                    <input type="hidden" {...register('firstName')} />
                    <input type="hidden" {...register('lastName')} />
                    <input type="hidden" {...register('phoneNumber')} value="" />

                    <button
                        type="submit"
                        className="w-full py-3 px-4 border border-transparent rounded-md text-white font-medium bg-[#556B2F] hover:bg-[#4B5320] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#556B2F]"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="flex justify-center items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                Registrerar...
                            </div>
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
export default RegistrationPage;