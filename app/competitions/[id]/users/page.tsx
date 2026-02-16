"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { TypographyH4 } from "@/components/ui/typography-h4";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: number;
  username: string;
}

const UsersPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/user/all");
        setUsers(res.data);
      } catch (error) {
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleUser = (userId: number) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const addParticipantsMutation = useMutation({
    mutationFn: async () => {
      return api.post(`/competitions/${id}/participant/add`, {
        user_ids: Array.from(selectedUserIds),
      });
    },
    onSuccess: () => {
      toast.success("Participants added successfully 🎉");
      router.push(`/competitions/${id}`);
    },
    onError: () => {
      toast.error("Failed to add participants");
    },
  });

  const submitParticipants = () => {
    if (selectedUserIds.size === 0) {
      toast.warning("Please select at least one user");
      return;
    }

    addParticipantsMutation.mutate();
  };

  return (
    <main className="bg-white p-6 rounded-2xl w-full max-w-md shadow-md dark:bg-gray-800">
      <Card className="w-full max-w-2xl shadow-md rounded-2xl">
        <CardContent className="px-6">
          <TypographyH4>Add Participants</TypographyH4>

          <div className="mt-6 space-y-3 max-h-100 overflow-y-auto pr-2">
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full rounded-md" />
              ))}

            {!loading &&
              users.map((user) => (
                <Label
                  htmlFor={`user-${user.id}`}
                  key={user.id}
                  className="cursor-pointer flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition"
                >
                  <Checkbox
                    checked={selectedUserIds.has(user.id)}
                    onCheckedChange={() => toggleUser(user.id)}
                    id={`user-${user.id}`}
                  />
                  <p>{user.username}</p>
                </Label>
              ))}

            {!loading && users.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No users available.
              </p>
            )}
          </div>

          <Button
            onClick={submitParticipants}
            disabled={addParticipantsMutation.isPending}
            className="w-full mt-6 bg-linear-to-br from-[#A3162E] to-[#1B3691]
            text-white shadow-md hover:shadow-lg
            hover:opacity-95 transition-all duration-200"
          >
            {addParticipantsMutation.isPending
              ? "Adding..."
              : "Add Selected Account"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default UsersPage;
