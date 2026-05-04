import { useState, type ChangeEvent, type FormEvent } from "react";

import { APPS_SCRIPT_URL } from "@/config/app";
import { CONTACT_FORM_INITIAL_VALUES } from "@/data/portfolio";
import type { ContactFormData, ContactStatus } from "@/types/portfolio";

export function useContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(CONTACT_FORM_INITIAL_VALUES);
  const [status, setStatus] = useState<ContactStatus>("idle");

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("sending");

    try {
      const body = new URLSearchParams(formData);

      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      setStatus("success");
      setFormData(CONTACT_FORM_INITIAL_VALUES);
    } catch {
      setStatus("error");
    }
  };

  return {
    formData,
    status,
    handleChange,
    handleSubmit,
  };
}
