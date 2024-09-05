import { useLayoutStore } from "./pinia/layout";
import { useAuthStore } from "./pinia/auth";
import { useUserStore } from "./pinia/user";
import { useCustomerStore } from "./pinia/customer";
import { createPinia } from "pinia";
import { useProductCategoryStore } from "./pinia/product-category";
import { useProductStore } from "./pinia/product";
import { useTransactionStore } from "./pinia/transaction";
import { useTestStore } from "./pinia/test";
import { useUserRolesStore} from "./pinia/user-roles";
import { useReportCategoryStore } from "./pinia/report-category";
import { useReportCustomerStore } from "./pinia/report-customer";

const pinia = createPinia();
export default pinia;

export {
    useLayoutStore,
    useAuthStore,
    useUserStore,
    useCustomerStore,
    useProductCategoryStore,
    useProductStore,
    useTransactionStore,
    useTestStore,
    useUserRolesStore,
    useReportCustomerStore,
    useReportCategoryStore
};
