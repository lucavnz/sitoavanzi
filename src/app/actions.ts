"use server";

import nodemailer from "nodemailer";

export async function submitInquiry(formData: FormData) {
    const rawData = {
        motorcycleTitle: formData.get("motorcycleTitle"),
        hasTradeIn: formData.get("hasTradeIn"),
        tradeInInfo: formData.get("tradeInInfo"),
        wantsFinancing: formData.get("wantsFinancing"),
        pickupPreference: formData.get("pickupPreference"),
        email: formData.get("email"),
        phone: formData.get("phone"),
    };

    console.log("Form Data Received:", rawData);

    // Basic validation
    if (!rawData.email && !rawData.phone) {
        return { success: false, message: "Inserisci almeno un contatto (Email o Telefono)." };
    }

    // Nodemailer setup (only if env vars are present)
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_APP_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            const tradeInPhoto = formData.get("tradeInPhoto") as File | null;
            let attachments = [];

            if (tradeInPhoto && tradeInPhoto.size > 0) {
                const buffer = Buffer.from(await tradeInPhoto.arrayBuffer());
                attachments.push({
                    filename: tradeInPhoto.name,
                    content: buffer
                });
            }

            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: "lucaavanzi62@gmail.com",
                subject: `Nuova richiesta per: ${rawData.motorcycleTitle}`,
                text: `
Nuova richiesta ricevuta dal sito web.

Moto: ${rawData.motorcycleTitle}

--- Dati Cliente ---
Email: ${rawData.email || "Non fornita"}
Telefono: ${rawData.phone || "Non fornito"}

--- Dettagli Richiesta ---
Permuta Usato: ${rawData.hasTradeIn === "yes" ? "Sì" : "No"}
Info Permuta: ${rawData.tradeInInfo || "Nessuna info aggiuntiva"}

Finanziamento: ${rawData.wantsFinancing}
Ritiro: ${rawData.pickupPreference}
                `,
                attachments: attachments
            };

            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully");
        } catch (error) {
            console.error("Error sending email:", error);
            // Don't fail the request if email fails, just log it
        }
    } else {
        console.log("Email not sent: Missing GMAIL_USER or GMAIL_APP_PASSWORD env vars.");
    }

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let whatsappLink = null;
    const submissionType = formData.get("submissionType");

    if (submissionType === "whatsapp" && process.env.PHONE_NUMBER) {
        const message = `Ciao, sono interessato alla moto: ${rawData.motorcycleTitle}.
        
Permuta: ${rawData.hasTradeIn === "yes" ? "Sì" : "No"}
Finanziamento: ${rawData.wantsFinancing}
Ritiro: ${rawData.pickupPreference}
Email: ${rawData.email}
`;
        whatsappLink = `https://wa.me/${process.env.PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    }

    return { success: true, message: "Richiesta inviata con successo!", whatsappLink };
}
