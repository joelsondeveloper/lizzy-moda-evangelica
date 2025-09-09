import Link from "next/link"

type RegisterProps = {
    text: string
    texLink: string
    link: string
}

const register = ({text, texLink, link}: RegisterProps) => {
  return (
    <div className="register flex items-center gap-2 text-sm">
        <p className="text-text-primary-light dark:text-text-primary-light dark:text-link-dark">{text}</p>
        <Link href={link} className="text-primary-accent-light dark:text-primary-accent-dark">{texLink}</Link>
      </div>
  )
}

export default register
