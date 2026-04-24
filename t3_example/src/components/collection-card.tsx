export const CollectionCard = ({
    title,
    image,
}: {
    title: string;
    image: string;
}) => {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-surface mt-4">
        <img
          src={image}
          className=" w-full h-100  object-cover transition-transform duration-700"
        />

        <div className="absolute inset-0 flex items-end justify-center pb-2 pointer-events-none">
            <h3 className="px-6 py-1  text-text-primary transition-colors duration-500 rounded-full bg-surface-soft/50 group-hover:bg-surface-soft/80 border-2 border-t-yellow-50">
                {title}
            </h3>

        </div>
    </div>
    )
}