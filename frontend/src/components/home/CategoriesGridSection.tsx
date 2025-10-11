import { Category, getCategories } from '@/services/category'
import { useAuth } from '@/context/AuthContext';

const { isLoading } = useAuth();
const CategoriesGridSection = async () => {

    const categories = await getCategories();


    const gridClasses = `
    grid-container w-full grid 
    grid-cols-1 
    sm:grid-cols-2 
    md:grid-cols-3 
    lg:grid-cols-4 
    xl:grid-cols-5 
    gap-[clamp(1rem,2vw,2rem)]
  `;

  const sectionClasses = `
    px-[clamp(1rem,4vw,6rem)] 
    py-[clamp(2rem,6vw,8rem)] 
    flex flex-col gap-12 
    justify-center items-center 
    bg-page-background-light 
    dark:bg-page-background-dark
  `;

  return (
    <section className={sectionClasses}>
      <header className="flex flex-col gap-3 text-center px-2">
        <h2 className="font-playfair text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-text-primary-light dark:text-text-primary-dark leading-tight">
          Categorias
        </h2>
        <p className="text-text-secondary-light dark:text-text-secondary-dark max-w-[50ch] mx-auto text-[clamp(0.9rem,1.5vw,1.1rem)]">
          Conheça nossas categorias
        </p>
      </header>

      {isLoading ? (
        <div className={gridClasses}>
          {Array.from({ length: 6 }).map((_, i) => (
            <article
              key={i}
              className="rounded-xl overflow-hidden flex flex-col cursor-pointer w-full"
            >
              <div className="img-container aspect-square relative">
                <div className="skeleton absolute top-0 left-0 w-full h-full rounded-xl"></div>
              </div>
              <div className="info p-4 flex flex-col gap-3 bg-card-background-light dark:bg-card-background-dark flex-1">
                <h3 className="skeleton h-6 w-3/4 rounded"></h3>
                <p className="skeleton h-5 w-1/2 rounded"></p>
                <button className="skeleton h-8 w-full rounded"></button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div
          className={`
        w-full
        flex lg:grid
        lg:grid-cols-4
        gap-[clamp(1rem,2vw,2rem)]
        overflow-x-auto
        snap-x snap-mandatory
        scroll-smooth
        scrollbar-hide
        px-2
      `}
        >
          {categories &&
            categories.map((product: Category) => (
              <div
                key={product._id}
                className="flex-shrink-0 w-[85%] sm:w-[45%] md:w-[33%] lg:w-auto snap-center"
              >
                
              </div>
            ))}
        </div>
      )}
    </section>
  )
}

export default CategoriesGridSection
