"use client";
import ProjectDeleteAlert from "@/components/modals/ProjectDeleteAlert";
import { cn } from "@/lib/utils";
import { Project } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Trash } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Loader from "./Loader";

interface ProjectItemProps {
  project: Project;
  isLoading: boolean;
}

const SidebarItem = ({ project, isLoading }: ProjectItemProps) => {
  const params = useParams();
  const isSelected = project.id === params.projectId;
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync: deleteProject, isPending } = useMutation({
    mutationFn: async () => {
      const response = axios.delete(`/api/projects`, {
        data: { Id: project.id },
      });
      if (isSelected) router.push("/projects");
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return (
    <li
      key={project.id}
      className="flex"
    >
      <Link
        href={`/projects/${project.id}`}
        className={cn(
          "flex-1 text-left break-words max-w-full px-2 py-1 rounded-sm my-1 transition-colors cursor-pointer",
          isSelected
            ? "text-stone-200 bg-stone-800"
            : "text-stone-400 hover:text-stone-200 hover:bg-stone-800"
        )}
      >
        {project.completed ? (
          <del>{project.name}</del>
        ) : (
          <span>{project.name}</span>
        )}
      </Link>

      <ProjectDeleteAlert
        project={project}
        deleteFn={deleteProject}
      >
        <button
          className="ml-2 hover:text-red-500 transition-all"
          disabled={isLoading || isPending}
        >
          {isPending ? <Loader /> : <Trash />}
        </button>
      </ProjectDeleteAlert>
    </li>
  );
};

export default SidebarItem;
