import { Button } from "@heroui/button";

export default function Filter({
  title,
  tags,
}: {
  title: string;
  tags: string[];
}) {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-y-2 gap-x-8 max-w-3xl">
      <h3 className="font-black text-blue-dark text-sm flex items-start py-1">
        {title}
      </h3>
      <div className="flex gap align-center justify-center gap-2 flex-wrap w-fit">
        {tags.map((tagTitle) => (
          <Button
            size="sm"
            className="h-auto m-w-16 px-2.5 py-1.5 font-medium text-xs bg-blue-transparent text-blue rounded-full"
            key={tagTitle}
          >
            {tagTitle}
          </Button>
        ))}
      </div>
    </div>
  );
}
