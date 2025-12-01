"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Upload, Loader2, ArrowLeft } from "lucide-react";
import { submitInquiry } from "@/app/actions";

interface ConfiguratorFormProps {
    motorcycleTitle: string;
    brandColor?: string;
}

const colorVariants: Record<string, any> = {
    orange: {
        bg: "bg-orange-500",
        bgLight: "bg-orange-500/10",
        text: "text-orange-500",
        border: "border-orange-500",
        focusBorder: "focus:border-orange-500",
    },
    blue: {
        bg: "bg-blue-500",
        bgLight: "bg-blue-500/10",
        text: "text-blue-500",
        border: "border-blue-500",
        focusBorder: "focus:border-blue-500",
    },
    yellow: {
        bg: "bg-yellow-500",
        bgLight: "bg-yellow-500/10",
        text: "text-yellow-500",
        border: "border-yellow-500",
        focusBorder: "focus:border-yellow-500",
    },
    green: {
        bg: "bg-green-500",
        bgLight: "bg-green-500/10",
        text: "text-green-500",
        border: "border-green-500",
        focusBorder: "focus:border-green-500",
    },
    red: {
        bg: "bg-red-600",
        bgLight: "bg-red-600/10",
        text: "text-red-600",
        border: "border-red-600",
        focusBorder: "focus:border-red-600",
    },
    fuchsia: {
        bg: "bg-fuchsia-500",
        bgLight: "bg-fuchsia-500/10",
        text: "text-fuchsia-500",
        border: "border-fuchsia-500",
        focusBorder: "focus:border-fuchsia-500",
    },
};

