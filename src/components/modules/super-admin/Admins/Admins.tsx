"use client";

import { useGetAllAdmin } from "@/hooks";
import AdminDirectory from "./AdminDirectory";

/** Admin directory for the super dashboard (search, toggle, pagination). */
export default function Admins() {
    return (
        <AdminDirectory
            useAdminsQuery={useGetAllAdmin}
            title="Admin"
            singular="admin"
            plural="admins"
            createHref="/super-dashboard/create-admin"
        />
    );
}
