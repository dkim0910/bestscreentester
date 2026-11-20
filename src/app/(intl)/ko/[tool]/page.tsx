import { toolRoute } from "@/components/pages/ToolPage";

const route = toolRoute("ko");

export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
