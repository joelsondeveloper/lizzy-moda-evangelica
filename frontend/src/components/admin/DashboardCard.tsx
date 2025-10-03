import Link from "next/link"

interface DashboardCardProps {
  children: React.ReactNode
  title?: string
  router?: string | undefined
  maxWidth?: string
  fullWidth?: boolean
}

const DashboardCard = ({children, title, router, maxWidth = "500px", fullWidth = false}: DashboardCardProps) => {
  return (
    <section className={`p-6 flex flex-col gap-5 bg-page-background-light dark:bg-page-background-dark rounded-2xl shadow-2xl ${fullWidth ? "w-full" : `w-[clamp(300px,50vw,${maxWidth})]`}`}>
      <header className="flex items-center justify-between">
        <h3 className="font-playfair text-xl font-semibold">{title}</h3>
        {router && <Link href={router} className="text-sm font-medium">Ver todos</Link>}
      </header>
      <div className="overflow-x-auto">
        {children}
      </div>
    </section>
  )
}

export default DashboardCard
