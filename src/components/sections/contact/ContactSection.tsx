import { motion } from "framer-motion";
import type { ChangeEvent } from "react";

import { CONTACT_COPY, CONTACT_FIELDS } from "@/data/portfolio";
import { useContactForm } from "@/hooks/use-contact-form";
import type { ContactField as ContactFieldConfig, ContactFormData } from "@/types/portfolio";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

interface ContactFieldProps {
  field: ContactFieldConfig;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const inputClassName =
  "w-full bg-transparent border-b border-black/30 py-1 text-lg font-medium focus:border-black focus:outline-none transition-colors";

const ContactField = ({ field, value, onChange }: ContactFieldProps) => {
  const sharedProps = {
    id: field.name,
    name: field.name,
    value,
    onChange,
    required: field.required,
    className: inputClassName,
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={field.name} className="text-xs font-bold uppercase tracking-wider">
        {field.label}
      </label>
      {field.multiline ? (
        <textarea {...sharedProps} rows={field.rows} className={`${inputClassName} resize-none`} />
      ) : (
        <input {...sharedProps} type={field.type} />
      )}
    </div>
  );
};

const ContactFieldsGrid = ({
  fields,
  formData,
  onChange,
}: {
  fields: ContactFieldConfig[];
  formData: ContactFormData;
  onChange: ContactFieldProps["onChange"];
}) => (
  <div className={fields.length > 1 ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""}>
    {fields.map((field) => (
      <ContactField
        key={field.name}
        field={field}
        value={formData[field.name]}
        onChange={onChange}
      />
    ))}
  </div>
);

const ContactSection = () => {
  const { formData, status, handleChange, handleSubmit } = useContactForm();
  const nameFields = CONTACT_FIELDS.slice(0, 2);
  const detailFields = CONTACT_FIELDS.slice(2, 4);
  const messageFields = CONTACT_FIELDS.slice(4);

  return (
    <section className="h-screen w-full bg-white text-black font-sans px-4 md:px-8 lg:px-12 overflow-hidden flex items-center justify-center relative">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-16 max-w-[1400px] w-full mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full py-2">
          <motion.div variants={itemVariants} className="mb-8 lg:mb-0">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tight text-left">
              {CONTACT_COPY.title} <br />
              {CONTACT_COPY.subtitle} <span className="inline-block ml-2">→</span>
            </h1>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8 lg:mt-0 hidden lg:block">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4 text-black/60">
              {CONTACT_COPY.label}
            </h2>
            <p className="text-base md:text-lg font-normal leading-relaxed text-black/80 max-w-md text-left">
              {CONTACT_COPY.description}
            </p>
          </motion.div>
        </div>

        <motion.div className="lg:col-span-5 flex flex-col justify-center" variants={itemVariants}>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <ContactFieldsGrid fields={nameFields} formData={formData} onChange={handleChange} />
            <ContactFieldsGrid fields={detailFields} formData={formData} onChange={handleChange} />
            <ContactFieldsGrid fields={messageFields} formData={formData} onChange={handleChange} />

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="submit"
                disabled={status === "sending"}
                className="group flex items-center gap-3 text-lg font-bold uppercase tracking-wider hover:text-black/70 transition-colors disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Send Message"}
                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
              </button>

              {status === "success" && (
                <p className="text-sm text-green-600 font-medium">✓ Message sent! I'll get back to you soon.</p>
              )}
              {status === "error" && (
                <p className="text-sm text-red-500 font-medium">✗ Something went wrong. Please try again.</p>
              )}
            </div>

          </form>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ContactSection;
