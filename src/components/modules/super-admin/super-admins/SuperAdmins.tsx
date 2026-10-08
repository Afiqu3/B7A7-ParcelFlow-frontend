"use client";

import { useGetAllSuperAdmin } from "@/hooks";
import AdminDirectory from "../Admins/AdminDirectory";

/** Super-admin directory: same table, toggle, search and pagination. */
export default function SuperAdmins() {
    return (
        <AdminDirectory
            useAdminsQuery={useGetAllSuperAdmin}
            title="Super admin"
            singular="super admin"
            plural="super admins"
            createHref="/super-dashboard/create-admin"
        />
    );
}
