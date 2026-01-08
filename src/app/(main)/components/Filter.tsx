import { Category } from "@app-types/models/Category";
import FilterButton from "./FilterButton";

export default function Filter({ title, tags }: { title: string; tags: Category[] }) {
  return (
    <div className="flex flex-col justify-center items-center gap-y-2 gap-x-8 max-w-3xl">
      <h3 className="font-black text-blue-night dark:text-white text-sm flex items-start py-1">
        {title}
      </h3>
      <div className="flex flex-wrap justify-center gap-2 h-[500px] overflow-y-auto px-4.5">
        {tags
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((tag) => (
            <FilterButton key={tag.slug} { ...tag } />
          ))}
      </div>
    </div>
  );
}
