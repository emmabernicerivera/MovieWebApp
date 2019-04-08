import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MyAppBar from './MyAppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import axios from 'axios';
import CardMedia from '@material-ui/core/CardMedia';
import firebase from './firebase';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: '95%',
      maxWidth: 800,
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
      width: 800,
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

  card: {
    marginTop: theme.spacing.unit * 3,
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 200,
    height: 300,
  },
  bigAvatar: {
    margin: 10,
    width: 50,
    height: 50,
  },
});

class MovieDetails extends Component {
  constructor() {
    super();
    this.state = {
      id: '',

      // FROM IMDB TITLE INFO
      originalTitle: 'Todo ',
      primaryTitle: 'Todo ',
      runtimeMinutes: 'Todo ',
      tconst: '',
      genres: 'Todo ',
      titleType: 'Todo ',
      endYear: 'Todo ',
      startYear: 'Todo ',

      // FROM IMDB RATINGS INFO
      averageRating: 'Todo ',
      numVotes: 'Todo ',

      // FROM THEMOVIEDB DATA
      overview: 'Todo ',
      backdrop: '',
      poster: 'https://via.placeholder.com/200x300',
      artWorkId: '',
      artWorkObject: [],
      cast: [
        {
          name: 'Todo ',
          character: 'Todo',
          profilePic: 'https://via.placeholder.com/100x100',
        },
      ],
      crew: [],
      themoviedbAPIKey: 'be40ed5e356ef636a6e5a75065751130',
    };
  }

  render() {
    const tconst = this.props.match.params.id;
    const artWorkBaseURL_200 = 'https://image.tmdb.org/t/p/w200';
    const { classes } = this.props;
    if (!tconst) {
      return <div>Sorry, but the Movie was not found</div>;
    }
    return (
      <div>
        <MyAppBar />
        <main className={classes.main}>
          <CssBaseline />
          <Card className={classes.card}>
            <CardMedia
              component="img"
              className={classes.cover}
              image={this.state.poster}
              title={this.state.primaryTitle}
            />
            <div className={classes.details}>
              <CardContent className={classes.content}>
                <Typography component="h4" variant="h4">
                  {this.state.primaryTitle} ({this.state.startYear})
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Genre(s): {this.state.genres}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Type: {this.state.titleType}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                  Ratings: {this.state.averageRating} ({this.state.numVotes})
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                  Runtime : {this.state.runtimeMinutes} Minutes
                </Typography>
                <Typography component="p">{this.state.overview}</Typography>
              </CardContent>
              <CardActions>
                <Link to="/">
                  <Button size="small">Back</Button>
                </Link>
              </CardActions>
            </div>
          </Card>
        </main>

        <main className={classes.main}>
          <CssBaseline />
          <Paper className={classes.paper}>
            <Typography component="h5" variant="h5">
              Cast Member(s)
            </Typography>
            <List className={classes.list}>
              {this.state.cast.map(castMember => {
                const profilePic = artWorkBaseURL_200 + castMember.profile_path;
                return (
                  <ListItem key={castMember.id || castMember.name}>
                    <Avatar
                      alt={castMember.name}
                      src={profilePic}
                      className={classes.bigAvatar}
                    >
                      <ImageIcon />
                    </Avatar>
                    <ListItemText
                      primary={castMember.name}
                      secondary={castMember.character}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </main>
      </div>
    );
  }

  componentDidMount() {
    this.setState({
      id: this.props.match.params.id,
      tconst: this.props.match.params.tconst,
    });
    const searchItemsRef = firebase
      .database()
      .ref('title_basics/' + this.props.match.params.id);
    searchItemsRef.once('value', snapshot => {
      this.setState({
        originalTitle: snapshot.child('originalTitle').val(),
        primaryTitle: snapshot.child('primaryTitle').val(),
        runtimeMinutes: snapshot.child('runtimeMinutes').val(),
        tconst: snapshot.child('tconst').val(),
        genres: snapshot.child('genres').val(),
        titleType: snapshot.child('titleType').val(),
        endYear: snapshot.child('endYear').val(),
        startYear: snapshot.child('startYear').val(),
      });
    });
    const ratingsRef = firebase.database().ref('title_ratings');
    const ratingsRefQuery = ratingsRef.limitToLast(1);

    ratingsRefQuery
      .orderByChild('tconst')
      .endAt(this.props.match.params.tconst)
      .once('value', snapshot => {
        let ratingSearches = Object.values(snapshot.val())[0];
        this.setState({
          averageRating: ratingSearches.averageRating,
          numVotes: ratingSearches.numVotes,
        });
      });

    const artWorkBaseURL_200 = 'https://image.tmdb.org/t/p/w200';
    const artWorkBaseURL_1280 = 'https://image.tmdb.org/t/p/w1280';

    axios
      .get(
        `https://api.themoviedb.org/3/find/${this.props.match.params.tconst}`,
        {
          params: {
            api_key: this.state.themoviedbAPIKey,
            language: 'en-US',
            external_source: 'imdb_id',
          },
        }
      )
      .then(res => {
        const artWork = res.data.movie_results;
        this.setState({ artWorkObject: artWork });
        if (this.state.artWorkObject && this.state.artWorkObject.length > 0) {
          this.setState({
            poster:
              artWorkBaseURL_200 + this.state.artWorkObject[0].poster_path,
            backdrop:
              artWorkBaseURL_1280 + this.state.artWorkObject[0].backdrop_path,
            overview: this.state.artWorkObject[0].overview,
            artWorkId: this.state.artWorkObject[0].id,
          });
        }
      })
      .then(res => {
        axios
          .get(
            `https://api.themoviedb.org/3/movie/${
              this.state.artWorkId
            }/credits`,
            {
              params: {
                //I added this
                api_key: this.state.themoviedbAPIKey,
                language: 'en-US',
                external_source: 'imdb_id',
              },
            }
          )
          .then(res => {
            const castAndCrew = res.data;
            this.setState({
              cast: castAndCrew.cast,
            });
          });
      });
  }
}

MovieDetails.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MovieDetails);
