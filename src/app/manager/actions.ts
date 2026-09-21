'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateEmployeeStatus(employeeId: string, status: 'active' | 'rejected' | 'inactive') {
  const supabase = await createClient()
  
  // Verify manager role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
    
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
    
  if (profile?.role !== 'manager') throw new Error('Unauthorized')

  const { error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', employeeId)

  if (error) {
    console.error('Error updating status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/manager/employees')
  return { success: true }
}

export async function createTask(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    assigned_to: formData.get('employee_id'),
    assigned_by: user.id,
    task_type: formData.get('task_type'),
    area: formData.get('area'),
    target_count: parseInt(formData.get('target_count') as string) || 0,
    priority: formData.get('priority') || 'medium',
    status: 'assigned',
    due_date: formData.get('due_date'),
    due_time: formData.get('due_time'),
  }

  const { error } = await supabase
    .from('tasks')
    .insert(rawData)

  if (error) {
    console.error('Error creating task:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/manager/tasks')
  redirect('/manager/tasks')
}

export async function updateManagerProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: formData.get('full_name') as string || undefined,
      phone: formData.get('phone') as string || null,
      city: formData.get('city') as string || null,
      bank_name: formData.get('bank_name') as string || null,
      bank_account_number: formData.get('bank_account_number') as string || null,
      bank_ifsc: formData.get('bank_ifsc') as string || null,
    })
    .eq('id', user.id)

  if (error) {
    console.error('Error updating manager profile:', error)
    throw new Error(error.message)
  }

  revalidatePath('/manager/profile')
  revalidatePath('/manager/dashboard')
  revalidatePath('/manager')
}

export async function updateTaskReviewStatus(taskId: string, action: 'approve' | 'reject', managerNotes?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const newStatus = action === 'approve' ? 'completed' : 'in_progress'

  const { error: taskError } = await supabase
    .from('tasks')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', taskId)

  if (taskError) throw new Error(taskError.message)

  await supabase
    .from('task_updates')
    .insert({
      task_id: taskId,
      employee_id: user.id,
      status: newStatus,
      notes: managerNotes || (action === 'approve' ? 'Task approved by manager.' : 'Task rejected by manager. Please resubmit proof.'),
    })

  revalidatePath(`/manager/tasks/${taskId}`)
  revalidatePath('/manager/tasks')
  revalidatePath('/manager/dashboard')
  return { success: true }
}

export async function updateAllowanceStatus(allowanceId: string, status: 'approved' | 'rejected'): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('field_allowances')
    .update({ status })
    .eq('id', allowanceId)

  if (error) throw new Error(error.message)

  revalidatePath('/manager/allowances')
  revalidatePath('/manager/dashboard')
}




