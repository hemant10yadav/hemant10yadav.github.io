"use client";

import { useState } from "react";

export const MessageForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Replace this with your Google Apps Script web app URL
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbw8CDP86j0c-n7llXDuZgexwSkP1FeMy_Ihpl5Qw2q4rAM36ORehcj4qu_7J_X3mr2-/exec";

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name: string) => {
    return name.trim().length >= 2;
  };

  const validateMessage = (message: string) => {
    return message.trim().length >= 5;
  };

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (!validateName(value)) {
          error = "Name must be at least 2 characters";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!validateEmail(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "message":
        if (!value.trim()) {
          error = "Message is required";
        } else if (!validateMessage(value)) {
          error = "Message must be at least 5 characters";
        }
        break;
    }

    return error;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const handleSubmit = async () => {
    // Validate all fields
    const nameError = validateField("name", formData.name);
    const emailError = validateField("email", formData.email);
    const messageError = validateField("message", formData.message);

    setErrors({
      name: nameError,
      email: emailError,
      message: messageError,
    });

    // If any errors exist, don't submit
    if (nameError || emailError || messageError) {
      return;
    }

    setSubmitting(true);

    try {
      const formBody = new URLSearchParams(formData);

      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: formBody,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setErrors({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {submitted ? (
        <div className="text-center py-10">
          <div className="text-4xl mb-3">🚀</div>
          <p className="text-lg text-purple-400 font-semibold">
            Message sent successfully!
          </p>
          <p className="text-gray-400 mt-2">I&apos;ll reply soon.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Your name"
              className={`w-full px-4 py-3 rounded-lg bg-white/5
                       border ${errors.name ? "border-red-500" : "border-white/10"} text-white placeholder:text-gray-400`}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Your email"
              className={`w-full px-4 py-3 rounded-lg bg-white/5
                       border ${errors.email ? "border-red-500" : "border-white/10"} text-white placeholder:text-gray-400`}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Your message"
              rows={4}
              className={`w-full px-4 py-3 rounded-lg bg-white/5
                       border ${errors.message ? "border-red-500" : "border-white/10"} text-white resize-none placeholder:text-gray-400`}
            />
            {errors.message && (
              <p className="text-red-400 text-sm mt-1">{errors.message}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3 rounded-lg bg-gradient-to-r
                       from-purple-500 to-pink-500 font-semibold
                       hover:from-purple-600 hover:to-pink-600
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all flex items-center justify-center gap-2"
          >
            {submitting && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </div>
      )}
    </>
  );
};
