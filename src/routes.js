/**
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav.
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import TrabajosPendientes from "layouts/trabajos/Pendientes";
import Precios from "layouts/precios";
import NuevoTrabajo from "layouts/trabajos/Nuevo";
import SignIn from "layouts/authentication/sign-in";
import LogOut from "layouts/authentication/log-out";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// @mui icons
import Icon from "@mui/material/Icon";
import Clientes from "./layouts/clientes/Clients";
import Detalle from "./layouts/trabajos/Detalle";
import Lista from "./layouts/trabajos/Lista";
import Productos from "layouts/productos";
import DetallesCliente from "./layouts/clientes/DetallesCliente";
import NuevoProducto from "layouts/productos/NuevoProducto";
import DetalleProducto from "layouts/productos/PreciosProducto";


const BASE_URL = process.env.REACT_APP_API_ROOT || 'http://localhost:3001';

const routes = [
  {
    type: "collapse",
    name: "Trabajos Pendientes",
    key: "pendientes-trabajos",
    icon: <AccessTimeIcon fontSize="small" />,
    route: "/",
    isAdmin: true,
    protected: false,
    component: <TrabajosPendientes />,
  },
  {
    type: "collapse",
    name: "Todos los Trabajos",
    key: "todos-trabajos",
    icon: <AccessTimeIcon fontSize="small" />,
    route: "/todos",
    isAdmin: true,
    protected: true,
    component: <Lista />,
  },
  {
    type: "collapse",
    name: "Nuevo Trabajo",
    key: "nuevo-trabajo",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/nuevoTrabajo",
    protected: true,
    component: <NuevoTrabajo />,
  },
  {
    type: "collapse",
    name: "Clientes",
    key: "clientes",
    isAdmin: true,
    icon: <Icon fontSize="small">person</Icon>,
    route: "/clientes",
    protected: true,
    component: <Clientes />,
  },
  {
    type: "collapse",
    name: "Precios",
    key: "precios",
    isAdmin: true,
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/precios",
    protected: true,
    component: <Precios />,
  },
  {
    type: "collapse",
    name: "Productos",
    key: "productos",
    isAdmin: true,
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/productos",
    protected: true,
    component: <Productos />,
  },
  {
    type: "hidden",
    name: "Nuevo Producto",
    key: "nuevoProducto",
    isAdmin: true,
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/nuevoProducto",
    protected: true,
    component: <NuevoProducto />,
  },
  {
    type: "collapse",
    name: "Trabajo",
    key: "trabajo",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/trabajo/:id",
    show: false,
    protected: true,
    component: <Detalle />,
  },
  {
    type: "collapse",
    name: "Cliente",
    key: "cliente",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/cliente/:id",
    show: false,
    protected: true,
    component: <DetallesCliente />,
  },
  {
    type: "collapse",
    name: "Producto",
    key: "producto",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/producto/:id",
    show: false,
    protected: true,
    component: <DetalleProducto />,
  },
  {
    type: "divider",
  },
  {
    type: "collapse",
    name: "Descargar lista de precios",
    key: "preciosList",
    icon: <Icon fontSize="small">download</Icon>,
    route: "#",
    protected: true,
    href: `${BASE_URL}/upload/priceList`
  },
  {
    type: "divider",
  },
  {
    type: "collapse",
    name: "Mi Perfil",
    key: "mi-perfil",
    icon: <Icon fontSize="small">person</Icon>,
    route: `/perfil`,
    protected: true,
    component: <DetallesCliente />
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/login",
    show: false,
    protected: false,
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Cerrar Sesión",
    key: "sign-in",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/logout",
    show: true,
    protected: true,
    component: <LogOut />,
  }
];

export default routes;
