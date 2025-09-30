import React, { useEffect, useRef } from "react";

let isScriptAdded = false;

export default function RazorpayButton() {
    const formRef = useRef(null);

    useEffect(() => {
        if (isScriptAdded) return;

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/payment-button.js";
        script.dataset.payment_button_id = "pl_JDeyo5oLdkJBxq";
        script.async = true;

        if (formRef.current) {
            formRef.current.appendChild(script);
            isScriptAdded = true;
        }

        return () => {
            if (formRef.current && script.parentNode === formRef.current) {
                formRef.current.removeChild(script);
                isScriptAdded = false;
            }
        };
    }, []);

    return <form ref={formRef}></form>;
}
