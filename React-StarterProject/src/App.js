import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MyAppBar from './MyAppBar';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import MySnackbarContent from './MySnackbarContent';
import Snackbar from '@material-ui/core/Snackbar';
import SearchResultItem from './SearchResultItem';
import firebase from './firebase.js';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: '100%',
      maxWidth: 360,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  listMain: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
  },

  list: {
    marginTop: theme.spacing.unit * 2,
    flexDirection: 'column',
    width: '100%',
    alignItems: 'left',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
  },

  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
  fab: {
    margin: theme.spacing.unit,
  },
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      searchQuery: '',
      results: [],
      successOpen: false,
      failedOpen: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <MyAppBar />
        <main className={classes.main}>
          <CssBaseline />
          <Paper className={classes.paper}>
            <form className={classes.form} onSubmit={this.handleSubmit}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="searchQuery">Search Movies</InputLabel>
                <Input
                  id="searchQuery"
                  name="searchQuery"
                  autoComplete="searchQuery"
                  onChange={this.handleChange}
                  value={this.state.searchQuery}
                  autoFocus
                />
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Submit
              </Button>
            </form>
          </Paper>
        </main>
        <main className={classes.listMain}>
          <CssBaseline />
          <Paper className={classes.paper}>
            <List className={classes.list}>
              {this.state.results.map(searchItem => {
                return (
                  <SearchResultItem
                    key={searchItem.id}
                    id={searchItem.id}
                    primaryTitle={searchItem.primaryTitle}
                    originalTitle={searchItem.originalTitle}
                    runtimeMinutes={searchItem.runtimeMinutes}
                    tconst={searchItem.tconst}
                    genres={searchItem.genres}
                    titleType={searchItem.titleType}
                    endYear={searchItem.endYear}
                    startYear={searchItem.startYear}
                  />
                );
              })}
            </List>
          </Paper>
        </main>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.successOpen}
          autoHideDuration={6000}
          onClose={this.handleSuccessClose}
        >
          <MySnackbarContent
            onClose={this.handleSuccessClose}
            variant="success"
            message={
              this.state.results.length +
              ' Search Result(s) found successfully!'
            }
          />
        </Snackbar>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.failedOpen} // Assign variable that will control the open state of failure Snackbar
          autoHideDuration={6000}
          onClose={this.handleFailedClose} // Assign callback when Snackbar is closed
        >
          <MySnackbarContent
            onClose={this.handledFailedClose} // Assign callback when Snackbar is closed
            variant="error"
            message="No Results found, try another movie!"
          />
        </Snackbar>
      </div>
    );
  }
  handleSuccessClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ successOpen: false });
  };

  handleFailedClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ failedOpen: false });
  };

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      results: [],
    });
    const searchItemsRef = firebase.database().ref('title_basics');
    const searchItemQuery = searchItemsRef.limitToLast(10);
    searchItemQuery
      .orderByChild('originalTitle')
      .startAt(this.state.searchQuery)
      .endAt(this.state.searchQuery + '\uf8ff')
      .once('value', snapshot => {
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
            titleType: searches[searchItem].titleType,
          });
        }
        this.setState({
          results: newState,
          searchQuery: '',
        });
        if (this.state.results && this.state.results.length > 0) {
          this.setState({
            successOpen: true,
            failedOpen: false,
          });
        } else {
          this.setState({
            successOpen: false,
            failedOpen: true,
          });
        }
      });
  }
}
App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
