'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateTaskStatus(
  taskId: string, 
  status: string,
  notes?: string,
  location?: { lat: number, lng: number, acc: number }
) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Update task status
  const updateData: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
  if (['submitted', 'completed'].includes(status)) {
    updateData.completed_at = new Date().toISOString()
  }

  const { error: taskError } = await supabase
    .from('tasks')
    .update(updateData)
    .eq('id', taskId)
    .eq('assigned_to', user.id) // Ensure employee owns task

  if (taskError) return { success: false, error: taskError.message }

  // Log update
  const { error: logError } = await supabase
    .from('task_updates')
    .insert({
      task_id: taskId,
      employee_id: user.id,
      status,
      notes: notes || null,
      latitude: location?.lat || null,
      longitude: location?.lng || null,
      location_accuracy: location?.acc || null
    })

  revalidatePath(`/employee/tasks/${taskId}`)
  revalidatePath('/employee/tasks')
  return { success: true }
}

export async function submitAttendance({ action, latitude, longitude, accuracy }: { action: 'check_in' | 'check_out', latitude: number, longitude: number, accuracy: number }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const today = new Date().toISOString().split('T')[0]
  
  if (action === 'check_in') {
    const { error } = await supabase.from('attendance').upsert({
      employee_id: user.id,
      date: today,
      check_in: new Date().toISOString(),
      check_in_latitude: latitude,
      check_in_longitude: longitude,
      status: 'present'
    }, { onConflict: 'employee_id,date' })
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase.from('attendance').update({
      check_out: new Date().toISOString(),
      check_out_latitude: latitude,
      check_out_longitude: longitude
    }).eq('employee_id', user.id).eq('date', today)
    if (error) throw new Error(error.message)
  }
  
  revalidatePath('/employee/attendance')
  return { success: true }
}

export async function submitReport(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('daily_reports').insert({
    employee_id: user.id,
    date: formData.get('date'),
    tasks_completed: parseInt(formData.get('tasks_completed') as string || '0'),
    properties_found: parseInt(formData.get('properties_found') as string || '0'),
    buyer_leads: parseInt(formData.get('buyer_leads') as string || '0'),
    renter_leads: parseInt(formData.get('renter_leads') as string || '0'),
    followups_completed: parseInt(formData.get('followups_completed') as string || '0'),
    today_notes: formData.get('today_notes'),
    problems_faced: formData.get('problems_faced'),
    tomorrow_plan: formData.get('tomorrow_plan'),
  })

  if (error) throw new Error(error.message)
  
  const { redirect } = await import('next/navigation')
  redirect('/employee/reports')
}

export async function createLead(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('leads').insert({
    created_by: user.id,
    assigned_to: user.id,
    customer_name: formData.get('customer_name'),
    phone: formData.get('phone'),
    whatsapp: formData.get('whatsapp'),
    requirement_type: formData.get('requirement_type'),
    property_type: formData.get('property_type'),
    preferred_area: formData.get('preferred_area'),
    budget_min: formData.get('budget_min') ? parseFloat(formData.get('budget_min') as string) : null,
    budget_max: formData.get('budget_max') ? parseFloat(formData.get('budget_max') as string) : null,
    bhk: formData.get('bhk') ? parseInt(formData.get('bhk') as string) : null,
    urgency: formData.get('urgency'),
    requirements_notes: formData.get('requirements_notes'),
    status: 'new'
  })

  if (error) throw new Error(error.message)
  
  const { redirect } = await import('next/navigation')
  redirect('/employee/leads')
}

export async function createProperty(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const price = parseFloat(formData.get('price') as string) || 0
  const listingType = formData.get('listing_type') as string

  const { error } = await supabase.from('properties').insert({
    submitted_by: user.id,
    title: formData.get('title'),
    listing_type: listingType,
    property_type: formData.get('property_type'),
    owner_name: formData.get('owner_name'),
    owner_phone: formData.get('owner_phone'),
    owner_whatsapp: formData.get('owner_whatsapp'),
    area: formData.get('area'),
    landmark: formData.get('landmark'),
    address: formData.get('address'),
    monthly_rent: listingType === 'rent' ? price : null,
    sale_price: listingType === 'sale' ? price : null,
    security_deposit: formData.get('security_deposit') ? parseFloat(formData.get('security_deposit') as string) : null,
    bedrooms: formData.get('bedrooms') ? parseInt(formData.get('bedrooms') as string) : null,
    bathrooms: formData.get('bathrooms') ? parseInt(formData.get('bathrooms') as string) : null,
    area_sqft: formData.get('area_sqft') ? parseFloat(formData.get('area_sqft') as string) : null,
    furnishing: formData.get('furnishing'),
    description: formData.get('description'),
    status: 'draft'
  })

  if (error) throw new Error(error.message)
  
  const { redirect } = await import('next/navigation')
  redirect('/employee/properties')
}

export async function submitTaskCompletion(
  taskId: string, 
  notes: string,
  photo: File,
  location?: { lat: number, lng: number, acc: number }
) {
  const { createClient } = await import("@/lib/supabase/server");
  const { revalidatePath } = await import("next/cache");
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  let finalNotes = notes
  let proofUrl = null

  if (photo && photo.size > 0) {
    const fileExt = photo.name.split(".").pop()
    const fileName = `${taskId}-${Date.now()}.${fileExt}`
    
    // Attempt to upload to proofs bucket
    const { data, error } = await supabase.storage
      .from("proofs")
      .upload(fileName, photo, { upsert: true })

    if (error) {
      console.error("Proof upload error:", error)
      finalNotes += "\n\n[System Note: Photo was provided but failed to upload. The manager needs to create a public storage bucket named proofs in Supabase to enable image uploads.]"
    } else if (data) {
      const { data: { publicUrl } } = supabase.storage
        .from("proofs")
        .getPublicUrl(fileName)
      proofUrl = publicUrl
      finalNotes += "\n\n**Proof of Work:**\n" + publicUrl
    }
  }

  // Record the update
  await supabase
    .from("task_updates")
    .insert({
      task_id: taskId,
      employee_id: user.id,
      status: "submitted",
      notes: finalNotes,
      latitude: location?.lat,
      longitude: location?.lng,
      location_accuracy: location?.acc,
    })

  // Update task status
  await supabase
    .from("tasks")
    .update({ status: "submitted" })
    .eq("id", taskId)
    .eq("assigned_to", user.id)

  revalidatePath("/employee/tasks")
  revalidatePath(`/employee/tasks/${taskId}`)
  revalidatePath("/employee/dashboard")
}

export async function updateProfile(formData: FormData) {
  const { createClient } = await import("@/lib/supabase/server");
  const { revalidatePath } = await import("next/cache");
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("profiles")
    .update({
      phone: formData.get("phone") || null,
      city: formData.get("city") || null,
      bank_name: formData.get("bank_name") || null,
      bank_account_number: formData.get("bank_account_number") || null,
      bank_ifsc: formData.get("bank_ifsc") || null,
    })
    .eq("id", user.id)

  if (error) throw new Error(error.message)
  
  revalidatePath("/employee/profile")
  revalidatePath(`/manager/employees/${user.id}`)
}

