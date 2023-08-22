import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Sidenav from "examples/Sidenav";
import theme from "assets/theme";
import themeDark from "assets/theme-dark";
import routes from "routes";
import { setMiniSidenav, useMaterialUIController } from "context";
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import { useGlobalDataContext } from "./context/DataContext";
import DataService from "./services/DataService";
import ProtectedRoute from "./authContexts/ProtectedRoute";
import { useAuth0 } from "@auth0/auth0-react";
import AdminRoute from "authContexts/AdminRoute";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();
  const { setPrices, setUser } = useGlobalDataContext()
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  /// TODO - NICO EVITAR FETCH SI NO ESTA AUTHENTICATED

  useEffect(() => {
    const fetchData = async () => {
      const token = await getAccessTokenSilently();
      // if (!token){
      //   debugger
      //   return;
      // }
      const { data: prices } = await DataService.fetchPrices(token);
      setPrices(prices);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };


  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      // if (route.collapse) {
      //   return getRoutes(route.collapse);
      // }

      if (route.protected) {
        if (route.isAdmin) {
          return <Route exact path={route.route} key={route.key} element={<AdminRoute />}>
            <Route exact path={route.route} element={route.component} />
          </Route>
        }
        return (
          <Route exact path={route.route} key={route.key} element={<ProtectedRoute />}>
            <Route exact path={route.route} element={route.component} />
          </Route>
        )
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  const { isLoading, isAuthenticated, error, loginWithRedirect, user } = useAuth0();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) {
        return
      }

      const token = getAccessTokenSilently();
      const { data, error } = await DataService.fetchUserDataByEmail(token, user?.email);

      if (error) {
        navigate('/logout')
      }
      setUser(data);
    }

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAccessTokenSilently, setUser, user?.email]);


  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (!isAuthenticated) {
    return loginWithRedirect()
  }
  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {
        isAuthenticated &&
        <Sidenav
          color={sidenavColor}
          brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
          brandName="Grafica Publicar"
          routes={routes}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
        />
      }
      <Routes>
        {getRoutes(routes)}
        {/*<Route path="*" element={<Navigate to="/" />} />*/}
      </Routes>
    </ThemeProvider>
  );
}
