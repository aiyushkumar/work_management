import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Phone, MapPin, Landmark, Save, ShieldCheck, Mail, LogOut } from 'lucide-react'
import { updateManagerProfile } from '@/app/manager/actions'
import { logout } from '@/app/(auth)/actions'

export default async function ManagerProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  const initialLetter = profile?.full_name?.charAt(0).toUpperCase() || 'M'

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Manager Profile & Bank Details</h1>
          <p className="text-muted-foreground mt-1">Manage your personal details, contact info, and payout bank account.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1.5">
            <ShieldCheck size={14} /> Manager
          </span>
          <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border ${
            profile?.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'
          }`}>
            {profile?.status || 'Active'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1 shadow-sm border-t-4 border-t-navy-900 flex flex-col justify-between">
          <CardContent className="p-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 text-navy-900 rounded-full flex items-center justify-center font-bold text-4xl mx-auto mb-4 shadow-md ring-4 ring-yellow-100">
              {initialLetter}
            </div>
            <h2 className="text-xl font-bold text-navy-900">{profile?.full_name || 'Manager'}</h2>
            <p className="text-sm text-slate-500 mt-1 flex items-center justify-center gap-1">
              <Mail size={14} /> {profile?.email || user?.email}
            </p>

            <div className="mt-6 pt-6 border-t text-xs text-slate-500 space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Account ID:</span>
                <span className="font-mono text-slate-600">{user?.id?.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Member Since:</span>
                <span>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </CardContent>

          {/* Quick Sign Out Action */}
          <div className="p-4 bg-slate-50 border-t">
            <form action={logout}>
              <Button type="submit" variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 flex items-center justify-center gap-2">
                <LogOut size={16} /> Sign Out of Account
              </Button>
            </form>
          </div>
        </Card>

        {/* Edit Form */}
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-navy-900">
              <User size={20} className="text-yellow-600" /> Personal & Financial Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form action={updateManagerProfile} className="space-y-6">
              
              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="font-bold text-navy-900 text-sm tracking-wide uppercase border-b pb-2">
                  Personal & Contact Info
                </h3>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-1.5 text-slate-700">
                    <User size={14} /> Full Name
                  </label>
                  <Input 
                    name="full_name" 
                    defaultValue={profile?.full_name || ''} 
                    placeholder="Enter full name" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-1.5 text-slate-700">
                      <Phone size={14} /> Phone Number
                    </label>
                    <Input 
                      name="phone" 
                      defaultValue={profile?.phone || ''} 
                      placeholder="+91 XXXXX XXXXX" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-1.5 text-slate-700">
                      <MapPin size={14} /> City / Location
                    </label>
                    <Input 
                      name="city" 
                      defaultValue={profile?.city || ''} 
                      placeholder="e.g. Bhopal" 
                    />
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="pt-4 space-y-4">
                <h3 className="font-bold text-navy-900 text-sm tracking-wide uppercase border-b pb-2 flex items-center gap-2">
                  <Landmark size={16} className="text-green-600" /> Bank Details (For Payouts & Salary)
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Bank Name</label>
                    <Input 
                      name="bank_name" 
                      defaultValue={profile?.bank_name || ''} 
                      placeholder="e.g. State Bank of India" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Account Number</label>
                      <Input 
                        name="bank_account_number" 
                        defaultValue={profile?.bank_account_number || ''} 
                        placeholder="Enter account number" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">IFSC Code</label>
                      <Input 
                        name="bank_ifsc" 
                        defaultValue={profile?.bank_ifsc || ''} 
                        placeholder="e.g. SBIN0001234" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button type="submit" className="bg-navy-900 hover:bg-navy-800 text-white font-semibold">
                  <Save className="mr-2 h-4 w-4" /> Save Profile & Bank Details
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
