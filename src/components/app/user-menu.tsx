import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserMenu({
  name,
  image,
}: {
  name?: string | null;
  image?: string | null;
}) {
  const fallback = name?.slice(0, 1).toUpperCase() ?? "U";

  return (
    <div className="flex items-center gap-3 rounded-full border border-border bg-card px-3 py-2">
      <Avatar className="size-8">
        {image ? <AvatarImage alt={name ?? "User"} src={image} /> : null}
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <span className="hidden text-sm font-medium md:inline">
        {name ?? "User"}
      </span>
    </div>
  );
}
