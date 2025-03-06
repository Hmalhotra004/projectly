"use client";
import { cn } from "@/lib/utils";
import { type Task } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Check, LoaderCircle, LucideProps, Trash, X } from "lucide-react";
import { useParams } from "next/navigation";
import { ForwardRefExoticComponent } from "react";
import ActionTooltip from "../ActionTooltip";
import { Separator } from "../ui/separator";

interface TaskProps {
  task: Task;
  type: "Active" | "Completed";
}

const Task = ({ task, type }: TaskProps) => {
  const queryClient = useQueryClient();
  const params = useParams();

  const { mutateAsync: TaskState, isPending } = useMutation({
    mutationKey: [task.projectId],
    mutationFn: async () => {
      await axios.put("/api/tasks", {
        id: task.id,
        projectId: task.projectId,
        state: task.completed,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", params.projectId],
        exact: true,
      });
    },
  });

  const { mutateAsync: deleteTask, isPending: deleteLoading } = useMutation({
    mutationKey: [task.projectId],
    mutationFn: async () => {
      await axios.delete("/api/tasks", {
        data: {
          id: task.id,
          projectId: task.projectId,
          state: task.completed,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", params.projectId],
        exact: true,
      });
    },
  });

  return (
    <li
      key={task.id}
      className="flex justify-between my-2 text-left break-words"
    >
      <span className={cn(type === "Completed" && "line-through opacity-60")}>
        {task.name}
      </span>
      <div className="flex">
        <button
          className="hover:text-emerald-600"
          onClick={() => TaskState()}
          disabled={isPending}
        >
          {isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <IconButton
              text={
                type === "Active"
                  ? "Mark as Completed"
                  : "Mark as Not Completed"
              }
              icon={type === "Active" ? Check : X}
            />
          )}
        </button>

        <Separator
          orientation="vertical"
          className="mx-2 bg-stone-700"
        />

        <button
          onClick={() => deleteTask()}
          className="text-stone-700 hover:text-red-500 transition-colors"
          disabled={deleteLoading}
        >
          {deleteLoading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <IconButton
              text="Delete Task"
              icon={Trash}
            />
          )}
        </button>
      </div>
    </li>
  );
};

const IconButton = ({
  text,
  icon: Icon,
}: {
  text: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
}) => {
  return (
    <ActionTooltip label={text}>
      <Icon className="w-5" />
    </ActionTooltip>
  );
};

export default Task;
