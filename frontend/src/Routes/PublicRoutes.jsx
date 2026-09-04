import React, { lazy } from "react";
import MainContent from "../components/MainContent";

const Login = lazy(() => import("../pages/Auth/Login"));
const Clubs = lazy(() => import("../components/Clubs/Clubs"));
const SignUp = lazy(() => import("@/pages/Auth/SignUp"));
// [EMAIL/PASSWORD AUTH — INTENTIONALLY DISABLED]
// const VerifyAccount = lazy(() => import("@/pages/Auth/VerifyAccount"));
const AuthSelection = lazy(() => import("@/pages/Auth/AuthSelection"));
const EventsPage = lazy(() => import("@/pages/Events"));
const Developers = lazy(() => import("../pages/Developers"));
const NotFound = lazy(() => import("@/pages/NotFound"));


export const publicRoutes = [
  { path: "/", element: <MainContent /> },
  { path: "/clubs", element: <Clubs /> },
  { path: "/get-started", element: <AuthSelection /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <Login /> },
  // [EMAIL/PASSWORD AUTH — INTENTIONALLY DISABLED]
  // { path: "/verify-account", element: <VerifyAccount /> },
  { path: "/events", element: <EventsPage /> },
  { path: "/developers", element: <Developers /> },
  { path: "*", element: <NotFound /> },
];
