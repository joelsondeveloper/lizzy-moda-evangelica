import Link from "next/link"

interface DashboardCardProps {
  children: React.ReactNode
  title?: string
  router?: string | undefined
  maxWidth?: string
}

const DashboardCard = ({children, title, router, maxWidth = "500px"}: DashboardCardProps) => {
  return (
    <section className={`p-6 flex flex-col gap-5 bg-page-background-light dark:bg-page-background-dark rounded-2xl shadow-2xl w-[clamp(300px,50vw,${maxWidth})]`}>
      <header className="flex items-center justify-between">
        <h3 className="font-playfair text-xl font-semibold">{title}</h3>
        {router && <Link href={router} className="text-sm font-medium">Ver todos</Link>}
      </header>
      {children}
    </section>
  )
}

export default DashboardCard
