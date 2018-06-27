import React, { PropTypes } from 'react';
import $ from "jquery";

class Home extends React.Component {
  constructor(props){
    let box = (
      <div>
        <h3 id="searchInst">Enter up to 5 of your competitors' URLs (seperated by a comma)</h3>
      </div>);
    super(props);
    this.state = { lockSearch: true, errorBox: box, urlErrors: [] };
    this.searchHandler = this.searchHandler.bind(this);
    this.render = this.render.bind(this);
    this.barHandler = this.barHandler.bind(this);
  }

  barHandler(event){
    if((event.keyCode && event.keyCode === 13) || event.key === "Enter"){
      return this.searchHandler();
    }
    let box = (
      <div>
        <h3 id="searchInst">Enter up to 5 of your competitors' URLs (seperated by a comma)</h3>
      </div>);
    this.setState({ lockSearch: false, errorBox: box });
    document.querySelector("#searchBar").style.borderColor = "#4f4f4f";
    function isLetter(str) {
      return str.length === 1 && str.match(/[a-zA-Z0-9\t\n ./<>?;\,:"'`!@#$%^&*()\]\[}_+=|\\-]/g);
    }
    var input = event.target.value;
    let filter = (item, index) => {
      if(item.length <= 0 || !item){
        let urlCopy = this.state.urlErrors;
        let errorIndex = urlCopy.indexOf(index);
        if(errorIndex !== -1){
          urlCopy.splice(errorIndex,1);
          if(urlCopy.length > 0){
            let box = (
              <div>
                <ul id="errorBox">
                  {urlCopy.map((item, i) => <li className="error" key={item}>Url {item+1} is not formatted correctly!</li>)}
                </ul>
                <div className="triangleDown">
                </div>
              </div>);
          }
          else {
            let box = (
              <div>
                <h3 id="searchInst">Enter up to 5 of your competitors' URLs (seperated by a comma)</h3>
              </div>);
          }
          this.setState({urlErrors: urlCopy, errorBox: box});
        }
      }
      return ((item.length > 0) && item);
    };
    let searchTerms = input.replace(/\s/g,'').split(",").filter(filter);
    function isURL(str) {
      var pattern =  /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
      return (pattern.test(str) && (str.match(/\./g).length === 2) && (str.lastIndexOf(".") +2 < str.length)); //one for 0 indexing the other for the fact that ICANN does not allow single character url endings
    }
    let errors = [];
    this.state.urlErrors.forEach((item) => {
      if(item+1 <= searchTerms.length){
        errors.push(item);
      }
    });
    this.setState({ urlErrors: errors });
    if(searchTerms.length <= 5){
      let searchPromise = new Promise((resolve, reject) => {
        return resolve(searchTerms.forEach((item, index) => {
          if(!isURL(item)){
            var temp = "https://" + item;
            if(!isURL(temp)){
              temp = "https://www." + item;
              if(!isURL(temp)){
                let urlCopy = this.state.urlErrors;
                if(urlCopy.indexOf(index) == -1){
                  urlCopy.push(index);
                }
                let box = (
                  <div>
                    <ul id="errorBox">
                      {urlCopy.map((item, i) => <li className="error" key={item}>Url {item+1} is not formatted correctly!</li>)}
                    </ul>
                    <div className="triangleDown">
                    </div>
                  </div>);
                this.setState({ lockSearch: true, errorBox: box, urlErrors: urlCopy });
                document.querySelector("#searchBar").style.borderColor = "red";
              }
              else {
                let urlCopy = this.state.urlErrors;
                let errorIndex = urlCopy.indexOf(index);
                if(errorIndex !== -1){
                  urlCopy.splice(errorIndex,1);
                  if(urlCopy.length > 0){
                    let box = (
                      <div>
                        <ul id="errorBox">
                          {urlCopy.map((item, i) => <li className="error" key={item}>Url {item+1} is not formatted correctly!</li>)}
                        </ul>
                        <div className="triangleDown">
                        </div>
                      </div>);
                  }
                  else {
                    let box = (
                      <div>
                        <h3 id="searchInst">Enter up to 5 of your competitors' URLs (seperated by a comma)</h3>
                      </div>);
                  }
                  this.setState({urlErrors: urlCopy, errorBox: box});
                }
              }
            }
            else {
              let urlCopy = this.state.urlErrors;
              let errorIndex = urlCopy.indexOf(index);
              if(errorIndex !== -1){
                urlCopy.splice(errorIndex,1);
                if(urlCopy.length > 0){
                  let box = (
                    <div>
                      <ul id="errorBox">
                        {urlCopy.map((item, i) => <li className="error" key={item}>Url {item+1} is not formatted correctly!</li>)}
                      </ul>
                      <div className="triangleDown">
                      </div>
                    </div>);
                }
                else {
                  let box = (
                    <div>
                      <h3 id="searchInst">Enter up to 5 of your competitors' URLs (seperated by a comma)</h3>
                    </div>);
                }
                this.setState({urlErrors: urlCopy, errorBox: box});
              }
            }
          }
          else {
            let urlCopy = this.state.urlErrors;
            let errorIndex = urlCopy.indexOf(index);
            if(errorIndex !== -1){
              urlCopy.splice(errorIndex,1);
              if(urlCopy.length > 0){
                let box = (
                  <div>
                    <ul id="errorBox">
                      {urlCopy.map((item, i) => <li className="error" key={item}>Url {item+1} is not formatted correctly!</li>)}
                    </ul>
                    <div className="triangleDown">
                    </div>
                  </div>);
              }
              else {
                let box = (
                  <div>
                    <h3 id="searchInst">Enter up to 5 of your competitors' URLs (seperated by a comma)</h3>
                  </div>);
              }
              this.setState({urlErrors: urlCopy, errorBox: box});
            }
          }
        }));
      });

      searchPromise.then(() => {
        if(!this.state.lockSearch && input.length !== 0){
          document.querySelector("#searchBar").style.borderColor = "green";
        }
        else {
          if(this.state.urlErrors.length > 0){
            let box = (
              <div>
                <ul id="errorBox">
                  {this.state.urlErrors.map((item, i) => <li className="error" key={item}>Url {item+1} is not formatted correctly!</li>)}
                </ul>
                <div className="triangleDown">
                </div>
              </div>);
            this.setState({ errorBox: box });
          }
          else {
            this.setState({ lockSearch: true });
          }
        }
      });
    }
    else {
      let box = (
        <div>
          <ul id="errorBox">
            <li id="tooManyTermsErr" className="error">You have too many URLs in the search bar!</li>
          </ul>
          <div className="triangleDown">
          </div>
        </div>);
      this.setState({ lockSearch: true, errorBox: box });
      document.querySelector("#searchBar").style.borderColor = "red";
    }
  }

  searchHandler(event){
    if(!this.state.lockSearch){
      alert("Search started!");
      //this is where we will do things in the future.
    }
    //else do nothing, we've been pretty thorough elsewhere explaining why it is not working
  }

  render(){
    return (
      <div>
        <header>
          <button id="callButton" type="button">Schedule A Call</button>
          <h1 id="headerLogo">ACQUALI</h1>
          <a id="contactLink" href="#contact">Contact Us</a>
          <a id="aboutLink" href="#about">About</a>
          <a id="solutionsLink" href="#solutions">Solutions</a>
          <a id="howLink" href="#how">How it Works</a>
        </header>
        <h2 id="title">FREE Competitor Word Cloud Tool</h2>
        {this.state.errorBox}
        <input id="searchBar" type="text" name="" onKeyUp={this.barHandler}/>
        <button id="search" onClick={this.searchHandler}>Create Word Cloud</button>
      </div>);
  }
}

export default Home;
