import { Head, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Error, Label } from '@/Components/Form/Field';
import Icon from '@/Components/Icon';
import ThemeToggle from '@/Components/ThemeToggle';

export default function TwoFactorChallenge({ email }) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [resending, setResending] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const submitCode = (fullCode) => {
        if (submitting) return;
        setSubmitting(true);
        setError('');

        router.post(
            route('login.2fa.store'),
            { code: fullCode },
            {
                onError: (errors) => {
                    setError(errors.code || 'Code invalide ou expiré.');
                    setSubmitting(false);
                    // Réinitialiser les cases et remettre le focus sur la première
                    setOtp(['', '', '', '', '', '']);
                    setTimeout(() => inputRefs.current[0]?.focus(), 50);
                },
            }
        );
    };

    const handleChange = (index, value) => {
        const digit = value.replace(/[^0-9]/g, '').slice(-1);

        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);

        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-soumission dès le 6ème chiffre renseigné
        if (index === 5 && digit) {
            const fullCode = newOtp.join('');
            if (fullCode.length === 6) {
                submitCode(fullCode);
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (otp[index]) {
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            } else if (index > 0) {
                inputRefs.current[index - 1]?.focus();
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
        if (!pastedData) return;

        const newOtp = ['', '', '', '', '', ''];
        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);

        if (pastedData.length === 6) {
            inputRefs.current[5]?.focus();
            submitCode(pastedData);
        } else {
            inputRefs.current[pastedData.length]?.focus();
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        const fullCode = otp.join('');
        if (fullCode.length === 6) {
            submitCode(fullCode);
        }
    };

    const handleResend = (e) => {
        e.preventDefault();
        setResending(true);
        setError('');
        router.post(
            route('login.2fa.resend'),
            {},
            {
                onFinish: () => {
                    setResending(false);
                    setOtp(['', '', '', '', '', '']);
                    setTimeout(() => inputRefs.current[0]?.focus(), 50);
                },
            }
        );
    };

    const isFull = otp.every((d) => d !== '');

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-gray-50 dark:bg-soil-950 px-5 transition-colors duration-200">
            <Head title="Vérification à deux facteurs" />
            <div className="absolute right-5 top-5">
                <ThemeToggle />
            </div>
            <div className="w-full max-w-md">
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-yolk-500/10 text-yolk-500 shadow-inner">
                        <Icon name="egg" className="h-8 w-8" />
                    </div>
                    <h1 className="font-display text-2xl font-semibold text-gray-900 dark:text-sand-100">Double authentification</h1>
                    <p className="mt-2 text-sm text-gray-500 dark:text-sand-400 max-w-xs">
                        Un code de vérification à 6 chiffres a été envoyé à{' '}
                        <strong className="text-gray-800 dark:text-sand-200 break-all">{email}</strong>.
                    </p>
                </div>

                <form onSubmit={handleManualSubmit} className="space-y-6 rounded-2xl border border-gray-200 dark:border-soil-700 bg-white dark:bg-soil-900/60 p-6 sm:p-8 shadow-sm dark:shadow-none">
                    <div>
                        <p className="mb-4 text-center text-xs uppercase tracking-wider text-gray-400 dark:text-sand-400 font-semibold">
                            Saisissez le code à 6 chiffres
                        </p>

                        <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    disabled={submitting}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className={`h-12 w-11 sm:h-14 sm:w-12 text-center font-mono text-xl font-bold rounded-xl border-2 transition-all duration-150 outline-none ${
                                        digit
                                            ? 'border-yolk-500 bg-yolk-500/5 text-yolk-600 dark:text-yolk-400 ring-2 ring-yolk-500/20'
                                            : 'border-gray-300 dark:border-soil-700 bg-gray-50 dark:bg-soil-800 text-gray-900 dark:text-sand-100 focus:border-yolk-500 focus:ring-2 focus:ring-yolk-500/20'
                                    } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                            ))}
                        </div>

                        {error && (
                            <p className="mt-3 text-center text-sm text-red-500 font-medium">{error}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || !isFull}
                        className="w-full rounded-xl bg-yolk-500 px-4 py-3 text-sm font-semibold text-white shadow transition hover:bg-yolk-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="h-4 w-4 animate-spin text-current" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Vérification en cours…
                            </span>
                        ) : (
                            'Valider la connexion'
                        )}
                    </button>
                </form>

                <div className="mt-6 flex flex-col items-center gap-2 text-xs text-gray-500 dark:text-sand-500">
                    <button
                        onClick={handleResend}
                        disabled={resending || submitting}
                        className="text-yolk-500 hover:underline disabled:opacity-50 font-medium"
                    >
                        {resending ? 'Envoi du code…' : 'Renvoyer un nouveau code par e-mail'}
                    </button>
                    <a href={route('login')} className="hover:underline mt-1">
                        ← Retour à la connexion
                    </a>
                </div>
            </div>
        </div>
    );
}
