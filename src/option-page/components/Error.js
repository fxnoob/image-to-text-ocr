import React from "react";
import Button from "@material-ui/core/Button";
import Loader from "./Loader";
import ConnectionErrorAnimation from "../../assets/NoInternetConnection";

export default () => {
  const reload = () => {
    window.location.reload();
  };
  return (
    <>
      <Loader json={ConnectionErrorAnimation} text="Network Error!" />
      <div
        style={{
          textAlign: "center",
          marginTop: "0.5rem",
        }}
      >
        <Button style={{ border: "1px solid" }} onClick={reload}>
          Reload
        </Button>
      </div>
    </>
  );
};
