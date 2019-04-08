import React , { Component } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { withStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import firebase from "./firebase";
const styles = theme => ({
  root: {
    width: "100%",
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing.unit,
      width: "auto",
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    width: "100%",
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200,
      },
    },
  },
});

class MyAppBar extends Component {
  constructor() {
    super();
    this.state = {
      searchQuery: "",
      results: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  render() {
  const { classes } = this.props;
  return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer">
                <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" color="inherit" noWrap>
              Movies Search
            </Typography>
            <div className={classes.grow} />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <form onSubmit={this.handleSubmit}>
              <InputBase id="searchQuery" name="searchQuery"  onChange={this.handleChange} value={this.state.searchQuery}
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
              />
              </form>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      results: []
    });
    const searchItemsRef = firebase.database().ref("title_basics");
    const searchItemQuery = searchItemsRef.limitToLast(10);
    searchItemQuery.orderByChild("originalTitle").startAt(this.state.searchQuery).endAt(this.state.searchQuery+"\uf8ff").on("value", (snapshot) => {
      let searches = snapshot.val();
      let newState = [];
      for (let searchItem in searches) {
        newState.push({
          id: searchItem,
          originalTitle: searches[searchItem].originalTitle,
          primaryTitle: searches[searchItem].primaryTitle,
          endYear: searches[searchItem].endYear,
          genres: searches[searchItem].genres,
          isAdult: searches[searchItem].isAdult,
          runtimeMinutes: searches[searchItem].runtimeMinutes,
          startYear: searches[searchItem].startYear,
          tconst: searches[searchItem].tconst,
          titleType: searches[searchItem].titleType
        });
      }
      this.setState({
        results: newState,
        searchQuery : ''
      });
    });
  }

}
MyAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyAppBar);