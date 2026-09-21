-- Enums
CREATE TYPE user_role AS ENUM ('manager', 'employee');
CREATE TYPE user_status AS ENUM ('pending', 'active', 'rejected', 'inactive');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE task_status AS ENUM ('assigned', 'accepted', 'in_progress', 'submitted', 'needs_revision', 'approved', 'completed', 'cancelled');
CREATE TYPE property_type AS ENUM ('house', 'flat', 'room', 'pg', 'shop', 'office', 'plot', 'other');
CREATE TYPE listing_type AS ENUM ('rent', 'sale');
CREATE TYPE property_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'unavailable', 'rented', 'sold');
CREATE TYPE furnishing_status AS ENUM ('furnished', 'semi_furnished', 'unfurnished');
CREATE TYPE lead_requirement_type AS ENUM ('buy', 'rent');
CREATE TYPE lead_urgency AS ENUM ('low', 'medium', 'high');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'matched', 'site_visit', 'converted', 'lost', 'follow_up');
CREATE TYPE followup_status AS ENUM ('pending', 'completed', 'cancelled');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'half_day', 'leave');
CREATE TYPE allowance_status AS ENUM ('pending', 'approved', 'rejected', 'paid');

-- Profiles Table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role user_role DEFAULT 'employee',
    status user_status DEFAULT 'pending',
    avatar_url TEXT,
    city TEXT,
    working_area TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks Table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES profiles(id),
    assigned_by UUID REFERENCES profiles(id),
    task_type TEXT,
    area TEXT,
    target_count INTEGER,
    priority task_priority DEFAULT 'medium',
    status task_status DEFAULT 'assigned',
    due_date DATE,
    due_time TIME,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Task Updates Table
CREATE TABLE task_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES profiles(id),
    status task_status,
    notes TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    location_accuracy DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties Table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submitted_by UUID REFERENCES profiles(id),
    verified_by UUID REFERENCES profiles(id),
    property_type property_type NOT NULL,
    listing_type listing_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    
    owner_name TEXT NOT NULL,
    owner_phone TEXT NOT NULL,
    owner_whatsapp TEXT,
    
    address TEXT,
    locality TEXT,
    area TEXT,
    landmark TEXT,
    pincode TEXT,
    
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    
    monthly_rent DECIMAL,
    security_deposit DECIMAL,
    sale_price DECIMAL,
    
    bedrooms INTEGER,
    bathrooms INTEGER,
    area_sqft DECIMAL,
    
    furnishing furnishing_status,
    floor INTEGER,
    total_floors INTEGER,
    parking BOOLEAN,
    
    available_from DATE,
    
    status property_status DEFAULT 'draft',
    verification_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ
);

-- Property Media Table
CREATE TABLE property_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    uploaded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads Table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID REFERENCES profiles(id),
    assigned_to UUID REFERENCES profiles(id),
    
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    
    requirement_type lead_requirement_type NOT NULL,
    property_type property_type,
    
    preferred_area TEXT,
    preferred_locality TEXT,
    
    budget_min DECIMAL,
    budget_max DECIMAL,
    
    bhk INTEGER,
    required_area_sqft DECIMAL,
    
    move_in_date DATE,
    
    urgency lead_urgency,
    requirements_notes TEXT,
    
    status lead_status DEFAULT 'new',
    source TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lead Followups Table
CREATE TABLE lead_followups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES profiles(id),
    followup_date DATE NOT NULL,
    followup_time TIME,
    notes TEXT,
    status followup_status DEFAULT 'pending',
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance Table
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES profiles(id),
    date DATE NOT NULL,
    check_in TIMESTAMPTZ,
    check_out TIMESTAMPTZ,
    check_in_latitude DOUBLE PRECISION,
    check_in_longitude DOUBLE PRECISION,
    check_out_latitude DOUBLE PRECISION,
    check_out_longitude DOUBLE PRECISION,
    status attendance_status DEFAULT 'present',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id, date)
);

-- Daily Reports Table
CREATE TABLE daily_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES profiles(id),
    date DATE NOT NULL,
    tasks_assigned INTEGER DEFAULT 0,
    tasks_completed INTEGER DEFAULT 0,
    owners_contacted INTEGER DEFAULT 0,
    properties_found INTEGER DEFAULT 0,
    properties_verified INTEGER DEFAULT 0,
    buyer_leads INTEGER DEFAULT 0,
    renter_leads INTEGER DEFAULT 0,
    followups_completed INTEGER DEFAULT 0,
    field_hours DECIMAL DEFAULT 0,
    problems_faced TEXT,
    today_notes TEXT,
    tomorrow_plan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id, date)
);

-- Field Allowances Table
CREATE TABLE field_allowances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES profiles(id),
    date DATE NOT NULL,
    amount DECIMAL NOT NULL,
    reason TEXT,
    status allowance_status DEFAULT 'pending',
    approved_by UUID REFERENCES profiles(id),
    approved_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    related_id UUID,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Logs Table
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Row Level Security (RLS) - Basic Setup (Enable RLS on all tables)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_allowances ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper Functions for Policies
CREATE OR REPLACE FUNCTION is_manager()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'manager' 
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Base policy: Managers can do everything
CREATE POLICY "Managers can select all tasks" ON tasks FOR SELECT USING (is_manager());
CREATE POLICY "Managers can insert all tasks" ON tasks FOR INSERT WITH CHECK (is_manager());
CREATE POLICY "Managers can update all tasks" ON tasks FOR UPDATE USING (is_manager());
CREATE POLICY "Managers can delete all tasks" ON tasks FOR DELETE USING (is_manager());

CREATE POLICY "Managers can select all properties" ON properties FOR SELECT USING (is_manager());
CREATE POLICY "Managers can insert all properties" ON properties FOR INSERT WITH CHECK (is_manager());
CREATE POLICY "Managers can update all properties" ON properties FOR UPDATE USING (is_manager());
CREATE POLICY "Managers can delete all properties" ON properties FOR DELETE USING (is_manager());

-- Employees policies: Can see assigned tasks
CREATE POLICY "Employees can view assigned tasks" ON tasks FOR SELECT USING (auth.uid() = assigned_to);
CREATE POLICY "Employees can update assigned tasks" ON tasks FOR UPDATE USING (auth.uid() = assigned_to);

-- Employees policies: Can view and create properties
CREATE POLICY "Employees can view all properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Employees can insert properties" ON properties FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Employees can update own properties" ON properties FOR UPDATE USING (auth.uid() = submitted_by);

-- Create new Profile automatically on Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, status)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.email, 
    'employee', 
    'pending'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
