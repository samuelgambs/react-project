import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import stocks from "./stocks.json";
import FilterResults from "react-filter-search";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import Search from "@material-ui/icons/Search";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { ReactComponent as SemBusca } from "./assets/busca.svg";

class Autocomplete extends Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array)
  };

  static defaultProps = {
    suggestions: []
  };

  constructor(props) {
    super(props);

    this.state = {
      // The active selection's index
      activeSuggestion: 0,
      // The suggestions that match the user's input
      filteredSuggestions: [],
      // Whether or not the suggestion list is shown
      showSuggestions: false,
      // What the user has entered
      data: [],
      value: "",
      userInput: "",
      open: false,
      hideFirstSearch: false
    };
  }

  // Event fired when the input value is changed
  onChange = event => {
    const { suggestions } = this.props;
    const userInput = event.currentTarget.value;

    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = suggestions.filter(
      suggestion =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    // Update the user input and filtered suggestions, reset the active
    // suggestion and make sure the suggestions are shown
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: event.currentTarget.value
    });
  };

  // Event fired when the user clicks on a suggestion
  onClick = e => {
    // Update the user input and reset the rest of the state
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText
    });
  };

  // Event fired when the user presses a key down
  onKeyDown = e => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    // User pressed the enter key, update the input and close the
    // suggestions
    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion]
      });
    }
    // User pressed the up arrow, decrement the index
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({
        activeSuggestion: activeSuggestion + 1
      });
    }
  };

  handleClick = e => {
    if (this.state.userInput === "") {
      alert("vazio");
    } else {
      this.setState({
        data: stocks.market.company,
        value: this.state.userInput,
        hideFirstSearch: true
      });
    }
  };

  state = {
    open: false
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        value,
        data,
        userInput
      }
    } = this;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul class="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "suggestion-active";
              }

              return (
                <li className={className} key={suggestion} onClick={onClick}>
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = <div class="no-suggestions" />;
      }
    }

    const style = this.state.hideFirstSearch ? { display: "none" } : {};

    return (
      <Fragment>
        <div>
          <div>
            <input
              type="text"
              onChange={onChange}
              onKeyDown={onKeyDown}
              value={userInput}
              ref="myInput"
              className="inputStyle"
              placeholder="Pesquisar..."
            />
            <button onClick={this.handleClick}>
              <Search style={{ width: 40, height: 40 }} />
            </button>
          </div>
          {suggestionsListComponent}
        </div>
        <FilterResults
          value={value}
          data={data}
          renderResults={results => (
            <div className="resultStyle">
              <div className="firstSearch" style={style}>
                <SemBusca />
                <br />
                Você ainda não realizou <br />
                nenhuma busca!
              </div>
              {results.map(i =>
                i.stock.map((s, index) => (
                  <div>
                    {index === 0 && (
                      <div className="resultsHeading">Resultado da busca</div>
                    )}
                    <ExpansionPanel key={index} className="results">
                      <ExpansionPanelSummary
                        className="summary"
                        expandIcon={
                          <ExpandMoreIcon style={{ color: "#ba7fd8" }} />
                        }
                      >
                        <Typography className="heading">
                          <img alt="logo" src={i.logo} />
                        </Typography>
                        <Typography className="secondaryHeading">
                          <div className="name">
                            <b>{i.name}</b> - {s.name}
                          </div>
                        </Typography>
                        <Typography className="infoHeading">
                          <div className="info">Ver detalhe da ação</div>
                        </Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <Typography className="containerDetails">
                          <Typography className="details">
                            Abertura:
                            <div className="text-style-1">
                              {s.openingvalue}
                            </div>
                          </Typography>
                          <Typography className="secondaryDetails">
                            Atual:
                            <div className="text-style-2"> {s.actualvalue}</div>
                          </Typography>
                          <Typography className="buttonDetails">
                            <Button
                              variant="contained"
                              size="large"
                              classes="buttonStyle"
                              color="primary"
                              className="buttonStyle"
                              onClick={this.handleClickOpen}
                              style={{ width: 154, height: 50, fontSize: 20 }}
                            >
                              {s.openingvalue < s.actualvalue && (
                                <b> Comprar </b>
                              )}
                              {s.openingvalue > s.actualvalue && (
                                <b> Vender </b>
                              )}
                            </Button>
                          </Typography>
                        </Typography>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <Dialog
                      open={this.state.open}
                      onClose={this.handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogContent>
                        <DialogContentText id={i.name}>
                          Tem certeza que deseja vender essa ação?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                          Não
                        </Button>
                        <Button
                          onClick={this.handleClose}
                          color="primary"
                          autoFocus
                        >
                          Sim
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                ))
              )}
            </div>
          )}
        />
      </Fragment>
    );
  }
}
export default Autocomplete;
