import React from "react";

import { Drawer } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import PropTypes from "prop-types";

import useAuth from "../../../../hooks/useAuth";
import { client_pages } from "../../../../static/nav-pages";
import { getAllowedRoutes } from "../../../../utils/helpers";

import AccordionSideBar from "./components/Accordion/Accordion";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 300,
    [theme.breakpoints.up("lg")]: {
      marginTop: 64,
      height: "calc(100% - 64px)",
    },
  },
  root: {
    backgroundColor: theme.palette.white,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    // padding: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  nav: {
    marginBottom: theme.spacing(2),
  },
}));

const Sidebar = (props) => {
  const {
    open,
    variant,
    onClose,
    className,

  } = props;
  const classes = useStyles();

  const navPages = client_pages;

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open
      variant={variant}
    >
      <div className={classes.root}>
        <AccordionSideBar />
      </div>
    </Drawer>

  );
};

Sidebar.defaultProps = {
  className: null,
  onClose: () => { },
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired,
};

export default Sidebar;