export default function ConfiguratorForm({ motorcycleTitle, brandColor = "orange" }: ConfiguratorFormProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        hasTradeIn: "",
        tradeInInfo: "",
        wantsFinancing: "",
        pickupPreference: "",
        email: "",
        phone: "",
        tradeInPhoto: null as File | null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const totalSteps = 5;
    const colors = colorVariants[brandColor] || colorVariants.orange;

    const handleNext = () => {
        if (step === 1 && !formData.hasTradeIn) return;
        if (step === 2 && !formData.wantsFinancing) return;
        if (step === 3 && !formData.email && !formData.phone) {
            setError("Inserisci almeno un contatto.");
            return;
        }
        if (step === 4 && !formData.pickupPreference) return;

        setError("");
        setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async (type: "whatsapp" | "email") => {
        setIsSubmitting(true);
        const data = new FormData();
        data.append("motorcycleTitle", motorcycleTitle);
        data.append("hasTradeIn", formData.hasTradeIn);
        data.append("tradeInInfo", formData.tradeInInfo);
        data.append("wantsFinancing", formData.wantsFinancing);
        data.append("pickupPreference", formData.pickupPreference);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("submissionType", type);

        if (formData.tradeInPhoto) {
            data.append("tradeInPhoto", formData.tradeInPhoto);
        }

        const result = await submitInquiry(data);
        setIsSubmitting(false);

        if (result.success) {
            setIsSuccess(true);
            if (result.whatsappLink) {
                window.open(result.whatsappLink, '_blank');
            }
        } else {
            setError(result.message || "Errore durante l'invio.");
        }
    };

    const updateData = (key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
        setError("");
    };

    if (isSuccess) {
        return (
            <div className="bg-neutral-900 rounded-2xl p-8 text-center border border-green-500/30">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Richiesta Inviata!</h3>
                <p className="text-neutral-400">
                    Grazie per averci contattato. Ti risponderemo il prima possibile.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
            {/* Progress Bar */}
            <div className="h-1 bg-neutral-800 w-full">
                <motion.div
                    className={`h-full ${colors.bg}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / totalSteps) * 100}%` }}
                />
            </div>

            <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                    {step > 1 && (
                        <button onClick={handleBack} className="text-neutral-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 ml-auto">
                        Step {step} di {totalSteps}
                    </span>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-3">Vuoi permutare il tuo usato?</h3>
                                <p className="text-sm text-neutral-400">
                                    Compila il form per ricevere un'offerta personalizzata. Ti risponderemo in tempi brevissimi.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <OptionButton
                                    selected={formData.hasTradeIn === "yes"}
                                    onClick={() => updateData("hasTradeIn", "yes")}
                                    label="Sì"
                                    colors={colors}
                                />
                                <OptionButton
                                    selected={formData.hasTradeIn === "no"}
                                    onClick={() => {
                                        setFormData((prev) => ({ ...prev, hasTradeIn: "no" }));
                                        setTimeout(() => setStep(2), 333);
                                    }}
                                    label="No"
                                    colors={colors}
                                />
                            </div>

                            {formData.hasTradeIn === "yes" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="space-y-4 pt-4 border-t border-neutral-800"
                                >
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
                                            Carica una foto (Opzionale)
                                        </label>
                                        <div className="border-2 border-dashed border-neutral-700 rounded-xl p-6 text-center hover:border-neutral-500 transition-colors cursor-pointer relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) {
                                                        updateData("tradeInPhoto", e.target.files[0]);
                                                    }
                                                }}
                                            />
                                            <Upload className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
                                            <span className="text-sm text-neutral-400">
                                                {formData.tradeInPhoto ? formData.tradeInPhoto.name : "Clicca per caricare"}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
                                            Informazioni sulla moto
                                        </label>
                                        <textarea
                                            className={`w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white focus:outline-none ${colors.focusBorder} transition-colors text-sm`}
                                            rows={3}
                                            placeholder="Marca, Modello, Anno, Km..."
                                            value={formData.tradeInInfo}
                                            onChange={(e) => updateData("tradeInInfo", e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={handleNext}
                                        className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-neutral-200 transition-colors"
                                    >
                                        Continua
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-2xl font-bold text-white">Vorresti finanziare la moto?</h3>
                            <div className="space-y-3">
                                {["Sì, intero importo", "Sì, parzialmente", "No", "Non so, vorrei info"].map((opt) => (
                                    <OptionButton
                                        key={opt}
                                        selected={formData.wantsFinancing === opt}
                                        onClick={() => {
                                            setFormData((prev) => ({ ...prev, wantsFinancing: opt }));
                                            setTimeout(() => setStep(3), 333);
                                        }}
                                        label={opt}
                                        fullWidth
                                        colors={colors}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-2xl font-bold text-white">Come possiamo ricontattarti?</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className={`w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white focus:outline-none ${colors.focusBorder} transition-colors`}
                                        placeholder="tua@email.com"
                                        value={formData.email}
                                        onChange={(e) => updateData("email", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
                                        Telefono
                                    </label>
                                    <input
                                        type="tel"
                                        className={`w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white focus:outline-none ${colors.focusBorder} transition-colors`}
                                        placeholder="+39 333 ..."
                                        value={formData.phone}
                                        onChange={(e) => updateData("phone", e.target.value)}
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <button
                                    onClick={handleNext}
                                    className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-neutral-200 transition-colors"
                                >
                                    Continua
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-2xl font-bold text-white">Quando vorresti ritirarla?</h3>
                            <div className="space-y-3">
                                {["Il prima possibile", "Ritiro programmato (mese prossimo)", "Non so, devo decidere"].map((opt) => (
                                    <OptionButton
                                        key={opt}
                                        selected={formData.pickupPreference === opt}
                                        onClick={() => {
                                            setFormData((prev) => ({ ...prev, pickupPreference: opt }));
                                            setTimeout(() => setStep(5), 333);
                                        }}
                                        label={opt}
                                        fullWidth
                                        colors={colors}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 5 && (
                        <motion.div
                            key="step5"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-2xl font-bold text-white">Riepilogo</h3>
                            <div className="bg-neutral-950 rounded-xl p-4 space-y-3 text-sm text-neutral-300">
                                <SummaryRow label="Moto" value={motorcycleTitle} />
                                <SummaryRow label="Permuta" value={formData.hasTradeIn === "yes" ? "Sì" : "No"} />
                                {formData.hasTradeIn === "yes" && <SummaryRow label="Info Permuta" value={formData.tradeInInfo} />}
                                <SummaryRow label="Finanziamento" value={formData.wantsFinancing} />
                                <SummaryRow label="Ritiro" value={formData.pickupPreference} />
                                <SummaryRow label="Email" value={formData.email || "-"} />
                                <SummaryRow label="Telefono" value={formData.phone || "-"} />
                            </div>

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    onClick={() => handleSubmit("whatsapp")}
                                    disabled={isSubmitting}
                                    className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                    )}
                                    Invia su WhatsApp
                                </button>

                                <button
                                    onClick={() => handleSubmit("email")}
                                    disabled={isSubmitting}
                                    className="w-full bg-neutral-800 text-white font-bold py-4 rounded-xl hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Check className="w-5 h-5" />
                                    )}
                                    Invia solo per Email
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function OptionButton({ selected, onClick, label, fullWidth = false, colors }: { selected: boolean; onClick: () => void; label: string; fullWidth?: boolean; colors: any }) {
    return (
        <button
            onClick={onClick}
            className={`
                ${fullWidth ? "w-full" : ""}
                p-4 rounded-xl border-2 transition-all duration-200 text-left relative overflow-hidden group
                ${selected
                    ? `${colors.border} ${colors.bgLight} ${colors.text}`
                    : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-600 hover:text-white"
                }
            `}
        >
            <span className="font-bold relative z-10">{label}</span>
            {selected && <Check className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${colors.text}`} />}
        </button>
    );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between border-b border-neutral-800 pb-2 last:border-0 last:pb-0">
            <span className="text-neutral-500">{label}</span>
            <span className="font-medium text-right max-w-[60%] truncate">{value}</span>
        </div>
    );
}
