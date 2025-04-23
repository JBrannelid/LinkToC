import {useState } from "react";
import {useForm} from "react-hook-form";
import {useAuth} from "./AuthContext.jsx";
import authService from "../api/services/authService.js";
import { RabbitIcon}  from "lucide-react";

const RegistrationPage = () => {
   
    const [serverError, setServerError] = useState ('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {login} = useAuth();
   
    
    const {
        register,
        handleSubmit,
        formState: {errors},
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

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setServerError('');

            console.log('Submitting registration data:', data);

            // Submit registration data and get response
            const response = await authService.register(data);

            // Check if the registration was successful
            if (response && response.isSuccess) {
                console.log('Registration successful:', response);

                // Attempt to log in with the newly registered credentials
                try {
                    await login(data.email, data.password);
                    // Redirect to dashboard or home page after successful login
                    console.log('Login successful:', response);
                    
                } catch (loginError) {
                    console.error('Auto-login failed after registration:', loginError);
                    // Even if auto-login fails, registration was successful
                    // Redirect to login page with a success message
                    console.log('Registration successful. Please log in with your credentials.', response);

                }
            } else {
                // Handle API response indicating failure
                throw new Error(response?.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration failed', error);
            setServerError(error.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="flex flex-col h-screen">
            {/* Logo Section - Green background */}
            <div className="bg-[#556B2F] py-16 flex justify-center items-center">
                <RabbitIcon className="h-20 w-20" role="img" aria-label="Horse Rider Logo">
                    {/* Horse rider icon */}
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path
                            fill="rgba(200, 200, 200, 0.8)"
                        />
                    </svg>
                </RabbitIcon>
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
                        <label htmlFor="firstName" className="sr-only">
                            Förnamn
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            placeholder="Förnamn"
                            className={`w-full px-3 py-4 border ${
                                errors.firstName ? 'border-red-300' : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-1 focus:ring-olive-500 focus:border-olive-500 text-gray-900`}
                            aria-invalid={errors.firstName ? 'true' : 'false'}
                            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                            disabled={isSubmitting}
                            {...register('firstName', {
                                required: 'Förnamn krävs',
                            })}
                        />
                        {errors.firstName && (
                            <p id="firstName-error" className="mt-1 text-sm text-red-600" role="alert">
                                {errors.firstName.message}
                            </p>
                        )}
                    </div>
                    
                    <div className="mb-2">
                        <label htmlFor="lastName" className="sr-only">
                            Efternamn
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            placeholder="Efternamn"
                            className={`w-full px-3 py-4 border ${
                                errors.lastName ? 'border-red-300' : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-1 focus:ring-olive-500 focus:border-olive-500 text-gray-900`}
                            aria-invalid={errors.lastName ? 'true' : 'false'}
                            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                            disabled={isSubmitting}
                            {...register('lastName', {
                                required: 'Efternamn krävs',
                            })}
                        />
                        {errors.lastName && (
                            <p id="firstName-error" className="mt-1 text-sm text-red-600" role="alert">
                                {errors.lastName.message}
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
                        <label htmlFor="phoneNumber" className="sr-only">
                            Telefonnummer
                        </label>
                        <input
                            id="phoneNumber"
                            type="tel"
                            autoComplete="tel"
                            placeholder="Telefonnummer (valfritt)"
                            className="w-full px-3 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-olive-500 focus:border-olive-500 text-gray-900"
                            disabled={isSubmitting}
                            {...register('phoneNumber')}
                        />
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
                            placeholder="Lösenord"
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