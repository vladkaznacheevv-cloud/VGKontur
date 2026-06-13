"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { reachGoal } from "@/lib/metrica";

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  goal: string;
  children: ReactNode;
};

export function TrackedLink({ goal, children, onClick, ...props }: TrackedLinkProps) {
  return (
    <a
      {...props}
      data-metrica-goal={goal}
      onClick={(event) => {
        reachGoal(goal);
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
