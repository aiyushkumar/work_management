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
