import { Suspense } from "react";
import { ForensicsWorkspace } from "@/components/forensics/ForensicsWorkspace";

export default function ForensicsPage() {
  return (
    <Suspense>
      <ForensicsWorkspace />
    </Suspense>
  );
}
