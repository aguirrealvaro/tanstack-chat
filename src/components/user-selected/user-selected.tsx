import { Route as HomeRoute } from "@/routes/index";
import { X } from "lucide-react";

export const UserSelected = () => {
  const { users } = HomeRoute.useLoaderData();
  const { user: selectedUserId } = HomeRoute.useSearch();
  const navigate = HomeRoute.useNavigate();

  const selectedUser = users.find((user) => user.id === selectedUserId);

  if (!selectedUser) return null;

  const closeChat = () => {
    navigate({ search: { user: undefined } });
  };

  return (
    <div className="mb-4 flex items-center justify-between border-b px-4 pb-4">
      <div className="flex items-center">
        <div className="flex items-center gap-4">
          <img
            src={selectedUser.imageUrl}
            width={28}
            height={28}
            alt={`${selectedUser.firstName}'s-profile-image`}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <span>{selectedUser.firstName}</span>
            <span className="pointer-events-none truncate text-sm text-muted-foreground">
              {selectedUser.email}
            </span>
          </div>
        </div>
      </div>
      <button className="rounded-full p-2 hover:bg-muted" onClick={closeChat}>
        <X size={18} />
      </button>
    </div>
  );
};
