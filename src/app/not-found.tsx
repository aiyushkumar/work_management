import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center p-4">
      <div className="w-16 h-16 bg-navy-900 text-yellow-500 rounded-full flex items-center justify-center text-2xl font-bold shadow-md mb-6">
        MP
      </div>
      <h2 className="text-4xl font-bold text-navy-900 mb-2">404</h2>
      <h3 className="text-xl font-semibold mb-6">Page Not Found</h3>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you are looking for does not exist or has been moved. Use the navigation to find your way back.
      </p>
      <Link href="/">
        <Button className="bg-navy-900">Return to Dashboard</Button>
      </Link>
    </div>
  )
}
