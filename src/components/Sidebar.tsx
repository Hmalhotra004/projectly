"use client";

import { Button } from "@/components/ui/button";
import { Project } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import CreateProjectModal from "./modals/CreateProjectModal";
import SidebarItem from "./SidebarItem";
import SkeletonProject from "./SkeletonProject";

const Sidebar = () => {
  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await axios.get("/api/projects");
      return response.data;
    },
  });

  return (
    <aside className="min-w-[288px] px-6 pt-8 pb-4 bg-stone-900 text-stone-50 h-screen md:flex md:flex-col 2xs:hidden">
      <h2 className="mb-4 font-bold uppercase md:text-xl text-stone-200">
        Your Projects
      </h2>

      <CreateProjectModal>
        <Button
          variant="stone"
          onClick={() => {}}
          className="w-fit"
        >
          + Add Project
        </Button>
      </CreateProjectModal>

      <ul className="my-4 overflow-x-hidden scroll-area">
        {isLoading ? (
          <SkeletonProject />
        ) : isError ? (
          <p className="text-red-500">Failed to load projects.</p>
        ) : projects && projects.length > 0 ? (
          <section>
            {projects.map((project) => {
              return (
                <SidebarItem
                  key={project.id}
                  project={project}
                  isLoading={isLoading}
                />
              );
            })}
          </section>
        ) : (
          <p>Add a project</p>
        )}
      </ul>

      <button
        onClick={() => signOut()}
        className="flex text-stone-200 hover:text-stone-400 transition-all items-center justify-center mt-auto"
      >
        <LogOut className="w-5 mr-2" />
        Log out
      </button>
    </aside>
  );
};

export default Sidebar;
