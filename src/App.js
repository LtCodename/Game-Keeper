import React from 'react';
import UserList from './components/user-list/UserList.js';
import Header from './components/header/Header.js';
import Dashboard from './components/dashboard/Dashboard.js';
import Profile from './components/profile/Profile.js';
import Privacy from './components/privacy/Privacy.js';
import Preloader from './components/preloader/Preloader.js';
import { BrowserRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import colorsActions from './redux/reducers/colorsReducer';
import platformsActions from './redux/reducers/platformsReducer';
import userBlocksReducer from './redux/reducers/userBlocksReducer';
import userListsReducer from './redux/reducers/userListsReducer';
import userReducer from './redux/reducers/userReducer';
import userSectionsReducer from './redux/reducers/userSectionsReducer';
import fire from "./Firebase";
import { Redirect, Switch } from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listsSectionsBlocksLoaded: false,
      userAuthDataLoaded: false,
      colorsDataLoaded: false,
      platformsDataLoaded: false,
      unauthorized: false,
    }
  }

  componentDidMount() {
    this.fetchEverything();
  }

  fetchEverything = () => {
    this.fetchUser();
    this.fetchColors();
    this.fetchPlatforms();
  };

  fetchColors() {
    fire.firestore().collection('availableColors').onSnapshot(snapshot => {
      this.props.fetchColors(snapshot);
      setTimeout(() => {
        this.setState({
          colorsDataLoaded: true
        });
      }, 0);
    }, error => {
      console.log(error.message);
    });
  }

  fetchPlatforms() {
    fire.firestore().collection('platforms').get().then(snapshot => {
      this.props.fetchPlatforms(snapshot);
      setTimeout(() => {
        this.setState({
          platformsDataLoaded: true
        });
      }, 0);
    }).catch(error => {
      console.log(error.message);
    });
  }

  fetchUser() {
    fire.auth().onAuthStateChanged(user => {
      if (user !== null) {
        user.getIdTokenResult().then(idTokenResult => {
          user.admin = idTokenResult.claims.admin;
          console.log("User data:");
          console.log(user);
          this.props.checkUserPresence(user);
          setTimeout(() => {
            this.setState({
              userAuthDataLoaded: true
            });
          }, 0);
        });
        this.fetchData(user.uid);
      }else {
        this.props.checkUserPresence(user);
        this.setState({
          unauthorized: true
        });
      }
    })
  }

  fetchData = (uid) => {
    fire.firestore().collection('users').doc(uid).onSnapshot(
      doc => {
        if (doc.exists) {
           console.log("User collections data:", doc.data());
           const allUserData = doc.data() || {};
           this.props.setListsToStore(allUserData.lists || []);
           this.props.setSectionsToStore(allUserData.sections || []);
           this.props.setBlocksToStore(allUserData.blocks || []);
       } else {
           console.log("No such document!");
       }
       setTimeout(() => {
         this.setState({
           listsSectionsBlocksLoaded: true
         });
       }, 0);
      }, error => {
        console.log(error.message);
      }
    );
  };

  render() {
    const header = (
      <Header/>
    );

    const routes = (
      <Switch>
        <Route path="/profile" component={Profile} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/lists/:listId" component={UserList}/>
        <Route exact path="/" component={Dashboard} />
        <Redirect to="/" />
      </Switch>
    );

    const content = (
      <div className="appWrapper">
        <header>
          {header}
        </header>
        {routes}
      </div>
    );

    const fake = (
      <div className="appWrapper">
        <Preloader/>
      </div>
    );

    return (
      <BrowserRouter>
        {((this.state.listsSectionsBlocksLoaded
           && this.state.colorsDataLoaded
           && this.state.userAuthDataLoaded
           && this.state.platformsDataLoaded) || this.state.unauthorized) ? content : fake}
      </BrowserRouter>
    );
  }
}

const stateToProps = (state = {}) => {
  return {
    selectedListIndex: state.selectedListIndex
  }
};

const appDispatchToProps = (dispatch) => {
  return {
    checkUserPresence: (user) => {
      dispatch({ type: userReducer.actions.USER_CHECK, user: user });
    },
    fetchColors: (snapshot) => {
      dispatch({ type: colorsActions.actions.COLORS_FETCH, snapshot: snapshot });
    },
    fetchPlatforms: (snapshot) => {
      dispatch({ type: platformsActions.actions.PLATFORMS_FETCH, snapshot: snapshot });
    },
    setListsToStore: (lists) => {
      dispatch({ type: userListsReducer.actions.LISTS_SET, lists: lists });
    },
    setSectionsToStore: (sections) => {
      dispatch({ type: userSectionsReducer.actions.SECTIONS_SET, sections: sections });
    },
    setBlocksToStore: (blocks) => {
      dispatch({ type: userBlocksReducer.actions.BLOCKS_SET, blocks: blocks });
    }
  }
};

const AppConnected = connect(stateToProps, appDispatchToProps)(App);

export default AppConnected;
