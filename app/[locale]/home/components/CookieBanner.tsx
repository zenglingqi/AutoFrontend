import { useEffect, useState } from "react";

export function CookieBanner() {
    const [visible, setVisible] = useState(false);

    // 获取用户的Cookie同意状态
    useEffect(() => {
        if (!localStorage.getItem("cookie_consent")) {
            setVisible(true);
        }
    }, []);

    if (!visible) return null;

    return (
        <div
            className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl px-6 py-4 text-white shadow-lg
      dark:bg-gray-800 bg-gray-500 dark:text-gray-100 w-full sm:w-auto sm:max-w-lg"
        >
            <p className="mb-3 text-sm">
                We use cookies to process payments, personalize content, and improve your experience on our site. This includes the collection of:
                <ul className="list-disc list-inside">
                    <li>Your credit card information for payment processing.</li>
                    <li>Your registration information (e.g., phone number and email) for account management and communication.</li>
                    <li>Cookies for personalization of content and ads, as well as website analytics.</li>
                </ul>
                By continuing, you agree to our{" "}
                <a
                    href="/cookiepolicy"
                    className="underline text-yellow-300"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Cookie Policy
                </a>{" "}
                and acknowledge that we may store and process your data for these purposes.
            </p>

            <div className="flex gap-3 justify-center">
                {/* Accept Button */}
                <button
                    onClick={() => {
                        localStorage.setItem("cookie_consent", "accepted");
                        setVisible(false);
                    }}
                    className="rounded-md bg-yellow-400 px-4 py-2 text-black font-semibold"
                >
                    Accept
                </button>

                {/* Reject Button */}
                <button
                    onClick={() => {
                        localStorage.setItem("cookie_consent", "rejected");
                        setVisible(false);
                    }}
                    className="rounded-md bg-white/20 px-4 py-2"
                >
                    Reject
                </button>
            </div>
        </div>
    );
}
