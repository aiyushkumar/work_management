import { EmployeeNavigation } from '@/components/layout/employee-nav'

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <EmployeeNavigation>{children}</EmployeeNavigation>
}
