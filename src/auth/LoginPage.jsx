import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from './AuthContext';

const LoginForm = () => {
    const {login} = useAuth();
    const [serverError, setServerError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setServerError('');
        try {
            await login(data.email, data.password);
        } catch (error) {
            setServerError(error.message || 'Fel e-postadress eller lösenord');
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
            <div className="flex-1 px-6 py-8 bg-white">
                <form onSubmit={handleSubmit(onSubmit)} aria-labelledby="login-heading" noValidate className="flex flex-col gap-4">
                    {serverError && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md" role="alert" aria-live="assertive">
                            <p className="text-sm text-red-700">{serverError}</p>
                        </div>
                    )}

                    <div className="mb-2">
                        <label htmlFor="email" className="sr-only">
                            E-postadress
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
                                required: 'E-postadress krävs',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Otillåten epostadress',
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
                            Lösenord
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="Password"
                            className={`w-full px-3 py-4 border ${
                                errors.password ? 'border-red-300' : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-1 focus:ring-olive-500 focus:border-olive-500 text-gray-900`}
                            aria-invalid={errors.password ? 'true' : 'false'}
                            aria-describedby={errors.password ? 'password-error' : undefined}
                            disabled={isSubmitting}
                            {...register('password', {
                                required: 'Lösenord krävs',
                            })}
                        />
                        {errors.password && (
                            <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end mb-6">
                        <a href="/forgot-password" className="text-sm text-gray-400 hover:text-gray-500">
                            Forgot Your Password?
                        </a>
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

                    <div className="my-6 flex items-center">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-sm text-gray-500">or</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    <div className="flex justify-center space-x-8">
                        <button
                            type="button"
                            aria-label="Sign in with Google"
                            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50"
                        >
                            <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.535c-0.621,1.812-2.044,3.236-3.796,3.796v-2.669h-1.909v3.535c-1.054,0-2.023-0.215-2.932-0.644c-0.91-0.428-1.704-1.032-2.384-1.704c-0.673-0.673-1.222-1.456-1.65-2.384c-0.429-0.91-0.644-1.892-0.644-2.932c0-1.054,0.215-2.024,0.644-2.933c0.428-0.91,1.032-1.704,1.704-2.384c0.673-0.673,1.456-1.222,2.384-1.65c0.91-0.429,1.892-0.644,2.932-0.644c1.054,0,2.024,0.215,2.933,0.644c0.91,0.428,1.704,1.032,2.384,1.704l-2.503,2.503C12.759,9.745,12.545,9.926,12.545,12.151z" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            aria-label="Sign in with Facebook"
                            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50"
                        >
                            <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13.397,20.997v-8.196h2.765l0.411-3.209h-3.176V7.548c0-0.926,0.258-1.56,1.587-1.56h1.684V3.127C15.849,3.039,15.025,2.997,14.201,3c-2.444,0-4.122,1.492-4.122,4.231v2.355H7.332v3.209h2.753v8.202H13.397z" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            aria-label="Sign in with LinkedIn"
                            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50"
                        >
                            <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.7,3H4.3C3.582,3,3,3.582,3,4.3v15.4C3,20.418,3.582,21,4.3,21h15.4c0.718,0,1.3-0.582,1.3-1.3V4.3C21,3.582,20.418,3,19.7,3z M8.339,18.338H5.667v-8.59h2.672V18.338z M7.004,8.574c-0.857,0-1.549-0.694-1.549-1.548c0-0.855,0.691-1.548,1.549-1.548c0.854,0,1.547,0.694,1.547,1.548C8.551,7.881,7.858,8.574,7.004,8.574z M18.339,18.338h-2.669v-4.177c0-0.996-0.017-2.278-1.387-2.278c-1.389,0-1.601,1.086-1.601,2.206v4.249h-2.667v-8.59h2.559v1.174h0.037c0.356-0.675,1.227-1.387,2.526-1.387c2.703,0,3.203,1.779,3.203,4.092V18.338z" />
                            </svg>
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Don't Have an Account?{' '}
                            <a href="/register" className="font-medium text-yellow-500 hover:text-yellow-400">
                                Sign In
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default LoginForm;