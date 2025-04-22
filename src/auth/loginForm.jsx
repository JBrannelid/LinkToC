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
            <div className="bg-olive-600 py-16 flex justify-center items-center">
                <div>
                    <h2
                        id="login-heading"
                        className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Logga in
                    </h2>
                </div>

                {serverError && (
                    <div className=" bg-red-50 border-l-4 border-red-400 p-4 rounded-md"
                         role="alert"
                         aria-live="assertive">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                          clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div className="ml-3 ">
                                <p className="text-sm text-red-700">
                                    {serverError}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)}
                      aria-labelledby="login-heading"
                      noValidate
                      className="mt-8 space-y-6">
                    <div className=" rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="email"
                                   className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                className={`appearance-none relative block w-full px-3 py-2 border ${
                                    errors.email ? `border-red-300` : `border-gray-300`
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-300 focus:z-10 sm:text-sm`}
                                aria-invalid={errors.email ? 'true' : 'false'}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                                disabled={isSubmitting}
                                {...register('email', {
                                    required: 'E-postadress krävs',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Ogiltig e-postadress',
                                    },
                                })}
                            />
                            {errors.email && (
                                <p
                                    id="email-error"
                                    className="mt-1 text-sm text-red-600"
                                    role="alert">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1">
                                Lösenord
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                className={`appearance-none relative block w-full px-3 py-2 border ${
                                    errors.password ? `border-red-300` : `border-gray-300`
                                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-300 focus:z-10 sm:text-sm`}
                                aria-invalid={errors.password ? 'true' : 'false'}
                                aria-describedby={errors.password ? 'email-error' : undefined}
                                disabled={isSubmitting}
                                {...register('password', {
                                    required: 'Lösenord krävs',
                                })}/>
                            {errors.password && (
                                <p
                                    id="password-error"
                                    className="mt-1 text-sm text-red-600"
                                    role="alert"
                                    >
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                            disabled={isSubmitting}
                            aria-busy={isSubmitting ? 'true' : 'false'}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor"
                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                    Loggar in...
                                </>
                            ) : ('Logga in')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default LoginForm;