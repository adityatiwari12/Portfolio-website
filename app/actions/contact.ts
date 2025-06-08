"use server"

import { supabaseServer } from "@/lib/supabase"
import type { ContactFormData } from "@/lib/supabase"
import { z } from "zod"

// Contact form validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function submitContactForm(formData: FormData) {
  try {
    // Extract data from form
    const contactData: ContactFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    }

    // Validate form data
    const validationResult = contactSchema.safeParse(contactData)
    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map((err) => err.message).join(", ")
      return {
        success: false,
        error: errorMessages,
      }
    }

    // Insert into Supabase
    const { data, error } = await supabaseServer.from("contacts").insert([contactData]).select()

    if (error) {
      console.error("Database error:", error)
      return {
        success: false,
        error: "Failed to submit contact form. Please try again.",
      }
    }

    // Send notification email (in a real implementation)
    // await sendNotificationEmail(contactData)

    return {
      success: true,
      message: "Thank you for your message! I'll get back to you soon.",
      data: data[0],
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}

export async function getContacts() {
  try {
    const { data, error } = await supabaseServer.from("contacts").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching contacts:", error)
      return {
        success: false,
        error: "Failed to fetch contacts",
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

export async function updateContactStatus(id: number, status: "new" | "read" | "replied") {
  try {
    const { data, error } = await supabaseServer.from("contacts").update({ status }).eq("id", id).select()

    if (error) {
      console.error("Error updating contact status:", error)
      return {
        success: false,
        error: "Failed to update contact status",
      }
    }

    return {
      success: true,
      data: data[0],
    }
  } catch (error) {
    console.error("Error updating contact status:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}
