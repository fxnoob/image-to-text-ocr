import React, { Suspense } from "react";
const Home = React.lazy(() => import("./App"));
const Pdf = React.lazy(() => import("./Pdf"));
const Welcome = React.lazy(() => import("./Welcome"));
const queryString = require("query-string");
const parsed = queryString.parse(location.search);
const path = decodeURIComponent(parsed.path ? parsed.path : "home");
const GetView = ({ path }) => {
  let view;
  switch (path) {
    case "home":
      view = <Home />;
      break;
    case "pdf":
      view = <Pdf />;
      break;
    case "welcome":
      view = <Welcome />;
      break;
    default:
      view = <Home />;
  }
  return view;
};
export default () => {
  return (
    <Suspense fallback={<div style={{ textAlign: "center" }}>Loading...</div>}>
      <GetView path={path} />
    </Suspense>
  );
};
