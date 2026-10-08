import CreateAdminForm from "./create-admin-from";

/** Super-admin creation reuses the admin form with super-admin copy
 *  and the super-admin mutation. */
export default function CreateSuperAdminFrom() {
    return <CreateAdminForm variant="super-admin" />;
}
