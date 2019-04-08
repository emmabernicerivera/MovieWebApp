import React, { Component } from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { BrowserRouter as Router, Route, Link} from "react-router-dom";

export default class SearchResultItem extends Component {
  constructor() {
    super();
    this.state = {
        //id: this.props.id
    }
  }

  render() {
    return (
            <Link to={`/movie/${this.props.id}/${this.props.tconst}`}
                        className="list-group-item"
                        key={this.props.id}>
                <ListItem button>
                    <ListItemText 
                    primary={this.props.primaryTitle+" ("+this.props.startYear+")"} 
                    secondary={this.props.genres} />
                </ListItem> 
            </Link>
    );
  }
  
}
